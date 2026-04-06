# Design du système de style (CSS / Responsive / Thèmes)

## Architecture des fichiers CSS

```t
css/
├── base/
│   ├── reset.css              # Reset CSS (normalize)
│   ├── typography.css         # Polices, tailles, line-height
│   └── variables.css          # CSS custom properties (design tokens)
├── themes/
│   ├── theme-light.css        # Variables du thème clair
│   └── theme-dark.css         # Variables du thème sombre
├── layouts/
│   ├── main-container.css     # Layout principal
│   ├── single-column.css      # Layout colonne unique
│   ├── two-columns.css        # Layout deux colonnes (→ 1 col mobile)
│   └── fullscreen.css         # Layout plein écran
├── components/
│   ├── header.css             # En-tête (logo + titre)
│   ├── section.css            # Sections et sous-sections
│   ├── expandable-node.css    # Noeuds dépliables (small, medium, large)
│   ├── card.css               # Cards (projet, media, blog, catégorie)
│   ├── modal.css              # Modals OS-style
│   ├── filter-bar.css         # Barre de filtre/recherche
│   ├── tags.css               # Tags/badges
│   ├── links.css              # Liens (url, page, file)
│   ├── buttons.css            # Boutons d'action
│   ├── citation.css           # Bloc citation
│   ├── media-player.css       # Lecteur audio/vidéo
│   ├── image-carousel.css     # Carrousel d'images
│   ├── todo-list.css          # Liste de tâches
│   └── terminal.css           # Terminal easter egg
├── pages/
│   ├── index.css              # Spécificités de la page d'accueil
│   ├── museum.css             # Spécificités du musée
│   └── blog.css               # Spécificités du blog
├── utilities/
│   ├── animations.css         # Animations et transitions
│   ├── responsive.css         # Media queries centralisées
│   └── accessibility.css      # Styles d'accessibilité
└── main.css                   # Point d'entrée : @import de tout
```

---

## Design Tokens (CSS Custom Properties)

```css
/* css/base/variables.css */

:root {
    /* === Couleurs de base === */
    /* Palette principale : violet comme couleur dominante */
    --color-primary-50:  #f5f0ff;
    --color-primary-100: #ede5ff;
    --color-primary-200: #d4c4ff;
    --color-primary-300: #b899ff;
    --color-primary-400: #9b6dff;
    --color-primary-500: #7c3aed;   /* Violet principal */
    --color-primary-600: #6225c6;
    --color-primary-700: #4c1d9e;
    --color-primary-800: #371575;
    --color-primary-900: #220e4d;

    /* Gris neutres */
    --color-neutral-50:  #fafafa;
    --color-neutral-100: #f4f4f5;
    --color-neutral-200: #e4e4e7;
    --color-neutral-300: #d4d4d8;
    --color-neutral-400: #a1a1aa;
    --color-neutral-500: #71717a;
    --color-neutral-600: #52525b;
    --color-neutral-700: #3f3f46;
    --color-neutral-800: #27272a;
    --color-neutral-900: #18181b;

    /* Couleurs sémantiques */
    --color-success: #22c55e;
    --color-warning: #f59e0b;
    --color-error:   #ef4444;
    --color-info:    #3b82f6;

    /* === Typographie === */
    --font-family-main: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    --font-family-display: 'Outfit', 'Inter', sans-serif;

    --font-size-xs:   0.75rem;   /* 12px */
    --font-size-sm:   0.875rem;  /* 14px */
    --font-size-base: 1rem;      /* 16px */
    --font-size-lg:   1.125rem;  /* 18px */
    --font-size-xl:   1.25rem;   /* 20px */
    --font-size-2xl:  1.5rem;    /* 24px */
    --font-size-3xl:  1.875rem;  /* 30px */
    --font-size-4xl:  2.25rem;   /* 36px */

    --font-weight-normal:   400;
    --font-weight-medium:   500;
    --font-weight-semibold: 600;
    --font-weight-bold:     700;

    --line-height-tight:  1.25;
    --line-height-normal: 1.5;
    --line-height-loose:  1.75;

    /* === Espacements === */
    --space-1:  0.25rem;  /* 4px */
    --space-2:  0.5rem;   /* 8px */
    --space-3:  0.75rem;  /* 12px */
    --space-4:  1rem;     /* 16px */
    --space-5:  1.25rem;  /* 20px */
    --space-6:  1.5rem;   /* 24px */
    --space-8:  2rem;     /* 32px */
    --space-10: 2.5rem;   /* 40px */
    --space-12: 3rem;     /* 48px */
    --space-16: 4rem;     /* 64px */

    /* === Bordures === */
    --border-radius-sm:   4px;
    --border-radius-md:   8px;
    --border-radius-lg:   12px;
    --border-radius-xl:   16px;
    --border-radius-full: 9999px;

    --border-width-thin:   1px;
    --border-width-normal: 2px;

    /* === Ombres === */
    --shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    --shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    --shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

    /* === Transitions === */
    --transition-fast:   150ms ease;
    --transition-normal: 250ms ease;
    --transition-slow:   350ms ease;

    /* === Z-index === */
    --z-dropdown: 100;
    --z-sticky:   200;
    --z-modal:    300;
    --z-popover:  400;
    --z-terminal: 500;

    /* === Breakpoints (pour référence, utilisés dans media queries) === */
    /* --breakpoint-sm:  640px;  */
    /* --breakpoint-md:  768px;  */
    /* --breakpoint-lg:  1024px; */
    /* --breakpoint-xl:  1280px; */
}
```

