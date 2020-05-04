
from numpy import *
from matplotlib.pyplot import *
import math

def calc(n,h):
    x=0
    y=1
    X=[x]
    Y=[y]
    for i in range(1,n+1):
        x+=h
        y+=h*y
        X.append(x)
        Y.append(y)
    return X,Y
    
    
def images_et_graph_par_g(nbvals,pas):
    h=pas
    n=nbvals
    #on définit les axes de coordonnées, x allant de -2 à 2, et y allant de -1 à 5
    axis([-2,2,-1,5])
    grid()
    #h : positif
    X,Y=calc(n,h)
    plot(X,Y)
    #h : négatif
    XX,YY=calc(n,-h)
    plot(XX,YY)
    #on affiche
    show()
    return("abscisses : ",XX,X," ordonnées correspondantes : ",YY,Y)


#1er test : 
print( images_et_graph_par_g(5,0.1) )
#2eme test : 
#images_et_graph_par_g(25,0.1)




