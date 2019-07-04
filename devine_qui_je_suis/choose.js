
var imgs_p=["1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png","9.png","10.png","11.png","12.png","13.png","14.png","15.png","16.png","17.png","18.png","19.png","20.png","21.png","22.png","23.png","24.png","25.png","26.png","27.png","28.png","29.png","30.png","31.png","32.png"];

var imgs=[document.getElementById("img1"),document.getElementById("img2"),document.getElementById("img3"),document.getElementById("img4"),document.getElementById("img5"),document.getElementById("img6"),document.getElementById("img7"),document.getElementById("img8"),document.getElementById("img9"),document.getElementById("img10"),document.getElementById("img11"),document.getElementById("img12"),document.getElementById("img13"),document.getElementById("img14"),document.getElementById("img15"),document.getElementById("img16"),document.getElementById("img17"),document.getElementById("img18"),document.getElementById("img19"),document.getElementById("img20"),document.getElementById("img21"),document.getElementById("img22"),document.getElementById("img23"),document.getElementById("img24"),document.getElementById("img25"),document.getElementById("img26"),document.getElementById("img27"),document.getElementById("img28"),document.getElementById("img29"),document.getElementById("img30"),document.getElementById("img31"),document.getElementById("img32")];
var isaff=[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];

var noms1=["Superman","Batman","Wonder Woman","Flash","Green Lantern","Aquaman","Captain Marvel","Green Arrow","Hulk","Thor","Iron Man","Ant Man","Captain America","Spider Man","Wolverine","Le Cyclope","Iceberg","Angel","Le Fauve","La Torche","La chose","Le Surfer D'argent","Deadpool","Le Joker","Lex Luthor","Venom","Dr Octopus","Le bouffon vert","Magneto","Thanos","Loki","Dr Fatalis"];
var noms2=["Emmanuel Macron","Nicolas Sarkozy","Francois Hollande","Marine LePen","Jean Luc Melanchon","Francois Fillon","Manuel Valls","Jacque Chirac","Donald Trump","Ségolène Royal","Marion Maréchal","Francois Mitterand","Barack Obama","Vladimir Poutine","Martine Aubry","Angela Merkel","Nadine Morano","Adolf Hitler","Charles de Gaulle","Benito Mussolini","Joseph Staline","Winston Churchill","Louis XIV","Louis XVI","Elisabeth II","Kim Joung-Un","Felipe VI","Édouard Philippe","Jules Cesar","Charlemagne","Jules Ferry","Valerie Giscard D'estaing"];
var noms3=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32"];
var noms4=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32"];
var noms5=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32"];
var noms6=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32"];
var dimgs="images/";
var cats=[["images/superheros/",noms1],["images/politique/",noms2]];

var texte="Quelle categorie voulez vous ? \n\
    0-super-heros \n\
    1-politiques \n\
tapez le numero pour choisir la categorie que vous voulez. \n\
Si vous tapez autre chose, ce sera la premiere categorie qui sera prise.";

var valeur = prompt(texte);
var bc=parseInt(valeur);
if(bc in [0,1]){
    nbc=bc;
}
else
{
    alert("La categorie par défaut a été prise")
    nbc=0;
}

var dimgp=cats[nbc][0];
var noms_p=cats[nbc][1];

var choisi=false;

function Aff_Image(i)
{
    if(isaff[i])
    {
        imgs[i].setAttribute("src",dimgp+imgs_p[i]);
    }
    else
    {
        imgs[i].setAttribute("src",dimgs+"dos1.png");
    }
    
}

for(x=0;x<32;x++)
{
    Aff_Image(x);
    imgs[x].setAttribute("text",noms_p[x])
}

function ChooseCard(nb)
{
    if(choisi==false)
    {
        choisi=true;
        document.getElementById("choosed").setAttribute("src",dimgp+imgs_p[nb]);
        texte="Vous avez choisi : "+noms_p[nb];
        alert(texte);
        document.getElementById("texte").innerHTML = texte ;
    }
}







