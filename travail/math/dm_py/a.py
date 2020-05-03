
from decimal import Decimal, getcontext
 
getcontext().prec = 5 #précision voulue

def df(x):
    return 1/x

def images_par_f(nb_de_valeurs_calculees,pas):
    h=pas
    n=nb_de_valeurs_calculees
    x=1
    y=0
    X=[x]
    Y=[y]
    for i in range(1,n+1):
        x+=h
        y+=h*df(x)
        X.append(x)
        Y.append(y)
    return X,Y

def main():
    X1,Y1=images_par_f(5,0.1)
    X2,Y2=images_par_f(5,-0.1)
    
    print("h = 0.1 : ")
    for i in range(len(X2)): print(" x = ",Decimal(str(X1[i]))*Decimal("1")," , y = ",Decimal(str(Y1[i]))*Decimal("1"))
	
    print("h = -0.1 : ")
    for i in range(len(X2)): print(" x = ",Decimal(str(X2[i]))*Decimal("1")," , y = ",Decimal(str(Y2[i]))*Decimal("1"))



main()

