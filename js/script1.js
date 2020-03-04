
var age=document.getElementById("datenaissance");

var dt=new Date();
var monage=parseInt((parseInt(dt.getTime()/1000/3600/24)-(365.25-8))/365.25)


age.innerHTML=monage

