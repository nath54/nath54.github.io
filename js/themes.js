
//
const themes = ["css/theme_light.css", "css/theme_dark.css", "css/theme_grayscale.css", "css/theme_grayscale_inversed.css"];

//
window.current_theme = 0;


//
function changeTheme(){
    //
    window.current_theme = (window.current_theme + 1) % themes.length;
    //
    document.getElementById("css_theme_link").href = themes[window.current_theme];
}



