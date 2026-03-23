# Design du pipeline de build

## Architecture globale

```graph
                    ┌─────────────┐
                    │   Données   │
                    │ (YAML/JSON/ │
                    │  Markdown)  │
                    └─────────────┘
                           ↓
┌─────────────┐    ┌─────────────┐   ┌─────────────┐
│  Templates  │ →  │  build.py   │ ← │    Style    │
│   (PyXML)   │    │ (compileur) │   │   (CSS)     │
└─────────────┘    └─────────────┘   └─────────────┘
                          ↓
                    ┌─────────────┐
                    │  Site HTML  │
                    │   généré    │
                    │  (build/)   │
                    └─────────────┘
```

---

## Structure du projet (complète)

```t
nouveau_site_5.0/
├── build.py                    # Script principal de build
├── build_config.yaml           # Configuration du build
├── requirements.txt            # Dépendances Python (pyyaml, markdown, watchdog)
│
├── templates/                  # Templates PyXML
│   ├── components/             # Composants réutilisables
│   │   ├── project_card.pyxml
│   │   ├── blog_post_row_cardline.pyxml
│   │   ├── media_card.pyxml
│   │   ├── category_card.pyxml
│   │   ├── citation_card.pyxml
│   │   ├── large_expandable_node.pyxml
│   │   ├── medium_expandable_node.pyxml
│   │   └── small_expandable_node.pyxml
│   ├── layouts/                # Layouts de base
│   │   ├── base.pyxml          # Squelette HTML (head, body, scripts)
│   │   ├── main_container.pyxml
│   │   ├── single_column.pyxml
│   │   └── two_columns.pyxml
│   └── pages/                  # Templates de pages
│       ├── index.pyxml
│       ├── contact_me.pyxml
│       ├── about_me.pyxml
│       ├── projects.pyxml
│       ├── museum.pyxml
│       ├── museum_category.pyxml
│       ├── museum_entry_music.pyxml
│       ├── museum_entry_image.pyxml
│       ├── museum_entry_text.pyxml
│       ├── museum_entry_3d.pyxml
│       ├── museum_entry_interactive.pyxml
│       ├── blog.pyxml
│       ├── blog_entry.pyxml
│       └── 404.pyxml
│
├── css/                        # Fichiers de style (voir style_design.md)
│   ├── base/
│   ├── themes/
│   ├── layouts/
│   ├── components/
│   ├── pages/
│   ├── utilities/
│   └── main.css
│
├── js/                         # Scripts JavaScript (voir js_features_design.md)
│   ├── core/
│   ├── features/
│   ├── easter-eggs/
│   └── utils/
│
├── data/                       # Données du site (voir data_formats_design.md)
│   ├── about_me/
│   ├── blogs/
│   ├── citations/
│   ├── home/
│   ├── media/
│   └── projects/
│
├── res/                        # Ressources statiques
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   ├── cv_en.pdf
│   └── cv_fr.pdf
│
├── compiler/                   # Code source du compilateur PyXML
│   ├── __init__.py
│   ├── pyxml_parser.py         # Parser PyXML → arbre de noeuds
│   ├── compiler.py             # Compilation noeuds → HTML
│   ├── construction_blocks.py  # Mapping des blocs de construction
│   ├── execution_blocks.py     # Gestion des blocs d'exécution
│   ├── context.py              # Contexte de compilation
│   ├── parsers/                # Parsers de données
│   │   ├── __init__.py
│   │   ├── markdown_bilingual.py
│   │   ├── yaml_directory.py
│   │   ├── json_manifest.py
│   │   └── markdown_content.py
│   └── utils.py                # Utilitaires (escape HTML, paths, ...)
│
├── doc/                        # Documentation
│   └── personal_site_design/
│       ├── draft.md
│       ├── pages_design.md
│       ├── todo_overview.md
│       ├── pyxml_compiler_design.md
│       ├── style_design.md
│       ├── js_features_design.md
│       ├── data_formats_design.md
│       └── build_pipeline_design.md
│
└── build/                      # OUTPUT: site généré (gitignore pour dev, commit pour deploy)
    ├── index.html
    ├── css/
    ├── js/
    ├── res/
    └── pages/
        ├── contact_me.html
        ├── about_me.html
        ├── projects.html
        ├── museum.html
        ├── museum/
        │   ├── music.html
        │   ├── drawing.html
        │   ├── entry_music_song1.html
        │   └── ...
        ├── blog.html
        └── blog/
            ├── entry_thoughts_on_programming.html
            └── ...
```

