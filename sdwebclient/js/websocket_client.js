window.websocket = null; // On prépare la variable globale

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
  }
  
  function decode_utf8(s) {
    return decodeURIComponent(escape(s));
  }

function start_websocket(IP,PORT) {
    console.log("Trying to connect to : "+IP+":"+PORT+"/");
    // On se connecte au websocket
    window.websocket = new WebSocket("wss://" + IP + ":" + PORT + "/");

    // Quand il y a des erreurs
    window.websocket.onerror = function() {
        // On affiche un message d'erreur
        alert("There was an error during connection");
        // On peut aussi renvoyer vers la page d'accueil
        window.location.href = "index.html";
    };

    // On relie le websocket a notre fonction qui gere les messages recus
    window.websocket.onmessage = on_message;

    // On attent qu'il soit pret
    window.websocket.onopen = launch;
}

// Fonction pour envoyer des messages
function ws_send(message) {
    // On convertit en json
    message = JSON.stringify(message);
    // On envoie le message
    window.websocket.send(message);
}

function on_message(event) {
    // On recoit les informations
    var data = JSON.parse(event.data);
    if(typeof(data)=="string"){
        data = JSON.parse(data);
    }
    console.log("get message : ", data);
    // On traite les informations
    if(data["action"] != undefined){
        switch (data["action"]) {
            case "message":
                var pid = data.pid;
                alert(data.txt);
                break;
            case "error_generating_image_t2i":
                var pid = data.pid;
                document.getElementById("button_t2i").style.display = "none";
                document.getElementById("sending_informations_t2i").style.display = "none";
                document.getElementById("generating_t2i").style.display = "none";
                document.getElementById("error_t2i").style.display = "block";
                document.getElementById("generated_t2i").style.display = "none";
                window.state = 0;
                break;
            case "error_generating_image_i2i":
                var pid = data.pid;
                document.getElementById("button_i2i").style.display = "none";
                document.getElementById("sending_informations_i2i").style.display = "none";
                document.getElementById("generating_i2i").style.display = "none";
                document.getElementById("error_i2i").style.display = "block";
                document.getElementById("generated_i2i").style.display = "none";
                window.state = 0;
                break;
            case "t2i_generated":
                var pid = data.pid;
                var imgs = data.imgs;
                aff_imgs(imgs);
                //
                document.getElementById("button_t2i").style.display = "none";
                document.getElementById("sending_informations_t2i").style.display = "none";
                document.getElementById("generating_t2i").style.display = "none";
                document.getElementById("error_t2i").style.display = "none";
                document.getElementById("generated_t2i").style.display = "block";  
                window.state = 0;              
                break;
            case "i2i_generated":
                var pid = data.pid;
                var imgs = data.imgs;
                aff_imgs(imgs);
                document.getElementById("button_i2i").style.display = "none";
                document.getElementById("sending_informations_i2i").style.display = "none";
                document.getElementById("generating_i2i").style.display = "none";
                document.getElementById("error_i2i").style.display = "none";
                document.getElementById("generated_i2i").style.display = "block";
                window.state = 0;
                break;
            case "generating_txt2img":
                var pid = data.pid;
                document.getElementById("button_t2i").style.display = "none";
                document.getElementById("sending_informations_t2i").style.display = "none";
                document.getElementById("generating_t2i").style.display = "flex";
                document.getElementById("error_t2i").style.display = "none";
                document.getElementById("generated_t2i").style.display = "none";
                window.state = 1;
                break;
            case "generating_img2img":
                var pid = data.pid;
                document.getElementById("button_i2i").style.display = "none";
                document.getElementById("sending_informations_i2i").style.display = "none";
                document.getElementById("generating_i2i").style.display = "flex";
                document.getElementById("error_i2i").style.display = "none";
                document.getElementById("generated_i2i").style.display = "none";
                window.state = 1;
                break;
            default:
                // Il faut faire attention aux types d'actions que l'on gère
                // Et ne pas oublier les "break;" à la fin de chaque cas
                console.error("unsupported event", data);
        }
    }
    else{
        console.error("Not supported event", data);   
    }
}



function launch(){
    console.log("Connected !");
}