# My Internships - 3rd engineering school internship

## Header

title_en: "Multimodal Control Interfaces for Robotic Swarms: Integrating Visual Gestures, Speech, and LLM Orchestration"
title_fr: "Systèmes d'Interaction Humain-Essaim Multimodaux : Intégration de Gestes 3D, Parole et LLMs"
date: "2026-06-05"
author: "Nathan Cerisara"
tags: ["Internship", "Robotics", "HRI", "LLM", "Computer-Vision"]
category: "Experience"
summary_en: "Designing a natural human-swarm interface utilizing monocular gesture tracking, low-latency speech, and LLM code watchdogs at IRIDIA."
summary_fr: "Conception d'une interface humain-essaim naturelle exploitant la vision 3D par webcam, la voix et des boucles de contrôle LLM sécurisées à l'IRIDIA."
series: "my_internships"
series_order: 3

## Content EN

### 1. Abstract and Architectural Objectives

Operating decentralized robot swarms (composed of heterogeneous agents such as pi-pucks and drones) in dynamic environments typically imposes severe cognitive load on a human operator. 

This research project, carried out at **IRIDIA** (the AI research laboratory at Université Libre de Bruxelles), focuses on the design and implementation of a multimodal Human-Robot Interaction (HRI) system. The system allows an untrained operator to control a swarm collectively in real time using monocular visual gestures, natural language commands, and Large Language Model (LLM) orchestration, interfaced directly with the **ARGoS** physics simulation engine.

### 2. Multi-Threaded Orchestration Engine

To ensure high-throughput communication and prevent timing collisions across perception and simulation layers, we designed a Python server running an asynchronous 7-thread architecture:

* `thread_camera.py`: Monocular image acquisition and skeletal joint extraction.
* `thread_microphone.py` & `thread_speaker.py`: Raw audio capture and TTS synthesis.
* `thread_socket_argos.py`: High-frequency TCP server linking telemetry and kinematic commands.
* `thread_llm.py`: Managing API inference calls for dialogue and LUA code generation.
* `thread_gui.py`: Interactive DearPyGui control dashboard.
* **Synchronization**: Inter-thread communication is secured via thread-safe double-ended queues (`SafeBuffer`) protected by reentrant locks (`threading.Lock`) managed by a unified `GlobalSystem` state controller.

### 3. Perception Pipelines and Gesture Classification

The sensory extraction layer relies on lightweight, low-latency algorithms optimized for edge execution:

* **Visual Tracking**: Using a monocular camera, the system extracts 21 hand landmarks and 33 body pose coordinates via **MediaPipe Pose & Hands**. Coordinate displacements are normalized dynamically by Torso-to-Hip ratios, making tracking invariant to the operator's distance from the camera.
* **Gesture Classifiers**: 
  * *Event-based (Discrete) Modality*: Detects single-shot commands (e.g., closing index-pinky tips to wrist to fire a `FistEvent`, palm orientation detection via cross-product determinants).
  * *Streaming-based (Continuous) Modality*: Translates coordinate translations over standard coordinate planes into analog velocity streams, acting as a virtual joystick.
* **Speech Processing**: Audio is captured at 16kHz via PortAudio. Voice Activity Detection (VAD) is resolved locally through RMS energy thresholding. Transcription is processed in near-instantaneous streaming fashion (<200ms) using **Moonshine STT**, while audio feedback is generated via a local **Piper TTS** instance loading a GLaDOS voice model.

### 4. Swarm Kinematics and LUA State Machines

The simulated robots execute on-board hierarchical state machines in LUA:

* **State Machines**: Nodes implement standardized `on_enter`, `on_step`, and `on_leave` behaviors. Transitions are triggered either by network packets broadcast by the Python TCP server (event-based) or time step countdowns.
* **Formation Control**: Swarm cohesion is managed via dynamic coordinate polygons. Vertices are automatically subdivided based on swarm size (`num_bots`), and individual robot allocations are resolved via a greedy Hungarian-like proximity matching algorithm.

### 5. Closed-Loop LLM Calibration and Syntax Safeguards

To allow non-expert users to program behaviors dynamically, an LLM acts as an offline compiler and system calibrator:

* **Calibration Dialogue**: High-level vocal requests are mapped to structured Python API calls using OpenRouter tool calling to rebuild the active spatial database (`RegistryPoints`).
* **LUA Safeguard Loop**: When the LLM generates a custom LUA controller, the Python server intercepts the script and evaluates it via a local LUA syntax checking subprocess before broadcasting. If syntax anomalies are caught, the system intercepts the error traceback and feeds it directly back to the LLM, triggering an automated closed-loop self-correction routine (limited to 3 retries). This validation barrier completely insulates the ARGoS simulation from syntactical failures, ensuring continuous, crash-free human-swarm interaction.

