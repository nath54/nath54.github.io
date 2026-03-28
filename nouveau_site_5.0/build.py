"""Build script for the personal website.

Usage:
    python build.py              Build the complete site
    python build.py --watch      Build + watch for changes (auto-rebuild)
    python build.py --serve      Build + start a local HTTP server
    python build.py --clean      Remove the generated output directory
    python build.py --port 8080  Set the port for the local server
"""

from __future__ import annotations

from typing import Any
from pathlib import Path

import sys
import time
import shutil
import argparse
import threading

import yaml  # type: ignore  # pylint: disable=import-error

from pyxml_compiler.compiler import compile_page
from pyxml_compiler.context import CompilationContext
from pyxml_compiler.utils import read_file, write_file
from pyxml_compiler.parsers import PARSERS


def load_config(config_path: str = "build_config.yaml") -> dict[str, Any]:
    """Load the build configuration from a YAML file.

    Args:
        config_path: Path to the build configuration file.

    Returns:
        A dictionary of configuration values.
    """
    content: str = read_file(config_path)
    config: dict[str, Any] = yaml.safe_load(content)
    return config


def build_site(config: dict[str, Any]) -> None:
    """Execute a complete site build.

    Steps:
        1. Clean the output directory
        2. Copy static assets (CSS, JS, resources)
        3. Compile static PyXML pages
        4. Generate dynamic pages from data

    Args:
        config: The build configuration dictionary.
    """
    source_dir: Path = Path(config.get("source_dir", "."))
    build_dir: Path = source_dir / config.get("build_dir", "generated_website")
    templates_dir: Path = source_dir / config.get("templates_dir", "pyxml_sources")
    # css_dir: Path = source_dir / config.get("css_dir", "css")
    js_lib_dir: Path = build_dir / "js" / "lib"
    js_gen_dir: Path = build_dir / "js" / "generated"
    # res_dir: Path = source_dir / config.get("res_dir", "res")

    print(f"Building site from {source_dir}...")
    print(f"   Templates: {templates_dir}")
    print(f"   Output:    {build_dir}")

    # 1. Clean generated content (but preserve js/lib/)
    # We need to be careful not to delete the hand-written js/lib files
    # Only clean generated HTML and js/generated/
    clean_generated(build_dir, js_lib_dir)

    # Ensure output directories exist
    build_dir.mkdir(parents=True, exist_ok=True)
    js_gen_dir.mkdir(parents=True, exist_ok=True)

    # 2. Copy static assets
    copy_static_assets(config, source_dir, build_dir)

    # 3. Create compilation context
    context: CompilationContext = CompilationContext(
        base_dir=source_dir,
        templates_dir=templates_dir,
        build_dir=build_dir,
        default_lang=config.get("default_lang", "en"),
        site_title=config.get("site_title", "Nathan's Website"),
        languages=config.get("languages", ["en", "fr"]),
    )

    # 4. Compile static pages
    css_paths: list[str] = config.get("css_paths", ["css/main.css"])
    js_paths: list[str] = config.get("js_paths", ["js/lib/lib_translation.js"])

    compile_static_pages(context, config, templates_dir, build_dir, css_paths, js_paths)

    # 5. Generate dynamic pages
    generate_dynamic_pages(
        context, config, templates_dir, build_dir, css_paths, js_paths
    )

    print(f"Build complete! Output in {build_dir}/")


def clean_generated(build_dir: Path, js_lib_dir: Path) -> None:  # pylint: disable=unused-argument
    """Clean generated files without removing hand-written JS libs.

    Removes all .html files in build_dir and its subdirectories,
    and clears the js/generated/ directory.

    Args:
        build_dir: The output directory to clean.
        js_lib_dir: The js/lib directory to preserve.
    """
    if not build_dir.exists():
        return

    # Remove all generated HTML files
    for html_file in build_dir.rglob("*.html"):
        html_file.unlink()

    # Clear js/generated/
    js_gen: Path = build_dir / "js" / "generated"
    if js_gen.exists():
        shutil.rmtree(js_gen)


def copy_static_assets(
    config: dict[str, Any],
    source_dir: Path,
    build_dir: Path,
) -> None:
    """Copy CSS and resource files to the build output.

    Does NOT copy JS files (those are in generated_website/js/ directly).

    Args:
        config: The build configuration.
        source_dir: The project source directory.
        build_dir: The output build directory.
    """
    # Copy CSS if source directory exists
    css_src: Path = source_dir / config.get("css_dir", "css")
    css_dst: Path = build_dir / "css"
    if css_src.exists() and css_src != css_dst:
        if css_dst.exists():
            shutil.rmtree(css_dst)
        shutil.copytree(css_src, css_dst)
        print(f"   Copied CSS: {css_src} -> {css_dst}")

    # Copy resources if source directory exists
    res_src: Path = source_dir / config.get("res_dir", "res")
    res_dst: Path = build_dir / "res"
    if res_src.exists() and res_src != res_dst:
        if res_dst.exists():
            shutil.rmtree(res_dst)
        shutil.copytree(res_src, res_dst)
        print(f"   Copied resources: {res_src} -> {res_dst}")


