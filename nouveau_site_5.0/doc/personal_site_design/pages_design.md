# Website pages design

## Index home page

Path: `./index.html`

```xml

<main_container>

    <2_columns_container_1_on_mobile>

        <!-- Left Index Column (header, presentation and quick history) -->
        <left_column>

            <!-- Header section -->
            <row_head>

                <logo />

                <title_text>
                    Nathan's website
                </title_text>

            </row_head>

            <!-- Presentation section -->
            <section>

                <text
                    data-translation-en="Hi! I'm Nathan, a computer science passionate exploring software architecture, web development, and digital arts."
                    data-translation-fr="Bonjour ! Je suis Nathan, un passionné d'informatique explorant l'architecture logicielle, le développement web et les arts numériques."
                >
                    Hi! I'm Nathan, a computer science passionate exploring software architecture, web development, and digital arts.
                </text>

            </section>

            <!-- Quick history section -->
            <section>

                <!-- The data will be parsed from ./data/home/quick_history.md, that contains data under the format:

                    ## Title (EN)

                    Content (EN)

                    ## Title (FR)

                    Content (FR)

                    ...

                    That data will be parsed and converted into the following format:

                    <small_expandable_node>
                        <name
                            data-translation-en="Title in english"
                            data-translation-fr="Title in french"
                        >Title in english</name>
                        <content
                            data-translation-en="Content in english"
                            data-translation-fr="Content in french"
                        >Content in english</content>
                    </small_expandable_node>

                 -->
                <!-- START OF AUTOMATICALLY GENERATED FROM ./data/home/quick_history.md -->

                <!-- END OF AUTOMATICALLY GENERATED FROM ./data/home/quick_history.md -->

            </section>

        </left_column>

        <!-- Right Index Column (links to other pages) -->
        <right_column>

            <!-- Professional links -->
            <section>

                <title>
                    Professional links
                </title>

                <link_file icon="file" name="CV / resume (english)" url="res/cv_en.pdf" />
                <link_file icon="file" name="CV / resume (french)" url="res/cv_fr.pdf" />

                <link_url icon="github" name="Github" url="https://github.com/nath54" />
                <link_url icon="linkedin" name="Linkedin" url="https://www.linkedin.com/in/nathan-cerisara-8669331ba/" />

                <link_page icon="msg_bubble" name="Contact me" url="pages/contact_me.html" />

            </section>

            <!-- For my friends and family and those who want to know me -->
            <section>

                <title>
                    For my friends and family and those who want to know me
                </title>

                <link_page icon="person" name="About me" url="pages/about_me.html" />
                <link_page icon="projects" name="Projects" url="pages/projects.html" />
                <link_page icon="museum" name="Museum" url="pages/museum.html" />
                <link_page icon="blog" name="Blog" url="pages/blog.html" />

            </section>

            <!-- Random citation -->
            <section>

                <title>
                    Random citation
                </title>

                <citation>
                    <text>Citation</text>
                    <row>
                        <author>Author</author>
                        <text> - </text>
                        <date>Date</date>
                    </row>
                    <source>Source</source>
                </citation>

            </section>

        </right_column>

    </2_columns_container_1_on_mobile>

</main_container>

```

Les citations sont chargées automatiquement depuis les fichiers JSON présents dans le dossier `./data/citations/`, il y a un fichier `manifest.json` qui liste tous les fichiers JSON à charger.

Tous les fichiers JSON de citations sont de la forme:

```json
[
    {
        "citation_en": "The citation in english",
        "citation_fr": "La citation en français",
        "author": "Author",
        "date": "Date",
        "source": "Source"
    }
]
```

## Page - Contact me

Path: `./pages/contact_me.html`

```xml
<main_container>

    <single_column>

        <title_text>Contact Me</title_text>

        <section>
            <text>
                If you want to reach out for professional inquiries, for a collaboration, or just to say hi, here are the best ways of contacting me:
            </text>

            <subsection>
                <text>By sending an email to:</text>
                <code>cerisara.nathan@protonmail.com</code>
            </subsection>

            <subsection>
                <text>Or by sending a message on Linkedin:</text>
                <link_url icon="linkedin" name="Linkedin" url="https://www.linkedin.com/in/nathan-cerisara-8669331ba/" />
            </subsection>

        </section>

    </single_column>

</main_container>
```

## Page - About me

Path: `./pages/about_me.html`

