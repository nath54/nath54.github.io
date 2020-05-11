pp={"r":4,"w":2,"x":1}
def tonb(lp): return str(sum([pp[p] if p in pp.keys() else 0 for p in lp]))
def convert_oct(txt): return "".join([tonb(a) for a in txt.split("-")])

def convert_txt(nb):
    txt=""
    for x in range(3):
        nn=int(nb[x])
        for k in pp:
            v=pp[k]
            if nn-v>=0:
                nn-=v
                txt+=k
            else:
                txt+="-"
    return txt

def main():
    a="rwx-rwx-rwx"
    b=convert_oct(a)
    c=convert_txt(b)
    print(c)

main()