---

## Système de thèmes

Les thèmes fonctionnent en **surchargeant les CSS custom properties** sur le `<body>`.

```css
/* css/themes/theme-light.css */

body[data-theme="light"] {
    /* Fond et texte */
    --theme-bg-primary:    var(--color-neutral-50);
    --theme-bg-secondary:  #ffffff;
    --theme-bg-surface:    #ffffff;
    --theme-bg-elevated:   #ffffff;

    --theme-text-primary:   var(--color-neutral-900);
    --theme-text-secondary: var(--color-neutral-600);
    --theme-text-muted:     var(--color-neutral-400);

    /* Bordures */
    --theme-border-color:  var(--color-neutral-200);
    --theme-border-hover:  var(--color-neutral-300);

    /* Accents */
    --theme-accent:        var(--color-primary-500);
    --theme-accent-hover:  var(--color-primary-600);
    --theme-accent-text:   #ffffff;

    /* Cards */
    --theme-card-bg:       #ffffff;
    --theme-card-shadow:   var(--shadow-md);
    --theme-card-hover-shadow: var(--shadow-lg);

    /* Inputs */
    --theme-input-bg:      #ffffff;
    --theme-input-border:  var(--color-neutral-300);
    --theme-input-focus:   var(--color-primary-500);
}
```

```css
/* css/themes/theme-dark.css */

body[data-theme="dark"] {
    --theme-bg-primary:    var(--color-neutral-900);
    --theme-bg-secondary:  var(--color-neutral-800);
    --theme-bg-surface:    var(--color-neutral-800);
    --theme-bg-elevated:   var(--color-neutral-700);

    --theme-text-primary:   var(--color-neutral-50);
    --theme-text-secondary: var(--color-neutral-300);
    --theme-text-muted:     var(--color-neutral-500);

    --theme-border-color:  var(--color-neutral-700);
    --theme-border-hover:  var(--color-neutral-600);

    --theme-accent:        var(--color-primary-400);
    --theme-accent-hover:  var(--color-primary-300);
    --theme-accent-text:   var(--color-neutral-900);

    --theme-card-bg:       var(--color-neutral-800);
    --theme-card-shadow:   0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --theme-card-hover-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);

    --theme-input-bg:      var(--color-neutral-800);
    --theme-input-border:  var(--color-neutral-600);
    --theme-input-focus:   var(--color-primary-400);
}
```

### Pseudo-code : Comment ajouter un nouveau thème

```python
# Pour ajouter un thème "ocean" par exemple :

# 1. Créer css/themes/theme-ocean.css
# 2. Y définir toutes les variables --theme-*
# 3. Utiliser le sélecteur body[data-theme="ocean"] { ... }
# 4. Le thème sera automatiquement disponible via le toggle JS

# Le compilateur PyXML inclura automatiquement tous les fichiers
# de css/themes/ dans le build.
```

---

## Mapping PyXML → CSS

Chaque balise PyXML est compilée en HTML avec des **classes CSS** correspondantes.