---

## Script principal `build.py`

### Pseudo-code

```python
#!/usr/bin/env python3
"""
build.py - Script principal de build du site web.

Usage:
    python build.py              # Build complet
    python build.py --watch      # Build + watch (rebuild auto sur changement)
    python build.py --clean      # Supprime le dossier build/
    python build.py --serve      # Build + serveur local (http://localhost:8000)
"""

import argparse
import shutil
from pathlib import Path

from compiler.pyxml_parser import parse_pyxml
from compiler.compiler import compile_node
from compiler.context import CompilationContext
from compiler.parsers.yaml_directory import YamlDirectoryParser
from compiler.parsers.markdown_bilingual import MarkdownBilingualParser
from compiler.parsers.json_manifest import JsonManifestParser


# ===================== Configuration =====================

def load_config(config_path="build_config.yaml"):
    """Charge la configuration du build."""

    config = yaml.safe_load(read_file(config_path))
    return config
    # Retourne un dict avec :
    # {
    #     "source_dir": ".",
    #     "build_dir": "build",
    #     "templates_dir": "templates",
    #     "css_dir": "css",
    #     "js_dir": "js",
    #     "data_dir": "data",
    #     "res_dir": "res",
    #     "default_lang": "en",
    #     "site_title": "Nathan's Website",
    #     "base_url": "https://nath54.github.io",
    # }


# ===================== Build principal =====================

def build_site(config):
    """
    Build complet du site.

    Étapes :
    1. Nettoyer le dossier build/
    2. Copier les assets statiques (CSS, JS, res)
    3. Compiler chaque page PyXML
    4. Générer les pages dynamiques (projets, museum, blog)
    5. Éventuellement minifier CSS/JS (production)
    """

    build_dir = Path(config["build_dir"])

    # 1. Nettoyer
    if build_dir.exists():
        shutil.rmtree(build_dir)
    build_dir.mkdir(parents=True)

    # 2. Copier les assets
    copy_static_assets(config)

    # 3. Créer le contexte de compilation global
    context = CompilationContext(
        base_dir=Path(config["source_dir"]),
        templates_dir=Path(config["templates_dir"]),
        build_dir=build_dir,
        default_lang=config["default_lang"],
        site_title=config["site_title"],
    )

    # 4. Compiler les pages statiques
    compile_static_pages(context, config)

    # 5. Générer les pages dynamiques
    generate_dynamic_pages(context, config)

    print(f"✓ Build terminé dans {build_dir}/")


# ===================== Assets statiques =====================

def copy_static_assets(config):
    """Copie CSS, JS et ressources dans build/."""

    build_dir = Path(config["build_dir"])

    # CSS : copier tel quel (ou concaténer/minifier en prod)
    shutil.copytree(config["css_dir"], build_dir / "css")

    # JS : copier tel quel
    shutil.copytree(config["js_dir"], build_dir / "js")

    # Ressources (images, fonts, CV, icônes)
    shutil.copytree(config["res_dir"], build_dir / "res")


# ===================== Pages statiques =====================

def compile_static_pages(context, config):
    """Compile les pages qui n'ont pas besoin de génération dynamique multiple."""

    static_pages = [
        ("templates/pages/index.pyxml",       "index.html"),
        ("templates/pages/contact_me.pyxml",   "pages/contact_me.html"),
        ("templates/pages/about_me.pyxml",     "pages/about_me.html"),
        ("templates/pages/projects.pyxml",     "pages/projects.html"),
        ("templates/pages/museum.pyxml",       "pages/museum.html"),
        ("templates/pages/blog.pyxml",         "pages/blog.html"),
        ("templates/pages/404.pyxml",          "404.html"),
    ]

    for template_path, output_path in static_pages:
        print(f"  Compiling {template_path} → {output_path}")

        # Lire et parser le template
        pyxml_content = read_file(template_path)
        root = parse_pyxml(pyxml_content)

        # Compiler
        page_context = context.for_page(output_path)
        html = compile_page(root, page_context)

        # Écrire
        output_file = Path(config["build_dir"]) / output_path
        output_file.parent.mkdir(parents=True, exist_ok=True)
        write_file(output_file, html)


# ===================== Pages dynamiques =====================

def generate_dynamic_pages(context, config):
    """Génère les pages qui nécessitent une page par entrée de données."""

    # 1. Sous-pages Museum (une par catégorie)
    generate_museum_category_pages(context, config)

    # 2. Sous-pages Museum (une par entrée media)
    generate_museum_entry_pages(context, config)

    # 3. Sous-pages Blog (une par article)
    generate_blog_entry_pages(context, config)

    # 4. Sous-pages Projets (une par projet, pour le no-JS)
    generate_project_detail_pages(context, config)


def generate_museum_category_pages(context, config):
    """Génère une page HTML par catégorie de media."""

    # Charger le manifest des catégories
    manifest = yaml.safe_load(read_file("data/media/manifest.yaml"))

    # Charger toutes les entrées media
    media_parser = YamlDirectoryParser()
    all_media = media_parser.load(Path("data/media/entries"))

    for cat_type, cat_info in manifest["categories"].items():
        # Filtrer les media de cette catégorie
        category_media = [m for m in all_media if m["media_type"] == cat_type]

        if not category_media:
            continue

        # Compiler la page de catégorie
        template = read_file("templates/pages/museum_category.pyxml")
        root = parse_pyxml(template)

        page_context = context.for_page(f"pages/museum/{cat_type}.html")
        page_context.set("category_name_en", cat_info["name_en"])
        page_context.set("category_name_fr", cat_info["name_fr"])
        page_context.set("media_entries", category_media)

        html = compile_page(root, page_context)

        output_path = Path(config["build_dir"]) / f"pages/museum/{cat_type}.html"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        write_file(output_path, html)


def generate_museum_entry_pages(context, config):
    """Génère une page HTML par entrée media."""

    media_parser = YamlDirectoryParser()
    all_media = media_parser.load(Path("data/media/entries"))

    # Mapping type → template
    TYPE_TEMPLATES = {
        "music":       "templates/pages/museum_entry_music.pyxml",
        "poem":        "templates/pages/museum_entry_text.pyxml",
        "lyrics":      "templates/pages/museum_entry_text.pyxml",
        "novel":       "templates/pages/museum_entry_text.pyxml",
        "drawing":     "templates/pages/museum_entry_image.pyxml",
        "pixel_art":   "templates/pages/museum_entry_image.pyxml",
        "voxel_art":   "templates/pages/museum_entry_image.pyxml",
        "3d":          "templates/pages/museum_entry_3d.pyxml",
        "video":       "templates/pages/museum_entry_music.pyxml",
        "interactive": "templates/pages/museum_entry_interactive.pyxml",
    }

    for entry in all_media:
        entry_id = entry["_source_file"]
        media_type = entry["media_type"]
        template_path = TYPE_TEMPLATES.get(media_type)

        if not template_path:
            print(f"  ⚠ Unknown media type: {media_type} for {entry_id}")
            continue

        template = read_file(template_path)
        root = parse_pyxml(template)

        page_context = context.for_page(f"pages/museum/entry_{entry_id}.html")
        page_context.update(entry)

        html = compile_page(root, page_context)

        output_path = Path(config["build_dir"]) / f"pages/museum/entry_{entry_id}.html"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        write_file(output_path, html)


def generate_blog_entry_pages(context, config):
    """Génère une page HTML par article de blog."""

    blog_parser = YamlDirectoryParser()
    all_blogs = blog_parser.load(Path("data/blogs/entries"))

    for entry in all_blogs:
        entry_id = entry["_source_file"]

        # Lire le contenu markdown EN/FR et convertir en HTML
        md_en = read_file(Path("data/blogs") / entry["markdown_content_en"])
        md_fr = read_file(Path("data/blogs") / entry["markdown_content_fr"])
        entry["markdown_content_en_html"] = markdown_to_html(md_en)
        entry["markdown_content_fr_html"] = markdown_to_html(md_fr)

        template = read_file("templates/pages/blog_entry.pyxml")
        root = parse_pyxml(template)

        page_context = context.for_page(f"pages/blog/entry_{entry_id}.html")
        page_context.update(entry)

        html = compile_page(root, page_context)

        output_path = Path(config["build_dir"]) / f"pages/blog/entry_{entry_id}.html"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        write_file(output_path, html)


# ===================== Mode Watch =====================

def watch_and_rebuild(config):
    """
    Surveille les changements dans les fichiers sources et rebuild automatiquement.
    Utilise la bibliothèque `watchdog`.
    """

    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler

    class RebuildHandler(FileSystemEventHandler):
        def __init__(self):
            self.last_rebuild = 0
            self.debounce_ms = 500  # éviter les rebuilds multiples

        def on_modified(self, event):
            if event.is_directory:
                return

            # Vérifier l'extension
            path = Path(event.src_path)
            if path.suffix in [".pyxml", ".css", ".js", ".yaml", ".yml",
                               ".json", ".md"]:
                now = time.time() * 1000
                if now - self.last_rebuild > self.debounce_ms:
                    print(f"\n🔄 Change detected: {path.name}")
                    try:
                        build_site(config)
                    except Exception as e:
                        print(f"❌ Build error: {e}")
                    self.last_rebuild = now

    # Dossiers à surveiller
    dirs_to_watch = ["templates", "css", "js", "data", "res"]

    observer = Observer()
    handler = RebuildHandler()

    for d in dirs_to_watch:
        if Path(d).exists():
            observer.schedule(handler, d, recursive=True)

    observer.start()
    print("👀 Watching for changes... (Ctrl+C to stop)")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


# ===================== Mode Serve =====================

def serve_locally(config, port=8000):
    """Lance un serveur HTTP local pour prévisualiser le site."""

    import http.server
    import socketserver

    build_dir = config["build_dir"]

    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=build_dir, **kwargs)

    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"🌐 Serving at http://localhost:{port}/")
        httpd.serve_forever()


# ===================== Point d'entrée =====================

def main():
    parser = argparse.ArgumentParser(description="Build the personal website")
    parser.add_argument("--watch", action="store_true", help="Watch for changes and rebuild")
    parser.add_argument("--serve", action="store_true", help="Start a local server")
    parser.add_argument("--clean", action="store_true", help="Clean the build directory")
    parser.add_argument("--port", type=int, default=8000, help="Port for local server")

    args = parser.parse_args()
    config = load_config()

    if args.clean:
        shutil.rmtree(config["build_dir"], ignore_errors=True)
        print("🗑️ Build directory cleaned")
        return

    # Build initial
    build_site(config)

    # Watch ou Serve
    if args.watch and args.serve:
        # Lancer les deux dans des threads séparés
        import threading
        watcher = threading.Thread(target=watch_and_rebuild, args=(config,), daemon=True)
        watcher.start()
        serve_locally(config, args.port)

    elif args.watch:
        watch_and_rebuild(config)

    elif args.serve:
        serve_locally(config, args.port)


if __name__ == "__main__":
    main()
```

