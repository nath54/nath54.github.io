# Design des fonctionnalités JavaScript

## Architecture des fichiers JS

```t
js/
├── core/
│   ├── app.js                 # Point d'entrée principal, initialisation
│   ├── router.js              # SPA router (fetch + History API)
│   └── events.js              # Event bus global
├── features/
│   ├── localization.js        # Traduction multilingue (amélioré)
│   ├── theme-switcher.js      # Gestion des thèmes (auto + toggle)
│   ├── filter.js              # Filtre/recherche live
│   ├── modal.js               # Gestion des modals OS-style
│   ├── citations.js           # Citations aléatoires
│   ├── scroll-animations.js   # Animations au scroll
│   └── image-carousel.js      # Carrousel d'images
├── easter-eggs/
│   ├── terminal.js            # Terminal easter egg
│   └── terminal-commands.js   # Commandes du terminal
├── editor/
│   └── websocket-client.js    # Client websocket pour mode éditeur (futur)
└── utils/
    ├── dom.js                 # Utilitaires DOM
    └── storage.js             # Wrapper localStorage
```

---

## 1. SPA Router (Single Page Application)

Le site fonctionne comme un SPA quand JS est activé : les changements de page sont interceptés et le contenu est chargé via `fetch`, sans recharger la page entière.

### 1.1. Pseudo-code

```python
class SPARouter:
    """
    Gère la navigation SPA avec fetch + History API.
    Quand JS est désactivé, les liens <a> fonctionnent normalement.
    """

    def __init__(self):
        self.content_container = document.getElementById("page-content")
        self.current_path = window.location.pathname
        self.transition_duration = 250  # ms

        # Écouter les clics sur les liens internes
        document.addEventListener("click", self.handle_click)

        # Écouter le bouton "Back" du navigateur
        window.addEventListener("popstate", self.handle_popstate)

    def handle_click(self, event):
        """Intercepte les clics sur liens internes."""

        link = event.target.closest("a.link-page")
        if not link:
            return

        event.preventDefault()
        target_url = link.getAttribute("href")

        # Ajouter à l'historique du navigateur
        history.pushState({"path": target_url}, "", target_url)

        # Charger la nouvelle page
        self.navigate_to(target_url)

    def handle_popstate(self, event):
        """Gère le bouton Back/Forward du navigateur."""

        if event.state and event.state.path:
            self.navigate_to(event.state.path)
        else:
            self.navigate_to(window.location.pathname)

    async def navigate_to(self, url):
        """Charge une page via fetch et l'injecte dans le container."""

        # 1. Animation de sortie
        self.content_container.classList.add("page-exit")
        await sleep(self.transition_duration)

        # 2. Fetch de la page
        try:
            response = await fetch(url)
            html = await response.text()

            # 3. Extraire le contenu du <main_container> (pas le <html> entier)
            content = extract_page_content(html)

            # 4. Injecter dans le container
            self.content_container.innerHTML = content

            # 5. Re-initialiser les composants JS sur le nouveau contenu
            reinitialize_components(self.content_container)

        except FetchError:
            # Fallback : navigation classique
            window.location.href = url
            return

        # 6. Animation d'entrée
        self.content_container.classList.remove("page-exit")
        self.content_container.classList.add("page-enter")
        await sleep(self.transition_duration)
        self.content_container.classList.remove("page-enter")

        # 7. Scroll en haut
        window.scrollTo(0, 0)

        # 8. Mettre à jour le titre de la page
        update_page_title(content)

        self.current_path = url


def extract_page_content(full_html):
    """Extrait le contenu entre les balises du conteneur principal."""

    parser = DOMParser()
    doc = parser.parseFromString(full_html, "text/html")
    main = doc.querySelector(".main-container")
    return main.innerHTML if main else full_html


def reinitialize_components(container):
    """Re-initialise les composants JS après un changement de page."""

    # Re-attacher les filtres
    init_filters(container)
    # Re-attacher les modals
    init_modals(container)
    # Re-appliquer les traductions
    translate_page()
    # Re-initialiser les animations au scroll
    init_scroll_animations(container)
    # Re-initialiser le carrousel d'images si présent
    init_carousels(container)
```

