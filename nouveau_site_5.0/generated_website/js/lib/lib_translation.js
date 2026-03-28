// --- Get the arguments ---

// Get the current url string of the html page
var current_url_string = window.location;

// Instantiate an url object from the url string to access the arguments (the object parses the url string)
var url = new URL(current_url_string);

// Get the language from the url arguments, or from the local storage, or default to "fr"
var lang = url.searchParams.get("lang") || localStorage.getItem("lang") || "fr";

// Prepare the languages object and the list of keys
const languages = {
    "fr": "Français",
    "en": "Anglais"
};

// Get the list of keys (-> ["fr", "en"])
const lkeys = Object.keys(languages);

// Set the current language if the language is valid, else default to "en"
if (Object.keys(languages).includes(lang)) {
    window.current_language = lang;
} else {
    window.current_language = "en";
}

// That function returns the current language as a url argument (e.g. "?lang=en")
function url_language() {
    // If the current language is "en", return "?lang=en"
    if (window.current_language == "en") {
        return "?lang=en";
    }
    // If the current language is "fr", return "?lang=fr"
    else if (window.current_language == "fr") {
        return "?lang=fr";
    }
    // Otherwise, return "" (default to "en")
    else {
        return "";
    }
}

// Translate the page on load
document.addEventListener('DOMContentLoaded', () => {
    translate_page();
});

// That function switches the current language to the next one in the list (e.g. "fr" -> "en" -> "fr" -> ...)
// and updates the local storage and the page
function switch_language() {
    // Determine new Language
    if (!window.current_language) {
        window.current_language = "fr";
    }
    else {
        var i = lkeys.indexOf(window.current_language);
        window.current_language = lkeys[(i + 1) % lkeys.length];
    }

    // Update the local storage
    localStorage.setItem("lang", window.current_language);

    // Translate the page
    translate_page();
}


// That function translates the page
function translate_page() {

    // There are 2 types of translation actions:
    // 1. Update the text content of the HTML nodes that have the class "to_translate"
    // 2. Update the visibility of the HTML nodes that have a class "translation_visibility" and a data attribute "data-langcode"
    //    - If the data-langcode is the same as the current language, the node is visible
    //    - If the data-langcode is different from the current language, the node is hidden

    // --- Translation 1 (to_translate) ---

    // Get all the elements with the class "to_translate"
    var elt_list = document.getElementsByClassName("to_translate");
    // For each element, translate it to the current language
    for (element of elt_list) {
        if (window.current_language == "en" && element.dataset.translation_en != undefined) {
            // element.innerText = element.dataset.translation_en;
            element.innerHTML = element.dataset.translation_en;
        }
        else if (window.current_language == "fr" && element.dataset.translation_fr != undefined) {
            // element.innerText = element.dataset.translation_fr;
            element.innerHTML = element.dataset.translation_fr;
        }
    }

    // --- Translation 2 (translation_visibility) ---

    // Get all the elements with the class "translation_visibility"
    var elt_list = document.getElementsByClassName("translation_visibility");

    // For each element, update its visibility based on the current language
    for (element of elt_list) {
        if (element.dataset.langcode == window.current_language) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    }
}