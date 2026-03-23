# Design du langage PyXML et du compilateur

## Concept général

Le PyXML est un langage intermédiaire de haut niveau, à mi-chemin entre XML et Python. Il permet de décrire la structure des pages du site web de manière déclarative, tout en intégrant des **blocs d'exécution** qui génèrent dynamiquement du contenu à la compilation.

```graph
        [Données]                    (YAML, JSON, Markdown)
              ↓
[Template PyXML] + [Style CSS]       (description de la page + style)
              ↓
    [Compilateur Python]             (build.py)
              ↓
      [Site HTML généré]             (fichiers .html statiques)
```

---

## Les deux types de blocs

### 1. Blocs de construction (Construction Blocks)

Ce sont des balises XML custom qui décrivent la structure visuelle de la page. Ils sont **déclaratifs** : ils disent *quoi* afficher, pas *comment*.

Chaque bloc de construction est mappé vers un **template HTML + classes CSS** lors de la compilation.

```xml
<!-- Exemples de blocs de construction -->

<main_container> ... </main_container>
<single_column> ... </single_column>
<2_columns_container_1_on_mobile> ... </2_columns_container_1_on_mobile>
<section> ... </section>
<title_text> ... </title_text>
<text> ... </text>
<link_url icon="..." name="..." url="..." />
<link_page icon="..." name="..." url="..." />
<link_file icon="..." name="..." url="..." />
<filter_bar> ... </filter_bar>
<project_card> ... </project_card>
<tags_list> ... </tags_list>
<!-- etc. voir pages_design.md pour la liste complète -->
```

#### Pseudo-code : Compilation d'un bloc de construction

```python
def compile_construction_block(node, context):
    """
    Transforme un noeud PyXML de construction en HTML.

    Args:
        node: Le noeud XML parsé (tag, attributes, children)
        context: Contexte de compilation (thème, langue par défaut, chemin courant, ...)

    Returns:
        str: Le HTML généré
    """

    # 1. Récupérer le template HTML associé à ce tag
    template = CONSTRUCTION_TEMPLATES[node.tag]
    # exemple: CONSTRUCTION_TEMPLATES["title_text"] = '<h1 class="title-text {classes}">{content}</h1>'

    # 2. Extraire les attributs du noeud
    attributes = node.attributes
    # exemple: {"data-translation-en": "Hello", "data-translation-fr": "Bonjour"}

    # 3. Compiler récursivement les enfants
    children_html = ""
    for child in node.children:
        if is_construction_block(child):
            children_html += compile_construction_block(child, context)
        elif is_execution_block(child):
            children_html += execute_execution_block(child, context)
        elif is_text_node(child):
            children_html += escape_html(child.text)
        elif is_comment_node(child):
            pass  # ignorer les commentaires

    # 4. Mapper les attributs PyXML vers attributs HTML
    html_attrs = map_attributes(attributes)
    # "data-translation-en" → "data-translation-en" (direct)
    # "icon" → on ajoute une <img> ou <svg> dans le template

    # 5. Appliquer le template
    html = template.format(
        content=children_html,
        classes=get_css_classes(node.tag, attributes),
        attributes=html_attrs
    )

    return html
```

---

### 2. Blocs d'exécution (Execution Blocks)

Ce sont des blocs spéciaux qui **génèrent dynamiquement** des blocs de construction à la compilation, en lisant des données depuis des fichiers (YAML, JSON, Markdown).

Syntaxe proposée :

```xml
<!-- Bloc d'exécution : balise spéciale <exec_*> -->

<exec_generate
    parser="markdown_bilingual"
    source="./data/about_me/"
    template="large_expandable_node"
    sort_by="filename"
    sort_order="asc"
/>

<exec_generate
    parser="yaml_directory"
    source="./data/projects/"
    template="project_card"
    filter="project_showcase_importance >= 40"
    sort_by="project_showcase_importance"
    sort_order="desc"
/>

<exec_generate
    parser="json_array"
    source="./data/citations/manifest.json"
    template="citation_card"
    mode="random_one"
/>

<exec_generate
    parser="yaml_directory"
    source="./data/blogs/"
    template="blog_post_row_cardline"
    sort_by="date"
    sort_order="desc"
    paginate="25"
/>
```

