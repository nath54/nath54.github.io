
/*
            CALCUL DE MON AGE
*/


var age=document.getElementById("datenaissance");

var dt=new Date();
var monmois=dt.getMonth();
var monan=dt.getFullYear();
var monjour=dt.getDate();

//alert(monan+" "+monmois+" "+monjour);

var annais=2003
var moisnais=11
var journais=23

var monage=monan-annais
if(monmois<moisnais){
    monage-=1;
}
else if(monmois==moisnais && monjour<journais){
    monage-=1;
}

age.innerHTML=monage


/*

*/


