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
					clue: "note",
					answer: "re",
					position: 9,
					orientation: "across",
					startx: 1,
					starty: 8
				},
				{
					clue: "Autre Architecture Nvidia",
					answer: "Pascal",
					position: 10,
					orientation: "across",
					startx: 4,
					starty: 8
				},
				{
					clue: "apprendre",
					answer: "learn",
					position: 11,
					orientation: "across",
					startx: 14,
					starty: 9
				},
				{
					clue: "Matériel qui permet à l'utilisateur de voir l'interface graphique de l'ordinateur",
					answer: "ecran",
					position: 12,
					orientation: "across",
					startx: 4,
					starty: 10
				},
				{
					clue: "minerai très précieux",
					answer: "or",
					position: 13,
					orientation: "across",
					startx: 1,
					starty: 12
				},
				{
					clue: "Entreprise qui crée des processeurs et qui a aussi essayé de créer des cartes graphiques, mais qui a lamentablement échoué",
					answer: "intel",
					position: 14,
					orientation: "across",
					startx: 10,
					starty: 12
				},
				{
					clue: "format de carte mère",
					answer: "atx",
					position: 15,
					orientation: "across",
					startx: 18,
					starty: 12
				},
				{
					clue: "élément de l'interface  graphique, qui est utilisé un logiciel et qui sert à interagir avec l'utilisateur",
					answer: "fenetre",
					position: 16,
					orientation: "across",
					startx: 4,
					starty: 14
				},
				{
					clue: "Le meilleur language informatique au monde (non, je n'éxagère pas, c'est la vérité)",
					answer: "python",
					position: 17,
					orientation: "across",
					startx: 3,
					starty: 16
				},
				{
					clue: "Onde",
					answer: "son",
					position: 18,
					orientation: "across",
					startx: 10,
					starty: 16
				},
				{
					clue: "Technologie de nvidia de la gamme rtx",
					answer: "ray-tracing",
					position: 19,
					orientation: "across",
					startx: 5,
					starty: 18
				},
				{
					clue: "addresse d'une page web",
					answer: "url",
					position: 20,
					orientation: "across",
					startx: 1,
					starty: 18
				},
				{
					clue: "Logiciel malveillant",
					answer: "virus",
					position: 21,
					orientation: "across",
					startx: 9,
					starty: 18
				},
				{
					clue: "L'un des ports les plus utilisés sur un ordinateur",
					answer: "usb",
					position: 22,
					orientation: "across",
					startx: 15,
					starty: 18
				}
			] 
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
