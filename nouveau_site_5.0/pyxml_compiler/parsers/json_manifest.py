"""JSON manifest parser.

Reads a manifest JSON file that lists other JSON files to load,
then consolidates all entries into a single list.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from pyxml_compiler.utils import read_file


class JsonManifestParser:
    """Parser that reads a JSON manifest and loads referenced JSON files.

    The manifest must be a JSON object with a 'files' key listing
    relative paths to other JSON files, or directly a JSON array.
    """

    def load(self, source_path: Path) -> list[dict[str, Any]]:
        """Load data from a JSON manifest file.

        If the source file is a manifest (has a 'files' key), loads each
        referenced file and consolidates all entries. Otherwise, if the
        file contains a JSON array, returns that array directly.

        Args:
            source_path: Path to the manifest.json file.

        Returns:
            A consolidated list of all entries from all referenced files.
        """
        content: str = read_file(source_path)
        data: Any = json.loads(content)
        base_dir: Path = source_path.parent

        all_entries: list[dict[str, Any]] = []

        # Determine the file list to load
        file_list: list[str] = []
        if isinstance(data, dict) and "files" in data:
            file_list = data["files"]
        elif isinstance(data, list) and all(isinstance(x, str) for x in data):
            file_list = data

        if file_list:
            for ref_file in file_list:
                file_path: Path = base_dir / ref_file
                if not file_path.exists():
                    continue

                file_content: str = read_file(file_path)
                file_data: Any = json.loads(file_content)

                if isinstance(file_data, list):
                    all_entries.extend(file_data)
                elif isinstance(file_data, dict):
                    all_entries.append(file_data)

            return all_entries

        # If it's directly an array of objects (the data itself)
        if isinstance(data, list):
            return data

        # If it's a single object (the data itself)
        if isinstance(data, dict):
            return [data]

        return []
