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

                <text>
                    Hi ! I'm Nathan, a computer science passionate.  <!-- TODO: write a better text -->
                </text>

            </section>

            <!-- Quick history section -->
            <section>

                <small_expandable_node>

                    <name>
                        2023 - 2026 : Engineering school (Télécom Physique Strasbourg).
                    </name>

                    <content>
                        In 2023, I started a 3-year engineering school (Télécom Physique Strasbourg). I am currently in the end of my last year, doing my 6-month internship in the IRIDIA lab of the Université Libre de Bruxelles.
                    </content>

                </small_expandable_node>

                <small_expandable_node>

                    <name>
                        2021 - 2023 : Preparatory class (Lycée Louis-le-Grand, Paris).
                    </name>

                    <content>
                        In 2021, I started a 2-year preparatory class (CPGE) in Paris (lycée Louis-le-Grand). I then passed the entrance exams for the French engineering schools (concours Mines-Télécom, Centrale-Supélec, X, ENS).
                    </content>

                </small_expandable_node>

                <small_expandable_node>

                    <name>
                        2015 - 2021 : Second part of my childhood and high school.
                    </name>

                    <content>
                        In 2015, we moved into Heillecourt, a city in the suburbs of Nancy. I went to the middle school there (collège Montaigu), and then to the high school in Nancy (lycée Henri Poincaré). I graduated in 2021 with a scientific baccalauréat (Maths, Computer Science and Physics options).
                    </content>

                </small_expandable_node>

                <small_expandable_node>

                    <name>
                        2003 - 2015 : First part of my childhood.
                    </name>

                    <content>
                        I was born in Nancy, France. I lived in Sivry, a small village of 200 inhabitants, in the countryside, 20 km in the north of Nancy.
                    </content>

                </small_expandable_node>

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
            <large_expandable_node title="Title">

                For each `##` title in the file:
                <medium_expandable_node title="Sub-title">
                    <name>Sub-title</name>
                    <content>Markdown Parsed Content</content>
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

Project description:

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

```xml
<main_container>
    <single_column>

        <!-- TODO -->

    </single_column>
</main_container>
```

## Page - Museum

Path: `./pages/museum.html`

```xml
<main_container>
    <single_column>

        <title_text>The Museum (Media Gallery)</title_text>

        <!-- TODO -->
    </single_column>
</main_container>
```

## Page - Blog

Path: `./pages/blog.html`

```xml
<main_container>
    <single_column>

        <!-- TODO -->

    </single_column>
</main_container>
```
