#coding:utf-8
from matplotlib.pyplot import *



def df(a):
    return 1/a


def calc(n,h):
    x,y=1,0
    X,Y=[x],[y]

    for i in range(1,n+1):
        x+=h
        y+=h*df(x)
        X.append(x)
        Y.append(y)
    return X,Y

def images_et_graph_par_f(nbvals,pas):
    h,n=pas,nbvals
    
    grid()
    
    X,Y=calc(n,h)
    plot(X,Y)
    
    XX,YY=calc(n,-h)
    plot(XX,YY)
    
    show()

    for w in range(len(X)):
        print(" x = "+str(X[w])+" : yy = "+str(Y[w])+" |  xx = "+str(XX[w])+" : yy = "+str(YY[w]))
    
images_et_graph_par_f(5,0.1)



