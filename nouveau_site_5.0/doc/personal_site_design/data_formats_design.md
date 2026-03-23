# Design des formats de données intermédiaires

## Vue d'ensemble

Le site utilise plusieurs formats de données intermédiaires pour séparer le contenu de la présentation. Chaque type de contenu a son propre format et son propre parser.

```t
data/
├── about_me/            # Markdown bilingue
│   ├── My_Hobbies.md
│   ├── My_Studies.md
│   └── Places_where_I_lived.md
├── blogs/               # YAML + Markdown par article
│   ├── manifest.yaml
│   └── entries/
│       ├── 2024-10-21_thoughts_on_programming.yaml
│       └── content/
│           ├── 2024-10-21_thoughts_on_programming_en.md
│           └── 2024-10-21_thoughts_on_programming_fr.md
├── citations/           # JSON
│   ├── manifest.json
│   └── data_citation_1.json
├── home/                # Markdown bilingue
│   └── quick_history.md
├── media/               # YAML par entrée
│   ├── manifest.yaml
│   └── entries/
│       ├── music_song1.yaml
│       ├── drawing_landscape.yaml
│       └── poem_autumn.yaml
└── projects/            # YAML par projet
    ├── project_website.yaml
    ├── project_game.yaml
    └── project_cv_creator.yaml
```

---

## Format 1 : Markdown bilingue

Utilisé pour : `about_me/`, `home/quick_history.md`

### 1.1. Structure du fichier

```markdown
# My Hobbies (EN title, ignored by parser - just for readability)

## Programming

I love programming since I was a teenager...

## Music

I play several instruments...

---LANG_SEPARATOR---

# Mes Hobbies (FR title, ignored by parser)

## La programmation

J'adore la programmation depuis que je suis adolescent...

## La musique

Je joue de plusieurs instruments...
```

### 1.2. Règles de parsing

```python
def parse_markdown_bilingual(filepath):
    """
    Parse un fichier markdown bilingue.

    Convention :
    - Le fichier est séparé en deux parties par `---LANG_SEPARATOR---`
    - La première partie est EN, la seconde est FR
    - Les titres de niveau 1 (#) sont les titres de section
    - Les titres de niveau 2 (##) sont les sous-sections
    - Le contenu sous chaque ## est le corps de la sous-section

    Returns:
        dict:
            title_en: str
            title_fr: str
            sections: list[dict]
                sub_title_en: str
                sub_title_fr: str
                content_en: str  (HTML généré depuis markdown)
                content_fr: str  (HTML généré depuis markdown)
    """

    content = read_file(filepath)

    # Séparer EN / FR
    parts = content.split("---LANG_SEPARATOR---")
    part_en = parts[0].strip()
    part_fr = parts[1].strip() if len(parts) > 1 else ""

    # Parser chaque partie
    title_en, sections_en = parse_single_lang(part_en)
    title_fr, sections_fr = parse_single_lang(part_fr)

    # Fusionner les sections par index
    sections = []
    for i in range(max(len(sections_en), len(sections_fr))):
        section = {
            "sub_title_en": sections_en[i]["title"] if i < len(sections_en) else "",
            "sub_title_fr": sections_fr[i]["title"] if i < len(sections_fr) else "",
            "content_en": markdown_to_html(sections_en[i]["content"]) if i < len(sections_en) else "",
            "content_fr": markdown_to_html(sections_fr[i]["content"]) if i < len(sections_fr) else "",
        }
        sections.append(section)

    return {
        "title_en": title_en,
        "title_fr": title_fr,
        "sections": sections,
    }


def parse_single_lang(text):
    """
    Parse le markdown d'une seule langue.

    Returns:
        title: str (contenu du premier #)
        sections: list[dict] avec title et content
    """

    lines = text.split("\n")
    title = ""
    sections = []
    current_section = None

    for line in lines:
        if line.startswith("# "):
            title = line[2:].strip()
        elif line.startswith("## "):
            if current_section:
                sections.append(current_section)
            current_section = {
                "title": line[3:].strip(),
                "content": ""
            }
        elif current_section is not None:
            current_section["content"] += line + "\n"

    if current_section:
        sections.append(current_section)

    return title, sections
```

