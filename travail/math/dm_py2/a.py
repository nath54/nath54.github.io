


def images_par_g(nbvals,pas):
    h=pas
    n=nbvals
    #Valeur initiale pour x 
    x=0
    #Image par f de x=0
    y=1
    #Toutes les abscisses sont stockées dans une 1ere liste, définie en extension
    X=[x]
    #Toutes les ordonnées sont stockées dans une 2ème liste, définie en extension
    Y=[y]
    
    for i in range(1,n+1):
        x+=h
        y+=h*df(x)



