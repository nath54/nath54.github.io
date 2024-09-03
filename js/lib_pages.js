
// Langues par défaut s'il n'y a pas de modules de localization / traduction de page actif
const default_language = "fr";

// Liste des langues supportées par ce module des titres
const supported_languages = ["fr", "en"];

// Liste de toutes les pages {"id_de_la_div": "Titres dans les langues supportées par le site"}
const pages = {
    "page_home": {
        "fr": "Accueil",
        "en": "Home"
    },
    "page_pi": {
        "fr": "Informations Personnelles",
        "en": "Personnal Informations"
    },
    "page_projects": {
        "fr": "Projets",
        "en": "Projects"
    },
    "page_media": {
        "fr": "Flux media",
        "en": "Media Flow"
    }
};

// Fonction pour changer de page
function go_to_page(page_name){
    // Test de si la page existe
    if(pages[page_name] == undefined){
        return;
    }

    // On cache toutes les div
    for(page_id of Object.keys(pages)){
        document.getElementById(page_id).style.display = "none";
    }

    // On affiche juste la bonne div
    document.getElementById(page_name).style.display = "flex";

    // On met à jour le titre
    if(window.current_language == undefined || !supported_languages.includes(window.current_language)){
        // Titre avec langue par défaut
        document.getElementById("title").innerText = pages[page_name][default_language];
    }
    else{
        // Titre dans la langue actuelle de la page
        document.getElementById("title").innerText = pages[page_name][window.current_language];
    }

    // On met à jour les attributs des titres pour assurer la compatibilité avec le module de traduction indépendant
    if(supported_languages.includes("en")){
        document.getElementById("title").dataset.translation_en = pages[page_name]["en"];
    }if(supported_languages.includes("fr")){
        document.getElementById("title").dataset.translation_fr = pages[page_name]["fr"];
    }if(supported_languages.includes("es")){
        document.getElementById("title").dataset.translation_es = pages[page_name]["es"];
    }if(supported_languages.includes("zh")){
        document.getElementById("title").dataset.translation_zh = pages[page_name]["zh"];
    }if(supported_languages.includes("ja")){
        document.getElementById("title").dataset.translation_ja = pages[page_name]["ja"];
    }if(supported_languages.includes("kr")){
        document.getElementById("title").dataset.translation_kr = pages[page_name]["kr"];
    }if(supported_languages.includes("de")){
        document.getElementById("title").dataset.translation_de = pages[page_name]["de"];
    }if(supported_languages.includes("ru")){
        document.getElementById("title").dataset.translation_ru = pages[page_name]["ru"];
    }if(supported_languages.includes("ar")){
        document.getElementById("title").dataset.translation_ar = pages[page_name]["ar"];
    }
}

