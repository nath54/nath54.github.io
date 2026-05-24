# My Internships - 1rst engineering school internship

## Header

title_en: "Semantic Search and Conversational Segmentation on Enterprise Collaboration Channels"
title_fr: "Recherche Sémantique et Segmentation de Flux Conversationnels d'Entreprise"
date: "2024-06-05"
author: "Nathan Cerisara"
tags: ["Internship", "Semantic-Search", "NLP", "Rainbow", "Python"]
category: "Experience"
summary_en: "Designing a quantitative pipeline for conversational segmentation and semantic vector search on enterprise collaboration platforms."
summary_fr: "Conception d'un pipeline quantitatif de segmentation conversationnelle et de recherche vectorielle sémantique pour plateformes de collaboration d'entreprise."
series: "my_internships"
series_order: 1

## Content EN

### 1. Introduction and Contextual Challenges

Within enterprise collaboration channels (such as Alcatel-Lucent Enterprise's Rainbow platform), unstructured text streams exhibit high informational entropy. Standard keyword-based information retrieval systems prove sub-optimal due to the continuous and multi-topic nature of collaborative chat logs. 

This research project focuses on designing an end-to-end pipeline capable of structured partition and semantic indexing of raw conversation streams.

### 2. Algorithmic Conversational Segmentation

To establish a structured unit of information, we formulated a conversational segmentation engine. The objective is to partition a continuous chronological stream of messages into discrete, topically coherent sessions:

* **Feature Extraction**: Computing local semantic drift across sliding temporal windows.
* **Decision Boundary**: The system utilizes temporal gap thresholds combined with vector cosine distance variations to identify topic transitions and execute clean transactional boundaries (Rainbow Instances).

### 3. Semantic Search Architecture and NER Integration

The search layer leverages a dual-stage neural information retrieval design:

* **Vector Representation**: Raw text segments are projected into a dense semantic space using specialized sentence embeddings (`all-MiniLM-L6-v2`).
* **Entity Extraction (NER)**: Downstream Named Entity Recognition (NER) models isolate key informational pivots (e.g., personnel, departments, specific technologies) to enforce deterministic metadata constraints over the vector search space.
* **Optimization and Translation**: To minimize latency and computational cost, the architecture implements a local embedding and translation cache, isolating the system from external API round-trip overhead.

### 4. Benchmarking and Quantitative Verification

The pipeline's retrieval accuracy and latency were evaluated using a custom benchmarking framework. We compared multiple configurations of embeddings and NER models under controlled hardware resources. 

Additionally, a local interactive web application (`demo.html` and `benchmarks.html`) was developed to serve as a diagnostic interface, allowing real-time visualization of segmentation thresholds and semantic distance scores.

---

## Content FR

### 1. Introduction et Problématique Industrielle

Dans les canaux de discussion des plateformes collaboratives d'entreprise (telles que Rainbow d'Alcatel-Lucent Enterprise), la distribution de l'information présente une forte entropie. La recherche textuelle classique par mots-clés s'avère sous-optimale en raison de la nature continue et multi-thématique des flux de messages. 

Ce projet de recherche s'est concentré sur la conception d'un pipeline complet capable de structurer et d'indexer sémantiquement ces flux bruts.

### 2. Segmentation Conversationnelle Algorithmique

Afin de restituer des unités d'information cohérentes, nous avons formulé un moteur de segmentation conversationnelle. L'objectif est de partitionner un flux de messages chronologiques en sessions thématiques distinctes :

* **Extraction d'Indicateurs** : Calcul de la dérive sémantique locale sur des fenêtres temporelles glissantes.
* **Frontières de Décision** : Le système combine des seuils d'inactivité temporelle avec des variations de distance cosinus vectorielle pour identifier les points de transition thématique et générer des sessions isolées cohérentes (Instances Rainbow).

### 3. Architecture de Recherche Sémantique et Intégration NER

Le sous-système de recherche repose sur une approche vectorielle à deux niveaux :

* **Représentations Vectorielles (Embeddings)** : Les segments textuels sont projetés dans un espace sémantique dense à l'aide du modèle pré-entraîné `all-MiniLM-L6-v2`.
* **Extraction d'Entités (NER)** : L'intégration en cascade de modèles de reconnaissance d'entités nommées (NER) permet d'isoler les entités pivots (collaborateurs, services, technologies) afin d'appliquer des contraintes de filtrage déterministes sur l'espace vectoriel.
* **Optimisation Computationnelle** : Un module de cache local pour les plongements et les requêtes traduites minimise les requêtes réseau redondantes et garantit des temps de réponse inférieurs à la dizaine de millisecondes.

### 4. Benchmarking et Vérification Quantitative

Les performances temporelles et la précision de recherche ont été évaluées via une suite de tests automatisés. Nous avons comparé l'efficacité de plusieurs combinaisons d'embeddings et de modèles NER sous contraintes matérielles strictes. 

Une application web statique interactive (`demo.html` et `benchmarks.html`) a été développée comme interface de diagnostic, permettant la visualisation des seuils de découpe et le monitoring des performances d'indexation.
