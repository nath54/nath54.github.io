"""Parser registry — maps parser names to their classes.

Each parser implements a load() method that returns a list of dictionaries.
"""

from __future__ import annotations

from typing import Any

from pyxml_compiler.parsers.json_manifest import JsonManifestParser
from pyxml_compiler.parsers.markdown_bilingual import MarkdownBilingualParser
from pyxml_compiler.parsers.markdown_content import MarkdownContentParser
from pyxml_compiler.parsers.yaml_directory import YamlDirectoryParser


PARSERS: dict[str, type] = {
    "markdown_bilingual": MarkdownBilingualParser,
    "yaml_directory": YamlDirectoryParser,
    "json_manifest": JsonManifestParser,
    "json_array": JsonManifestParser,  # alias
    "markdown_content": MarkdownContentParser,
}