---

## 2. Système de traduction amélioré

Amélioration du `localization.js` existant.

### 2.1. Pseudo-code

```python
class Localization:
    """
    Système de traduction multilingue amélioré.
    - Détection automatique de la langue système
    - Support de plus de langues
    - Utilise data-translation-XX comme attribut
    """

    LANGUAGES = {
        "en": "English",
        "fr": "Français",
    }

    def __init__(self):
        # Priorité : URL param > localStorage > langue système > défaut "en"
        self.current_lang = self.detect_language()
        self.apply_translations()

    def detect_language(self):
        """Détecte la langue à utiliser, par ordre de priorité."""

        # 1. Paramètre URL ?lang=xx
        url_lang = URL(window.location).searchParams.get("lang")
        if url_lang and url_lang in self.LANGUAGES:
            return url_lang

        # 2. Préférence sauvegardée
        saved_lang = localStorage.getItem("lang")
        if saved_lang and saved_lang in self.LANGUAGES:
            return saved_lang

        # 3. Langue du navigateur / système
        browser_lang = navigator.language[:2]  # "fr-FR" → "fr"
        if browser_lang in self.LANGUAGES:
            return browser_lang

        # 4. Défaut
        return "en"

    def switch_language(self):
        """Passe à la langue suivante dans la rotation."""

        keys = list(self.LANGUAGES.keys())
        current_index = keys.index(self.current_lang)
        self.current_lang = keys[(current_index + 1) % len(keys)]

        localStorage.setItem("lang", self.current_lang)
        self.apply_translations()

    def apply_translations(self):
        """Applique les traductions à tous les éléments de la page."""

        attr_name = f"data-translation-{self.current_lang}"

        # Sélectionner tous les éléments qui ont l'attribut de traduction
        elements = document.querySelectorAll(f"[{attr_name}]")

        for element in elements:
            translated_text = element.getAttribute(attr_name)
            if translated_text:
                element.textContent = translated_text
```

---

## 3. Gestion des thèmes

### 3.1. Pseudo-code

```python
class ThemeSwitcher:
    """
    Gère les thèmes du site (light, dark, extensibles).
    - Auto-détection du thème système avec prefers-color-scheme
    - Toggle manuel avec persistance
    """

    THEMES = ["light", "dark"]  # extensible

    def __init__(self):
        self.current_theme = self.detect_theme()
        self.apply_theme(self.current_theme)

        # Écouter les changements de thème système
        media_query = window.matchMedia("(prefers-color-scheme: dark)")
        media_query.addEventListener("change", self.on_system_theme_change)

    def detect_theme(self):
        """Détecte le thème à utiliser."""

        # 1. Préférence sauvegardée
        saved = localStorage.getItem("theme")
        if saved and saved in self.THEMES:
            return saved

        # 2. Thème système
        if window.matchMedia("(prefers-color-scheme: dark)").matches:
            return "dark"

        return "light"

    def apply_theme(self, theme):
        """Applique un thème au body."""

        document.body.setAttribute("data-theme", theme)
        self.current_theme = theme

    def toggle_theme(self):
        """Passe au thème suivant."""

        current_index = self.THEMES.index(self.current_theme)
        next_theme = self.THEMES[(current_index + 1) % len(self.THEMES)]

        self.apply_theme(next_theme)
        localStorage.setItem("theme", next_theme)

    def on_system_theme_change(self, event):
        """Réagit au changement de thème système (si pas de préférence manuelle)."""

        if not localStorage.getItem("theme"):
            new_theme = "dark" if event.matches else "light"
            self.apply_theme(new_theme)
```

---

## 4. Filtre / Recherche live

### 4.1. Pseudo-code

