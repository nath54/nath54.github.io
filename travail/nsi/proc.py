
#proc[0] = date de soumission de la tache
#proc[1] = la durée de la tache 
#proc[2] = la priorité de la tache


def eval_tp(proc):
    temps_gache=0
    temps_passe=0
    for p in proc:
        while p[0]>temps_passe:
            temps_passe+=1
            temps_gache+=1
        temps_passe+=p[1]
    return("temps passe : ",temps_passe,"temps passe : ",temps_gache)
    


def trier_processus(proc):
    for i in range(len(proc)):
        for j in range(i):
            if proc[i][0]<proc[j][0]:
                temp=proc[i]
                proc[i]=proc[j]
                proc[j]=temp
            elif proc[i][0]==proc[j][0]:
                if proc[i][2]>proc[j][2]:
                    temp=proc[i]
                    proc[i]=proc[j]
                    proc[j]=temp
                elif proc[i][2]==proc[j][2]:
                    if proc[i][1] < proc[j][1]:
                        temp=proc[i]
                        proc[i]=proc[j]
                        proc[j]=temp
                    
                
    return proc



def main():
    P1 = (6, 16, 3)
    P2 = (4, 8, 1)
    P3 = (4, 10, 2)
    P4 =(6, 10, 5)
    P5 = (4, 1, 3)

    procs=[
        P1,
        P2,
        P3,
        P4,
        P5        
    ]
    print( "avant : ", eval_tp(procs) )
    nprocs=trier_processus(procs)
    print( nprocs )
    print( "après : ",eval_tp(nprocs) )

main()