def compile_static_pages(
    context: CompilationContext,
    config: dict[str, Any],
    templates_dir: Path,
    build_dir: Path,
    css_paths: list[str],
    js_paths: list[str],
) -> None:
    """Compile all static PyXML page templates into HTML files.

    Static pages are those defined in the config's 'static_pages' list.

    Args:
        context: The compilation context.
        config: The build configuration.
        templates_dir: Path to the templates directory.
        build_dir: Path to the output directory.
        css_paths: CSS file paths for the HTML skeleton.
        js_paths: JS file paths for the HTML skeleton.
    """
    static_pages: list[dict[str, str]] = config.get("static_pages", [])

    if not static_pages:
        # Default pages if none configured
        static_pages = _discover_static_pages(templates_dir)

    for page_def in static_pages:
        template: str = page_def.get("template", "")
        output: str = page_def.get("output", "")

        template_path: Path = templates_dir / template
        if not template_path.exists():
            print(f"   Template not found, skipping: {template_path}")
            continue

        output_path: Path = build_dir / output
        print(f"   Compiling {template} -> {output}")

        page_context: CompilationContext = context.for_page(output)
        html: str = compile_page(
            template_path,
            page_context,
            css_paths=css_paths,
            js_paths=js_paths,
        )

        write_file(output_path, html)


def _discover_static_pages(templates_dir: Path) -> list[dict[str, str]]:
    """Auto-discover static pages from the templates/pages/ directory.

    Args:
        templates_dir: Path to the templates root directory.

    Returns:
        A list of dicts with 'template' and 'output' keys.
    """
    pages_dir: Path = templates_dir / "pages"
    if not pages_dir.exists():
        return []

    pages: list[dict[str, str]] = []
    for pyxml_file in sorted(pages_dir.glob("*.pyxml")):
        relative_template: str = f"pages/{pyxml_file.name}"
        if pyxml_file.stem == "index":
            output: str = "index.html"
        elif pyxml_file.stem == "404":
            output = "404.html"
        else:
            output = f"pages/{pyxml_file.stem}.html"

        pages.append(
            {
                "template": relative_template,
                "output": output,
            }
        )

    return pages


def generate_dynamic_pages(
    context: CompilationContext,
    config: dict[str, Any],
    templates_dir: Path,
    build_dir: Path,
    css_paths: list[str],
    js_paths: list[str],
) -> None:
    """Generate dynamic pages from data files and templates.

    Dynamic pages are generated per-entry (one page per project,
    per blog post, per museum entry, etc.).

    Args:
        context: The compilation context.
        config: The build configuration.
        templates_dir: Path to the templates directory.
        build_dir: Path to the output directory.
        css_paths: CSS file paths for the HTML skeleton.
        js_paths: JS file paths for the HTML skeleton.
    """
    dynamic_pages: list[dict[str, Any]] = config.get("dynamic_pages", [])

    for page_def in dynamic_pages:
        parser_name: str = page_def.get("parser", "")
        source: str = page_def.get("source", "")
        template: str = page_def.get("template", "")
        output_pattern: str = page_def.get("output_pattern", "")
        type_templates: dict[str, str] = page_def.get("type_templates", {})
        type_field: str = page_def.get("type_field", "")

        if parser_name not in PARSERS:
            print(f"   ⚠️  Unknown parser '{parser_name}', skipping")
            continue

        parser = PARSERS[parser_name]()
        source_path: Path = Path(config.get("source_dir", ".")) / source
        if not source_path.exists():
            print(f"   ⚠️  Source not found: {source_path}, skipping")
            continue

        entries: list[dict[str, Any]] = parser.load(source_path)
        print(f"   📦 Generating {len(entries)} pages from {source}")

        for entry in entries:
            entry_id: str = str(entry.get("_source_file", "unknown"))

            # Determine template to use
            if type_templates and type_field:
                entry_type: str = str(entry.get(type_field, ""))
                template_file: str = type_templates.get(entry_type, template)
            else:
                template_file = template

            template_path: Path = templates_dir / template_file
            if not template_path.exists():
                print(
                    f"      ⚠️  Template not found: {template_path}, skipping entry {entry_id}"
                )
                continue

            # Build output path from pattern
            output: str = output_pattern.format(id=entry_id, **entry)
            output_path: Path = build_dir / output

            page_context: CompilationContext = context.for_page(output)
            page_context.update(entry)

            html: str = compile_page(
                template_path,
                page_context,
                css_paths=css_paths,
                js_paths=js_paths,
            )
            write_file(output_path, html)


