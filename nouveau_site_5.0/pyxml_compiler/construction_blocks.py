"""Construction blocks — mapping PyXML tags to HTML elements and CSS classes.

This module handles the compilation of PyXML construction blocks (declarative
layout/component tags) into HTML elements with the appropriate CSS classes.

It uses the PYXML_TO_HTML mapping to determine which HTML element and CSS
classes correspond to each PyXML tag. Attributes are passed through with
appropriate transformations for the translation system.

Translation system integration:
- data-translation-XX attributes → class="to_translate" + data-translation_XX
  (JS replaces innerText based on current language)
- data-langcode attribute → class="translation_visibility"
  (JS shows/hides the entire element based on current language)
"""

# pylint: disable=unused-argument

from __future__ import annotations

import html as html_module

from pyxml_compiler.utils import escape_html


# Mapping PyXML tag → (html_element, css_classes)
PYXML_TO_HTML: dict[str, tuple[str, str]] = {
    # --- Layouts ---
    "main_container": ("div", "main-container"),
    "single_column": ("div", "layout-single-column"),
    "2_columns_container_1_on_mobile": ("div", "layout-two-columns"),
    "layout_columns_2_1_mobile": ("div", "layout-two-columns"),
    "left_column": ("div", "layout-col layout-col-left"),
    "right_column": ("div", "layout-col layout-col-right"),
    "fullscreen_column": ("div", "layout-fullscreen"),
    # --- Structure ---
    "section": ("section", "section"),
    "subsection": ("div", "subsection"),
    "row": ("div", "row"),
    "column": ("div", "column"),
    "center": ("div", "center"),
    "row_head": ("header", "row-head"),
    # --- Typography ---
    "title_text": ("h1", "title-text"),
    "title": ("h2", "section-title"),
    "text": ("p", "text"),
    "code": ("code", "inline-code"),
    # --- Components ---
    "logo": ("img", "site-logo"),
    "link_url": ("a", "link link-external"),
    "link_page": ("a", "link link-page"),
    "link_file": ("a", "link link-file"),
    "button_action": ("button", "btn btn-action"),
    "button_close": ("button", "btn btn-close"),
    # --- Cards ---
    "project_card": ("article", "card card-project"),
    "media_card": ("article", "card card-media"),
    "category_card": ("a", "card card-category"),
    "blog_post_row_cardline": ("article", "card card-blog-row"),
    # --- Card internals ---
    "card_header": ("div", "card-header"),
    "card_body": ("div", "card-body"),
    "card_actions": ("div", "card-actions"),
    "card_thumbnail": ("div", "card-thumbnail"),
    "card_plaque": ("div", "card-plaque"),
    # --- Expandables ---
    "small_expandable_node": ("details", "expandable expandable-sm"),
    "medium_expandable_node": ("details", "expandable expandable-md"),
    "large_expandable_node": ("details", "expandable expandable-lg"),
    "name": ("summary", "expandable-title"),
    "content": ("div", "expandable-content"),
    # --- Containers ---
    "filter_bar": ("div", "filter-bar"),
    "search_input": ("input", "search-input"),
    "filter_group": ("div", "filter-group"),
    "filter_button": ("button", "filter-btn"),
    "projects_grid": ("div", "grid grid-projects"),
    "categories_grid": ("div", "grid grid-categories"),
    "museum_gallery": ("div", "grid grid-museum"),
    "modals_container": ("div", "modals-container"),
    "blog_pages_container": ("div", "blog-pages"),
    "tags_list": ("div", "tags-list"),
    "tag": ("span", "tag"),
    # --- Citation ---
    "citation": ("blockquote", "citation"),
    "author": ("span", "citation-author"),
    "date": ("span", "citation-date"),
    "source": ("cite", "citation-source"),
    # --- Media ---
    "media_header": ("header", "media-header"),
    "media_content": ("div", "media-content"),
    "media_description": ("div", "media-description"),
    "audio_player": ("div", "audio-player"),
    "image_full": ("figure", "image-full"),
    "model_viewer": ("div", "model-viewer"),
    "interactive_canvas": ("div", "interactive-canvas"),
    "image_carousel": ("div", "image-carousel"),
    "text_scrollable": ("div", "text-scrollable"),
    # --- Modal ---
    "project_modal": ("dialog", "modal modal-project"),
    "modal_header": ("div", "modal-header"),
    "modal_body": ("div", "modal-body"),
    # --- Blog ---
    "article_header": ("header", "article-header"),
    "article_cover": ("img", "article-cover"),
    "article_metadata": ("div", "article-metadata"),
    "article_body": ("div", "article-body"),
    "article_footer": ("footer", "article-footer"),
    "markdown_render": ("div", "markdown-render"),
    # --- Misc ---
    "todo_list": ("ul", "todo-list"),
    "todo_item": ("li", "todo-item"),
    "icon": ("img", "icon"),
    "status": ("span", "badge badge-status"),
    "count": ("span", "count"),
    "plaque_title": ("h3", "plaque-title"),
    "plaque_date": ("time", "plaque-date"),
    "date_text": ("time", "date-text"),
    "short_description": ("p", "short-description"),
    "long_description": ("div", "long-description"),
    "thumbnail_img": ("img", "thumbnail-img"),
    "img": ("img", ""),
}