---

## Format 2 : YAML Projet

Utilisé pour : `data/projects/`

### 2.1. Structure du fichier

```yaml
# data/projects/project_website.yaml

name_en: "Personal Website v5.0"
name_fr: "Site Personnel v5.0"

tags: ["web", "python", "css", "javascript"]

icon: "res/projects/website_icon.png"
link: "https://github.com/nath54/nath54.github.io"

project_type: "personal"
# Valeurs possibles : "personal", "professional", "academic"

project_status: "base-dev"
# Valeurs possibles : "non-started", "base-dev", "first-minimal-demo", "Vx.xx"

project_showcase_importance: 90
# Entier 0-100
# < 40 : projet masqué de la grille
# ≥ 40 : affiché, trié par importance décroissante

short_description_en: "My personal website, built with a custom PyXML compiler."
short_description_fr: "Mon site personnel, construit avec un compilateur PyXML custom."

description_en:
    - "This is the 5th iteration of my personal website."
    - "It uses a custom build pipeline: PyXML templates + YAML/JSON data → static HTML."
    - "Features include: SPA navigation, multi-language, themes, museum gallery, blog."

description_fr:
    - "C'est la 5ème itération de mon site personnel."
    - "Il utilise un pipeline de build custom : templates PyXML + données YAML/JSON → HTML statique."
    - "Fonctionnalités : navigation SPA, multi-langue, thèmes, galerie musée, blog."

gallery:
    - "res/projects/website_screenshot1.png"
    - "res/projects/website_screenshot2.png"

TODOLIST:
    - text: "PyXML compiler"
      done: false
      children:
        - text: "Construction blocks"
          done: true
        - text: "Execution blocks"
          done: false
    - text: "Style system"
      done: false
    - text: "JS features"
      done: false
```

### 2.2. Règles de parsing

```python
def parse_yaml_project(filepath):
    """
    Parse un fichier YAML de projet.
    Validation : vérifie les champs requis et les valeurs autorisées.

    Returns:
        dict: données du projet (clés = noms des champs YAML)
    """

    data = yaml.safe_load(read_file(filepath))
    data["_source_file"] = filepath.stem  # pour générer les IDs

    # Validation
    REQUIRED_FIELDS = ["name_en", "name_fr", "tags", "project_type",
                       "project_status", "project_showcase_importance",
                       "short_description_en", "short_description_fr"]
    for field in REQUIRED_FIELDS:
        assert field in data, f"Missing field '{field}' in {filepath}"

    VALID_TYPES = ["personal", "professional", "academic"]
    assert data["project_type"] in VALID_TYPES

    return data
```

---

## Format 3 : YAML Media (Museum)

Utilisé pour : `data/media/entries/`

### 3.1. Structure du fichier

```yaml
# data/media/entries/music_song1.yaml

title_en: "Midnight Echoes"
title_fr: "Échos de Minuit"

date: "2024-05-12"

media_type: "music"
# Valeurs possibles : "music", "poem", "drawing", "3d", "video", "pixel_art",
#                      "voxel_art", "interactive", "novel", "lyrics"

tags: ["ambient", "synth", "electronic"]

# === Champs spécifiques au type ===

# Pour music, video :
file_url: "res/media/audio/midnight_echoes.mp3"

# Pour drawing, 3d, pixel_art, voxel_art :
# image_url: "res/media/images/landscape.png"

# Pour poem, lyrics, novel :
# text_content_en: |
#     Line 1 of poem
#     Line 2 of poem
# text_content_fr: |
#     Ligne 1 du poème
#     Ligne 2 du poème

description_en: "An ambient track I composed during a late night session."
description_fr: "Un morceau ambient composé lors d'une session nocturne."

# Optionnel : thumbnail custom (sinon auto-généré)
thumbnail: "res/media/thumbnails/midnight_echoes_thumb.jpg"
```