```python
class LiveFilter:
    """
    Filtre live pour les grilles de projets, museum, blog.
    Fonctionne sans JS via soumission de formulaire (filtrage côté serveur non dispo,
    mais tous les éléments sont déjà dans le DOM).
    """

    def __init__(self, container):
        self.container = container
        self.search_input = container.querySelector(".search-input")
        self.filter_buttons = container.querySelectorAll(".filter-btn")
        self.items = container.querySelectorAll(".card")
        self.active_filter = "all"

        # Event listeners
        self.search_input.addEventListener("input", self.on_search)
        for btn in self.filter_buttons:
            btn.addEventListener("click", self.on_filter_click)

    def on_search(self, event):
        """Filtre les éléments par texte."""

        query = self.search_input.value.lower().strip()

        for item in self.items:
            text_content = item.textContent.lower()
            matches_search = (query == "" or query in text_content)
            matches_filter = self.matches_type_filter(item)

            if matches_search and matches_filter:
                item.style.display = ""
                item.classList.add("animate-on-scroll", "visible")
            else:
                item.style.display = "none"

    def on_filter_click(self, event):
        """Filtre par type (all, personal, academic, ...)."""

        btn = event.target
        self.active_filter = btn.getAttribute("data-filter")

        # Mettre à jour le style actif des boutons
        for b in self.filter_buttons:
            b.classList.remove("active")
        btn.classList.add("active")

        # Re-appliquer le filtre
        self.on_search(None)

    def matches_type_filter(self, item):
        """Vérifie si un item correspond au filtre de type actif."""

        if self.active_filter == "all":
            return True
        return item.getAttribute("data-type") == self.active_filter
```

---

## 5. Modals OS-style

### 5.1. Pseudo-code

```python
class ModalManager:
    """
    Gère les modals style fenêtre d'OS.
    - Ouvre/ferme avec animation
    - Draggable (optionnel, style OS)
    - Fermeture au clic extérieur ou Escape
    """

    def __init__(self):
        document.addEventListener("click", self.handle_open_click)
        document.addEventListener("keydown", self.handle_keydown)

    def handle_open_click(self, event):
        """Ouvre un modal quand on clique sur un bouton action."""

        btn = event.target.closest("[action='open_modal']")
        if not btn:
            return

        modal_id = btn.getAttribute("target")
        self.open(modal_id)

    def open(self, modal_id):
        """Ouvre un modal par son ID."""

        modal = document.getElementById(modal_id)
        if not modal:
            return

        # Afficher l'overlay
        overlay = get_or_create_overlay()
        overlay.classList.add("visible")

        # Afficher le modal avec animation
        modal.classList.remove("hidden")
        modal.classList.add("modal-enter")

        # Focus trap pour l'accessibilité
        trap_focus(modal)

    def close(self, modal_id):
        """Ferme un modal."""

        modal = document.getElementById(modal_id)

        modal.classList.add("modal-exit")
        await sleep(250)
        modal.classList.add("hidden")
        modal.classList.remove("modal-enter", "modal-exit")

        # Cacher l'overlay si aucun modal ouvert
        if not any_modal_open():
            overlay = document.querySelector(".modal-overlay")
            overlay.classList.remove("visible")

    def handle_keydown(self, event):
        """Ferme le modal actif avec Escape."""

        if event.key == "Escape":
            active = document.querySelector(".modal:not(.hidden)")
            if active:
                self.close(active.id)
```

---

## 6. Citations aléatoires

### 6.1. Pseudo-code

```python
class RandomCitation:
    """
    Charge les citations depuis les fichiers JSON et en affiche une aléatoirement.
    """

    def __init__(self, container):
        self.container = container
        self.citations = []
        self.load_citations()

    async def load_citations(self):
        """Charge le manifest puis tous les fichiers de citations."""

        # 1. Charger le manifest
        manifest = await fetch_json("data/citations/manifest.json")

        # 2. Charger chaque fichier référencé
        for filename in manifest["files"]:
            data = await fetch_json(f"data/citations/{filename}")
            self.citations.extend(data)

        # 3. Afficher une citation aléatoire
        self.display_random()

    def display_random(self):
        """Affiche une citation aléatoire dans le container."""

        if not self.citations:
            return

        citation = random_choice(self.citations)
        current_lang = window.localization.current_lang

        text_key = f"citation_{current_lang}"
        text = citation.get(text_key, citation.get("citation_en", ""))

        self.container.querySelector(".citation .text").textContent = text
        self.container.querySelector(".citation .citation-author").textContent = citation["author"]
```

