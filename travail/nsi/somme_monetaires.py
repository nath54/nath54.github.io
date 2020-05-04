#!/usr/bin/python
#coding:utf-8
import sys

vm = [1, 2, 5, 10, 20, 50]

def decomposition_somme(somme):
    pieces=[]
    r=somme
    i=len(vm)-1
    while r>0:
        if r<vm[i]: i-=1
        if r>=vm[i]:
            pieces.append(vm[i])
            r-=vm[i]    
    return(pieces)

def main():
    args=sys.argv
    print( decomposition_somme(int(args[1])) )
    #decomposition_somme(125)
    #renvoie [50,50,20,5]

main()