Automatically generated from `./data/about_me/`.

```xml
<main_container>

    <single_column>

        <title_text>About Me</title_text>

        <text>If you want to know more about myself...</text>

        <!-- Generated under the following format:


            For each file in ./data/about_me/ (sorted by name):
            <large_expandable_node>
                <name
                    data-translation-en="Title in english"
                    data-translation-fr="Title in french"
                >Title in english</name>

                For each `##` title in the file:
                <medium_expandable_node>
                    <name
                        data-translation-en="Sub-title in english"
                        data-translation-fr="Sub-title in french"
                    >Sub-title in english</name>
                    <content
                        data-translation-en="Content in english"
                        data-translation-fr="Content in french"
                    >Content in english</content>
                </medium_expandable_node>

            </large_expandable_node>

        -->
        <!-- START OF AUTOMATICALLY GENERATED FROM MARKDOWN FILES AT ./data/about_me/ -->

        <!-- END OF AUTOMATICALLY GENERATED FROM MARKDOWN FILES AT ./data/about_me/ -->

    </single_column>
</main_container>
```

## Page - Projects

Path: `./pages/projects.html`

Project description data:

```yaml
name_en: "Project name"
name_fr: "Nom du projet"
tags: ["tag1", "tag2", "tag3"]
icon: "icon.png"
link: "https://github.com/nath54/project-name"
project_type: "personal" # "personal", "professional", "academic"
project_status: "non-started" # "non-started", "base-dev", "first-minimal-demo", "Vx.xx" (where x is a digit)
project_showcase_importance: 0 # 0 is not important at all, below 40, the projects are hidden, and then higher the number is, the more important the project is
short_description_en: "Short description of the project"
short_description_fr: "Description courte du projet"
description_en:
    - "Description line 1"
    - "Description line 2"
    - "Description line 3"
description_fr:
    - "Ligne 1 de description"
    - "Ligne 2 de description"
    - "Ligne 3 de description"
gallery:
    - "image1.png"
    - "image2.png"
    - "image3.png"
TODOLIST:
    - [ ] Task 1
        - [x] Subtask 1
        - [ ] Subtask 2
    - [x] Task 2
    - [ ] Task 3
```

Automatically generated from `./data/projects/`.

Project card icons in the Project Grid Container:

```xml
<project_card data-type="personal" data-importance="85">
    <card_header>
        <icon src="icon.png" />
        <!-- Using your custom translation attributes natively -->
        <name
            data-translation-en="Project name"
            data-translation-fr="Nom du projet"
        >Project name</name>
        <status badge="Vx.xx">Vx.xx</status>
    </card_header>

    <card_body>
        <short_description
            data-translation-en="Short description of the project"
            data-translation-fr="Description courte du projet"
        >Short description of the project</short_description>

        <tags_list>
            <!-- Automatically pulled from the YAML tags array -->
            <tag>tag1</tag>
            <tag>tag2</tag>
            <tag>tag3</tag>
        </tags_list>
    </card_body>

    <card_actions>
        <link_url icon="github" name="Source" url="https://github.com/nath54/project-name" />

        <!--
            In an OS theme, clicking this opens a new detailed "Window" / Modal over the UI
            In the non JS case, it will redirect to a pre-generated HTML page with the same content of the modal container.
        -->
        <button_action icon="expand" name="Details" action="open_modal" target="modal_project_1" />
    </card_actions>
</project_card>
```

Modal part, or non-js project page:

```xml
<project_modal id="modal_project_1" class="hidden">
    <modal_header>
        <title>Project name</title>
        <button_close target="modal_project_1" />
    </modal_header>
    <modal_body>
        <!-- Python script injects the multiline YAML description_en / description_fr here -->
        <long_description>...</long_description>

        <!-- Iterates over YAML gallery array -->
        <image_carousel>
            <img src="image1.png" />
            <img src="image2.png" />
        </image_carousel>

        <!-- Formats the YAML TODOLIST array into a checkbox list -->
        <todo_list>
            <todo_item checked="false">Task 1</todo_item>
            <todo_item checked="true">Task 2</todo_item>
        </todo_list>
    </modal_body>