---

## Configuration du build

```yaml
# build_config.yaml

source_dir: "."
build_dir: "build"
templates_dir: "templates"
css_dir: "css"
js_dir: "js"
data_dir: "data"
res_dir: "res"

default_lang: "en"
site_title: "Nathan's Website"
base_url: "https://nath54.github.io"

# Options de production
minify_css: false
minify_js: false
minify_html: false
```

---

## Hook GitHub pour build automatique

### GitHub Actions workflow

```yaml
# .github/workflows/build-and-deploy.yml

name: Build and Deploy Website

on:
    push:
        branches: [main]
        paths:
            - 'nouveau_site_5.0/**'

jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v4

            - name: Setup Python
              uses: actions/setup-python@v5
              with:
                  python-version: '3.11'

            - name: Install dependencies
              run: |
                  cd nouveau_site_5.0
                  pip install -r requirements.txt

            - name: Build site
              run: |
                  cd nouveau_site_5.0
                  python build.py

            - name: Deploy to GitHub Pages
              uses: peaceiris/actions-gh-pages@v4
              with:
                  github_token: ${{ secrets.GITHUB_TOKEN }}
                  publish_dir: nouveau_site_5.0/build
```

---

## Dépendances Python

```s
# requirements.txt

PyYAML>=6.0
markdown>=3.5
watchdog>=3.0
```
