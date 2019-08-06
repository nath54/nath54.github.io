// A javascript-enhanced crossword puzzle [c] Jesse Weisbeck, MIT/GPL 
(function($) {
	$(function() {
		// provide crossword entries in an array of objects like the following example
		// Position refers to the numerical order of an entry. Each position can have 
		// two entries: an across entry and a down entry
		var puzzleData = [
			 	{
					clue: "Système d'exploitation connu",
					answer: "windows",
					position: 1,
					orientation: "across",
					startx: 1,
					starty: 1
				},
			 	{
					clue: "Connexion vraiment lente",
					answer: "adsl",
					position: 2,
					orientation: "across",
					startx: 12,
					starty: 1
				},
				{
					clue: "Architecture Nvidia",
					answer: "Turing",
					position: 3,
					orientation: "across",
					startx: 7,
					starty: 2
				},
				{
					clue: "Technologie nvidia permettant d'utiliser plusieurs cartes graphiques en même temps",
					answer: "sli",
					position: 4,
					orientation: "across",
					startx: 1,
					starty: 3
				},
				{
					clue: "Ce qu'il y a en grance quantité à l'intérieur d'un processeur et d'un carte graphique",
					answer: "transistors",
					position: 5,
					orientation: "across",
					startx: 6,
					starty: 4
				},
				{
					clue: "S'emploie dans toutes les fonctions et positions des pronoms personnels toniques (apposition à tu, sujet d'infinitif ou de participe, après une préposition, après c'est, dans les phrases sans verbe, comme complément postposé d'un impératif) ",
					answer: "toi",
					position: 6,
					orientation: "across",
					startx: 1,
					starty: 5
				},
				{
					clue: "Grande entreprise qui produit des processeurs et des cartes graphiques",
					answer: "amd",
					position: 7,
					orientation: "across",
					startx: 3,
					starty: 6
				},
				{
					clue: "Entreprise qui produit du matériel informatique en général",
					answer: "dell",
					position: 8,
					orientation: "across",
					startx: 13,
					starty: 6
				},
				{
					clue: "",
					answer: "",
					position: 0,
					orientation: "across",
					startx: 0,
					starty: 0
				},
				{
					clue: "",
					answer: "",
					position: 0,
					orientation: "across",
					startx: 0,
					starty: 0
				},
				{
					clue: "",
					answer: "",
					position: 0,
					orientation: "across",
					startx: 0,
					starty: 0
				},
			] 
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
