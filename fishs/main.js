canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d")
tex=500;
tey=500;

imgfond=new Image();
imgfond.src="images/eau.png"
imgf11=new Image();
imgf11.src="images/f_2_1.png"
imgf21=new Image();
imgf21.src="images/f_1_1.png"
imgf31=new Image();
imgf31.src="images/f_3_1.png"
imgf41=new Image();
imgf41.src="images/f_4_1.png"

var dt = new Date();

function randomchoice(lst){
    a=parseInt(Math.random()*lst.length);
    e=lst[a]
    return e
}

class Poisson{
    constructor(){
        this.px=Math.random()*tex/2;
        this.py=Math.random()*tex/2;
        this.tx=50;
        this.ty=50;
        this.tc=100;
        this.an_droit=[imgf11];
        this.an_gauche=[imgf21];
        this.an_pres=[imgf31];
        this.an_loin=[imgf41];
        this.imgs=this.an_droit;
        this.an=0
        this.img_actu=this.imgs[this.an];
        this.dbg=dt.getTime();
        this.tbg=0.05;
        this.dan=dt.getTime();
        this.tanim=0.1;
        this.sens="Right";
    }
    update(dt){
        if( dt.getTime()-this.dbg >= this.tbg ){
            this.dbg=dt.getTime();
            this.senss=["Left","Right",this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens];
            this.nsens=randomchoice(this.senss);
            this.sens=this.nsens;
            if( this.nsens == "Up"){
                this.tc-=1;
                this.imgs=this.an_loin;
                this.an=0;
            }
            if( this.nsens == "Down"){
                this.tc+=1;
                this.imgs=this.an_pres;
                this.an=0;
            }
            if( this.nsens == "Left"){
                this.px-=1;
                this.py+=(-1+Math.random()*2);
                this.imgs=this.an_gauche;
                this.an=0;
            }
            if( this.nsens == "Right"){
                this.px+=1;
                this.py+=(-1+parseInt(Math.random()*2));
                this.imgs=this.an_droit;
                this.an=0;
            }
            if( this.px<0) this.px=0;
            if( this.px>tex) this.px=tex;
            if( this.py<50) this.py=50;
            if( this.py>tey) this.py=tey;
            if( this.tc<50) this.tc=50;
            if( this.tc>150) this.tc=150;
            if( dt.getTime()-this.dan >= this.tanim){
                this.dan=dt.getTime();
                this.an+=1;
                if( this.an >= this.imgs.length ) this.an=0;
                this.img_actu=this.imgs[this.an];
            }
        }
    }
}



function Aff(fish,dt){
    ctx.drawImage( imgfond , 0 , 0 );
    ctx.drawImage( fish.img_actu , fish.px , fish.py , fish.tx , fish.ty );
    //ctx.fillText(fps, 15, 15);
}

function Main(){
    fish=new Poisson();
    encour=true;
    function mainboucle(){
        var dt = new Date();
        Aff(fish,dt);
        fish.update(dt);
        if(encour) window.requestAnimationFrame(mainboucle);
    }
    window.requestAnimationFrame(mainboucle);
}

Main();