```python
# Mapping des balises PyXML vers les éléments HTML + classes CSS

PYXML_TO_HTML = {
    # --- Layouts ---
    "main_container":                     ("div",     "main-container"),
    "single_column":                      ("div",     "layout-single-column"),
    "2_columns_container_1_on_mobile":    ("div",     "layout-two-columns"),
    "left_column":                        ("div",     "layout-col layout-col-left"),
    "right_column":                       ("div",     "layout-col layout-col-right"),
    "fullscreen_column":                  ("div",     "layout-fullscreen"),

    # --- Structure ---
    "section":                            ("section", "section"),
    "subsection":                         ("div",     "subsection"),
    "row":                                ("div",     "row"),
    "column":                             ("div",     "column"),
    "center":                             ("div",     "center"),
    "row_head":                           ("header",  "row-head"),

    # --- Typographie ---
    "title_text":                         ("h1",      "title-text"),
    "title":                              ("h2",      "section-title"),
    "text":                               ("p",       "text"),
    "code":                               ("code",    "inline-code"),

    # --- Composants ---
    "logo":                               ("img",     "site-logo"),
    "link_url":                           ("a",       "link link-external"),
    "link_page":                          ("a",       "link link-page"),
    "link_file":                          ("a",       "link link-file"),
    "button_action":                      ("button",  "btn btn-action"),
    "button_close":                       ("button",  "btn btn-close"),

    # --- Cards ---
    "project_card":                       ("article", "card card-project"),
    "media_card":                         ("article", "card card-media"),
    "category_card":                      ("a",       "card card-category"),
    "blog_post_row_cardline":             ("article", "card card-blog-row"),

    # --- Card internals ---
    "card_header":                        ("div",     "card-header"),
    "card_body":                          ("div",     "card-body"),
    "card_actions":                       ("div",     "card-actions"),
    "card_thumbnail":                     ("div",     "card-thumbnail"),
    "card_plaque":                        ("div",     "card-plaque"),

    # --- Expandables ---
    "small_expandable_node":              ("details", "expandable expandable-sm"),
    "medium_expandable_node":             ("details", "expandable expandable-md"),
    "large_expandable_node":              ("details", "expandable expandable-lg"),
    "name":                               ("summary", "expandable-title"),
    "content":                            ("div",     "expandable-content"),

    # --- Containers spéciaux ---
    "filter_bar":                         ("div",     "filter-bar"),
    "search_input":                       ("input",   "search-input"),
    "filter_group":                       ("div",     "filter-group"),
    "filter_button":                      ("button",  "filter-btn"),
    "projects_grid":                      ("div",     "grid grid-projects"),
    "categories_grid":                    ("div",     "grid grid-categories"),
    "museum_gallery":                     ("div",     "grid grid-museum"),
    "modals_container":                   ("div",     "modals-container"),
    "blog_pages_container":               ("div",     "blog-pages"),
    "tags_list":                          ("div",     "tags-list"),
    "tag":                                ("span",    "tag"),

    # --- Citation ---
    "citation":                           ("blockquote", "citation"),
    "author":                             ("span",       "citation-author"),
    "date":                               ("span",       "citation-date"),
    "source":                             ("cite",       "citation-source"),

    # --- Media ---
    "media_header":                       ("header",  "media-header"),
    "media_content":                      ("div",     "media-content"),
    "media_description":                  ("div",     "media-description"),
    "audio_player":                       ("div",     "audio-player"),
    "image_full":                         ("figure",  "image-full"),
    "model_viewer":                       ("div",     "model-viewer"),
    "interactive_canvas":                 ("div",     "interactive-canvas"),
    "image_carousel":                     ("div",     "image-carousel"),
    "text_scrollable":                    ("div",     "text-scrollable"),

    # --- Modal ---
    "project_modal":                      ("dialog",  "modal modal-project"),
    "modal_header":                       ("div",     "modal-header"),
    "modal_body":                         ("div",     "modal-body"),

    # --- Blog ---
    "article_header":                     ("header",  "article-header"),
    "article_cover":                      ("img",     "article-cover"),
    "article_metadata":                   ("div",     "article-metadata"),
    "article_body":                       ("div",     "article-body"),
    "article_footer":                     ("footer",  "article-footer"),
    "markdown_render":                    ("div",     "markdown-render"),

    # --- Misc ---
    "todo_list":                          ("ul",      "todo-list"),
    "todo_item":                          ("li",      "todo-item"),
    "icon":                               ("img",     "icon"),
    "status":                             ("span",    "badge badge-status"),
    "count":                              ("span",    "count"),
    "plaque_title":                       ("h3",      "plaque-title"),
    "plaque_date":                        ("time",    "plaque-date"),
    "date_text":                          ("time",    "date-text"),
}
```

---

## Exemples de composants CSS

### Card de projet

```css
/* css/components/card.css */

.card {
    background: var(--theme-card-bg);
    border: var(--border-width-thin) solid var(--theme-border-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--theme-card-shadow);
    overflow: hidden;
    transition: transform var(--transition-normal),
                box-shadow var(--transition-normal);
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: var(--theme-card-hover-shadow);
}

.card-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    border-bottom: var(--border-width-thin) solid var(--theme-border-color);
}

.card-body {
    padding: var(--space-4);
}

.card-actions {
    display: flex;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    border-top: var(--border-width-thin) solid var(--theme-border-color);
    background: var(--theme-bg-elevated);
}
```

