// Get the arguments
var current_url_string = window.location;
var url = new URL(current_url_string);
var lang = url.searchParams.get("lang");

//
const languages = {
    "fr": "Français",
    "en": "Anglais"
};
const lkeys = Object.keys(languages);

//
if (Object.keys(languages).includes(lang)) {
    window.current_language = lang;
} else {
    window.current_language = "fr";
}

//
function url_language() {
    if (window.current_language) {
        return "?lang=" + window.current_language;
    } else {
        return "";
    }
}

//
function switch_language() {
    // Determine new Language
    if(!window.current_language){
        window.current_language = "en";
    }
    else{
        var i = lkeys.indexOf(window.current_language);
        window.current_language = lkeys[ (i+1) % lkeys.length ];
    }

    // Translate the page
    translate_page();
}


function translate_page() {    
    //
    var elt_list = document.getElementsByClassName("to_translate");
    for (element of elt_list) {
        if (window.current_language == "en" && element.dataset.translation_en != undefined) {
            element.innerText = element.dataset.translation_en;
        }
        else if (window.current_language == "fr" && element.dataset.translation_fr != undefined) {
            element.innerText = element.dataset.translation_fr;
        }
    }
}