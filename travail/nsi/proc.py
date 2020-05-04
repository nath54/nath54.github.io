
#proc[0] = date de soumission de la tache
#proc[1] = la durée de la tache 
#proc[2] = la priorité de la tache


def exec_procs(procs):
    proc_possibles=[]
    seq_exec=[]
    tp_passe=0
    dproc_exec=None
    while len(procs)>0:
        #on regarde si de nouveaux processus sont possibles
        for p in procs:
            if tp_passe>=procs[p][0] and not p in proc_possibles:
                proc_possibles.append(p)
        #
        next_ex_p="ne fait rien"
        for p in proc_possibles:
            if next_ex_p=="ne fait rien":
                next_ex_p=p
            elif procs[p][2]>procs[next_ex_p][2]:
                next_ex_p=p
        #
        if next_ex_p!=dproc_exec:
            seq_exec.append( [next_ex_p,1] )
        else:
            seq_exec[-1][1]+=1
        #
        if next_ex_p!="ne fait rien":
            procs[p][1]-=1
        #
        nprocs={}
        for p in procs.keys():
            if procs[p][1]<=0:
                del(proc_possibles[proc_possibles.index(p)])
            else:
                nprocs[p]=procs[p]
        procs=nprocs
        #
        tp_passe+=1
        dproc_exec=next_ex_p
        #
        #print( tp_passe , seq_exec )
    return seq_exec    
    
   


def main():
    P1 = [6, 16, 3]
    P2 = [4, 8, 1]
    P3 = [4, 10, 2]
    P4 = [6, 10, 5]
    P5 = [4, 2, 3]

    procs={
        "P1":P1,
        "P2":P2,
        "P3":P3,
        "P4":P4,
        "P5":P5       
    }
    
    print( exec_procs(procs) )

main()