def watch_and_rebuild(config: dict[str, Any]) -> None:
    """Watch for file changes and automatically rebuild.

    Monitors templates, CSS, JS, and data directories for changes.
    Uses a debounce timer to avoid rebuilding too frequently.

    Args:
        config: The build configuration.
    """
    try:
        from watchdog.events import FileSystemEventHandler  # type: ignore  # pylint: disable=import-error, import-outside-toplevel
        from watchdog.observers import Observer  # type: ignore  # pylint: disable=import-error, import-outside-toplevel
    except ImportError:
        print("❌ watchdog is required for --watch mode.")
        print("   Install it with: pip install watchdog")
        sys.exit(1)

    class RebuildHandler(FileSystemEventHandler):
        """File system event handler that triggers rebuilds."""

        def __init__(self) -> None:
            """Initialize the handler."""
            self.last_rebuild: float = 0.0
            self.debounce_seconds: float = 0.5

        def on_modified(self, event: Any) -> None:
            """Handle file modification events."""
            if event.is_directory:
                return

            path: Path = Path(event.src_path)
            valid_extensions: set[str] = {
                ".pyxml",
                ".css",
                ".js",
                ".yaml",
                ".yml",
                ".json",
                ".md",
            }
            if path.suffix not in valid_extensions:
                return

            now: float = time.time()
            if now - self.last_rebuild < self.debounce_seconds:
                return

            print(f"\n🔄 Change detected: {path.name}")
            try:
                build_site(config)
            except Exception as e:  # pylint: disable=broad-except
                print(f"❌ Build error: {e}")
            self.last_rebuild = now

    dirs_to_watch: list[str] = [
        config.get("templates_dir", "pyxml_sources"),
        config.get("css_dir", "css"),
        config.get("data_dir", "data"),
        config.get("res_dir", "res"),
    ]

    observer = Observer()
    handler: RebuildHandler = RebuildHandler()

    for d in dirs_to_watch:
        dir_path: Path = Path(d)
        if dir_path.exists():
            observer.schedule(handler, str(dir_path), recursive=True)

    observer.start()
    print("👀 Watching for changes... (Ctrl+C to stop)")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


def serve_locally(config: dict[str, Any], port: int = 8000) -> None:
    """Start a local HTTP server for previewing the site.

    Args:
        config: The build configuration.
        port: The port number to serve on.
    """
    import http.server  # type: ignore  # pylint: disable=import-error, import-outside-toplevel
    import socketserver  # type: ignore  # pylint: disable=import-error, import-outside-toplevel

    build_dir: str = str(
        Path(config.get("source_dir", "."))
        / config.get("build_dir", "generated_website")
    )

    class Handler(http.server.SimpleHTTPRequestHandler):
        """HTTP handler serving files from the build directory."""

        def __init__(self, *args: Any, **kwargs: Any) -> None:
            """Initialize with the build directory."""
            super().__init__(*args, directory=build_dir, **kwargs)

    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"🌐 Serving at http://localhost:{port}/")
        httpd.serve_forever()


def main() -> None:
    """CLI entry point for the build script."""
    parser: argparse.ArgumentParser = argparse.ArgumentParser(
        description="Build the personal website from PyXML templates.",
    )
    parser.add_argument(
        "--watch",
        action="store_true",
        help="Watch for file changes and rebuild automatically",
    )
    parser.add_argument(
        "--serve",
        action="store_true",
        help="Start a local HTTP server after building",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Clean the generated output directory",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port for the local server (default: 8000)",
    )
    parser.add_argument(
        "--config",
        type=str,
        default="build_config.yaml",
        help="Path to the build configuration file",
    )

    args: argparse.Namespace = parser.parse_args()

    config: dict[str, Any] = load_config(args.config)

    if args.clean:
        build_dir: Path = Path(config.get("source_dir", ".")) / config.get(
            "build_dir", "generated_website"
        )
        # Only clean generated HTML, not js/lib/
        clean_generated(build_dir, build_dir / "js" / "lib")
        print("🗑️  Generated files cleaned")
        return

    # Initial build
    build_site(config)

    # Watch and/or Serve
    if args.watch and args.serve:
        watcher_thread: threading.Thread = threading.Thread(
            target=watch_and_rebuild,
            args=(config,),
            daemon=True,
        )
        watcher_thread.start()
        serve_locally(config, args.port)
    elif args.watch:
        watch_and_rebuild(config)
    elif args.serve:
        serve_locally(config, args.port)


if __name__ == "__main__":
    main()
