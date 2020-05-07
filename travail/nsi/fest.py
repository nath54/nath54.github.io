def test_col(a,b):  return (a[0] < b[0] and a[1] > b[0]) or (a[0]<b[1] and a[1]>b[1])
def ech_liste_pos(liste,i,j):
    tmp=liste[i]
    liste[i]=liste[j]
    liste[j]=tmp
def tri1(pos):
    for i in range(len(pos)):
        for j in range(i):
            if pos[i][0]<pos[j][0]: ech_liste_pos(pos,i,j)
            elif pos[i][0]==pos[j][0] and pos[i][2]<pos[j][2]: ech_liste_pos(pos,i,j)
    return pos
def tri2(pos,i=0):
    while i+1<=len(pos)-1:
        while i+1<=len(pos)-1 and test_col(pos[i],pos[i+1])>0:  del(pos[i+1])
        i+=1    
    return pos
def main(pieces): print("initial : ",pieces,"\nrésultat : ",[(a,b) for a,b,c in tri2(tri1([(a,b,b-a) for a,b in pieces]))])
main([(14, 16), (15, 18), (16.5, 17.5), (19, 20.5), (17.5, 20)])