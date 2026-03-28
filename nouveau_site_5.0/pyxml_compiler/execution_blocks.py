"""Execution blocks — handlers for dynamic content generation at compile time.

Handles all exec_* PyXML blocks:
- exec_generate: Load data via a parser, apply filters/sort, compile templates
- exec_foreach: Iterate over a list and compile children for each item
- exec_if: Conditionally compile children
- exec_include: Include and compile another PyXML template
- exec_markdown: Render a markdown file/string to HTML
"""

from __future__ import annotations

from typing import Any
from pathlib import Path

import ast
import operator

from pyxml_compiler.context import CompilationContext
from pyxml_compiler.nodes import PyxmlNode, TextNode
from pyxml_compiler.utils import (
    chunk_list,
    read_file,
    resolve_path,
    substitute_placeholders,
)


class CompilationError(Exception):
    """Raised when a compilation step fails."""


def execute_execution_block(node: PyxmlNode, context: CompilationContext) -> str:
    """Dispatch an execution block to the appropriate handler.

    Args:
        node: The exec_* PyxmlNode to process.
        context: The current compilation context.

    Returns:
        The generated HTML string.

    Raises:
        CompilationError: If the execution block type is unknown.
    """
    tag: str = node.tag

    handlers: dict[str, Any] = {
        "exec_generate": handle_exec_generate,
        "exec_foreach": handle_exec_foreach,
        "exec_if": handle_exec_if,
        "exec_include": handle_exec_include,
        "exec_markdown": handle_exec_markdown,
    }

    handler = handlers.get(tag)
    if handler is None:
        raise CompilationError(f"Unknown execution block: {tag}")

    return handler(node, context)


def handle_exec_generate(node: PyxmlNode, context: CompilationContext) -> str:
    """Handle <exec_generate> blocks.

    Loads data from a source using the specified parser, applies optional
    filter/sort/pagination, then compiles each entry through a template.

    Required attributes:
        parser: Name of the parser to use (registered in parsers/__init__.py)
        source: Path to the data source (directory or file)
        template: Name of the component template file (without path prefix)

    Optional attributes:
        filter: Filter expression (e.g. "project_showcase_importance >= 40")
        sort_by: Field name to sort by
        sort_order: "asc" or "desc" (default "asc")
        paginate: Number of items per page
        mode: Special mode (e.g. "random_one")

    Args:
        node: The exec_generate node.
        context: The compilation context.

    Returns:
        The generated HTML.
    """
    # Import here to avoid circular imports
    from pyxml_compiler.parsers import PARSERS  # pylint: disable=import-outside-toplevel

    # 1. Get parser
    parser_name: str = node.attributes.get("parser", "")
    if parser_name not in PARSERS:
        raise CompilationError(
            f"Unknown parser '{parser_name}'. Available: {list(PARSERS.keys())}"
        )
    parser = PARSERS[parser_name]()

    # 2. Load data
    source: str = node.attributes.get("source", "")
    source_path: Path = resolve_path(source, context.base_dir)
    raw_data: list[dict[str, Any]] = parser.load(source_path)

    # 3. Apply filter
    filter_expr: str = node.attributes.get("filter", "")
    if filter_expr:
        raw_data = apply_filter(raw_data, filter_expr)

    # 4. Apply sort
    sort_by: str = node.attributes.get("sort_by", "")
    if sort_by:
        sort_order: str = node.attributes.get("sort_order", "asc")
        reverse: bool = sort_order == "desc"
        raw_data = sorted(
            raw_data,
            key=lambda x: x.get(sort_by, ""),
            reverse=reverse,
        )

    # 5. Pagination
    paginate: str = node.attributes.get("paginate", "")
    if paginate:
        page_size: int = int(paginate)
        pages: list[list[dict[str, Any]]] = chunk_list(raw_data, page_size)
    else:
        pages = [raw_data]

    # 6. Compile each entry through the template
    template_name: str = node.attributes.get("template", "")
    template_path: Path = (
        context.templates_dir / "components" / f"{template_name}.xml"
    )
    if not template_path.exists():
        # Fallback to .pyxml for backward compatibility
        template_path = (
            context.templates_dir / "components" / f"{template_name}.pyxml"
        )

    if not template_path.exists():
        raise CompilationError(f"Template not found: {template_name}")

    template_content: str = read_file(template_path)

    # Import compile_node here to avoid circular imports
    from pyxml_compiler.compiler import compile_node  # pylint: disable=import-outside-toplevel
    from pyxml_compiler.pyxml_parser import parse_pyxml  # pylint: disable=import-outside-toplevel

    html_parts: list[str] = []
    current_page: list[dict[str, Any]] = pages[0] if pages else []

    mode: str = node.attributes.get("mode", "")

    for entry in current_page:
        # Substitute placeholders in the template with entry data
        instantiated: str = substitute_placeholders(template_content, entry)

        # Parse the instantiated template
        entry_node: PyxmlNode = parse_pyxml(instantiated)

        # Create a sub-context with the entry data
        sub_context: CompilationContext = context.copy()
        sub_context.update(entry)

        # Compile
        html_parts.append(compile_node(entry_node, sub_context))

    # Handle special mode
    if mode == "random_one":
        # Wrap each item in a hidden container; JS will reveal one randomly
        wrapped: list[str] = []
        for i, part in enumerate(html_parts):
            wrapped.append(
                f'<div class="random-item" data-random-index="{i}" '
                f'style="display:none;">{part}</div>'
            )
        return "\n".join(wrapped)

    return "\n".join(html_parts)


