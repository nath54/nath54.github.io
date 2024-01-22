// Get the arguments
var url_string = window.location;
console.log(url_string);
var url = new URL(url_string);
var lang = url.searchParams.get("lang");
console.log(lang);

if (lang == "en") {
    window.current_language = "en";
} else {
    window.current_language = "fr";
}

function url_language() {
    if (window.current_language) {
        return "?lang=" + window.current_language;
    } else {
        return "";
    }
}

function switch_language() {
    var url_string = window.location.href;
    console.log(url_string);
    var url = new URL(url_string);
    var lang = url.searchParams.get("lang");
    if (lang) {
        if (lang == "en") {
            window.current_language = "fr";
            url_string = url_string.replace("lang=en", "lang=fr");
            window.location.href = url_string;
        } else {
            window.current_language = "en";
            url_string = url_string.replace("lang=fr", "lang=en");
            window.location.href = url_string;
        }
    } else {
        window.current_language = "en";
        url_string += "?lang=en";
        window.location.href = url_string;
    }
}

function translate(elt, translation) {
    console.log("Looking to translate ", elt, " with ", translation);
    if (window.current_language == "en") {
        elt.innerText = translation;
    }
}

console.log("Ready!");

function translate_page() {
    if (window.current_language == "en") {
        document.getElementById("bt_lang").style.backgroundImage = 'url("res/bt_en_to_fr.png")';
        //
        var elt_list = document.getElementsByClassName("to_translate");
        for (element of elt_list) {
            element.innerText = element.dataset.translation;
        }
    }
}