# Self-closing tags that produce elements with no children (void HTML elements)
SELF_CLOSING_TAGS: set[str] = {
    "logo",
    "icon",
    "search_input",
    "link_url",
    "link_page",
    "link_file",
    "article_cover",
    "audio_player",
    "image_full",
    "model_viewer",
    "interactive_canvas",
    "thumbnail_img",
    "img",
}

# Attributes that are internal to PyXML and should not be passed to HTML
INTERNAL_ATTRIBUTES: set[str] = {
    "action",
    "target",  # button_action internal attrs handled specially
}


def map_pyxml_attributes(
    tag: str,
    attrs: dict[str, str],
) -> tuple[dict[str, str], list[str]]:
    """Convert PyXML attributes to HTML attributes.

    Handles translation attributes (data-translation-XX → data-translation_XX)
    and adds appropriate CSS classes.

    Args:
        tag: The PyXML tag name.
        attrs: The PyXML attributes dictionary.

    Returns:
        A tuple of (html_attributes_dict, extra_css_classes_list).
    """
    html_attrs: dict[str, str] = {}
    extra_classes: list[str] = []

    has_translation: bool = False
    has_langcode: bool = False

    for key, value in attrs.items():
        # Translation attributes: data-translation-en → data-translation_en
        if key.startswith("data-translation-"):
            lang_code: str = key.split("data-translation-")[1]
            html_attrs[f"data-translation_{lang_code}"] = value
            has_translation = True
        # Visibility translation: data-langcode
        elif key == "data-langcode":
            html_attrs["data-langcode"] = value
            has_langcode = True
        # Standard pass-through attributes
        elif key == "url":
            html_attrs["href"] = value
        elif key == "src":
            html_attrs["src"] = value
        elif key == "alt":
            html_attrs["alt"] = value
        elif key == "id":
            html_attrs["id"] = value
        elif key == "class":
            extra_classes.append(value)
        elif key == "placeholder":
            html_attrs["placeholder"] = value
        elif key == "autoplay":
            html_attrs["autoplay"] = value
        elif key == "interactive":
            html_attrs["data-interactive"] = value
        elif key == "type":
            html_attrs["data-type"] = value
        elif key.startswith("data-"):
            html_attrs[key] = value
        elif key == "badge":
            html_attrs["data-badge"] = value
        elif key == "checked":
            html_attrs["data-checked"] = value
        elif key == "active":
            if value == "true":
                extra_classes.append("active")
        elif key == "icon":
            html_attrs["data-icon"] = value
        elif key == "name":
            # name is used as display text for links/buttons, handled in content
            html_attrs["data-name"] = value
        elif key.startswith("name_"):
            # name_en, name_fr etc. attributes
            lang_code = key.split("name_")[1]
            html_attrs[f"data-translation_{lang_code}"] = value
            # Only add to_translate if NOT a link or button (since they handle it internally)
            if tag not in (
                "link_url",
                "link_page",
                "link_file",
                "button_action",
                "button_close",
            ):
                has_translation = True
        elif key == "action":
            html_attrs["data-action"] = value
            # Add interactive class for cursor: pointer
            extra_classes.append("interactive")
        elif key == "target":
            html_attrs["data-action-target"] = value
        elif key in INTERNAL_ATTRIBUTES:
            html_attrs[f"data-{key}"] = value
        else:
            html_attrs[f"data-{key}"] = value

    # Add translation-related CSS classes
    if has_translation:
        extra_classes.append("to_translate")
    if has_langcode:
        extra_classes.append("translation_visibility")

    return html_attrs, extra_classes


