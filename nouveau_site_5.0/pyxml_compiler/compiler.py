"""Main compiler module — compiles PyXML AST nodes into HTML.

This is the central compilation engine that dispatches PyXML nodes
to the appropriate handlers (construction blocks or execution blocks)
and assembles the final HTML output with the page skeleton.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from pyxml_compiler.construction_blocks import (
    PYXML_TO_HTML,
    SELF_CLOSING_TAGS,
    build_opening_tag,
    get_button_content,
    get_link_content,
    map_pyxml_attributes,
)
from pyxml_compiler.context import CompilationContext
from pyxml_compiler.execution_blocks import execute_execution_block
from pyxml_compiler.nodes import (
    CommentNode,
    PyxmlNode,
    TextNode,
    is_execution_block,
)
from pyxml_compiler.utils import escape_html, read_file
from pyxml_compiler.pyxml_parser import parse_pyxml


# HTML page skeleton template
HTML_SKELETON: str = """<!DOCTYPE html>
<html lang="{lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {meta_tags}
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="{favicon_path}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    {css_links}
</head>
<body data-theme="light">
    {body}
    {js_scripts}
</body>
</html>"""


def compile_node(
    node: PyxmlNode | TextNode | CommentNode,
    context: CompilationContext,
) -> str:
    """Compile a single AST node into HTML.

    Dispatches to the appropriate handler based on node type:
    - TextNode: returns escaped text
    - CommentNode: returns an HTML comment
    - PyxmlNode with exec_* tag: passes to execution block handler
    - PyxmlNode with known tag: passes to construction block handler
    - PyxmlNode with _pyxml_root_ tag: compiles children only
    - PyxmlNode with unknown tag: falls back to generic div

    Args:
        node: The AST node to compile.
        context: The current compilation context.

    Returns:
        The compiled HTML string.
    """
    if isinstance(node, TextNode):
        return escape_html(str(context.resolve(node.text)))

    if isinstance(node, CommentNode):
        return f"<!-- {escape_html(node.text)} -->"

    if not isinstance(node, PyxmlNode):
        return ""

    # Internal root wrapper — just compile children
    if node.tag == "_pyxml_root_":
        return compile_children(node, context)

    # Comment placeholder nodes
    if node.tag == "_comment_":
        comment_text: str = node.attributes.get("text", "")
        return f"<!-- {escape_html(comment_text)} -->"

    # Execution blocks
    if is_execution_block(node.tag):
        return execute_execution_block(node, context)

    # Construction blocks
    return compile_construction_node(node, context)


def compile_children(
    node: PyxmlNode,
    context: CompilationContext,
) -> str:
    """Compile all children of a node and concatenate the results.

    Args:
        node: The parent node whose children to compile.
        context: The current compilation context.

    Returns:
        The concatenated HTML of all children.
    """
    parts: list[str] = []
    for child in node.children:
        parts.append(compile_node(child, context))
    return "".join(parts)


def compile_construction_node(
    node: PyxmlNode,
    context: CompilationContext,
) -> str:
    """Compile a construction block node into HTML.

    Looks up the tag in PYXML_TO_HTML for the target HTML element
    and CSS classes. Handles special cases like links, buttons,
    and self-closing elements.

    Args:
        node: The construction block PyxmlNode.
        context: The compilation context.

    Returns:
        The compiled HTML string.
    """
    tag: str = node.tag

    # Get HTML element and CSS classes from mapping
    if tag in PYXML_TO_HTML:
        html_tag: str
        css_classes: str
        html_tag, css_classes = PYXML_TO_HTML[tag]
    else:
        # Fallback: unknown tag → div with tag name as class
        html_tag = "div"
        css_classes = tag.replace("_", "-")

    # Calculate relative depth (e.g., 'pages/about.html' -> '../')
    depth: int = len(Path(context.output_path).parents) - 1
    rel_prefix: str = "../" * depth if depth > 0 else ""

    # Resolve placeholders and adjust paths
    resolved_attributes: dict[str, str] = {}

    # Add default src for logo if missing
    if tag == "logo" and "src" not in node.attributes:
        node.attributes["src"] = "res/logo.svg"
    # Add default src for icon if missing and it's a specific type?

    for k, v in node.attributes.items():
        resolved_v = str(context.resolve(v))
        # Logic to adjust relative paths for sub-folder pages:
        # If it's a relative path to res/, css/, or js/ and it doesn't look like an absolute URL...
        if k in ("src", "href", "url", "scene_data") and not (
            resolved_v.startswith(("http", "https", "mailto:", "/"))
        ):
            resolved_v = f"{rel_prefix}{resolved_v}"
        resolved_attributes[k] = resolved_v

    # Map PyXML attributes to HTML attributes
    html_attrs, extra_classes = map_pyxml_attributes(tag, resolved_attributes)

    # Self-closing tags
    is_self_closing: bool = tag in SELF_CLOSING_TAGS and not node.children

    if is_self_closing:
        # Special handling for links (need inner content from attrs)
        if tag in ("link_url", "link_page", "link_file"):
            content: str = get_link_content(tag, node.attributes)
            opening: str = build_opening_tag(
                html_tag,
                css_classes,
                html_attrs,
                extra_classes,
            )
            return f"{opening}{content}</{html_tag}>"

        # Special handling for buttons
        if tag in ("button_action", "button_close"):
            content = get_button_content(tag, node.attributes)
            opening = build_opening_tag(
                html_tag,
                css_classes,
                html_attrs,
                extra_classes,
            )
            return f"{opening}{content}</{html_tag}>"

        # Special handling for search_input
        if tag == "search_input":
            html_attrs["type"] = "text"
            return build_opening_tag(
                html_tag,
                css_classes,
                html_attrs,
                extra_classes,
                self_closing=True,
            )

        # Special handling for logo/icon
        if tag in ("logo", "icon"):
            return build_opening_tag(
                html_tag,
                css_classes,
                html_attrs,
                extra_classes,
                self_closing=True,
            )

        # Special handling for article_cover
        if tag == "article_cover":
            return build_opening_tag(
                html_tag,
                css_classes,
                html_attrs,
                extra_classes,
                self_closing=True,
            )

        # Generic self-closing
        return build_opening_tag(
            html_tag,
            css_classes,
            html_attrs,
            extra_classes,
            self_closing=True,
        )

    # Non self-closing: compile children
    children_html: str = compile_children(node, context)

    # For links with children (non self-closing link)
    if tag in ("link_url", "link_page", "link_file") and not children_html:
        children_html = get_link_content(tag, node.attributes)

    # For buttons with children
    if tag in ("button_action", "button_close") and not children_html:
        children_html = get_button_content(tag, node.attributes)

    # Generic fallback for any other node with a name attribute and no children
    if not children_html and tag not in (
        "link_url",
        "link_page",
        "link_file",
        "button_action",
        "button_close",
        "logo",
        "icon",
        "img",
        "thumbnail_img",
        "search_input",
    ):
        name: str = resolved_attributes.get("name", "")
        # If no name, check name_en then any name_XX
        if not name:
            name = resolved_attributes.get("name_en", "")
        if not name:
            # Get first name_XX attribute if any
            for k, v in resolved_attributes.items():
                if k.startswith("name_"):
                    name = v
                    break
        if name:
            children_html = escape_html(name)

    opening = build_opening_tag(
        html_tag,
        css_classes,
        html_attrs,
        extra_classes,
    )
    return f"{opening}{children_html}</{html_tag}>"


def compile_page(
    pyxml_path: Path,
    context: CompilationContext,
    css_paths: Optional[list[str]] = None,
    js_paths: Optional[list[str]] = None,
    meta_tags_str: str = "",
) -> str:
    """Compile a full PyXML page file into a complete HTML document.

    Reads the PyXML template, compiles it, and wraps the result in
    the HTML skeleton with head, CSS links, JS scripts, etc.

    Args:
        pyxml_path: Path to the .pyxml template file.
        context: The compilation context.
        css_paths: List of CSS file paths to include (relative to build).
        js_paths: List of JS file paths to include (relative to build).
        meta_tags_str: Additional meta tags HTML string.

    Returns:
        The complete HTML page as a string.
    """

    # Read and parse
    pyxml_content: str = read_file(pyxml_path)
    root: PyxmlNode = parse_pyxml(pyxml_content)

    # Calculate relative depth (e.g., 'pages/about.html' -> '../')
    depth: int = len(Path(context.output_path).parents) - 1
    rel_prefix: str = "../" * depth if depth > 0 else ""

    # Compile the body
    body_html: str = compile_node(root, context)

    # Inject OS style title bar if not index
    is_index: bool = context.output_path == "index.html"
    if not is_index:
        page_title = context.page_title or context.site_title
        os_bar = f"""
    <div class="os-title-bar">
        <a href="{rel_prefix}index.html" class="os-btn-back">
            <i class="fas fa-arrow-left"></i> 
            <span data-translation-en="Back" data-translation-fr="Retour">Back</span>
        </a>
        <div class="os-title" data-translation-en="{page_title}" data-translation-fr="{page_title}">{page_title}</div>
        <div class="os-controls">
            <span class="os-btn-min"></span>
            <span class="os-btn-max"></span>
            <span class="os-btn-close"></span>
        </div>
    </div>
"""
        body_html = os_bar + body_html

    # Build CSS links
    if css_paths is None:
        css_paths = ["css/main.css"]
    css_links: str = "\n    ".join(
        f'<link rel="stylesheet" href="{rel_prefix}{path}">' for path in css_paths
    )

    # Build JS script tags
    if js_paths is None:
        js_paths = [
            "js/lib/lib_translation.js",
            "js/lib/particles.js",
            "js/lib/nascene_engine.js",
        ]
    js_scripts: str = "\n    ".join(
        f'<script src="{rel_prefix}{path}"></script>' for path in js_paths
    )

    # Assemble the full page
    page_html: str = HTML_SKELETON.format(
        lang=context.default_lang,
        title=context.page_title or context.site_title,
        meta_tags=meta_tags_str,
        favicon_path=f"{rel_prefix}res/logo.svg",
        css_links=css_links,
        body=body_html,
        js_scripts=js_scripts,
    )

    return page_html
