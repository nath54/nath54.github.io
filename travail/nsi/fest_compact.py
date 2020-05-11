def ech(liste,i,j):
    tmp=liste[i]
    liste[i]=liste[j]
    liste[j]=tmp
def main(p,k=0):
    for i in range(len(p)):
        for j in range(i):
            if p[i][0]<p[j][0]: ech(p,i,j)
            elif p[i][0]==p[j][0] and p[i][1]-p[i][0]<p[j][1]-p[j][0]: ech(p,i,j)
    while k+1<=len(p)-1:
        while k+1<=len(p)-1 and ((p[k][0]<p[k+1][0]and p[k][1]>p[k+1][0])or(p[k][0]<p[k+1][1]and p[k][1]>p[k+1][1])):del(p[k+1])
        k+=1    
    return p
print(main([(14,16),(15,18),(16.5,17.5),(19,20.5),(17.5,20)]))