def handle_exec_foreach(node: PyxmlNode, context: CompilationContext) -> str:
    """Handle <exec_foreach> blocks.

    Iterates over a list (resolved from context) and compiles the
    children for each item.

    Attributes:
        var: Name of the iteration variable
        in: Placeholder for the list to iterate over (e.g. "{tags}")

    Args:
        node: The exec_foreach node.
        context: The compilation context.

    Returns:
        The generated HTML.
    """
    from pyxml_compiler.compiler import compile_node  # pylint: disable=import-outside-toplevel

    var_name: str = node.attributes.get("var", "item")
    list_ref: str = node.attributes.get("in", "")
    list_data: Any = context.resolve(list_ref)

    if not isinstance(list_data, (list, tuple)):
        # Try to handle as a string that looks like a list
        if isinstance(list_data, str) and list_data.startswith("["):
            # Simple parsing: ['a', 'b', 'c'] or ["a", "b", "c"]
            try:
                list_data = ast.literal_eval(list_data)
            except (ValueError, SyntaxError):
                list_data = [list_data]
        else:
            list_data = [list_data] if list_data else []

    html_parts: list[str] = []
    for item in list_data:
        sub_context: CompilationContext = context.copy()
        sub_context.set(var_name, item)

        for child in node.children:
            html_parts.append(compile_node(child, sub_context))

    return "\n".join(html_parts)


def handle_exec_if(node: PyxmlNode, context: CompilationContext) -> str:
    """Handle <exec_if> blocks.

    Evaluates a condition and, if true, compiles the children.

    Attributes:
        condition: A condition expression (e.g. "{cover_image} != ''")

    Args:
        node: The exec_if node.
        context: The compilation context.

    Returns:
        The generated HTML, or empty string if condition is false.
    """
    from pyxml_compiler.compiler import compile_node  # pylint: disable=import-outside-toplevel

    condition: str = node.attributes.get("condition", "")
    result: bool = evaluate_condition(condition, context)

    if result:
        html_parts: list[str] = []
        for child in node.children:
            html_parts.append(compile_node(child, context))
        return "\n".join(html_parts)

    return ""


def handle_exec_include(node: PyxmlNode, context: CompilationContext) -> str:
    """Handle <exec_include> blocks.

    Includes and compiles another PyXML template file.

    Attributes:
        template: Relative path to the template (from templates_dir)
        data: Optional placeholder for data dict to merge into context

    Args:
        node: The exec_include node.
        context: The compilation context.

    Returns:
        The generated HTML from the included template.
    """
    from pyxml_compiler.compiler import compile_node  # pylint: disable=import-outside-toplevel
    from pyxml_compiler.pyxml_parser import parse_pyxml  # pylint: disable=import-outside-toplevel

    template_path_str: str = node.attributes.get("template", "")
    template_path: Path = context.templates_dir / template_path_str

    if not template_path.exists():
        # Try .xml extension if not provided and file not found
        if not template_path.suffix:
            template_path = template_path.with_suffix(".xml")
            if not template_path.exists():
                template_path = template_path.with_suffix(".pyxml")

    if not template_path.exists():
        raise CompilationError(f"Include template not found: {template_path_str}")

    template_content: str = read_file(template_path)

    # Resolve data attribute if present
    data_ref: str = node.attributes.get("data", "")
    sub_context: CompilationContext = context.copy()
    if data_ref:
        data: Any = context.resolve(data_ref)
        if isinstance(data, dict):
            sub_context.update(data)

    # Substitute placeholders in the template
    instantiated: str = substitute_placeholders(template_content, sub_context.variables)

    # Parse and compile
    template_node: PyxmlNode = parse_pyxml(instantiated)
    return compile_node(template_node, sub_context)