</project_modal>
```

```xml
<main_container>
    <single_column>

        <title_text>My Projects</title_text>

        <!-- OS-style Filter/Search Bar Toolbar -->
        <filter_bar>
            <!-- Works natively without JS as a form submission, but intercepted by JS for live filtering -->
            <search_input placeholder="Search projects..." />
            <filter_group>
                <filter_button active="true" data-filter="all">All</filter_button>
                <filter_button data-filter="personal">Personal</filter_button>
                <filter_button data-filter="academic">Academic</filter_button>
                <filter_button data-filter="professional">Professional</filter_button>
            </filter_group>
        </filter_bar>

        <!-- Projects Grid Container -->
        <projects_grid>

            <!--
               The Python script will iterate over ./data/projects/ YAML files.
               It will filter out any project where project_showcase_importance < 40.
               It will output them sorted descending by project_showcase_importance.
            -->

            <!-- START OF AUTOMATICALLY GENERATED PROJECTS -->

            <!-- END OF AUTOMATICALLY GENERATED PROJECTS -->

        </projects_grid>

        <!-- Modals for detailed views (Hidden by default) -->
        <modals_container>

            <!-- START OF AUTOMATICALLY GENERATED PROJECT MODALS -->

            <!-- END OF AUTOMATICALLY GENERATED PROJECT MODALS -->

        </modals_container>

    </single_column>
</main_container>
```

## Page - Museum

Path: `./pages/museum.html`

Media entry data:

```yaml
title_en: "Artwork Title"
title_fr: "Titre de l'oeuvre"
date: "2024-05-12"
media_type: "music" # "music", "poem", "drawing", "3d", "video"
tags: ["ambient", "synth"]
# Depending on media_type, only one of the following is filled
file_url: "audio/song.mp3" # for music, video
image_url: "images/drawing.png" # for drawing, 3d, pixel art
text_content_en: |
    Line 1 of poem
    Line 2 of poem
text_content_fr: |
    Ligne 1 du poème
    Ligne 2 du poème
description_en: "Context about this creation"
description_fr: "Contexte de cette création"
```

### Museum - Main Root Page (`./pages/museum.html`)

Links to different museum sections based on `media_type`.

```xml
<main_container>

    <single_column>

        <title_text>The Museum</title_text>

        <text>Choose a gallery to visit.</text>

        <categories_grid>

            <!-- START OF AUTOMATICALLY GENERATED CATEGORY CARDS -->

            <!-- END OF AUTOMATICALLY GENERATED CATEGORY CARDS -->

        </categories_grid>

    </single_column>

</main_container>
```

### Museum - Category Card Template

```xml
<category_card type="{media_type}" url="pages/museum/{media_type}.html">
    <title>{Category Name}</title>

    <icon url="{icon_url}" />

    <!-- Generated by python script based on the number of related media -->
    <count>X exhibits</count>
</category_card>
```

### Museum - Category Subpage Template (`./pages/museum/[media_type].html`)

```xml
<main_container>
    <single_column>
        <title_text>Museum: {Category Name}</title_text>

        <filter_bar>
            <search_input placeholder="Search exhibits..." />
        </filter_bar>

        <museum_gallery>
            <!-- START OF AUTOMATICALLY GENERATED SHORT CARDS -->

            <!-- END OF AUTOMATICALLY GENERATED SHORT CARDS -->
        </museum_gallery>
    </single_column>
</main_container>
```

### Museum - Short Card Template

```xml
<media_card data-type="{media_type}">
    <card_thumbnail>
        <!-- Generated thumbnail based on media_type (e.g. image preview or audio waveform placeholder) -->
        <thumbnail_img src="{thumbnail_url}" />
    </card_thumbnail>

    <card_plaque>
        <plaque_title>{title_en}</plaque_title>
        <plaque_date>{date}</plaque_date>
    </card_plaque>

    <card_actions>
        <!-- Navigates to the full media entry subpage -->
        <button_action icon="view" name="View Exhibit" action="navigate" url="pages/museum/entry_{id}.html" />
    </card_actions>
</media_card>
```

### Museum - Full Entry Subpage Templates (`./pages/museum/entry_[id].html`)

Depending on the `media_type`, the Python script will use one of these specific templates.

#### Modality: Text / Poem

```xml
<main_container>
    <single_column>
        <media_header>
            <title_text>{title_en}</title_text>
            <date_text>{date}</date_text>
            <tags_list>...</tags_list>
        </media_header>

        <media_content type="text">
            <text_scrollable>{text_content_en}</text_scrollable>
        </media_content>

        <media_description>{description_en}</media_description>
    </single_column>