### 3.2. Manifest

```yaml
# data/media/manifest.yaml

# Ce fichier est optionnel : si absent, le parser scanne le dossier entries/
# Si présent, il permet de contrôler l'ordre et de grouper manuellement

categories:
    music:
        name_en: "Music"
        name_fr: "Musique"
        icon: "res/icons/music.svg"
    poem:
        name_en: "Poems & Lyrics"
        name_fr: "Poèmes & Paroles"
        icon: "res/icons/poem.svg"
    drawing:
        name_en: "Drawings"
        name_fr: "Dessins"
        icon: "res/icons/drawing.svg"
    3d:
        name_en: "3D Renderings"
        name_fr: "Rendus 3D"
        icon: "res/icons/3d.svg"
    video:
        name_en: "Videos"
        name_fr: "Vidéos"
        icon: "res/icons/video.svg"
    interactive:
        name_en: "Interactive Experiences"
        name_fr: "Expériences Interactives"
        icon: "res/icons/interactive.svg"
```

---

## Format 4 : YAML Blog

Utilisé pour : `data/blogs/`

### 4.1. Structure du fichier

```yaml
# data/blogs/entries/2024-10-21_thoughts_on_programming.yaml

title_en: "My thoughts on programming"
title_fr: "Mes pensées sur la programmation"

date: "2024-10-21"
author: "Nathan"

tags: ["tech", "thoughts", "programming"]

cover_image: "res/blog/covers/programming_thoughts.jpg"
# Optionnel : si absent, pas de cover image

summary_en: "A reflection on what programming means to me and how it shaped my thinking."
summary_fr: "Une réflexion sur ce que la programmation signifie pour moi et comment elle a façonné ma pensée."

# Chemins relatifs vers les fichiers markdown du contenu
markdown_content_en: "content/2024-10-21_thoughts_on_programming_en.md"
markdown_content_fr: "content/2024-10-21_thoughts_on_programming_fr.md"
```

### 4.2. Contenu markdown de l'article

```markdown
<!-- data/blogs/content/2024-10-21_thoughts_on_programming_en.md -->

Programming is not just about writing code. It's about solving problems,
expressing ideas, and creating something out of nothing.

## The Early Days

I started programming when I was around 14 years old...

## What I've Learned

...

## Where I'm Going

...
```

---

## Format 5 : JSON Citations

Utilisé pour : `data/citations/`

### 5.1. Manifest

```json
{
    "files": [
        "data_citation_1.json",
        "data_citation_2.json"
    ]
}
```

### 5.2. Fichier de citations

```json
[
    {
        "citation_en": "The only way to do great work is to love what you do.",
        "citation_fr": "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
        "author": "Steve Jobs",
        "date": "2005",
        "source": "Stanford Commencement Speech"
    },
    {
        "citation_en": "Talk is cheap. Show me the code.",
        "citation_fr": "Les paroles ne coûtent rien. Montrez-moi le code.",
        "author": "Linus Torvalds",
        "date": "2000",
        "source": "Linux Kernel Mailing List"
    }
]
```

---

## Résumé des parsers nécessaires

| Parser                   | Source                         | Format   | Utilisé par             |
|--------------------------|--------------------------------|----------|-------------------------|
| `MarkdownBilingualParser`| `data/about_me/`, `data/home/` | `.md`    | About Me, Quick History |
| `YamlDirectoryParser`    | `data/projects/`               | `.yaml`  | Projects page           |
| `YamlDirectoryParser`    | `data/media/entries/`          | `.yaml`  | Museum pages            |
| `YamlDirectoryParser`    | `data/blogs/entries/`          | `.yaml`  | Blog pages              |
| `JsonManifestParser`     | `data/citations/`              | `.json`  | Random citation         |
| `MarkdownContentParser`  | `data/blogs/content/`          | `.md`    | Blog articles           |
| `YamlManifestParser`     | `data/media/manifest.yaml`     | `.yaml`  | Museum categories       |
