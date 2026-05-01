# The PyXML Chronicles: The Origin

## Header
title_en: "The PyXML Chronicles: The Origin"
title_fr: "Les Chroniques PyXML : L'Origine"
date: "2026-01-10"
author: "Nathan Cerisara"
tags: ["Tech"]
category: "Tech"
summary_en: "Why standard SSGs weren't enough."
summary_fr: "Pourquoi les SSG standards ne suffisaient pas."
series: "pyxml_chronicles"
series_order: 1

## Content EN
I wanted more control over the DOM generation...

The journey of building a custom XML parser began out of frustration with rigid static site generators.

Jekyll, Hugo, and others are fantastic tools, but they often abstract the DOM in ways that make creating highly custom UI components difficult and verbose.

By leveraging Python's built-in element tree, the compiler directly manipulates the DOM structure, translating custom XML tags into raw, performant HTML.

Working with Python's deep standard library revealed how much power is hidden behind standard patterns, especially when handling text encodings and recursive traversal.

## Content FR
Je voulais plus de contrôle sur la génération du DOM...

Le parcours de création d'un analyseur XML personnalisé a commencé par une frustration face aux générateurs de sites statiques rigides.

Jekyll, Hugo et les autres sont des outils fantastiques, mais ils abstraient souvent le DOM d'une manière qui rend la création de composants d'interface utilisateur hautement personnalisés difficile et complexe.

En tirant parti de l'arborescence des éléments intégrés de Python, le compilateur manipule directement la structure du DOM, traduisant les balises XML personnalisées en HTML brut et performant.

Travailler avec la bibliothèque standard approfondie de Python a révélé la puissance cachée derrière les modèles standards, en particulier lors du traitement des encodages de texte et de la traversée récursive.