#### Pseudo-code : Exécution d'un bloc d'exécution

```python
# Registry des parsers disponibles
PARSERS = {
    "markdown_bilingual": MarkdownBilingualParser,
    "yaml_directory": YamlDirectoryParser,
    "json_array": JsonArrayParser,
    "json_manifest": JsonManifestParser,
}

def execute_execution_block(node, context):
    """
    Exécute un bloc d'exécution pour générer des blocs de construction.

    Args:
        node: Le noeud XML <exec_generate .../>
        context: Contexte de compilation

    Returns:
        str: Le HTML généré par l'exécution
    """

    # 1. Déterminer le parser à utiliser
    parser_name = node.attributes["parser"]
    parser_class = PARSERS[parser_name]
    parser = parser_class()

    # 2. Charger les données depuis la source
    source_path = resolve_path(node.attributes["source"], context.base_dir)
    raw_data = parser.load(source_path)
    # raw_data = liste de dictionnaires, un par entrée

    # 3. Appliquer les filtres si présents
    if "filter" in node.attributes:
        filter_expr = node.attributes["filter"]
        raw_data = apply_filter(raw_data, filter_expr)

    # 4. Appliquer le tri si présent
    if "sort_by" in node.attributes:
        sort_key = node.attributes["sort_by"]
        sort_order = node.attributes.get("sort_order", "asc")
        raw_data = sorted(raw_data, key=lambda x: x[sort_key], reverse=(sort_order == "desc"))

    # 5. Appliquer la pagination si présente
    if "paginate" in node.attributes:
        page_size = int(node.attributes["paginate"])
        pages = chunk_list(raw_data, page_size)
        # Génère plusieurs pages HTML séparées
    else:
        pages = [raw_data]

    # 6. Pour chaque entrée, instancier le template de construction
    template_name = node.attributes["template"]
    html_parts = []

    for entry in pages[0]:  # page courante
        construction_xml = instantiate_template(template_name, entry)
        # construction_xml = du PyXML avec les {placeholders} remplacés par les données

        # 7. Compiler le PyXML généré en HTML
        generated_node = parse_pyxml(construction_xml)
        html_parts.append(compile_construction_block(generated_node, context))

    # 8. Gérer le mode spécial si présent
    if node.attributes.get("mode") == "random_one":
        # On génère tous les éléments mais en display:none,
        # et le JS en affichera un aléatoirement
        pass

    return "\n".join(html_parts)
```

---

## Parsers

### Parser : `markdown_bilingual`

Lit des fichiers Markdown bilingues. Le format est :

```markdown
# Titre EN

Contenu en anglais

# Titre FR

Contenu en français

## Sous-titre EN

Sous-contenu en anglais

## Sous-titre FR

Sous-contenu en français
```

```python
class MarkdownBilingualParser:
    """Parse des fichiers markdown bilingues (sections EN/FR alternées)."""

    def load(self, source_path):
        """
        Args:
            source_path: chemin vers un dossier contenant des .md

        Returns:
            list[dict]: liste de dictionnaires avec les clés:
                - filename: nom du fichier
                - title_en, title_fr: titres
                - sections: list[dict] avec sub_title_en, sub_title_fr, content_en, content_fr
        """

        entries = []

        for md_file in sorted(glob(source_path / "*.md")):

            content = read_file(md_file)

            # Séparer les sections par les headers de niveau 1 (#)
            # Regrouper par paires (EN, FR) grâce au suffixe du titre
            title_en, title_fr = extract_h1_titles(content)

            # Pour chaque header de niveau 2 (##), regrouper par paires
            subsections = extract_h2_sections(content)

            entries.append({
                "filename": md_file.stem,
                "title_en": title_en,
                "title_fr": title_fr,
                "sections": subsections
            })

        return entries
```

