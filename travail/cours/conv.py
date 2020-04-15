#coding:utf-8
import io,os
from shutil import copyfile


def isinteger(a):
    try:
        b=float(a)
        return True
    except:
        return False

def load_text(fich):
    assert isinstance(fich,str)
    f=io.open(fich,"r",encoding="utf-8")
    text=f.read()
    f.close()
    return text

def get_titre(fich):
    r=fich.split("/")
    titre=r[len(r)-1].split(".")[0]
    return titre

def makefile(fich,text):
    titre=get_titre(fich)
    lignes=text.split("\n")
    imgs=[]
    txt="""
<html>
    <head>
        <meta charset="utf-8">
        <title>"""+titre+"""</title>
        <link href="style.css" rel="stylesheet">
    </head>
    <body>
    <a href="https://nath54.github.io/index.html">Ma page web ( petite pub :) )</a>
    """
    
    for l in lignes:
        bal=["<p>","</p>"]
        if l[:2]=="# ":
            bal=["<h1 style='text-decoration: underline;'>","</h1>"]
            l=l[2:]
        elif l[:2]=="- ":
            bal=["<p class='cons'>","</p>"]
            #l=l[2:]
        elif l[:2]=="* ":
            bal=["<p class='r1'>","</p>"]
            #l=l[2:]
        elif l[:2]=="/ ":
            bal=["<p class='r2'>","</p>"]
            l=l[2:]
        elif l[:3]=="-- ":
            bal=["<p class='exemple'>","</p>"]
            l=l[2:]
        elif isinteger(l.split(")")[0]):
            bal=["<h3>","</h3>"]
        elif l[:4]=="IMG ":
            ti=l[4:]
            bal=["<img src='"+ti+"'>","</img>"]
            imgs.append(ti)
            l=""
        #
        if ":" in list(l):
            ll=l.split(":")
            txt+="\n"+bal[0]+"<span style='font-weight:1200; font-size:120%; '>"+ll[0]+":</span>"+":".join(ll[1:])+bal[1]
            #print(txt.split("\n")[-1])
        else:
            txt+="\n"+bal[0]+l+bal[1]
    
    txt+="""
    </body>
</html>
"""
    return txt,imgs


def makestyle():
    txt="""
body{
    text-align:center;
    font-size:20px;
    color:rgb(30,30,30);
    margin-top:30px;
    margin-bottom:30px;
    margin-left:30px;
    margin-right:30px;
}

a{
    font-size:12px;
}

h{

}

h1{
    color:rgb(100,0,0);
}

h2,h3,h4{
    color:rgb(0,0,100);
}

p{
    color:rgb(0,0,0);
}

.conv{
    color:rgb(0,0,0);
    font-weight:1000:
}

.r1{
    color:rgb(100,150,100);
    font-weight:500:
    font-size:30px;
}

.r2{
    color:rgb(100,100,150);
    font-weight:700:
}

.exemple{
    font-weight:400;
    color:rgb(50,100,50);
}

    """
    return txt

def save_files(fich,ftxt,stxt,imgs,direb,diref):
    r=fich.split("/")
    n=r[len(r)-1].split(".")
    dire=n[0]
    if not dire in os.listdir(diref): os.mkdir(diref+dire)
    dire=diref+dire+"/"
    f1=io.open(dire+"index.html","w",encoding="utf-8")
    f1.write(ftxt)
    f1.close()
    f2=io.open(dire+"style.css","w",encoding="utf-8")
    f2.write(stxt)
    f2.close()
    for i in imgs:
        copyfile(direb+i, dire+i)


def main():
    inp=""
    while not (inp in ["q","exit","quit"]):
        #inp=input(">>>")
        inp="conv"
        if inp=="conv":
            #fich=input("L'adresse du fichier\n : ")
            direb="histoire/"
            diref="../../github/nath54.github.io/travail/"
            fich=direb+"histoire_chap_la_mise_en_oeuvre_du_projet_republicain.nath"
            text=load_text(fich)
            ftxt,imgs=makefile(fich,text)
            stxt=makestyle()
            save_files(fich,ftxt,stxt,imgs,direb,diref)
        inp="q"


main()










            


