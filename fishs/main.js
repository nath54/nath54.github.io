canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d")
tex=500;
tey=500;

imgfond=new Image();
imgfond.src="images/eau.png";
imgfond2=new Image();
imgfond2.src="images/eau_2.png";
imgf11=new Image();
imgf11.src="images/f_1_1.png";
imgf12=new Image();
imgf12.src="images/f_1_2.png";
imgf13=new Image();
imgf13.src="images/f_1_3.png";
imgf14=new Image();
imgf14.src="images/f_1_4.png";
imgf21=new Image();
imgf21.src="images/f_2_1.png";
imgf22=new Image();
imgf22.src="images/f_2_2.png";
imgf23=new Image();
imgf23.src="images/f_2_3.png";
imgf24=new Image();
imgf24.src="images/f_2_4.png";
imgf31=new Image();
imgf31.src="images/f_3_1.png";
imgf41=new Image();
imgf41.src="images/f_4_1.png";
as1=[imgf11,imgf12,imgf13,imgf14,imgf21,imgf22,imgf23,imgf24,imgf31,imgf41];
imgf211=new Image();
imgf211.src="images/f2_1_1.png";
imgf212=new Image();
imgf212.src="images/f2_1_2.png";
imgf213=new Image();
imgf213.src="images/f2_1_3.png";
imgf214=new Image();
imgf214.src="images/f2_1_4.png";
imgf221=new Image();
imgf221.src="images/f2_2_1.png";
imgf222=new Image();
imgf222.src="images/f2_2_2.png";
imgf223=new Image();
imgf223.src="images/f2_2_3.png";
imgf224=new Image();
imgf224.src="images/f2_2_4.png";
imgf231=new Image();
imgf231.src="images/f2_3_1.png";
imgf241=new Image();
imgf241.src="images/f2_4_1.png";
as2=[imgf211,imgf212,imgf213,imgf214,imgf221,imgf222,imgf223,imgf224,imgf231,imgf241];
imgf311=new Image();
imgf311.src="images/f3_1_1.png";
imgf312=new Image();
imgf312.src="images/f3_1_2.png";
imgf313=new Image();
imgf313.src="images/f3_1_3.png";
imgf314=new Image();
imgf314.src="images/f3_1_4.png";
imgf321=new Image();
imgf321.src="images/f3_2_1.png";
imgf322=new Image();
imgf322.src="images/f3_2_2.png";
imgf323=new Image();
imgf323.src="images/f3_2_3.png";
imgf324=new Image();
imgf324.src="images/f3_2_4.png";
imgf331=new Image();
imgf331.src="images/f3_3_1.png";
imgf341=new Image();
imgf341.src="images/f3_4_1.png";
as3=[imgf311,imgf312,imgf313,imgf314,imgf321,imgf322,imgf323,imgf324,imgf331,imgf341];
ans=[as1,as2,as3];
//
imgm11=new Image();
imgm11.src="images/m1_1.png";
imgm21=new Image();
imgm21.src="images/m2_1.png";
imgm51=new Image();
imgm51.src="images/m5_1.png";
imgm52=new Image();
imgm52.src="images/m5_2.png";
imgm53=new Image();
imgm53.src="images/m5_3.png";
imgm54=new Image();
imgm54.src="images/m5_4.png";
imgm61=new Image();
imgm61.src="images/m6_1.png";
imgm62=new Image();
imgm62.src="images/m6_2.png";
imgm63=new Image();
imgm63.src="images/m6_3.png";
imgm64=new Image();
imgm64.src="images/m6_4.png";



var dt = new Date();

function randomchoice(lst){
    a=parseInt(Math.random()*lst.length);
    e=lst[a]
    return e
}

function arrayUnset(array, value){
    array.splice(array.indexOf(value), 1);
}

