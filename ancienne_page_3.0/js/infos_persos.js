
function toggle_visibility(id_div, id_img){
    var div = document.getElementById(id_div);
    var img = document.getElementById(id_img);
    // Cas où la div était cachée
    if(div.style.display == "none"){
        div.style.display = "inherit";
        img.style.transform = "rotate(90deg)";
    }
    // Cas où la div était visible
    else{
        div.style.display = "none";
        img.style.transform = "none";
    }
}
