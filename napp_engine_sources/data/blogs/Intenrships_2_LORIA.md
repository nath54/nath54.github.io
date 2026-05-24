# My Internships - 2nd engineering school internship

## Header

title_en: "Parameter-Efficient Fine-Tuning of Large Language Models via Ladder Side Tuning"
title_fr: "Parameter-Efficient Fine-Tuning de LLMs via Ladder Side Tuning"
date: "2025-06-05"
author: "Nathan Cerisara"
tags: ["Internship", "Deep-Learning", "LLM", "PEFT", "PyTorch"]
category: "Experience"
summary_en: "A comparative research study on Ladder Side Tuning (LST) and QLoRA for backpropagation-free LLM adaptation at LORIA."
summary_fr: "Étude comparative du Ladder Side Tuning (LST) et de QLoRA pour l'adaptation sans rétropropagation de LLMs au LORIA."
series: "my_internships"
series_order: 2

## Content EN

### 1. The PEFT Computational Bottleneck

Fine-tuning Large Language Models (LLMs) represents a massive computational challenge due to active parameters scale. While Parameter-Efficient Fine-Tuning (PEFT) methods like QLoRA reduce the number of trainable weights, they still require a full backward pass through the massive base model (the frozen backbone) to compute gradients. This architectural constraint introduces significant memory overhead during training.

This research project, conducted at LORIA (Nancy, France), investigates **Ladder Side Tuning (LST)** as a memory-efficient alternative that eliminates gradient computation through the primary network.

### 2. Ladder Side Tuning Methodology

LST completely freezes the backbone model (such as Qwen2.5, Llama-3.2, or OPT) during both forward and backward passes. Instead, parameter adaptation is isolated within an independent, low-dimensional side network (the "ladder"):

* **Projections**: The intermediate hidden states of the frozen backbone's residual streams are projected into the side ladder using linear projection layers (`LinearProjection`).
* **Information Fusion**: Customized gating modules (`GateSum` or parameterized interpolators like `GateLSTInterpolatedWithFloatAlpha`) combine the representation streams.
* **Optimization Benefits**: Gradients are strictly calculated for the ladder parameters. This design avoids storing optimizer states for the massive backbone, resulting in significant GPU memory savings.

### 3. Modular Architecture and Initialization Strategies

We developed a highly modular PyTorch framework (`lib_ladder.py`) supporting diverse backbone families (OPT, Llama, Qwen). The platform supports systematically controlled experiments with multiple parameters:

* **Initialization Frameworks**: Comparative analysis of weight initializations (orthogonal, Xavier, He, warm-start, and backbone-pruning).
* **Layer Configurations**: Varying layer count, layer spacing, hidden dimensions, and direct extensions to optimize the trade-off between parameters count and performance.

### 4. Experimental Evaluations and Results

The framework was evaluated across multiple dimensions:

* **Natural Language Understanding (NLU)**: Measuring Matthews Correlation Coefficient (MCC) on GLUE tasks (CoLA and MRPC) over systematically controlled seed iterations.
* **Mathematical Reasoning**: Quantitative evaluations on mathematics datasets (GSM8K, MATH500, AIME24) using local inference servers.
* **IsoFLOP and Memory Analysis**: Mapping scaling laws as a function of compute.

Our results confirmed that a highly optimized, compact ladder side network achieves competitive downstream task performance compared to QLoRA while significantly reducing active memory usage and training latency.

---

## Content FR

### 1. Le Goulot d'Étranglement Computationnel du PEFT

L'adaptation fine (fine-tuning) des grands modèles de langage (LLMs) pose des contraintes mémoires majeures dues à l'échelle des paramètres. Bien que les méthodes de Parameter-Efficient Fine-Tuning (PEFT) comme QLoRA restreignent le nombre de poids entraînables, elles requièrent toujours une rétropropagation complète à travers le modèle de base (le "backbone" gelé). Cet impératif architectural engendre une consommation de mémoire de calcul importante lors de la phase d'entraînement.

Ce projet de recherche, mené au LORIA (Nancy, France), étudie le **Ladder Side Tuning (LST)** comme alternative économe en ressources, éliminant tout calcul de gradient dans le réseau principal.

### 2. Méthodologie du Ladder Side Tuning

La méthode LST maintient le modèle principal entièrement gelé, aussi bien lors de la passe avant que de la passe arrière. L'adaptation comportementale est isolée au sein d'un sous-réseau auxiliaire indépendant de faible dimension (le "ladder" ou l'échelle) :

* **Projections Spatiales** : Les états cachés intermédiaires du flux résiduel du backbone sont projetés dans le ladder via des couches linéaires d'adaptation (`LinearProjection`).
* **Fusion d'Information** : Des modules de portes de transfert (`GateSum` ou portes d'interpolation dynamique `GateLSTInterpolatedWithFloatAlpha`) combinent les flux de représentations.
* **Bénéfices d'Optimisation** : Les gradients sont calculés exclusivement sur les paramètres du ladder. Cette architecture évite le stockage des états d'optimisation pour le modèle de base, réduisant drastiquement l'empreinte mémoire sur GPU.

### 3. Architecture Modulaire et Stratégies d'Initialisation

Nous avons conçu un framework PyTorch hautement modulaire (`lib_ladder.py`) compatible avec plusieurs familles de LLMs (OPT, Llama, Qwen). La plateforme permet un contrôle rigoureux des hyperparamètres expérimentaux :

* **Initialisation des Poids** : Analyse comparative des méthodes d'initialisation (He, Xavier, orthogonale, warm-start et élagage de couches ou backbone-pruning).
* **Configurations Structurelles** : Modulation du nombre de couches, de leur espacement (spacing), de la dimension cachée du ladder et des extensions directes.

### 4. Campagnes Expérimentales et Résultats

L'architecture a fait l'objet de plusieurs évaluations quantitatives :

* **Compréhension du Langage Naturel (NLU)** : Mesure du coefficient de corrélation de Matthews (MCC) sur les tâches GLUE (CoLA et MRPC).
* **Raisonnement Mathématique** : Mesure de la précision sur GSM8K, MATH500 et AIME24 via des serveurs d'inférence locaux.
* **Analyses IsoFLOP et de l'Empreinte Mémoire** : Cartographie des lois d'échelle en fonction du budget de calcul.

Les données expérimentales indiquent qu'un réseau auxiliaire optimisé et compact atteint des scores compétitifs face à QLoRA tout en réduisant significativement la latence d'entraînement et l'allocation mémoire active.
