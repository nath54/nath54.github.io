// Get the arguments
var current_url_string = window.location;
var url = new URL(current_url_string);
var theme = url.searchParams.get("theme") || localStorage.getItem("theme") || 0;

//
const themes = ["css/theme_light.css", "css/theme_dark.css", "css/theme_grayscale.css", "css/theme_grayscale_inversed.css"];

//

if(theme != undefined && theme >= 0 && theme < themes.length){
    window.current_theme = parseInt(theme);
}
else{
    window.current_theme = 0;
}

//
function setTheme(){
    //
    document.getElementById("css_theme_link").href = themes[window.current_theme];
}

//
function changeTheme(){
    //
    window.current_theme = (window.current_theme + 1) % themes.length;
    //
    localStorage.setItem("theme", window.current_theme);
    //
    setTheme();
}



