

// On récupère les arguments
var album_name = getAllUrlParams()["album"];

if(album_name == undefined){
    window.location.href = "page_gallerie.html";
}

var data_album = data_gallerie[album_name];
console.log("Data album : ", data_album);
var album = data_album["album"];
var icon = data_album["icon"];
var description = data_album["description"];

var album_titre = document.getElementById("album_titre");
var album_desc = document.getElementById("album_description");
var album_container = document.getElementById("album_container");

album_titre.innerText = "Album : "+album_name;
album_desc.innerText = description;

album.forEach(image => {
    var cover_url = image["img"];
    if(image["img_small"] != ""){
        cover_url = image["img_small"];
    }
    //
    var im = create_element("img", ["img_album", "m_s1"], {}, cover_url);
    album_container.appendChild(im);
});


