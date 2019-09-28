canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");


tex=600;
tey=500;

iball=document.getElementById("ball");
iterrain=document.getElementById("terrain");

var rects=[[38,0,8,47],[44,40,8,4],[66,40,5,4],[254,0,8,47],[226,40,5,4],[251,40,4,4]];
for( r of rects) r[1]+=tey-369

var dt=new Date();
var dframe=dt.getTime();
var tframe=10;
var g=0.1;  //force gravité
var fr=0.6; //facteur rebondissement
var fpvf=0.75; //facteur perte de vitesse frottements

var bpx=tex/2;
var bpy=tey/2;
var btx=25;
var bty=25;
var vitx=-10+Math.random()*20;
var vity=-10+Math.random()*20;
var chemb=[];
var encour=true;

function initialise(){
	bpx=tex/2;
	bpy=tey/2;
	btx=25;
	bty=25;
	vitx=-10+Math.random()*20;
	vity=-10+Math.random()*20;
	chemb=[];
}

function collide(o1,o2){
    if ((o1.y > o2.y) && (o1.y < o2.y + o2.h)) {
        return 'top'; // o1's top border collided with o2's bottom border
    }
    if ((o2.y > o1.y) && (o2.y < o1.y + o1.h)) {
        return 'bottom'; // o2's top border collided with o1's bottom border
    }
    if ((o1.x > o2.x) && (o1.x < o2.x + o2.w)) {
        return 'left'; // o1's top border collided with o2's bottom border
    }
    if ((o2.x > o1.x) && (o2.x < o1.x + o1.w)) {
        return 'right'; // o2's top border collided with o1's bottom border
    }
    return null;
}

function tc(){
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
		var rect1 = {x: bpx, y: bpy, width: btx, height: bty}
        var rect2 = {x: r[0], y: r[1], width: r[2], height: r[3]}
        var c=collide( rect1 , rect2 );
        if( c!= null ) alert(c);
        if(c=='bottom' || c=='top'){
        	vity=-vity*fr;
            vitx=vitx*fpvf;
        }
        if(c=='left' || c=='right'){
        	vitx=-vitx*fr;
            vity=vity*fpvf;
        }
	}
}

function balleupdate(){
	vity+=g;
	tc();
    bpx=bpx+vitx;
	bpy=bpy+vity;
	chemb.push( [bpx,bpy] );
}

function aff(){
	ctx.fillStyle="rgb(255,255,255)";
	ctx.fillRect(0,0,tex,tey);
	ctx.drawImage( iterrain, 0, tey-369, tex, 369);
	ctx.drawImage( iball, bpx, bpy, btx, bty);
	ctx.fillStyle="rgb(0,0,255)";
	for( r of rects ) ctx.fillRect( r[0], r[1] , r[2] , r[3] );
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