### Noeud dépliable

```css
/* css/components/expandable-node.css */

.expandable {
    border: var(--border-width-thin) solid var(--theme-border-color);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--space-2);
    overflow: hidden;
}

.expandable-title {
    cursor: pointer;
    padding: var(--space-3) var(--space-4);
    font-weight: var(--font-weight-medium);
    background: var(--theme-bg-elevated);
    transition: background var(--transition-fast);
    list-style: none; /* enlever le triangle par défaut */
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.expandable-title::before {
    content: "▸";
    transition: transform var(--transition-fast);
}

.expandable[open] > .expandable-title::before {
    transform: rotate(90deg);
}

.expandable-title:hover {
    background: var(--theme-bg-secondary);
}

.expandable-content {
    padding: var(--space-4);
    animation: expand-in var(--transition-normal);
}

/* Tailles */
.expandable-sm .expandable-title { font-size: var(--font-size-sm); }
.expandable-md .expandable-title { font-size: var(--font-size-base); }
.expandable-lg .expandable-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
}

@keyframes expand-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
}
```

---

## Responsive Design

### Stratégie : Mobile-first

On écrit les styles de base pour mobile, puis on ajoute des styles pour les écrans plus larges avec `@media (min-width: ...)`.

```css
/* css/utilities/responsive.css */

/* === Mobile (par défaut) === */

.layout-two-columns {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
}

.layout-col {
    width: 100%;
}

.grid {
    display: grid;
    gap: var(--space-4);
}

.grid-projects,
.grid-categories,
.grid-museum {
    grid-template-columns: 1fr;
}

/* === Tablette (≥ 768px) === */

@media (min-width: 768px) {

    .grid-projects,
    .grid-categories {
        grid-template-columns: repeat(2, 1fr);
    }

    .grid-museum {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* === Desktop (≥ 1024px) === */

@media (min-width: 1024px) {

    .layout-two-columns {
        flex-direction: row;
    }

    .layout-col-left {
        flex: 2;
    }

    .layout-col-right {
        flex: 1;
    }

    .grid-projects {
        grid-template-columns: repeat(3, 1fr);
    }

    .grid-categories {
        grid-template-columns: repeat(3, 1fr);
    }

    .grid-museum {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* === Large Desktop (≥ 1280px) === */

@media (min-width: 1280px) {

    .main-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .grid-projects {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

### Pseudo-code : Comment le compilateur gère le responsive

```python
# Le compilateur n'a PAS besoin de gérer le responsive directement.
# Le responsive est 100% géré par CSS.
#
# La balise <2_columns_container_1_on_mobile> est compilée en :
#   <div class="layout-two-columns">
#
# Et c'est le CSS responsive qui gère le passage de
# flex-direction: column (mobile) à flex-direction: row (desktop).
#
# Aucune logique responsive dans le PyXML ou le compilateur.
```

---

## Animations et micro-interactions

```css
/* css/utilities/animations.css */

/* Apparition des éléments au scroll (utilisé avec IntersectionObserver en JS) */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Hover sur les liens */
.link {
    color: var(--theme-accent);
    text-decoration: none;
    transition: color var(--transition-fast);
    position: relative;
}

.link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--theme-accent);
    transition: width var(--transition-normal);
}

.link:hover::after {
    width: 100%;
}

/* Pulse sur le badge de status */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.7; }
}

.badge-status[data-status="in-progress"] {
    animation: pulse 2s infinite;
}
```

---

## Comment le style est intégré au pipeline

```python
# Le compilateur PyXML gère le style de la manière suivante :
#
# 1. Il NE génère PAS de CSS.
#    Les fichiers CSS sont écrits manuellement et versionnés.
#
# 2. Il utilise le mapping PYXML_TO_HTML pour ajouter les bonnes classes.
#
# 3. Le fichier main.css (point d'entrée) est référencé dans le HTML_SKELETON.
#
# 4. Pour le build de production, un script optionnel peut :
#    - Concaténer tous les CSS en un seul fichier
#    - Minifier le CSS
#    - Ajouter les préfixes CSS (autoprefixer)
#
# Structure finale dans le site généré :
#
#   build/
#   ├── css/
#   │   ├── main.css           (concaténé et minifié)
#   │   └── themes/
#   │       ├── theme-light.css
#   │       └── theme-dark.css
#   ├── index.html
#   └── pages/
#       └── ...
```
