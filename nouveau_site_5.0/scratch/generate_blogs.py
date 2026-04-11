import os

blog_dir = "data/blogs"
os.makedirs(blog_dir, exist_ok=True)

blogs = [
    # General blogs
    {
        "id": "A_Day_In_The_Park",
        "title_en": "A Day In The Park",
        "title_fr": "Une Journée Au Parc",
        "date": "2026-04-10",
        "category": "Lifestyle",
        "series": "",
        "series_order": 0,
        "summary_en": "Just took a walk in the beautiful city park today. Let me tell you about it.",
        "summary_fr": "J'ai simplement pris une marche dans le beau parc de la ville aujourd'hui. Laissez-moi vous raconter.",
        "content_en": "The weather was **perfect**. Sun shining brightly, birds singing.",
        "content_fr": "Le temps était **parfait**. Le soleil brillait, les oiseaux chantaient.",
    },
    {
        "id": "Future_of_AI",
        "title_en": "Thoughts on the Future of AI",
        "title_fr": "Réflexions sur le Futur de l'IA",
        "date": "2026-03-15",
        "category": "Tech",
        "series": "",
        "series_order": 0,
        "summary_en": "Are we ready for artificial general intelligence?",
        "summary_fr": "Sommes-nous prêts pour l'intelligence artificielle générale ?",
        "content_en": "The rapid advancement of LLMs is astounding.",
        "content_fr": "L'avancement rapide des LLMs est stupéfiant.",
    },
    {
        "id": "Favorite_Books_2025",
        "title_en": "Top 5 Books I Read in 2025",
        "title_fr": "Mon Top 5 des Livres lus en 2025",
        "date": "2026-01-02",
        "category": "Lifestyle",
        "series": "",
        "series_order": 0,
        "summary_en": "A short review of the best science fiction and fantasy I consumed last year.",
        "summary_fr": "Une courte critique de la meilleure science-fiction et fantasy que j'ai consommée l'année dernière.",
        "content_en": "1. Project Hail Mary\n2. Dune\n...",
        "content_fr": "1. Projet Dernière Chance\n2. Dune\n...",
    },
    {
        "id": "CSS_Grid_Tips",
        "title_en": "CSS Grid: 3 Tips You Didn't Know",
        "title_fr": "CSS Grid : 3 Astuces Que Vous Ignoriez",
        "date": "2026-02-18",
        "category": "Tech",
        "series": "",
        "series_order": 0,
        "summary_en": "Level up your layout game with these hidden CSS Grid properties.",
        "summary_fr": "Améliorez vos mises en page avec ces propriétés cachées de CSS Grid.",
        "content_en": "Using minmax() is a game changer.",
        "content_fr": "Utiliser minmax() change vraiment la donne.",
    },
    {
        "id": "Why_I_Love_Python",
        "title_en": "Why Python Remains My Favorite Language",
        "title_fr": "Pourquoi Python Reste Mon Langage Préféré",
        "date": "2025-11-20",
        "category": "Tech",
        "series": "",
        "series_order": 0,
        "summary_en": "After trying Go and Rust, I still find myself coming back to Python.",
        "summary_fr": "Après avoir essayé Go et Rust, je reviens toujours à Python.",
        "content_en": "It's the pseudo-code like readability.",
        "content_fr": "C'est la lisibilité similaire au pseudo-code.",
    },
    
    # Series: PyXML Chronicles
    {
        "id": "PyXML_Part1",
        "title_en": "The PyXML Chronicles: The Origin",
        "title_fr": "Les Chroniques PyXML : L'Origine",
        "date": "2026-01-10",
        "category": "Tech",
        "series": "pyxml_chronicles",
        "series_order": 1,
        "summary_en": "Why standard SSGs weren't enough.",
        "summary_fr": "Pourquoi les SSG standards ne suffisaient pas.",
        "content_en": "I wanted more control over the DOM generation...",
        "content_fr": "Je voulais plus de contrôle sur la génération du DOM...",
    },
    {
        "id": "PyXML_Part2",
        "title_en": "The PyXML Chronicles: Parsers",
        "title_fr": "Les Chroniques PyXML : Les Parseurs",
        "date": "2026-01-20",
        "category": "Tech",
        "series": "pyxml_chronicles",
        "series_order": 2,
        "summary_en": "Building the dynamic parser system.",
        "summary_fr": "Construction du système de parseurs dynamiques.",
        "content_en": "We use Python's xml.etree...",
        "content_fr": "Nous utilisons xml.etree de Python...",
    },
    {
        "id": "PyXML_Part3",
        "title_en": "The PyXML Chronicles: Context",
        "title_fr": "Les Chroniques PyXML : Le Contexte",
        "date": "2026-02-05",
        "category": "Tech",
        "series": "pyxml_chronicles",
        "series_order": 3,
        "summary_en": "Passing variables through the AST.",
        "summary_fr": "Passer des variables à travers l'AST.",
        "content_en": "Context management is key in templating...",
        "content_fr": "La gestion de contexte est clé dans le templating...",
    },

    # Series: Echoes of the Void
    {
        "id": "Echoes_Part1",
        "title_en": "Echoes of the Void: Departure",
        "title_fr": "Échos du Vide : Le Départ",
        "date": "2025-10-01",
        "category": "Art",
        "series": "echoes_of_the_void",
        "series_order": 1,
        "summary_en": "The ship leaves the orbital station.",
        "summary_fr": "Le vaisseau quitte la station orbitale.",
        "content_en": "The thrusters flared silently against the void.",
        "content_fr": "Les propulseurs se sont allumés silencieusement contre le vide.",
    },
    {
        "id": "Echoes_Part2",
        "title_en": "Echoes of the Void: The Signal",
        "title_fr": "Échos du Vide : Le Signal",
        "date": "2025-10-15",
        "category": "Art",
        "series": "echoes_of_the_void",
        "series_order": 2,
        "summary_en": "A strange transmission is intercepted.",
        "summary_fr": "Une étrange transmission est interceptée.",
        "content_en": "It wasn't static. It was structured.",
        "content_fr": "Ce n'était pas de l'électricité statique. C'était structuré.",
    },
    
    # Random short entries
    {
        "id": "Short_Joke_1",
        "title_en": "Why do programmers prefer dark mode?",
        "title_fr": "Pourquoi les programmeurs préfèrent le mode sombre ?",
        "date": "2026-03-01",
        "category": "Joke",
        "series": "",
        "series_order": 0,
        "summary_en": "A classic tech joke.",
        "summary_fr": "Une blague classique de technologie.",
        "content_en": "Because light attracts bugs.",
        "content_fr": "Parce que la lumière attire les insectes (bugs).",
    },
    {
        "id": "Current_Mood",
        "title_en": "Coffee and Rain",
        "title_fr": "Café et Pluie",
        "date": "2026-04-11",
        "category": "Feeling",
        "series": "",
        "series_order": 0,
        "summary_en": "Sometimes you just need to chill.",
        "summary_fr": "Parfois, il faut juste se détendre.",
        "content_en": "Listening to jazz while coding today.",
        "content_fr": "J'écoute du jazz en codant aujourd'hui.",
    },
]

