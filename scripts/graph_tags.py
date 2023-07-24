
import os

compte_tokens = {}

for f in os.listdir(".data/"):
    if f.endswith(".txt"):
        f_name = f[:-4]
        #
        with open(".data/"+f, "r") as f:
            prompt = f.readline()

        print("\n\nNom du fichier : ", f_name)
        print("Prompt : ", prompt)

        toks = [t.strip() for t in prompt.split(",")]
        print(toks)
        for t in toks:
            if t in compte_tokens:
                compte_tokens[t] += 1
            else:
                compte_tokens[t] = 1
        

toks_sorted = list(compte_tokens.items())
toks_sorted.sort(key = lambda x : x[1], reverse=True)

print(toks_sorted)


#TODO : faire un script qui va établir automatiquement une hierarchie arborescente des images générées par stable diffusion avec les mots des prompts pour générer ces images

