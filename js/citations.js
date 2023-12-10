
var idc = parseInt(Math.random()*data_citations.length);

document.getElementById("citation").innerText = "\""+data_citations[idc]["citation"]+"\"";
if(data_citations[idc]["auteur"] == ""){
    document.getElementById("citation_auteur").innerText = " - chatGPT";
}
else{
    document.getElementById("citation_auteur").innerText = " - "+data_citations[idc]["auteur"];
}
