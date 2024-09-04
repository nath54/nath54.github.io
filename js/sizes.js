// Get the arguments
var current_url_string = window.location;
var url = new URL(current_url_string);
var size = url.searchParams.get("size") || localStorage.getItem("size") || 1;

//
const sizes = ["css/size_small.css", "css/size_normal.css", "css/size_large.css"];

//

if(size != undefined && size >= 0 && size < sizes.length){
    window.current_size = parseInt(size);
}
else{
    window.current_size = 1;
}

//
function setSize(){
    //
    document.getElementById("css_size_link").href = sizes[window.current_size];
}


//
function changeSize(){
    //
    window.current_size = (window.current_size + 1) % sizes.length;
    //
    localStorage.setItem("size", window.current_size);
    //
    setSize();
}