def handle_exec_markdown(node: PyxmlNode, context: CompilationContext) -> str:
    """Handle <exec_markdown> blocks.

    Renders a markdown file or inline markdown content to HTML.

    Attributes:
        src: Path to a markdown file (resolved from context)
        OR inline text content is used.

    Args:
        node: The exec_markdown node.
        context: The compilation context.

    Returns:
        The rendered HTML from the markdown content.
    """
    try:
        import markdown  # type: ignore[import] # pylint: disable=import-error, import-outside-toplevel
    except ImportError as e:
        raise CompilationError(
            "The 'markdown' package is required for exec_markdown. "
            "Install it with: pip install markdown"
        ) from e

    src: str = node.attributes.get("src", "")

    if src:
        resolved_src: str = str(context.resolve(src))
        src_path: Path = resolve_path(resolved_src, context.base_dir)

        if src_path.exists():
            md_content: str = read_file(src_path)
        else:
            md_content = resolved_src
    else:
        # Use inline text content from children
        md_content = ""
        for child in node.children:
            if isinstance(child, TextNode):
                md_content += child.text

    html: str = markdown.markdown(
        md_content,
        extensions=["fenced_code", "tables", "toc"],
    )
    return html


def apply_filter(
    data: list[dict[str, Any]],
    filter_expr: str,
) -> list[dict[str, Any]]:
    """Apply a simple filter expression to a list of data dicts.

    Supports expressions like:
    - "field >= 40"
    - "field == 'value'"
    - "field != ''"

    Args:
        data: The list of dictionaries to filter.
        filter_expr: The filter expression string.

    Returns:
        The filtered list of dictionaries.
    """
    # Parse the filter expression
    ops: dict[str, Any] = {
        ">=": operator.ge,
        "<=": operator.le,
        "!=": operator.ne,
        "==": operator.eq,
        ">": operator.gt,
        "<": operator.lt,
    }

    for op_str, op_func in ops.items():
        if op_str in filter_expr:
            parts: list[str] = filter_expr.split(op_str, 1)
            field_name: str = parts[0].strip()
            raw_value: str = parts[1].strip().strip("'\"")

            # Try to convert to number
            try:
                compare_value: int | float | str = int(raw_value)
            except ValueError:
                try:
                    compare_value = float(raw_value)
                except ValueError:
                    compare_value = raw_value

            return [
                entry
                for entry in data
                if field_name in entry and op_func(entry[field_name], compare_value)
            ]

    return data


def evaluate_condition(condition: str, context: CompilationContext) -> bool:
    """Evaluate a simple condition expression in the context.

    Supports:
    - "{variable} != ''"
    - "{variable} == 'value'"
    - Truthy/falsy check: "{variable}"

    Args:
        condition: The condition expression.
        context: The compilation context for variable resolution.

    Returns:
        True if the condition evaluates to true.
    """
    # Resolve placeholders in the condition
    resolved: str = str(context.resolve(condition))

    # Check for comparison operators
    ops: dict[str, Any] = {
        "!=": operator.ne,
        "==": operator.eq,
        ">=": operator.ge,
        "<=": operator.le,
        ">": operator.gt,
        "<": operator.lt,
    }

    for op_str, op_func in ops.items():
        if op_str in resolved:
            parts: list[str] = resolved.split(op_str, 1)
            left: str = parts[0].strip().strip("'\"")
            right: str = parts[1].strip().strip("'\"")

            # Try numeric comparison
            try:
                return op_func(float(left), float(right))
            except ValueError:
                return op_func(left, right)

    # Simple truthy check
    return bool(resolved) and resolved not in ("", "None", "False", "0", "{}")
