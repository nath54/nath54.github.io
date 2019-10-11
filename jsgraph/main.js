canvas=document.getElementById("canvas");
context=canvas.getContext("2d");

tex=1000;
tey=1000;
couleur="rgb(255,0,0)";

vit=-100
cam=[100,0];

function range(a,b){
	liste=[];
	for(x=a;x<b;x++){
        liste.push(x);
    }
	return liste
}


function f(x){
    return x;
}

function aff(){
	context.fillStyle="rgb(255,255,255)";
	context.fillRect( 0 , 0, tex, tey );
	context.strokeStyle="rgb(0,0,0)";
	if(cam[0] <= 0 && cam[0] >= -tex ){
		context.beginPath();
		context.moveTo( -cam[0] , 0 );
		context.lineTo( -cam[0] , tey );
		context.stroke();
	}
	if(cam[1] <= 0 && cam[1] >= -tey ){
		context.beginPath();
		context.moveTo( 0, -cam[1] );
		context.lineTo( tex, -cam[1] );
		context.stroke();
	}
	context.strokeStyle=couleur;
	context.beginPath();
	context.moveTo( cam[0] , f(cam[0])+cam[1] );
	for( x of range(cam[0],cam[0]+tex) ){
		context.lineTo( x , f(x)+cam[1] );
	}
	context.stroke();
}

function moveCam(d){
	if(d=='up') cam[1]+=vit
	if(d=='down') cam[1]-=vit
	if(d=='left') cam[0]+=vit
	if(d=='right') cam[0]-=vit
	aff();
}

aff();

alert( f(1) );

