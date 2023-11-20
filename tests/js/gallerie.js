

/*
        d1
        <div class="button_slop bg_color1 p_s1" onclick="window.location.href='page_informations_personnelles.html'">
            d2
            <div class="row vertical_center">
                <!-- Image -->
                d3i
                <div class="mr_s1"> //
                    img
                    <img src="res/icon_infos_persos.png" class="icon_button_slop" />
                </div>
                <!-- Texte -->
                d4
                <div class="col">
                    <!-- Titre button -->
                    d5
                    <div>
                        <span>Informations Personnelles</span>
                    </div>

                    <!-- Details button -->
                    d6
                    <div>
                        <i class="ml_s1 small_font">Bio, CV, ...</i>
                    </div>

                </div>
            </div>
        </div>
*/

function create_button(icon, name, description){
    var d1 = create_element("div", classes=["button_slop", "bg_color1", "p_s1"], attributes={"onclick": `window.location.href='page_g_album.html?album=${name}';`});
    var d2 = create_element("div", classes=["row", "vertical_center"]);
    var d3i = create_element("div", classes=["mr_s1"]);
    if(icon == ""){
        var img = create_element("img", classes=["icon_button_slop"], {}, src="res/default_album.png");
    }
    else{
        var img = create_element("img", classes=["icon_button_slop"], {}, src=icon);
    }
    d3i.appendChild(img);
    var d4 = create_element("div", classes=["col"]);
    var d5 = create_element("div");
    var span = create_element("span", [], {}, "", txt=name);
    d5.appendChild(span);
    var d6 = create_element("div");
    var i = create_element("i", classes = ["ml_s1", "small_font"], {}, "", txt=description);
    d6.appendChild(i);
    d4.appendChild(d5);
    d4.appendChild(d6);
    d2.appendChild(d3i);
    d2.appendChild(d4);
    d1.appendChild(d2);
    //
    return d1;
}

var button_containers = document.getElementById("buttons_container");



for (const [album_name, album_data] of Object.entries(data_gallerie)) {
    // On récupère les infos
    var icon = album_data["icon"];
    var description = album_data["description"];
    // On crée le bouton
    var div_button = create_button(icon, album_name, description);
    // On l'ajoute à la page
    button_containers.appendChild(div_button);
}
  
