"""Compilation context for PxXML compilation.

The CompilationContext stores all the state needed during compilation:
paths, variables, page metadata, and language configuration.
"""

from __future__ import annotations

from typing import Any, Optional
from pathlib import Path

import re
import copy


class CompilationContext:
    """Holds the state and configuration for a PyXML compilation pass.

    Attributes:
        base_dir: Root directory of the project source.
        templates_dir: Directory containing PyXML template files.
        build_dir: Output directory for generated HTML.
        default_lang: The default language code (e.g. 'en').
        site_title: The title of the website.
        page_title: The title of the current page being compiled.
        variables: Dictionary of variables available for placeholder resolution.
        languages: List of supported language codes.
    """

    def __init__(
        self,
        base_dir: Path,
        templates_dir: Path,
        build_dir: Path,
        default_lang: str = "en",
        site_title: str = "",
        page_title: str = "",
        languages: Optional[list[str]] = None,
    ) -> None:
        """Initialize a new CompilationContext.

        Args:
            base_dir: Root directory of the project source.
            templates_dir: Directory containing PyXML template files.
            build_dir: Output directory for generated HTML.
            default_lang: The default language code.
            site_title: The title of the website.
            page_title: The title of the current page.
            languages: List of supported language codes. Defaults to ['en', 'fr'].
        """
        self.base_dir: Path = base_dir
        self.templates_dir: Path = templates_dir
        self.build_dir: Path = build_dir
        self.default_lang: str = default_lang
        self.site_title: str = site_title
        self.page_title: str = page_title
        self.languages: list[str] = languages if languages is not None else ["en", "fr"]
        self.variables: dict[str, Any] = {}
        self.output_path: str = ""

    def set(self, key: str, value: Any) -> None:
        """Set a variable in the context.

        Args:
            key: The variable name.
            value: The variable value.
        """
        self.variables[key] = value

    def get(self, key: str, default: Any = None) -> Any:
        """Get a variable from the context.

        Args:
            key: The variable name.
            default: The default value if the key is not found.

        Returns:
            The variable value, or default if not found.
        """
        return self.variables.get(key, default)

    def update(self, data: dict[str, Any]) -> None:
        """Update the context variables with a dictionary.

        Args:
            data: Dictionary of key-value pairs to merge into the context.
        """
        self.variables.update(data)

    def resolve(self, placeholder: str) -> Any:
        """Resolve a placeholder string to its value.

        Handles '{variable_name}' syntax. If the placeholder is just
        '{key}', returns the raw value (may be a list, dict, etc.).
        If the placeholder contains mixed text and placeholders, returns
        a string with all placeholders substituted.

        Args:
            placeholder: The placeholder string to resolve.

        Returns:
            The resolved value. Can be any type for pure placeholders,
            or a string for mixed content.
        """

        stripped: str = placeholder.strip()

        # Pure placeholder: {key}
        if (
            stripped.startswith("{")
            and stripped.endswith("}")
            and stripped.count("{") == 1
            and stripped.count("}") == 1
        ):
            key: str = stripped[1:-1].strip()
            val = self.resolve_key(key)
            if val is not None:
                return val
            return placeholder  # unresolved

        # Mixed content with placeholders
        def replacer(match: re.Match[str]) -> str:
            """Replace a single placeholder in mixed content."""
            k: str = match.group(1).strip()
            val = self.resolve_key(k)
            if val is not None:
                return str(val)
            return match.group(0)

        return re.sub(r"\{([^}]+)\}", replacer, placeholder)

    def resolve_key(self, key: str) -> Any:
        """Resolve a complex key (e.g. 'obj[field]' or 'obj.field') from variables."""
        # Simple lookup
        if key in self.variables:
            return self.variables[key]

        # Handle nested access: obj[field] or obj.field
        # This is a basic implementation for the requested patterns
        match = re.match(r"(\w+)\[(['\"]?)(\w+)\2\]", key)
        if match:
            obj_name, _, field = match.groups()
            obj = self.variables.get(obj_name)
            if isinstance(obj, dict):
                return obj.get(field)

        match = re.match(r"(\w+)\.(\w+)", key)
        if match:
            obj_name, field = match.groups()
            obj = self.variables.get(obj_name)
            if isinstance(obj, dict):
                return obj.get(field)

        return None

    def copy(self) -> CompilationContext:
        """Create a shallow copy of this context.

        The variables dict is shallow-copied so that changes in the
        child context don't affect the parent.

        Returns:
            A new CompilationContext with the same settings and a
            shallow copy of the variables.
        """
        new_ctx: CompilationContext = CompilationContext(
            base_dir=self.base_dir,
            templates_dir=self.templates_dir,
            build_dir=self.build_dir,
            default_lang=self.default_lang,
            site_title=self.site_title,
            page_title=self.page_title,
            languages=list(self.languages),
        )
        new_ctx.variables = copy.copy(self.variables)
        new_ctx.output_path = self.output_path
        return new_ctx

    def for_page(self, output_path: str) -> CompilationContext:
        """Create a sub-context for compiling a specific page.

        Sets the page_title and output_path.

        Args:
            output_path: The relative output path of the page (e.g. 'pages/about.html').

        Returns:
            A new CompilationContext configured for this page.
        """
        ctx: CompilationContext = self.copy()
        ctx.output_path = output_path
        # Derive a page title from the path
        page_name: str = Path(output_path).stem.replace("_", " ").title()
        ctx.page_title = f"{page_name} — {self.site_title}"
        return ctx
