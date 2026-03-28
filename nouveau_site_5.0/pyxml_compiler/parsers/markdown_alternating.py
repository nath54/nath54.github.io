"""Markdown alternating parser.

Parses markdown files that contain content in alternating languages
using a specific header pattern. It expects pairs of sections,
where the first is the primary language (EN) and the second is the
alternate (FR).
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from pyxml_compiler.utils import read_file

try:
    import markdown  # type: ignore
except ImportError as e:
    raise ImportError(
        "The 'markdown' package is required. Install it with: pip install markdown"
    ) from e


class MarkdownAlternatingParser:
    """Parser for alternating bilingual markdown files.

    Expects a single .md file or a directory of .md files.
    The file should have alternating headers (##) for each language.
    Example:
    ## Event 1 (EN)
    Content EN...
    ## Event 1 (FR)
    Content FR...
    """

    def load(self, source_path: Path) -> list[dict[str, Any]]:
        """Load and parse alternating bilingual markdown content.

        Args:
            source_path: Path to a directory or a single .md file.

        Returns:
            A list of dicts, each with keys:
                - title_en (str): Title for the entry (if applicable)
                - sections (list[dict]): list of pairs, each with:
                    - sub_title_en, sub_title_fr (str)
                    - content_en, content_fr (str)
        """
        if source_path.is_file():
            md_files: list[Path] = [source_path]
        else:
            md_files = sorted(source_path.glob("*.md"))

        all_entries: list[dict[str, Any]] = []

        for md_file in md_files:
            content: str = read_file(md_file)
            parsed: dict[str, Any] = self._parse_alternating(content)
            all_entries.append(parsed)

        # For easy inclusion in templates, we might want to return the sections
        # from the first file directly if it's the only one.
        if len(all_entries) == 1:
            return all_entries[0]["sections"]

        return all_entries

    def _parse_alternating(self, content: str) -> dict[str, Any]:
        """Parse alternating markdown content.

        Args:
            content: The raw markdown content.

        Returns:
            A dict with 'title_en' and 'sections'.
        """
        lines: list[str] = content.split("\n")
        title_en: str = ""
        title_fr: str = ""
        raw_sections: list[dict[str, str]] = []
        current: dict[str, str] | None = None

        for line in lines:
            if line.startswith("# ") and not line.startswith("## "):
                if not title_en:  # Take the first main heading as title
                    full_title: str = line[2:].strip()
                    if " | " in full_title:
                        title_en, title_fr = [
                            t.strip() for t in full_title.split(" | ", 1)
                        ]
                        # Remove (EN) / (FR) if present
                        title_en = re.sub(r"\s*\(EN\)\s*$", "", title_en, flags=re.I)
                        title_fr = re.sub(r"\s*\(FR\)\s*$", "", title_fr, flags=re.I)
                    else:
                        title_en = full_title
            elif line.startswith("## "):
                if current:
                    raw_sections.append(current)
                current = {
                    "title": line[3:].strip(),
                    "content": "",
                }
            elif current is not None:
                current["content"] += line + "\n"

        if current:
            raw_sections.append(current)

        # Pair up sections (EN then FR)
        paired_sections: list[dict[str, str]] = []
        for i in range(0, len(raw_sections), 2):
            en: dict[str, str] = raw_sections[i]
            # Handle cases where there might not be an even number of sections
            fr: dict[str, str] = (
                raw_sections[i + 1]
                if i + 1 < len(raw_sections)
                else {"title": "", "content": ""}
            )

            # Clean up (EN) or (FR) from titles if present for better display
            # (Though native design-time text might prefer them left as-is)
            clean_title_en: str = re.sub(r"\s*\(EN\)\s*$", "", en["title"], flags=re.I)
            clean_title_fr: str = re.sub(r"\s*\(FR\)\s*$", "", fr["title"], flags=re.I)

            paired_sections.append(
                {
                    "sub_title_en": clean_title_en,
                    "sub_title_fr": clean_title_fr,
                    "content_en": markdown.markdown(
                        en["content"].strip(),
                        extensions=["fenced_code", "tables", "toc"],
                    ),
                    "content_fr": markdown.markdown(
                        fr["content"].strip(),
                        extensions=["fenced_code", "tables", "toc"],
                    ),
                }
            )

        return {
            "title_en": title_en,
            "title_fr": title_fr or title_en,
            "sections": paired_sections,
        }
