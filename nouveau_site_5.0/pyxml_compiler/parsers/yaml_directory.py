"""YAML directory parser.

Reads all YAML files from a directory and returns a list of dictionaries,
one per file. Each dict gets an extra '_source_file' key with the file stem.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml  # type: ignore

from pyxml_compiler.utils import read_file


class YamlDirectoryParser:
    """Parser that reads all YAML files from a directory.

    Supports both .yaml and .yml extensions.
    """

    def load(self, source_path: Path) -> list[dict[str, Any]]:
        """Load all YAML files from a directory.

        If source_path is a single file, loads just that file.
        If source_path is a directory, loads all .yaml and .yml files,
        sorted by filename.

        Args:
            source_path: Path to a directory or a single YAML file.

        Returns:
            A list of dicts, one per YAML file. Each dict includes
            '_source_file' set to the file stem.
        """
        entries: list[dict[str, Any]] = []

        if source_path.is_file():
            yaml_files: list[Path] = [source_path]
        else:
            yaml_files = sorted(
                list(source_path.glob("*.yaml")) + list(source_path.glob("*.yml"))
            )

        for yaml_file in yaml_files:
            content: str = read_file(yaml_file)
            data: Any = yaml.safe_load(content)

            if data is None:
                continue

            if isinstance(data, dict):
                data["_source_file"] = yaml_file.stem
                entries.append(data)
            elif isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        item["_source_file"] = yaml_file.stem
                        entries.append(item)

        return entries