# Generate more random ones to reach ~20
for i in range(1, 9):
    blogs.append({
        "id": f"Random_Thoughts_{i}",
        "title_en": f"Random Thought #{i}",
        "title_fr": f"Pensée Aléatoire #{i}",
        "date": f"2025-08-0{i}",
        "category": "Lifestyle",
        "series": "",
        "series_order": 0,
        "summary_en": "Just thinking out loud.",
        "summary_fr": "Juste en train de penser à voix haute.",
        "content_en": "This is a random thought.",
        "content_fr": "C'est une pensée aléatoire.",
    })

template = """---
HEADER
---
title_en: "{title_en}"
title_fr: "{title_fr}"
date: "{date}"
author: "Nathan Cerisara"
tags: ["{category}"]
category: "{category}"
summary_en: "{summary_en}"
summary_fr: "{summary_fr}"
{series_line}
---
CONTENT EN
---
{content_en}
---
CONTENT FR
---
{content_fr}
"""

for b in blogs:
    series_line = ""
    if b["series"]:
        series_line = f'series: "{b["series"]}"\nseries_order: {b["series_order"]}'
        
    content = template.format(
        title_en=b["title_en"],
        title_fr=b["title_fr"],
        date=b["date"],
        category=b["category"],
        summary_en=b["summary_en"],
        summary_fr=b["summary_fr"],
        series_line=series_line,
        content_en=b["content_en"],
        content_fr=b["content_fr"]
    )
    
    with open(os.path.join(blog_dir, f'{b["id"]}.md'), "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated {len(blogs)} blog posts.")
