
//
const data_states = {
    0: "not started",
    1: "prototyped",
    2: "in development",
    3: "in development - beta version",
    4: "done"
};

//
const states_icon_svgs = {
    0: `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle class="stroke_status_0" cx="100" cy="100" r="92" fill="none" stroke="black" stroke-width="8"></circle>
  <line x1="42" y1="40" x2="162" y2="160" stroke="#0000007f" stroke-width="8"></line>
  <line x1="42" y1="160" x2="162" y2="40" stroke="#0000007f" stroke-width="8"></line>
  <line class="stroke_status_0" x1="40" y1="40" x2="160" y2="160" stroke="#000000" stroke-width="8"></line>
  <line class="stroke_status_0" x1="40" y1="160" x2="160" y2="40" stroke="#000000" stroke-width="8"></line>
</svg>`,
    1: `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle class="stroke_status_1" cx="100" cy="100" r="92" fill="none" stroke="black" stroke-width="8"></circle>
  <line class="stroke_status_1" x1="100" y1="20" x2="100" y2="180" stroke="#000000" stroke-width="8" />
  <line class="stroke_status_1" x1="20" y1="100" x2="180" y2="100" stroke="#000000" stroke-width="8" />
  <line class="stroke_status_1" x1="45" y1="45" x2="155" y2="155" stroke="#000000" stroke-width="8" />
  <line class="stroke_status_1" x1="45" y1="155" x2="155" y2="45" stroke="#000000" stroke-width="8" />
</svg>`,
    2: `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle class="stroke_status_2" cx="100" cy="100" r="92" fill="none" stroke="black" stroke-width="8"></circle>
  <path class="stroke_status_2" d="M 50 100 C 50 60 100 60 100 100 C 100 140 150 140 150 100 " fill="none" stroke="black" stroke-width="10"></path>
</svg>`,
    3: `<svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle class="stroke_status_3" cx="100" cy="100" r="92" fill="none" stroke="black" stroke-width="8"></circle>
  <path class="stroke_status_3" d="M 50 100 C 50 60 100 60 100 100 C 100 140 150 140 150 100 " fill="none" stroke="black" stroke-width="10"></path>
</svg>`,
    4: ``
}

/*

#!# Project Syntax #!#



*/





//
const project_nalang = {
    "name": "NaLang",
    "description": {
        "en": "A little app to learn new languages.",
        "fr": "Une petite application pour apprendre de nouvelles langues.",
    },
    "made_by": "Nathan Cerisara",
    "made_with": "Godot Engine",
    "icon": "data/data_projects/icons/icon_NaLang.svg",
    "state": 3,
    "roadmap": [
        {
            "fr": "Fiche de vocabulaire custom pour les utilisateurs.",
            "en": "Custom vocabulary sheet for users."
        },
        {
            "fr": "Ajout d'exercices.",
            "en": "Adding exercices."
        },
        {
            "fr": "Bon module de text2speech multilangue sur toutes les plateformes d'exportation.",
            "en": "Good multilingual text2speech module on all export platforms."
        },
        {
            "fr": "Guide des leçons.",
            "en": "Lessons guide."
        }
    ],
    "links": {
        "github": "https://github.com/nath54/NaLang"
    }
};

//
const project_neavity_libs = {
    "name": "Neavity Libs",
    "description": {
        "en": "Python & WebApp libs and tools for AI and creativity with templates.",
        "fr": "Librairies & Outils en Python et WebApp pour l'IA et de la créativité avec des templates.",
    },
    "made_by": "Nathan Cerisara",
    "made_with": "Python/HTML/JS/CSS",
    "icon": "data/data_projects/icons/no_icon.svg",
    "state": 2,
    "roadmap": {
    }
};

//
const project_napp_engine = {
    "name": "Napp Engine",
    "description": {
        "en": "C++ graphical app engine with android compilation support.",
        "fr": "Moteur d'applications graphiques en C++ avec support pour compilation android.",
    },
    "made_by": "Nathan Cerisara",
    "made_with": "C++",
    "icon": "data/data_projects/icons/no_icon.svg",
    "state": 0,
    "roadmap": {
    }
};

//
const project_nadot = {
    "name": "Nadot",
    "description": {
        "en": "An abstraction layer above the Godot Engine for easier game dev.",
        "fr": "Une couche d'abstraction au-dessus de Godot Engine pour un développement de jeux-vidéos plus facile.",
    },
    "made_by": "Nathan Cerisara",
    "made_with": "Godot Engine",
    "icon": "data/data_projects/icons/no_icon.svg",
    "state": 0,
    "roadmap": {
    }
};

//
const project_napu = {
    "name": "NaPU",
    "description": {
        "en": "Processing Units (CPU, GPU, NPU, ...) creator, optimiser and simulator.",
        "fr": "Créateur, Optimiseur et Simulateur d'Unités de Calculs (CPU, GPU, NPU, ...).",
    },
    "made_by": "Nathan Cerisara",
    "made_with": "Python/HTML/JS/CSS",
    "icon": "data/data_projects/icons/no_icon.svg",
    "state": 0,
    "roadmap": {
    }
};

//
const project_namath = {
    "name": "NaMath",
    "description": {
        "en": "A python formal calculator engine.",
        "fr": "Moteur de calcul formel en python.",
    },
    "made_by": "Nathan Cerisara",
    "made_with": "Python",
    "icon": "data/data_projects/icons/no_icon.svg",
    "state": 1,
    "roadmap": {
    },
    "links": {
        "github": "https://github.com/nath54/calc_engine"
    }
};

//
const project_nai_gamemaster = {
    "name": "NAI GameMaster",
    "description": {
        "en": "An AI roleplaying WebApp made with Neavity Libs.",
        "fr": "Une WebApp pour du jeu de rôle par IA fait avec Neavity Libs.",
    },
    "made_by": "Nathan Cerisara",
    "made_with": "Python/HTML/JS/CSS",
    "icon": "data/data_projects/icons/no_icon.svg",
    "state": 0,
    "roadmap": {
    }
};

//
const project_nusic = {
    "name": "Nusic",
    "description": {
        "en": "A music creator app with easy and unified partitions system.",
        "fr": "Une application de création de musique avec un système de partitions unifiées.",
    },
    "made_by": "Nathan Cerisara",
    "made_with": "?",
    "icon": "data/data_projects/icons/no_icon.svg",
    "state": 0,
    "roadmap": {
    }
};

//
const project_dedale_llm = {
    "name": "Dedale LLM",
    "description": {
        "en": "An approach to MoE LLM with Python & Pytorch.",
        "fr": "Une approche aux LLM MoE avec Python & Pytorch.",
    },
    "made_by": "Nathan Cerisara",
    "made_with": "Python/Pytorch",
    "icon": "data/data_projects/icons/no_icon.svg",
    "state": 1,
    "roadmap": {
    },
    "links": {
        "github": "https://github.com/nath54/Dedale_LLM"
    }
};






//
const projects = [
    project_nalang,
    project_neavity_libs,
    project_napp_engine,
    project_napu,
    project_namath,
    project_nai_gamemaster,
    project_nadot,
    project_nusic,
    project_dedale_llm
];