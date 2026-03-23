# Tout ce qui reste à designer / construire

## Vue d'ensemble

Ce qui est fait ✅ :

- Design des pages en pseudo-code XML (`pages_design.md`)
  - Index / Home page
  - Contact me
  - About me
  - Projects (cards, modals, filter bar)
  - Museum (root, categories, entries par modalité)
  - Blog (root, cards, articles)
- Formats de données définis (YAML pour projets, media, blog ; JSON pour citations ; MD pour about_me, quick_history)
- Système de traduction basique (`localization.js`)
- Structure de données initiale (`data/`)

---

## Ce qui reste à faire

### 1. Langage PyXML & Compilateur Python

> Voir détails dans `pyxml_compiler_design.md`

- [ ] Designer le langage PyXML (blocs de construction + blocs d'exécution)
- [ ] Designer les parsers par type de données (markdown, yaml, json)
- [ ] Implémenter le compilateur Python : `PyXML + Data → HTML`
- [ ] Implémenter le système de templates réutilisables
- [ ] Gérer la compilation conditionnelle JS/no-JS (SPA pages vs static pages)

### 2. Système de Style (CSS / Responsive / Thèmes)

> Voir détails dans `style_design.md`

- [ ] Designer le design system (tokens : couleurs, typographie, espacements, ombres, ...)
- [ ] Designer le mapping `balise PyXML → classes CSS`
- [ ] Implémenter les styles CSS pour chaque composant PyXML
- [ ] Responsive design (mobile, tablette, desktop)
- [ ] Système de thèmes (light, dark + extensible)
- [ ] Animations et micro-interactions

### 3. Fonctionnalités JavaScript

> Voir détails dans `js_features_design.md`

- [ ] SPA (Single Page Application) avec `fetch` + navigation interne
- [ ] Gestion du bouton "Back" du navigateur (History API)
- [ ] Filtre / recherche live (projects, museum, blog)
- [ ] Système de modals OS-style
- [ ] Switching de thème (auto détection + toggle manuel)
- [ ] Système de traduction amélioré (détection langue système)
- [ ] Citations aléatoires (chargement JSON + affichage)
- [ ] Terminal easter egg
- [ ] (Futur) Mode OS fullscreen avec websocket local

### 4. Formats de données & Parsers

> Voir détails dans `data_formats_design.md`

- [ ] Finaliser le format markdown bilingue (`## Title EN` / `## Title FR`)
- [ ] Finaliser le format YAML pour projets, media, blog
- [ ] Designer le format manifest/index pour chaque type de données
- [ ] Parser markdown → HTML (avec support bilingue)
- [ ] Parser YAML → données structurées
- [ ] Parser JSON → données structurées (citations)

### 5. Pipeline de Build

> Voir détails dans `build_pipeline_design.md`

- [ ] Designer l'architecture du pipeline : `[Données] + [Template PyXML] + [Style CSS] → [Site HTML]`
- [ ] Script principal `build.py`
- [ ] Watcher pour dev local (rebuild auto sur changement)
- [ ] Hook GitHub pour build au commit
- [ ] Gestion des assets statiques (images, fonts, icônes)

### 6. Contenu à créer

- [ ] Remplir `data/projects/` avec les fichiers YAML des projets
- [ ] Remplir `data/citations/` avec des citations
- [ ] Remplir `data/media/` avec les entrées du musée
- [ ] Créer du contenu blog initial dans `data/blogs/`
- [ ] Préparer les assets (icônes, images, CV PDF)

### 7. Pages spéciales & extras

- [ ] Page 404 custom
- [ ] Pages "showcase" pour expériences interactives
- [ ] SEO basique (meta tags, og:tags, sitemap)
- [ ] Favicon et manifest.json (PWA basique)
