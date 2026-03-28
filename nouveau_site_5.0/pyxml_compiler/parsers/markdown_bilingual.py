"""Markdown bilingual parser.

Parses markdown files that contain content in two languages,
separated by a '---LANG_SEPARATOR---' marker. The first half is
the default language (EN), the second half is the alternate (FR).

Sections are identified by markdown headings (# for title, ## for subsections).
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from pyxml_compiler.utils import read_file


class MarkdownBilingualParser:
    """Parser for bilingual markdown files.

    Reads a directory of .md files, each split by '---LANG_SEPARATOR---'
    into EN and FR sections. Returns structured data for template compilation.
    """

    def load(self, source_path: Path) -> list[dict[str, Any]]:
        """Load and parse all bilingual markdown files from a directory.

        If source_path is a file, parse that single file.
        If source_path is a directory, parse all .md files sorted by name.

        Args:
            source_path: Path to a directory or a single .md file.

        Returns:
            A list of dicts, each with keys:
                - filename (str): stem of the source file
                - title_en (str): English title (first # heading)
                - title_fr (str): French title
                - sections (list[dict]): list of subsections, each with:
                    - sub_title_en, sub_title_fr (str)
                    - content_en, content_fr (str): raw markdown content
        """
        entries: list[dict[str, Any]] = []

        if source_path.is_file():
            md_files: list[Path] = [source_path]
        else:
            md_files = sorted(source_path.glob("*.md"))

        for md_file in md_files:
            content: str = read_file(md_file)
            parsed: dict[str, Any] = self._parse_bilingual(content)
            parsed["filename"] = md_file.stem
            parsed["_source_file"] = md_file.stem
            entries.append(parsed)

        return entries

    def _parse_bilingual(self, content: str) -> dict[str, Any]:
        """Parse a single bilingual markdown string.

        Args:
            content: The full markdown content with LANG_SEPARATOR.

        Returns:
            Dict with title_en, title_fr, and sections.
        """
        separator: str = "---LANG_SEPARATOR---"
        parts: list[str] = content.split(separator)

        part_en: str = parts[0].strip() if len(parts) > 0 else ""
        part_fr: str = parts[1].strip() if len(parts) > 1 else ""

        title_en: str
        sections_en: list[dict[str, str]]
        title_en, sections_en = self._parse_single_lang(part_en)

        title_fr: str
        sections_fr: list[dict[str, str]]
        title_fr, sections_fr = self._parse_single_lang(part_fr)

        # Merge sections by index
        max_sections: int = max(len(sections_en), len(sections_fr))
        sections: list[dict[str, str]] = []

        for i in range(max_sections):
            section: dict[str, str] = {
                "sub_title_en": (
                    sections_en[i]["title"] if i < len(sections_en) else ""
                ),
                "sub_title_fr": (
                    sections_fr[i]["title"] if i < len(sections_fr) else ""
                ),
                "content_en": (
                    sections_en[i]["content"].strip() if i < len(sections_en) else ""
                ),
                "content_fr": (
                    sections_fr[i]["content"].strip() if i < len(sections_fr) else ""
                ),
            }
            sections.append(section)

        return {
            "title_en": title_en,
            "title_fr": title_fr,
            "sections": sections,
        }

    @staticmethod
    def _parse_single_lang(text: str) -> tuple[str, list[dict[str, str]]]:
        """Parse the markdown of a single language portion.

        Args:
            text: Markdown text for one language.

        Returns:
            A tuple of (title, sections) where title is the first # heading
            and sections is a list of dicts with 'title' and 'content'.
        """
        lines: list[str] = text.split("\n")
        title: str = ""
        sections: list[dict[str, str]] = []
        current_section: dict[str, str] | None = None

        for line in lines:
            if line.startswith("# ") and not line.startswith("## "):
                title = line[2:].strip()
            elif line.startswith("## "):
                if current_section is not None:
                    sections.append(current_section)
                current_section = {
                    "title": line[3:].strip(),
                    "content": "",
                }
            elif current_section is not None:
                current_section["content"] += line + "\n"

        if current_section is not None:
            sections.append(current_section)

        return title, sections
