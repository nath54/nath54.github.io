#!/usr/bin/python
#coding:utf-8
import sys

ValeursMonetaires = [1, 2, 5, 10, 20, 50]

def decomposition_somme(somme):
    pieces=[]
    r=somme
    i=len(ValeursMonetaires)-1
    for i in range(0,len(ValeursMonetaires))[::-1]:
        while r>=ValeursMonetaires[i]:
            pieces.append(ValeursMonetaires[i])
            r-=ValeursMonetaires[i]
    print(pieces)

def main():
    args=sys.argv
    decomposition_somme(int(args[1]))


main()




















