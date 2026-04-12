"""Markdown Gazette parser.

Parses custom markdown files for The Nathan Gazette.
Expects the file to be divided into blocks using:
---
HEADER
---
(yaml frontmatter)
---
CONTENT EN
---
(markdown content)
---
CONTENT FR
---
(markdown content)

It returns a parsed dictionary for PyXML templates.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

import yaml  # type: ignore

from pyxml_compiler.utils import read_file

try:
    import markdown  # type: ignore
except ImportError as e:
    raise ImportError(
        "The 'markdown' package is required. Install it with: pip install markdown"
    ) from e


class MarkdownGazetteParser:
    """Parser that renders custom gazette markdown files to HTML."""

    def load(self, source_path: Path) -> list[dict[str, Any]]:
        entries: list[dict[str, Any]] = []

        if source_path.is_file():
            md_files: list[Path] = [source_path]
        else:
            md_files = sorted(source_path.glob("*.md"))

        for md_file in md_files:
            raw: str = read_file(md_file)
            parsed: dict[str, Any] = self._parse_gazette_format(raw)
            parsed["_source_file"] = md_file.stem
            entries.append(parsed)

        return entries

    def _parse_gazette_format(self, content: str) -> dict[str, Any]:
        """Parses the custom HEADER, CONTENT EN, CONTENT FR blocks."""
        # Using a regex to find the blocks safely
        # We look for lines that are exactly '## Header', '## Content EN', '## Content FR'

        blocks: dict[str, str] = {}

        # Split by lines that start with ## and contain a known block keyword
        pattern = re.compile(
            r"^##\s+(Header|Content EN|Content FR)\s*$", re.MULTILINE | re.IGNORECASE
        )

        matches = list(pattern.finditer(content))

        if not matches:
            # Fallback if the format is fundamentally broken, just parse as generic markdown
            return {
                "content_html": markdown.markdown(
                    content, extensions=["fenced_code", "tables", "toc"]
                )
            }

        for i, match in enumerate(matches):
            block_name = match.group(1).upper()
            start_idx = match.end()

            if i + 1 < len(matches):
                end_idx = matches[i + 1].start()
            else:
                end_idx = len(content)

            block_content = content[start_idx:end_idx].strip()
            blocks[block_name] = block_content

        # Process the blocks
        result: dict[str, Any] = {}

        # Parse YAML header
        if "HEADER" in blocks:
            try:
                header_data = yaml.safe_load(blocks["HEADER"])
                if isinstance(header_data, dict):
                    result.update(header_data)
            except yaml.YAMLError as e:
                print(f"Error parsing YAML header: {e}")

        # Ensure series is at least empty string for filter logic
        if "series" not in result:
            result["series"] = ""

        # Parse EN Content
        if "CONTENT EN" in blocks:
            result["markdown_content_en_raw"] = blocks["CONTENT EN"]
            result["markdown_content_en_html"] = markdown.markdown(
                blocks["CONTENT EN"], extensions=["fenced_code", "tables", "toc"]
            )

        # Parse FR Content
        if "CONTENT FR" in blocks:
            result["markdown_content_fr_raw"] = blocks["CONTENT FR"]
            result["markdown_content_fr_html"] = markdown.markdown(
                blocks["CONTENT FR"], extensions=["fenced_code", "tables", "toc"]
            )

        return result
