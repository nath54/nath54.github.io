canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");

var dt=new Date();

var tex=300;
var tey=350;
var affevlim=5;

var pvie_tot=5;
var pvie=pvie_tot;
var pscore=0;
var ptx=60;
var pty=60;
var ppx=120;
var ppy=tey-ptx-5;
var pline=2;
var pcl=[255,255,255];
var pev=0.1;
var paffev=0;
var objs=[];
//0=tp 1=x 2=y 3=tx 4=ty 5=line 6=ev 7=affev
var clf=[0,0,50];
var dev=dt.getTime();
var tev=10;
var vito=2.5;
var encour=true;
var nbo=2;

var clso=[[255,0,0],[0,255,0]]

ctx.font = "30px Comic";

function choice( liste ){
	return liste[parseInt(Math.random()*(liste.length-1))];
}

function rcol(r1,r2){
	var rect1 = {x: 5, y: 5, width: 50, height: 50}
    var rect2 = {x: 20, y: 10, width: 10, height: 10}

    if (rect1.x < rect2.x + rect2.width &&
       rect1.x + rect1.width > rect2.x &&
       rect1.y < rect2.y + rect2.height &&
       rect1.height + rect1.y > rect2.y) {
        return true;
    }
    return false;
}

function affmort(){
	ctx.fillStyle="rgb(0,0,0)";
	ctx.fillRect(0,0,tex,tey);
	ctx.fillStyle="rgb(200,0,0)";
	ctx.fillText("Vous etes mort.",50,100);
	ctx.fillText("Score : "+pscore,50,200);
}

function aff(){
	ctx.fillStyle="rgb("+clf[0]+","+clf[1]+","+clf[2]+")";
	ctx.fillRect(0,0,tex,tey);
	//
    ctx.strokeStyle="rgb(100,150,100)";
    ctx.beginPath();
    ctx.moveTo(tex/3,0);
    ctx.lineTo(tex/3,tey);
    ctx.lineTo(tex/3*2,tey);
    ctx.lineTo(tex/3*2,0);
    ctx.stroke();
    ctx.closePath();
     //
    for( o of objs ){
        ctx.fillStyle="rgb("+clso[o[0]][0]+","+clso[o[0]][1]+","+clso[o[0]][2]+")";
        if( o[0]==0) ctx.fillRect( o[1]-o[7] , o[2]-o[7] , o[3]+2*o[7] , o[4]+2*o[7] );
        else{
        	ctx.beginPath();
            ctx.arc(o[1]+o[3]/2, o[2]+o[4]/2, o[3]/2+o[7], 0, 2 * Math.PI, false);
            ctx.fill();
        }
    }
    //perso
    ctx.fillStyle="rgb("+pcl[0]+","+pcl[1]+","+pcl[2]+")";
    //ctx.fillStyle="rgb(200,200,200)";
    ctx.fillRect( ppx-paffev , ppy-paffev , ptx+paffev*2 , pty+paffev*2 );
    ctx.strokestyle="rgb(200,200,200)";
    ctx.strokeText("score : "+pscore, 200, 20);
    ctx.fillStyle="rgb(200,0,0)" ;
	ctx.fillText(pvie, 30, 20);
}

function ev(){
	var dt=new Date();
	if(dt.getTime()-dev>=tev){
		dev=dt.getTime();
		vito+=0.001;
		paffev+=pev;
		if(paffev>=affevlim){
			paffev=affevlim;
			pev=-pev;
		}
		if(paffev<=0){
			paffev=0;
			pev=-pev;
		}
		for( o of objs){
			o[2]+=vito
			if( o[2]>=tey ){
				nn=objs.indexOf(o);
			    nobs=[];
			    for( oo of objs ){
				    if(oo!=o) nobs.push(oo);
				}
				objs=nobs;
			}
			else if( o[5]==pline && o[2]+o[4]>=ppy && o[2] <= ppy+pty){
				if(o[0]==0){
					pvie-=1;
					pcl=[255,0,0];
				}
				else if( o[0]==1){
					pscore+=1;
				}
				nn=objs.indexOf(o);
			    nobs=[];
			    for( oo of objs ){
				    if(oo!=o) nobs.push(oo);
				}
				objs=nobs;
			}
		}
		for(o of objs){
			o[7]+=o[6];
			if( o[7] >= affevlim ){
				o[6]=-o[6];
				o[7]=affevlim;
			}
			else if( o[7] <= 0 ){
				o[6]=-o[6];
				o[7]=0;
			}
		}
		while( objs.length < nbo ){
			line=choice([1,2,3,4]);
			oo=[ choice([0,1,2])  ,  100*(line-1)+25 , choice([-100,-50,0]) , 50,50 , line , 0.1 , 0 , 0];
			objs.push( oo );
		}
		if(pvie<=0){
			encour=false;
		}
		for( x=0 ; x<3 ; x++){
			if(pcl[x]<255) pcl[x]+=2;
			if( pcl[x]>255) pcl[x]=255;
		}
	}
}

function move(d){
	if( d==0 ){
		//alert("Gauche");
	    if( pline>1 ){
		    pline-=1;
		    ppx-=100;
		}
	}
	else if( d==1 ){
		//alert("Droite");
		if( pline < 3 ){
			pline+=1;
			ppx+=100;
		}
	}
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if( encour ){
    	if(x<=ppx) move(0);
        else move(1);
    }
    else{
    	alert("Yo");
    }
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

function boucle(){
	ev();
	aff();
	if(encour) window.requestAnimationFrame( boucle );
	else affmort();
}
window.requestAnimationFrame( boucle );

//alert("salut");
