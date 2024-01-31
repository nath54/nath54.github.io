// Get the arguments
var url_string = window.location;
console.log(url_string);
var url = new URL(url_string);
var lang = url.searchParams.get("mode");
console.log(lang);

if (lang == "export") {
    export_mode();
}

function export_mode(page_type = 1) {
    // Disable header - page
    // Remove all absolute properties
    document.getElementById("header").style.display = "none";
    document.getElementById("main_container").style.position = "initial";
    document.getElementById("main_container").style.top = "";
    document.getElementById("main_container").style.left = "";
    document.getElementById("main_container").style.bottom = "";
    document.getElementById("main_container").style.right = "";
    //
    if (page_type == 1) {
        document.getElementById("main_pages_cv").style.width = "90%";
    } else {
        document.getElementById("main_pages_cv").style.width = "100%";
    }
    //
    document.getElementById("div_projet_academiques").style.marginTop = "60px";
}