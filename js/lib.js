
// Pour retourner à la page d'accueil
function go_home() {
    window.location.href = "index.html" + url_language();
}

// Pour simplifier l'écriture de certaines fonctions
function create_element(type = "div", classes = [], attributes = {}, src = "", txt = "") {
    var node = document.createElement(type);
    //
    classes.forEach(class_name => {
        node.classList.add(class_name);
    });
    //

    for (const [attr_key, attr_prop] of Object.entries(attributes)) {
        node.setAttribute(attr_key, attr_prop);
    }
    //
    if (src != "") {
        node.src = src;
    }
    //
    if (txt != "") {
        node.innerText = txt;
    }
    //
    return node;
}

// Pour récupérer les paramètres des arguments
// Source : https://www.sitepoint.com/get-url-parameters-with-javascript/
function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}

// Pour changer la visibilité d'un élément
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

//
function HtmlEncode(s)
{
  var el = document.createElement("span");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}


//
function exportCurrentParamsToUrl(){
    var res = "";
    // Current Language
    if(window.current_language != undefined){
        res += "lang="+HtmlEncode(window.current_language)
    }
    // Current Theme
    if(window.current_theme != undefined){
        if(res != ""){
            res += "&"
        }
        res += "theme="+HtmlEncode(window.current_theme)
    }
    // Current Size
    if(window.current_size != undefined){
        if(res != ""){
            res += "&"
        }
        res += "size="+HtmlEncode(window.current_size)
    }
    //
    if(res != ""){
        res = "?" + res;
    }
    return res;
}


