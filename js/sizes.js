
//
const sizes = ["css/size_small.css", "css/size_normal.css", "css/size_large.css"];

//
window.current_size = 1;


//
function changeSize(){
    //
    window.current_size = (window.current_size + 1) % sizes.length;
    //
    document.getElementById("css_size_link").href = sizes[window.current_size];
}



