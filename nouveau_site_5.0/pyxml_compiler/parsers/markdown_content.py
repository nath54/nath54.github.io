"""Markdown content parser.

Renders a single markdown file to HTML. Used for blog article content
and other standalone markdown files.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from pyxml_compiler.utils import read_file


class MarkdownContentParser:
    """Parser that renders markdown files to HTML.

    Returns each file as a dict with the rendered HTML and the source filename.
    """

    def load(self, source_path: Path) -> list[dict[str, Any]]:
        """Load and render markdown files to HTML.

        If source_path is a file, renders that single file.
        If source_path is a directory, renders all .md files.

        Args:
            source_path: Path to a directory or a single .md file.

        Returns:
            A list of dicts, each with:
                - _source_file (str): the file stem
                - content_html (str): the rendered HTML
                - content_raw (str): the raw markdown
        """
        try:
            import markdown
        except ImportError as e:
            raise ImportError(
                "The 'markdown' package is required. "
                "Install it with: pip install markdown"
            ) from e

        entries: list[dict[str, Any]] = []

        if source_path.is_file():
            md_files: list[Path] = [source_path]
        else:
            md_files = sorted(source_path.glob("*.md"))

        for md_file in md_files:
            raw: str = read_file(md_file)
            html: str = markdown.markdown(
                raw,
                extensions=["fenced_code", "tables", "toc"],
            )
            entries.append({
                "_source_file": md_file.stem,
                "content_html": html,
                "content_raw": raw,
            })

        return entries