class Poisson{
    constructor(mechant){
        this.as=randomchoice(ans);
        this.px=Math.random()*tex/2;
        this.py=Math.random()*tex/2;
        this.tc=100;
        this.mechant=mechant;
        if( this.mechant==false ){
            this.tx=35;
            this.ty=35;
            this.an_droite=[this.as[4],this.as[5],this.as[6],this.as[7]];
            this.an_gauche=[this.as[0],this.as[1],this.as[2],this.as[3]];
            this.an_pres=[this.as[8]];
            this.an_loin=[this.as[9]];
        }
        else{
            this.tx=100;
            this.ty=50;
            this.an_droite=[imgm21];
            this.an_gauche=[imgm11];
            this.an_pres=[null];
            this.an_loin=[null];
            this.an_mordre_gauche=[imgm61,imgm62,imgm63,imgm64];
            this.an_mordre_droite=[imgm51,imgm52,imgm53,imgm54];
        }
        this.imgs=this.an_droite;
        this.an=0
        this.img_actu=this.imgs[this.an];
        this.dbg=dt.getTime();
        this.tbg=1;
        this.dan=dt.getTime();
        this.tanim=80;
        this.sens="Right";
        this.dmon="Up";
        this.ismanger=false;
        this.dbmanger=0;
        this.tmanger=5*this.tanim;
        this.pmanger=null;
        this.imobilise=false;
        this.estmange=null;
    }
    update(dt,fishs){
        if( dt.getTime()-this.dbg >= this.tbg ){
            this.dbg=dt.getTime();
            if( this.estmange!=null){
                if(this.estmange.sens=="Left"){
                    this.px=this.estmange.px;
                    this.py=this.estmange.py+10;
                }
                else{
                    this.px=this.estmange.px-this.tx;
                    this.py=this.estmange.py+10;
                }
            }
            else if( this.ismanger==false && this.imobilise==false ){
                this.senss=["Left","Right",this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens,this.sens];
                this.nsens=randomchoice(this.senss);
                this.sens=this.nsens;
                if( this.nsens == "Up"){
                    this.tc-=1;
                    if(this.imgs!=this.an_loin){
                        this.imgs=this.an_loin;
                        this.an=0;
                    }
                }
                if( this.nsens == "Down"){
                    this.tc+=1;
                    if(this.imgs!=this.an_pres){
                        this.imgs=this.an_pres;
                        this.an=0;
                    }
                }
                if( this.nsens == "Left"){
                    this.px-=1;
                    this.monts=["Up","Down",this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon];
                    this.mon=randomchoice(this.monts);
                    this.dmon=this.mon;
                    if(this.mon=="Up") this.py-=1;
                    if(this.mon=="Down") this.py+=1;
                    if(this.imgs!=this.an_gauche){
                        this.imgs=this.an_gauche;
                        this.an=0;
                    }
                }
                if( this.nsens == "Right"){
                    this.px+=1;
                    this.monts=["Up","Down",this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon,this.dmon];
                    this.mon=randomchoice(this.monts);
                    this.dmon=this.mon;
                    if(this.mon=="Up") this.py-=1;
                    if(this.mon=="Down") this.py+=1;
                    if(this.imgs!=this.an_droite){
                        this.imgs=this.an_droite;
                        this.an=0;
                    }
                }
                if( this.mechant==true && Math.random()*100<=1 ){
                    for( x=0 ; x<fishs.length ; x++ ){
                        var f=fishs[x];
                        if( f.mechant==false && Math.abs(this.px-f.px)<=100 && Math.abs(this.py-f.py)<=60 && !this.ismanger ){
                            f.estmanger=this;
                            this.pmanger=f;
                            this.ismanger=true;
                            this.dbmanger=dt.getTime();
                            if( this.px < f.px ){
                                this.px=f.px+f.tx;
                                this.py=f.py-10;
                                this.sens="Right";
                                this.imgs=this.an_mordre_droite;
                                this.an=0;
                            }
                            else{
                                this.px=f.px;
                                this.py=f.py-10;
                                this.sens="Left";
                                this.imgs=this.an_mordre_gauche;
                                this.an=0;
                            }
                        }
                    }                    
                }
            }
            else{
                if( dt.getTime()-this.dbmanger>=this.tmanger ){
                    this.ismanger=false;
                    arrayUnset(fishs, this.pmanger);
                    this.pmanger=null;
                    fishs.push( new Poisson(false) );
                }
                else if(this.pmanger!=null && false ){
                    if( this.px < this.pmanger.px ){
                        this.px=this.pmanger.px+this.pmanger.tx;
                        this.py=this.pmanger.py-10;
                        this.sens="Right";
                        this.imgs=this.an_mordre_droite;
                    }
                    else{
                        this.px=this.pmanger.px;
                        this.py=this.pmanger.py-10;
                        this.sens="Left";
                        this.imgs=this.an_mordre_gauche;
                    }
                }
            }
            if( this.px<0) this.px=0;
            if( this.px>tex-this.tx) this.px=tex-this.tx;
            if( this.py<50) this.py=50;
            if( this.py>tey-this.ty-30) this.py=tey-this.ty-30;
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

function Aff(fishs,dt){
    ctx.drawImage( imgfond , 0 , 0 );
    for(x=0;x<fishs.length;x++) ctx.drawImage( fishs[x].img_actu , fishs[x].px , fishs[x].py , fishs[x].tx , fishs[x].ty );
    ctx.drawImage( imgfond2 , 0 , 0 );
    //ctx.fillText(fps, 15, 15);
}

document.addEventListener('keydown', (event) => {
    const nomTouche = event.key;
    alert(nomTouche);
  
}, false);

document.addEventListener('keyup', (event) => {
    const nomTouche = event.key;
    alert(nomTouche);
}, false);


function Main(){
    fishs=[];
    for(x=0;x<2+parseInt(Math.random()*5);x++){ fishs.push( new Poisson(false) );  }
    if(Math.random()<=0.5) fishs.push( new Poisson(true) );
    encour=true;
    function mainboucle(){
        var dt = new Date();
        Aff(fishs,dt);
        for(x=0;x<fishs.length;x++) fishs[x].update(dt,fishs);
        if(encour) window.requestAnimationFrame(mainboucle);
    }
    window.requestAnimationFrame(mainboucle);
}

Main();



