function export_mode() {
    // Disable header - page
    // Remove all absolute properties
    document.getElementById("header").style.display = "none";
    document.getElementById("main_container").style.position = "initial";
    document.getElementById("main_container").style.top = "";
    document.getElementById("main_container").style.left = "";
    document.getElementById("main_container").style.bottom = "";
    document.getElementById("main_container").style.right = "";
    //
    document.getElementById("main_pages_cv").style.width = "90%";
    //
    document.getElementById("div_projet_academiques").style.marginTop = "60px";
}