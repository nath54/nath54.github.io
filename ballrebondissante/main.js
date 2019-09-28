canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");

tex=300;
tey=300;

function rcl(){
	cl="rgb("
	cl+=toString(Math.random()*255);+",";
	cl+=toString(Math.random()*255);+",";
	cl+=toString(Math.random()*255);+")";
    return cl
}

class Balle:
  constructor(x,y,vitx,vity,t,cl){
  	this.px=x;
      this.py=y;
      this.t=t;
      this.vitx=vitx;
      this.vity=vity;
      this.cl=cl;
      var dt=new Date();
      this.dbg=dt.getTime();
      this.tbg=10;
  }
  update(){
  	var dt=new Date();
      if( dt.getTime()-this.dbg>=this.tbg ){
      	this.px+=this.vitx;
          this.py+=this.vity;
          if( this.px-this.t <= 0 ){
          	this.px=1;
              this.vitx=-this.vitx;
          }
          if( this.px+this.t >= tex ){
          	this.px=tex-1;
              this.vitx=-this.vitx;
          }
          if( this.py-this.t <= 0 ){
          	this.py=1;
              this.vity=-this.vity;
          }
          if( this.py+this.t >= tey ){
          	this.py=tey-1;
              this.vity=-this.vity;
          }
      }
}

function aff(clf,balles){
	ctx.fillStyle=clf;
	ctx.fillRect(0,0,tex,tey);
	for( b of balles ){
		ctx.fillStyle=b.cl;
		ctx.fillCircle( b.px , b.py , b.t );
	}
}

function main(){
	var balles=[];
	var clf=rcl();
	var tc=10;
	var vt=30;
	var encour=true;
	for( x=0 ; x< 10 ; x++){
		xx=Math.random()*tex;
		yy=Math.random()*tey;
		vx=vt*(-1+Math.random()*2)
		vy=vt*(-1+Math.random()*2)
		cl=rcl();
		balles.push( new balle(xx,yy,vx,vy,tc,cl) );
	}
	function boucle(){
		for( b of balles ) b.update();
		aff(clf,balles);
		if(encour) window.requestAnimationFrame( boucle );
	}
	window.requestAnimationFrame( boucle );
}

main();


