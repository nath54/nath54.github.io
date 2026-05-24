# Building My Own PyXML Compiler

## Header
title_en: "Building My Own PyXML Compiler"
title_fr: "Construire Mon Propre Compilateur PyXML"
date: "2026-03-27"
author: "Nathan Cerisara"
image: "res/logo.svg"
tags: ["Python", "Static Site Generator", "Compilers"]
summary_en: "A deep dive into why and how I built a custom XML-based static site generator for my portfolio."
summary_fr: "Une exploration profonde sur pourquoi et comment j'ai construit un générateur de site statique personnalisé basé sur XML."
category: "Tech"

## Content EN
### Why PyXML?
Standard SSGs like Jekyll or Hugo use Markdown + YAML Frontmatter. While powerful, they often feel disconnected from the HTML structure. PyXML allows me to define **custom semantic tags** that map directly to high-level UI components.

### Implementation Details
- **Parser**: Uses Python's `xml.etree.ElementTree` with custom extensions for execution blocks (`exec_*`).
- **Context**: A robust state manager for variable resolution and pathing.
- **Glassmorphism**: Native support for CSS backdrop filters.

### Future Improvements
- **Live Preview**: Integrated dev server with hot reload.
- **Wasm Version**: Running the compiler in the browser.

The journey of building a custom XML parser began out of frustration with rigid static site generators.

Jekyll, Hugo, and others are fantastic tools, but they often abstract the DOM in ways that make creating highly custom UI components difficult and verbose.

By leveraging Python's built-in element tree, the compiler directly manipulates the DOM structure, translating custom XML tags into raw, performant HTML.

Working with Python's deep standard library revealed how much power is hidden behind standard patterns, especially when handling text encodings and recursive traversal.

## Content FR
### Pourquoi PyXML ?
Les générateurs de sites statiques standards comme Jekyll ou Hugo utilisent Markdown + YAML Frontmatter. Bien que puissants, ils donnent souvent l'impression d'être déconnectés de la structure HTML. PyXML me permet de définir des **balises sémantiques personnalisées** qui correspondent directement à des composants d'interface utilisateur de haut niveau.

### Détails d'implémentation
- **Parser**: Utilise `xml.etree.ElementTree` de Python avec des extensions personnalisées pour les blocs d'exécution (`exec_*`).
- **Contexte**: Un gestionnaire d'état robuste pour la résolution des variables et la gestion des chemins.
- **Glassmorphism**: Support natif pour les filtres d'arrière-plan CSS.

### Améliorations futures
- **Aperçu en direct**: Serveur de développement intégré avec rechargement à chaud.
- **Version Wasm**: Exécution du compilateur dans le navigateur.

Le parcours de création d'un analyseur XML personnalisé a commencé par une frustration face aux générateurs de sites statiques rigides.

Jekyll, Hugo et les autres sont des outils fantastiques, mais ils abstraient souvent le DOM d'une manière qui rend la création de composants d'interface utilisateur hautement personnalisés difficile et complexe.

En tirant parti de l'arborescence des éléments intégrés de Python, le compilateur manipule directement la structure du DOM, traduisant les balises XML personnalisées en HTML brut et performant.

Travailler avec la bibliothèque standard approfondie de Python a révélé la puissance cachée derrière les modèles standards, en particulier lors du traitement des encodages de texte et de la traversée récursive.