</main_container>
```

#### Modality: Audio / Music

```xml
<main_container>
    <single_column>
        <media_header>
            <title_text>{title_en}</title_text>
        </media_header>

        <media_content type="audio">
            <!-- Full audio player with waveform, play/pause, volume controls -->
            <audio_player src="{file_url}" autoplay="false" />
        </media_content>

        <media_description>{description_en}</media_description>
    </single_column>
</main_container>
```

#### Modality: Image / Drawing

```xml
<main_container>
    <single_column>
        <media_header>
            <title_text>{title_en}</title_text>
        </media_header>

        <media_content type="image">
            <image_full src="{image_url}" alt="{title_en}" />
        </media_content>

        <media_description>{description_en}</media_description>
    </single_column>
</main_container>
```

#### Modality: 3D Rendering

```xml
<main_container>
    <single_column>
        <media_header>
            <title_text>{title_en}</title_text>
        </media_header>

        <media_content type="3d">
            <!-- Uses a WebGL renderer or spline viewer -->
            <model_viewer src="{file_url}" interactive="true" />
        </media_content>

        <media_description>{description_en}</media_description>
    </single_column>
</main_container>
```

#### Modality: Interactive Experience (e.g., small JS game or simulation)

```xml
<main_container>
    <!-- We might want fullscreen container here to maximize space -->
    <fullscreen_column>
        <media_header>
            <title_text>{title_en}</title_text>
        </media_header>

        <media_content type="interactive">
            <!-- An iframe or a custom web component injecting the experience -->
            <interactive_canvas src="{file_url}" />
        </media_content>

        <media_description>{description_en}</media_description>
    </fullscreen_column>
</main_container>
```

## Page - Blog

Path: `./pages/blog.html`

Blog entry data:

```yaml
title_en: "My thoughts on programming"
title_fr: "Mes pensées sur la programmation"
date: "2024-10-21"
tags: ["tech", "thoughts"]
cover_image: "images/blog_cover.jpg" # Optional
markdown_content_en: "blog_content_1_en.md" # Relative path to the raw markdown content file
markdown_content_fr: "blog_content_1_fr.md"
summary_en: "A short summary of what this article talks about."
summary_fr: "Un court résumé de ce dont parle cet article."
```

### Blog - Main Root Page (`./pages/blog.html`)

Links to different blog categories or years.

```xml
<main_container>
    <single_column>
        <title_text>Blog</title_text>
        <text>Where I drop my thoughts in a not very organized way.</text>

        <blog_pages_container>

            <!-- each page contains a list of 25 blog posts sorted by date DESC -->
            <!-- START OF AUTOMATICALLY GENERATED BLOG PAGES -->

            <!-- END OF AUTOMATICALLY GENERATED BLOG PAGES -->

        </blog_pages_container>

    </single_column>
</main_container>
```

### Blog - Short Card Template

```xml
<blog_post_row_cardline data-tags="{tags}">
    <!-- Rendered if cover_image exists -->
    <icon url="{icon_url}" />

    <column>
        <row>
            <title>{title_en}</title>
            <text> - </text>
            <date>{date}</date>
        </row>
        <text data-translation-en="{summary_en}" data-translation-fr="{summary_fr}">{summary_en}</text>
        <tags_list>...</tags_list>
    </column>

    <center>
        <button_action icon="read" name="Read Article" action="navigate" url="pages/blog/entry_{id}.html" />
    </center>
</blog_post_row_cardline>
```

### Blog - Full Article Subpage Template (`./pages/blog/entry_[id].html`)

```xml
<main_container>
    <single_column>
        <article_header>
            <!-- Large cover header if there is an image -->
            <article_cover src="{cover_image}" />
            <title_text>{title_en}</title_text>
            <article_metadata>
                <date>{date}</date>
                <author>{author}</author>
                <tags_list>...</tags_list>
            </article_metadata>
        </article_header>

        <article_body>
            <!-- Translated markdown rendered as HTML -->
            <markdown_render
                data-translation-en="{markdown_content_en_html}"
                data-translation-fr="{markdown_content_fr_html}"
            >
                {markdown_content_en_html}
            </markdown_render>
        </article_body>

        <article_footer>
            <button_action icon="back" name="Back to Blog" action="navigate" url="pages/blog.html" />
        </article_footer>
    </single_column>
</main_container>
```
