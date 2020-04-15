#coding:utf-8
import io



def style():
    styl="""
body{

}

.evenement_min{
    
}

.frise{
    background-color:rgb(100,100,100);
}
    """
    return styl



class Date():
    def __init__(self):
        self.annee=0
        self.mois=None
        self.jour=None
        self.heure=None
        self.minute=None
        self.seconde=None
    def aff(self):
        txt="("
        if self.annee!=None: txt+=f"  Année : {self.annee}"
        if self.mois!=None: txt+=f"  Mois : {self.mois}"
        if self.jour!=None: txt+=f"  Jour : {self.jour}"
        if self.heure!=None: txt+=f"  Heure : {self.heure}"
        if self.minute!=None: txt+=f"  Minute : {self.minute}"
        if self.seconde!=None: txt+=f"  Seconde : {self.seconde}"
        return txt+")"

class Evenement():
    def __init__(self):
        self.nom=None
        self.description=None
        self.img=None
        self.debut=None
        self.fin=None
    def aff(self):
        txt=""
        if self.nom!=None: txt+=f"  Nom : {self.nom}"
        if self.description!=None: txt+=f"  Description : {self.description}"
        if self.debut!=None: txt+=f"  Debut : {self.debut.aff()}"
        if self.fin!=None: txt+=f"  Fin : {self.fin.aff()}"
        return txt

def open_file(nf):
    f=io.open(nf,"r",encoding="utf-8")
    txt=f.read()
    f.close()
    return txt



def conv_file(fich=None,dos=None):
    assert isinstance(fich,str) and isinstance(dos,str)
    evs=open_file(dos+fich).split("\n")
    evenements=[]
    for e in evs:
        #print(e)
        ev=Evenement()
        ee=e.split("|")
        for a in ee:
            b=a.split("=")
            #print(b)
            if b[0]=="nom": ev.nom=b[1]
            elif b[0]=="description": ev.description=b[1]
            elif b[0]=="debut":
                deb=Date()
                ii=0
                for dd in b[1].split(","):
                    if len(dd)>0:
                        di=float(dd)
                        if ii==0: deb.annee=int(di)
                        elif ii==1 and di>=1 and di<=12: deb.mois=int(di)
                        elif ii==2 and di>=1 and di<=31: deb.jour=int(di)
                        elif ii==3 and di>=0 and di<=23: deb.heure=int(di)
                        elif ii==4 and di>=0 and di<=59: deb.minute=int(di)
                        elif ii==5 and di>=0 and di<=59: deb.seconde=di
                        ii+=1
                ev.debut=deb
        evenements.append(ev)
    ii=1
    """
    for e in evenements:
        print(f"{ii}) {e.aff()}")
        ii+=1
    """
    return evenements



def main():
    dos="test/"
    conv_file(fich="frise.nath",dos=dos)
    

main()






