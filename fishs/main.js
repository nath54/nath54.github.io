canvas=document.getElementId("canvas");
ctx=canvas.getContext("2d")

tex=100;
tey=100;


class Poisson{
    constructor(){
        this.px=Math.random()*tex;
        this.py=Math.random()*tex;
        this.tx=50;
        this.ty=50;
        this.tc=100;
        this.an_droit=["f_1_1.png"];
        this.an_gauche=["f_2_1.png"];
        this.an_pres=["f_3_1.png"];
        this.an_loin=["f_4_1.png"];
        this.imgs=this.an_droit;
        this.an=0
        this.img_actu=this.imgs[this.an];
    }
    update(){
        return false;
    }
}






