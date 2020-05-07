
def test_col(a,b):
    return (a[0] < b[0] and a[1] > b[0]) or (a[0]<b[1] and a[1]>b[1])

def tri1(pos):
    for i in range(len(pos)):
        for j in range(i):
            if pos[i][0]<pos[j][0]:
                temp=pos[i]
                pos[i]=pos[j]
                pos[j]=temp
            elif pos[i][0]==pos[j][0]:
                if pos[i][2]<pos[j][2]:
                    temp=pos[i]
                    pos[i]=pos[j]
                    pos[j]=temp
    return pos

def tri2(pos):
    i=0
    while i+1<len(pos)-1:
        if i+1<len(pos)-1:
            while test_col(pos[i],pos[i+1])>0:
                del(pos[i+1])
        i+=1    
    return pos

def tri_pieces(pieces):
    pt=[(a,b,b-a) for a,b in pieces]
    pt=tri1(pt)
    pt=tri2(pt)
    pt=[(a,b) for a,b,c in pt]
    return pt

def main():
    pieces = [(14, 16), (15, 18), (16.5, 17.5), (19, 20.5), (17.5, 20)]
    print("initial : ",pieces)
    pieces_a_regarder=tri_pieces(pieces)
    print("résultat : ",pieces_a_regarder)

main()


