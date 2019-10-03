canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");


tex=600;
tey=500;

iball=document.getElementById("ball");
iterrain=document.getElementById("terrain");

var rects=[ [72,2,22,99] , [137,78,9,11] , [503,2,23,102] , [453,75,10,12] ];
for( r of rects) r[1]+=tey-369;

var pansr=[ [110,85,20,2] , [470,85,20,2] ];
for( r of pansr) r[1]+=tey-369;

var dt=new Date();
var dframe=dt.getTime();
var tframe=10;
var g=0.2;  //force gravité
var fr=0.6; //facteur rebondissement
var fpvf=0.75; //facteur perte de vitesse frottements

var tscore=1500;
var dscore=dt.getTime();
var score1=0;
var score2=0;
var bpx=tex/2;
var bpy=tey/2;
var btx=25;
var bty=25;
var vitx=-10+Math.random()*20;
var vity=-10+Math.random()*20;
var chemb=[];
var encour=true;

function initialise(v){
	bpx=tex/2;
	bpy=tey/2;
	btx=25;
	bty=25;
	if(v==0){
	    vitx=-10+Math.random()*20;
	    vity=-5+Math.random()*-10;
	}
	else if (v==1){
		vitx=1+Math.random()*10;
	    vity=-5+Math.random()*-10;
	}
	else if (v==2){
		vitx=-1+Math.random()*-10;
	    vity=-5+Math.random()*-10;
	}
	chemb=[];
}

function collide(a,b){
    var cc=[];
    if( a.px < b.px && a.px + a.tx > b.px && a.py < b.py && a.py+a.ty > b.py+b.ty ) cc=["right"];
    else if( a.px > b.px && a.px+a.tx < b.px+b.tx && a.py < b.py && a.py+a.ty > b.py+b.ty ) cc=["left"];
    else if( a.px < b.px && a.px+a.tx > b.px+b.tx && a.py>b.py && a.py < b.py+b.ty ) cc=["top"];
    else if( a.px < b.px && a.px+a.tx > b.px+b.tx && a.py+a.ty > b.py && a.py+a.ty < b.py+b.ty ) cc=["bottom"];
    else if( a.px > b.px && a.py > b.py && a.px < b.px+b.tx && a.py < b.py+b.ty ) cc=["top","left"];
    else if( a.px+a.tx > b.px && a.px+a.tx < b.px+b.tx && a.py > b.py && a.py < b.py+b.ty ) cc=["top","right"];
    else if( a.px > b.px && a.px < b.px+b.tx && a.py+a.ty > b.py && a.py+a.ty < b.py+b.ty ) cc=["bottom","left"];
    else if( a.px+a.tx > b.px && a.px+a.tx < b.px+b.tx && a.py+a.ty > b.py && a.py+a.ty < b.py+b.ty ) cc=["bottom","right"];
    return cc;
}

function tc(){
    var dt=new Date();
	//y
	if( bpy+bty>tey ){
	    bpy=tey-bty;
	    vity=-vity*fr;
	    vitx=vitx*fpvf;
	}
	//x
	if( bpx<0 ){
	    bpx=0;
	    vitx=-vitx*fr;
	    vity=vity*fpvf;
	}
	else if( bpx+btx>tex ){
	    bpx=tex-btx;
	    vitx=-vitx*fr;
	    vity=vity*fpvf;
	}
	for( r of rects ){
		var rect2 = {px: bpx, py: bpy, tx: btx, ty: bty}
        var rect1 = {px: r[0], py: r[1], tx: r[2], ty: r[3]}
        var cc=collide( rect1 , rect2 );
        for( c of cc ){
            if(c=='bottom'){
                pby=r[1]+r[3]+1
            	vity=-vity*fr;
                vitx=vitx*fpvf;
            }
            if(c=='top'){
                pby=r[1]-bty-1
            	vity=-vity*fr;
                vitx=vitx*fpvf;
            }
            if(c=='left'){
                bpx=r[0]-btx-1
            	vitx=-vitx*fr;
                vity=vity*fpvf;
            }
            if(c=='right'){
                bpx=r[0]+r[2]+1
            	vitx=-vitx*fr;
                vity=vity*fpvf;
            }
        }
	}
	for( r of pansr ){
		var rect2 = {px: bpx, py: bpy, tx: btx, ty: bty}
        var rect1 = {px: r[0], py: r[1], tx: r[2], ty: r[3]}
        var cc=collide( rect1 , rect2 );
        if( cc.length > 0 && dt.getTime()-dscore>=tscore){
            dscore=dt.getTime();
            if( pansr.indexOf(r)==0 ) score1=score1+1
            else score2=score2+1
        }
    }
}

function balleupdate(){
	vity+=g;
	tc();
    bpx=bpx+vitx;
	bpy=bpy+vity;
	chemb.push( [bpx+btx/2,bpy+bty/2] );
}

function aff(){
	ctx.fillStyle="rgb(255,255,255)";
	ctx.fillRect(0,0,tex,tey);
	ctx.drawImage( iterrain, 0, tey-369, tex, 369);
	ctx.drawImage( iball, bpx, bpy, btx, bty);
	ctx.strokeStyle="rgb(0,0,0)";
	ctx.font = "30px Arial";
    ctx.strokeText(score1, 115, 120);
    ctx.strokeText(score2, 475, 120);
	//ctx.fillStyle="rgb(0,0,255)";
	//for( r of rects ) ctx.fillRect( r[0], r[1] , r[2] , r[3] );
	//ctx.fillStyle="rgb(0,255,0)";
	//for( r of pansr ) ctx.fillRect( r[0], r[1] , r[2] , r[3] );
    ctx.strokeStyle="rgb(0,100,0)";
	ctx.beginPath();
	var a=0;
	for( c of chemb ){
		if( a==0 ){
			ctx.moveTo( c[0] , c[1] );
		}
		else{
			ctx.lineTo( c[0] , c[1] );
		}
		a+=1;
	}
	ctx.stroke();
	ctx.closePath();
}

function tir(){
	initialise();
	function boucle(){
		var dt=new Date();
		if(dt.getTime()-dframe>=tframe){
			dframe=dt.getTime();
			balleupdate();
			aff();
		}
		if(encour) window.requestAnimationFrame( boucle );
	}
	window.requestAnimationFrame( boucle );
}

tir();

//alert("Tout va bien,pour l'instant, il n'y a pas de bugs ;)");