def build_opening_tag(
    html_tag: str,
    css_classes: str,
    html_attrs: dict[str, str],
    extra_classes: list[str],
    self_closing: bool = False,
) -> str:
    """Build an HTML opening tag string.

    Args:
        html_tag: The HTML element name.
        css_classes: The base CSS classes from PYXML_TO_HTML.
        html_attrs: Additional HTML attributes dict.
        extra_classes: Extra CSS classes to append.
        self_closing: Whether to produce a self-closing tag.

    Returns:
        The HTML opening tag string.
    """
    all_classes: list[str] = []
    if css_classes:
        all_classes.extend(css_classes.split())
    all_classes.extend(extra_classes)

    parts: list[str] = [f"<{html_tag}"]

    if all_classes:
        parts.append(f' class="{" ".join(all_classes)}"')

    for attr_name, attr_value in html_attrs.items():
        escaped: str = html_module.escape(str(attr_value), quote=True)
        parts.append(f' {attr_name}="{escaped}"')

    if self_closing:
        parts.append(" />")
    else:
        parts.append(">")

    return "".join(parts)


def get_link_content(tag: str, attrs: dict[str, str]) -> str:
    """Generate inner content for link-type elements.

    For link_url, link_page, link_file: produces icon + name text.

    Args:
        tag: The PyXML tag name.
        attrs: The PyXML attributes.

    Returns:
        HTML string for the link's inner content.
    """
    parts: list[str] = []

    icon: str = attrs.get("icon", "")
    if icon:
        parts.append(f'<span class="link-icon" data-icon="{escape_html(icon)}"></span>')

    # Handle translatable name
    name: str = attrs.get("name", "")
    translations: dict[str, str] = {
        k.split("name_")[1]: v for k, v in attrs.items() if k.startswith("name_")
    }

    if not name and translations:
        # Default to English if available, else first translation
        name = translations.get("en", next(iter(translations.values())))

    if name or translations:
        span_attrs: list[str] = ['class="link-text']
        if translations:
            span_attrs[0] += ' to_translate"'
            for lang, val in translations.items():
                span_attrs.append(f'data-translation_{lang}="{escape_html(val)}"')
        else:
            span_attrs[0] += '"'

        parts.append(f"<span {' '.join(span_attrs)}>{escape_html(name)}</span>")

    return "".join(parts)


def get_button_content(tag: str, attrs: dict[str, str]) -> str:
    """Generate inner content for button-type elements.

    Args:
        tag: The PyXML tag name.
        attrs: The PyXML attributes.

    Returns:
        HTML string for the button's inner content.
    """
    parts: list[str] = []

    icon: str = attrs.get("icon", "")
    if icon:
        parts.append(f'<span class="btn-icon" data-icon="{escape_html(icon)}"></span>')

    # Handle translatable name
    name: str = attrs.get("name", "")
    translations: dict[str, str] = {
        k.split("name_")[1]: v for k, v in attrs.items() if k.startswith("name_")
    }

    if not name and translations:
        # Default to English if available, else first translation
        name = translations.get("en", next(iter(translations.values())))

    if name or translations:
        span_attrs: list[str] = ['class="btn-text']
        if translations:
            span_attrs[0] += ' to_translate"'
            for lang, val in translations.items():
                span_attrs.append(f'data-translation_{lang}="{escape_html(val)}"')
        else:
            span_attrs[0] += '"'

        parts.append(f"<span {' '.join(span_attrs)}>{escape_html(name)}</span>")

    return "".join(parts)
