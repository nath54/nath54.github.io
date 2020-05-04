#!/usr/bin/python
import sys

lets="0123456789abcdef"
def todec(hexa):
    return lets.index(hexa[0])*16+lets.index(hexa[1])

def tohex(dec):
    return lets[dec//16]+lets[dec%16]

#fonction qui teste si un nuplet est bien un triplet RGB
def test_RGB(nuplet):
    return len(nuplet)==3 and all([ (isinstance(v,int) and v >= 0 and v<=255) for v in nuplet])

#fonction qui convertit un triplet RGB en un triplet rgb hexadecimal pres a l'emploi ( par exemple dans un code css d'un jeu de l'oie a tout hasard )
def toclhex(triplet):
    if not test_RGB(triplet):
        #print("ERROR : votre triplet n'est pas un bon triplet RGB") #si vous voulez un affichage d'erreur
        return "#000000"
    return "#"+"".join( [ v+"0" if len(v)==1 else v for v in [tohex(val) for val in triplet] ] )

def toclrgb(clhex):
    assert len(clhex)==7
    return (todec(clhex[1:3]),todec(clhex[3:5]),todec(clhex[5:7]))

def main():
    # arguments : sys.argv
    args=sys.argv
    pasbon=True
    if len(args)<=1:
        print("Il faudrait donner des arguments pour que je sache quoi faire !")
    elif len(args)==2:
        print("Il me faut 3 arguments !")
    elif len(args)==3:
        if(args[1]=="tohex"):
            tt=args[2]
            tt=tt.split(",")
            if(len(tt))==3:
                try:
                    ntt=tuple([int(vt) for vt in tt])
                    assert all([vt>=0 and vt <= 255 for vt in ntt])
                    clhex=toclhex(ntt)
                    print("La couleur héxadécimale est : "+str(clhex))
                    pasbon=False
                except Exception as e:
                    print("Veuillez rentrer un tuple RGB correct !")
                    
            else:
                print("EH ! Il me faut un tuple de 3 chiffres entre 0 et 255 séparés par une virgule ok ?")
        elif(args[1]=="torgb"):
            tt=args[2].lower()
            clhex="#"+tt
            clrgb=toclrgb(clhex)
            print("La couleur en tuple rgb vaut : "+str(clrgb))
            pasbon=False
        else:
            print("Commande inconnue...")
    if pasbon:
        print("""
Les commandes sont :
    -'torgb couleur hexadecimale sans le dieses, juste les 6 characteres'
  et
    'tohex tuple rgb sans les parentheses et separes par des virgules'
""")

main()