---

## Content FR

### 1. Résumé et Objectifs Architecturaux

Le pilotage d'un essaim de robots décentralisé (composé d'agents hétérogènes tels que des pi-pucks et des drones) engendre une surcharge cognitive critique pour un opérateur humain. 

Ce projet de recherche, réalisé au laboratoire **IRIDIA** de l'Université Libre de Bruxelles (ULB), se concentre sur la conception et le déploiement d'une architecture d'IHM multimodale. Le système permet à un opérateur non spécialiste de piloter un essaim en temps réel par vision monoculaire (gestes 3D), parole et orchestration par grand modèle de langage (LLM), directement interfacé avec le simulateur physique de robotique **ARGoS**.

### 2. Moteur d'Orchestration Asynchrone Multithreadé

Pour éliminer les collisions temporelles et la variation de latence de traitement entre la perception et la simulation physique, le serveur Python exécute 7 threads concurrents synchronisés :

* `thread_camera.py` : Acquisition vidéo et extraction tridimensionnelle des articulations.
* `thread_microphone.py` & `thread_speaker.py` : Entrée audio brute (VAD) et retour de synthèse vocale (TTS).
* `thread_socket_argos.py` : Serveur TCP non-bloquant à haute fréquence pour le streaming de la télémétrie.
* `thread_llm.py` : Gestion des appels d'inférence (dialogue, appels d'outils et génération LUA).
* `thread_gui.py` : Tableau de bord de contrôle basé sur DearPyGui.
* **Synchronisation** : L'état global est sécurisé via des verrous de réentrance (`threading.Lock`) et des mémoires tampons thread-safe (`SafeBuffer`) développées sur le modèle de files d'attente synchronisées.

### 3. Pipelines de Perception et Classification de Gestes

La couche d'acquisition sensorielle repose sur des modules légers à faible latence adaptés au calcul en périphérie (edge computing) :

* **Vision Spatiale** : Extraction de 21 repères de main et 33 repères corporels via **MediaPipe Pose & Hands**. Les coordonnées subissent une normalisation dynamique basée sur la distance épaule-hanche, assurant l'invariance d'échelle face aux mouvements de l'opérateur.
* **Classificateurs de Gestes** :
  * *Interaction Événementielle (Discrète)* : Détection de déclencheurs binaires (ex: fermeture du poing `FistEvent` ou orientation de la paume calculée par déterminant de produit vectoriel 2D).
  * *Interaction Continue (Streaming)* : Traduction instantanée des deltas de coordonnées articulaires en flux analogiques continus de vitesse (joystick virtuel).
* **Traitement de la Parole** : Enregistrement à 16kHz via PortAudio. Le VAD est résolu localement par seuillage RMS de l'énergie du signal. La transcription s'effectue en flux continu (<200ms) par le modèle **Moonshine STT**, et le retour vocal est généré localement via **Piper TTS** (modèle de voix GLaDOS).

### 4. Cinématique d'Essaim et Automates LUA Embarqués

Les robots simulés exécutent en local des machines à états hiérarchiques programmées en LUA :

* **Automates Finis** : Chaque état implémente les fonctions d'interface `on_enter`, `on_step`, et `on_leave`. Les transitions s'effectuent soit par événement réseau via socket TCP, soit par compte à rebours temporel interne (ticks).
* **Formations Spatiales** : La cohésion de l'essaim est assurée par des polygones virtuels. Le système subdivise dynamiquement les segments selon le nombre d'agents actifs (`num_bots`) et résout l'appariement de proximité par une heuristique d'allocation gloutonne de type algorithme hongrois.

### 5. Calibrage LLM en Boucle Fermée et Garde-Fou LUA

Pour simplifier l'interaction, un LLM agit en tant que compilateur de haut niveau et calibrateur hors-ligne :

* **Appel d'Outils (Tool Calling)** : Le dialogue en langage naturel est traduit en instructions d'API Python précises (OpenRouter) pour restructurer la base vectorielle spatiale (`RegistryPoints`).
* **Watchdog LUA** : Lorsque le LLM synthétise un script de contrôle LUA, l'orchestrateur Python intercepte le payload et initie une validation de syntaxe en sous-processus local. En cas d'erreur détectée, la trace d'erreur (traceback) est réinjectée dynamiquement dans le contexte du LLM pour auto-correction (limité à 3 tentatives). Ce garde-fou isole le simulateur ARGoS de toute défaillance syntaxique, garantissant une simulation continue et exempte de plantages.