### Parser : `yaml_directory`

Lit tous les fichiers YAML d'un dossier.

```python
class YamlDirectoryParser:
    """Parse tous les fichiers YAML d'un dossier."""

    def load(self, source_path):
        """
        Args:
            source_path: chemin vers un dossier contenant des .yaml ou .yml

        Returns:
            list[dict]: liste de dictionnaires, un par fichier YAML
        """

        entries = []

        for yaml_file in sorted(glob(source_path / "*.yaml") + glob(source_path / "*.yml")):
            data = yaml.safe_load(read_file(yaml_file))
            data["_source_file"] = yaml_file.stem
            entries.append(data)

        return entries
```

### Parser : `json_manifest`

Lit un fichier manifest JSON qui liste d'autres fichiers JSON à charger.

```python
class JsonManifestParser:
    """Parse un manifest JSON qui référence d'autres fichiers JSON."""

    def load(self, source_path):
        """
        Args:
            source_path: chemin vers le manifest.json

        Returns:
            list[dict]: liste consolidée de toutes les entrées
        """

        manifest = json.loads(read_file(source_path))
        base_dir = source_path.parent
        all_entries = []

        for ref_file in manifest["files"]:
            file_path = base_dir / ref_file
            data = json.loads(read_file(file_path))
            if isinstance(data, list):
                all_entries.extend(data)
            else:
                all_entries.append(data)

        return all_entries
```

---

## Système de templates

Les templates sont des fichiers PyXML avec des **placeholders** `{variable_name}` à remplacer lors de l'instanciation.

### Dossier des templates

```tree
templates/
├── components/
│   ├── project_card.pyxml
│   ├── blog_post_row_cardline.pyxml
│   ├── media_card.pyxml
│   ├── category_card.pyxml
│   ├── citation_card.pyxml
│   ├── large_expandable_node.pyxml
│   ├── medium_expandable_node.pyxml
│   └── small_expandable_node.pyxml
├── layouts/
│   ├── main_container.pyxml
│   ├── single_column.pyxml
│   └── 2_columns_container_1_on_mobile.pyxml
└── pages/
    ├── index.pyxml
    ├── contact_me.pyxml
    ├── about_me.pyxml
    ├── projects.pyxml
    ├── museum.pyxml
    ├── museum_category.pyxml
    ├── museum_entry.pyxml
    ├── blog.pyxml
    └── blog_entry.pyxml
```

### Exemple d'un template de composant

```xml
<!-- templates/components/project_card.pyxml -->

<project_card data-type="{project_type}" data-importance="{project_showcase_importance}">
    <card_header>
        <icon src="{icon}" />
        <name
            data-translation-en="{name_en}"
            data-translation-fr="{name_fr}"
        >{name_en}</name>
        <status badge="{project_status}">{project_status}</status>
    </card_header>

    <card_body>
        <short_description
            data-translation-en="{short_description_en}"
            data-translation-fr="{short_description_fr}"
        >{short_description_en}</short_description>

        <tags_list>
            <!-- Bloc d'exécution interne pour itérer sur les tags -->
            <exec_foreach var="tag" in="{tags}">
                <tag>{tag}</tag>
            </exec_foreach>
        </tags_list>
    </card_body>

    <card_actions>
        <link_url icon="github" name="Source" url="{link}" />
        <button_action icon="expand" name="Details" action="open_modal" target="modal_{_source_file}" />
    </card_actions>
</project_card>
```

---

## Blocs d'exécution avancés

En plus de `<exec_generate>`, on peut avoir :

### `<exec_foreach>` - Itération

```xml
<exec_foreach var="item" in="{list_variable}">
    <tag>{item}</tag>
</exec_foreach>
```

### `<exec_if>` - Conditionnel