---

## 7. Terminal Easter Egg

### 7.1. Pseudo-code

```python
class Terminal:
    """
    Terminal interactif en easter egg.
    S'ouvre avec un raccourci clavier (Ctrl+` par exemple).
    Stylisé comme un vrai terminal.
    """

    def __init__(self):
        self.is_open = False
        self.history = []
        self.history_index = -1
        self.commands = TERMINAL_COMMANDS  # dictionnaire commande → handler

        # Écouter le raccourci
        document.addEventListener("keydown", self.handle_shortcut)

    def handle_shortcut(self, event):
        """Ouvre/ferme le terminal avec Ctrl+`."""

        if event.ctrlKey and event.key == "`":
            event.preventDefault()
            self.toggle()

    def toggle(self):
        """Bascule l'affichage du terminal."""

        terminal_el = document.getElementById("terminal")

        if self.is_open:
            terminal_el.classList.add("terminal-exit")
            await sleep(250)
            terminal_el.classList.add("hidden")
            terminal_el.classList.remove("terminal-exit")
        else:
            terminal_el.classList.remove("hidden")
            terminal_el.classList.add("terminal-enter")
            terminal_el.querySelector(".terminal-input").focus()

        self.is_open = not self.is_open

    def execute_command(self, input_text):
        """Parse et exécute une commande."""

        parts = input_text.strip().split(" ")
        cmd_name = parts[0]
        args = parts[1:]

        # Ajouter à l'historique
        self.history.append(input_text)
        self.history_index = len(self.history)

        # Afficher la commande entrée
        self.print_line(f"$ {input_text}", class_name="terminal-cmd")

        # Exécuter
        if cmd_name in self.commands:
            output = self.commands[cmd_name](args)
            self.print_line(output)
        else:
            self.print_line(f"Command not found: {cmd_name}", class_name="terminal-error")

    def print_line(self, text, class_name=""):
        """Ajoute une ligne de sortie au terminal."""

        output = document.getElementById("terminal-output")
        line = document.createElement("div")
        line.className = f"terminal-line {class_name}"
        line.textContent = text
        output.appendChild(line)
        output.scrollTop = output.scrollHeight


# Commandes disponibles
TERMINAL_COMMANDS = {
    "help":     lambda args: "Available commands: help, about, ls, cat, clear, theme, lang, goto, matrix",
    "about":    lambda args: "Nathan's personal website v5.0 - Built with PyXML + ♥",
    "clear":    lambda args: clear_terminal(),
    "theme":    lambda args: toggle_theme_from_terminal(args),
    "lang":     lambda args: switch_lang_from_terminal(args),
    "goto":     lambda args: navigate_from_terminal(args),
    "ls":       lambda args: list_pages(),
    "cat":      lambda args: cat_page_content(args),
    "matrix":   lambda args: start_matrix_animation(),
    # ...
}
```

---

## 8. Initialisation globale (`app.js`)

### 8.1. Pseudo-code

```python
# js/core/app.js

def main():
    """Point d'entrée principal, appelé au chargement de la page."""

    # 1. Initialiser le router SPA
    window.router = SPARouter()

    # 2. Initialiser la traduction
    window.localization = Localization()

    # 3. Initialiser le thème
    window.theme_switcher = ThemeSwitcher()

    # 4. Initialiser les composants sur le contenu initial
    reinitialize_components(document.body)

    # 5. Initialiser le terminal
    window.terminal = Terminal()

    # 6. Initialiser les citations (si on est sur la page d'accueil)
    citation_container = document.querySelector(".citation")
    if citation_container:
        window.citations = RandomCitation(citation_container)

    # 7. Désactiver les liens de navigation no-JS
    disable_noscript_navigation()


def disable_noscript_navigation():
    """
    Cache les éléments de navigation qui sont là pour le mode no-JS.
    (Les liens classiques <a> avec navigation pleine page)
    """

    for el in document.querySelectorAll(".noscript-nav"):
        el.style.display = "none"


# Lancer au chargement
document.addEventListener("DOMContentLoaded", main)
```
