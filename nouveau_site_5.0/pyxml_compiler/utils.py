"""Utility functions for the PyXML compiler.

Provides file I/O helpers, HTML escaping, path resolution,
placeholder substitution, and list chunking.
"""

from __future__ import annotations

from typing import Any
from pathlib import Path

import re
import html as html_module


def read_file(path: Path | str) -> str:
    """Read a text file and return its contents as a string.

    Args:
        path: Path to the file to read.

    Returns:
        The file contents as a UTF-8 string.
    """
    return Path(path).read_text(encoding="utf-8")


def write_file(path: Path | str, content: str) -> None:
    """Write a string to a text file, creating parent directories if needed.

    Args:
        path: Path to the file to write.
        content: The string content to write.
    """
    p: Path = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")


def escape_html(text: str) -> str:
    """Escape special HTML characters in a string.

    Args:
        text: The raw text to escape.

    Returns:
        The HTML-escaped text.
    """
    return html_module.escape(text, quote=False)


def resolve_path(relative: str, base_dir: Path) -> Path:
    """Resolve a relative path against a base directory.

    Handles paths starting with './' by stripping it first.

    Args:
        relative: The relative path string (may start with './').
        base_dir: The base directory to resolve against.

    Returns:
        The resolved absolute Path.
    """
    cleaned: str = relative.lstrip("./").lstrip("\\")
    return (base_dir / cleaned).resolve()


def chunk_list(data: list[Any], chunk_size: int) -> list[list[Any]]:
    """Split a list into chunks of a given size.

    Args:
        data: The list to split.
        chunk_size: Maximum number of elements per chunk.

    Returns:
        A list of sub-lists, each containing at most chunk_size elements.
    """
    if chunk_size <= 0:
        return [data]
    return [data[i : i + chunk_size] for i in range(0, len(data), chunk_size)]


def substitute_placeholders(template_str: str, data: dict[str, Any]) -> str:
    """Replace {placeholder} patterns in a template string with values from data.

    Only replaces placeholders that match keys in data. Unmatched placeholders
    are left as-is. Values are converted to strings with str().

    Args:
        template_str: The template string with {key} placeholders.
        data: A dictionary of key-value pairs for substitution.

    Returns:
        The template string with matching placeholders replaced.
    """

    def replacer(match: re.Match[str]) -> str:
        """Replace a single placeholder match."""
        key: str = match.group(1).strip()
        if key in data:
            return html_module.escape(str(data[key]), quote=True)
        return match.group(0)  # leave unmatched

    return re.sub(r"\{([^}]+)\}", replacer, template_str)


def format_html_attributes(attrs: dict[str, str]) -> str:
    """Format a dictionary of attributes into an HTML attribute string.

    Args:
        attrs: Dictionary mapping attribute names to values.

    Returns:
        A string like ' class="foo" id="bar"' (leading space included),
        or empty string if no attributes.
    """
    if not attrs:
        return ""
    parts: list[str] = []
    for key, value in attrs.items():
        escaped_value: str = html_module.escape(str(value), quote=True)
        parts.append(f'{key}="{escaped_value}"')
    return " " + " ".join(parts)