```xml
<exec_if condition="{cover_image} != ''">
    <article_cover src="{cover_image}" />
</exec_if>
```

### `<exec_include>` - Inclusion d'un autre template

```xml
<exec_include template="components/project_card.pyxml" data="{current_entry}" />
```

### `<exec_markdown>` - Rendu Markdown → HTML

```xml
<exec_markdown src="{markdown_content_en}" />
<!-- Sera compilé en HTML à partir du fichier markdown référencé -->
```

#### Pseudo-code : Gestion des blocs d'exécution avancés

```python
def execute_execution_block(node, context):
    """Dispatch vers le bon handler selon le type de bloc d'exécution."""

    tag = node.tag

    if tag == "exec_generate":
        return handle_exec_generate(node, context)

    elif tag == "exec_foreach":
        return handle_exec_foreach(node, context)

    elif tag == "exec_if":
        return handle_exec_if(node, context)

    elif tag == "exec_include":
        return handle_exec_include(node, context)

    elif tag == "exec_markdown":
        return handle_exec_markdown(node, context)

    else:
        raise CompilationError(f"Unknown execution block: {tag}")


def handle_exec_foreach(node, context):
    """Itère sur une liste et génère du HTML pour chaque élément."""

    var_name = node.attributes["var"]
    list_data = context.resolve(node.attributes["in"])
    # list_data = ["tag1", "tag2", "tag3"]

    html_parts = []
    for item in list_data:
        # Créer un sous-contexte avec la variable d'itération
        sub_context = context.copy()
        sub_context.set(var_name, item)

        # Compiler les enfants dans ce sous-contexte
        for child in node.children:
            html_parts.append(compile_node(child, sub_context))

    return "\n".join(html_parts)


def handle_exec_if(node, context):
    """Évalue une condition et génère du HTML si vrai."""

    condition = node.attributes["condition"]
    result = evaluate_condition(condition, context)

    if result:
        html_parts = []
        for child in node.children:
            html_parts.append(compile_node(child, context))
        return "\n".join(html_parts)

    return ""


def handle_exec_include(node, context):
    """Inclut et compile un template externe."""

    template_path = node.attributes["template"]
    data = context.resolve(node.attributes.get("data", "{}"))

    sub_context = context.copy()
    sub_context.update(data)

    template_content = read_file(context.templates_dir / template_path)
    template_node = parse_pyxml(template_content)

    return compile_node(template_node, sub_context)


def handle_exec_markdown(node, context):
    """Convertit un fichier Markdown en HTML."""

    src = context.resolve(node.attributes["src"])
    md_content = read_file(src)
    html = markdown_to_html(md_content)

    return html
```

---

## Compilation d'une page complète

```python
def compile_page(pyxml_file, context):
    """
    Compile une page PyXML complète en fichier HTML.

    Args:
        pyxml_file: chemin vers le fichier .pyxml de la page
        context: contexte de compilation global

    Returns:
        str: le HTML complet de la page
    """

    # 1. Lire le fichier PyXML
    pyxml_content = read_file(pyxml_file)

    # 2. Parser le PyXML en arbre de noeuds
    root = parse_pyxml(pyxml_content)

    # 3. Compiler l'arbre en HTML
    body_html = compile_node(root, context)

    # 4. Envelopper dans le squelette HTML
    page_html = HTML_SKELETON.format(
        title=context.page_title,
        lang=context.default_lang,
        theme_css=context.theme_css_path,
        base_css=context.base_css_path,
        body=body_html,
        js_scripts=context.js_scripts,
        meta_tags=context.meta_tags,
    )

    return page_html


# Le squelette HTML de base
HTML_SKELETON = """<!DOCTYPE html>
<html lang="{lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {meta_tags}
    <title>{title}</title>
    <link rel="stylesheet" href="{base_css}">
    <link rel="stylesheet" href="{theme_css}" id="theme-stylesheet">
</head>
<body>
    {body}
    {js_scripts}
</body>
</html>"""
```
