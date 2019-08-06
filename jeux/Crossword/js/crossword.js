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
					clue: "note de musique",
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
					startx: 16,
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
					starty: 20
				},
				{
					clue: "Logiciel malveillant",
					answer: "virus",
					position: 21,
					orientation: "across",
					startx: 9,
					starty: 20
				},
				{
					clue: "L'un des ports les plus utilisés sur un ordinateur",
					answer: "usb",
					position: 22,
					orientation: "across",
					startx: 15,
					starty: 20
				},
				{
					clue: "L'adresse d'un utilisateur sur internet",
					answer: "ip",
					position: 23,
					orientation: "across",
					startx: 14,
					starty: 19
				},
				{
					clue: "Opération très utililsée en informatique",
					answer: "et",
					position: 24,
					orientation: "across",
					startx: 17,
					starty: 19
				},
				{
					clue: "Grande entreprise fabriquant des cartes graphiques",
					answer: "nvidia",
					position: 1,
					orientation: "down",
					startx: 3,
					starty: 1
				},
				{
					clue: "Magasin",
					answer: "store",
					position: 2,
					orientation: "down",
					startx: 7,
					starty: 1
				},
				{
					clue: "Deux",
					answer: "bi",
					position: 3,
					orientation: "down",
					startx: 10,
					starty: 1
				},
				{
					clue: "Synonyme de vieux",
					answer: "ages",
					position: 4,
					orientation: "down",
					startx: 12,
					starty: 1
				},
				{
					clue: "Port utilisé pour brancher les disques durs à la carte mère",
					answer: "sata",
					position: 5,
					orientation: "down",
					startx: 1,
					starty: 3
				},
				{
					clue: "Matériel permettant de stocker des données et d'y accéder très rapidement",
					answer: "ssd",
					position: 6,
					orientation: "down",
					startx: 10,
					starty: 4
				},
				{
					clue: "Ensemble normalisé de fonctions de calcul d'images 2D ou 3D lancé par Silicon Graphics en 1992",
					answer: "opengl",
					position: 7,
					orientation: "down",
					startx: 14,
					starty: 4
				},
				{
					clue: "carte (traduction en anglais )",
					answer: "map",
					position: 8,
					orientation: "down",
					startx: 4,
					starty: 6
				},
				{
					clue: "Ce qui sert à stocker",
					answer: "memoire",
					position: 9,
					orientation: "down",
					startx: 2,
					starty: 7
				},
				{
					clue: "Collection de bibliothèques destinées à la programmation d’applications multimédia, plus particulièrement de jeux ou de programmes faisant intervenir de la vidéo, sur les plates-formes Microsoft",
					answer: "directx",
					position: 10,
					orientation: "down",
					startx: 17,
					starty: 7
				},
				{
					clue: "Structure d'un système informatique.",
					answer: "architecture",
					position: 11,
					orientation: "down",
					startx: 5,
					starty: 8
				},
				{
					clue: "On en trouve partout sur internet",
					answer: "chat",
					position: 12,
					orientation: "down",
					startx: 7,
					starty: 8
				},
				{
					clue: "Programmes informatiques destinés à permettre à un autre programme (souvent un système d'exploitation) d'interagir avec un périphérique",
					answer: "drivers",
					position: 13,
					orientation: "down",
					startx: 10,
					starty: 10
				},
				{
					clue: "Multiplet de 8 bits codant une information",
					answer: "octet",
					position: 14,
					orientation: "down",
					startx: 1,
					starty: 12
				},
				{
					clue: "Très haute gamme de cartes graphiques nvidia destinées généralement pour le gaming",
					answer: "titan",
					position: 15,
					orientation: "down",
					startx: 12,
					starty: 12
				},
				{
					clue: "OS open source",
					answer: "linux",
					position: 16,
					orientation: "down",
					startx: 14,
					starty: 12
				},
				{
					clue: "Tout écran en est composé d'une très grande quantité",
					answer: "pixel",
					position: 17,
					orientation: "down",
					startx: 3,
					starty: 16
				},
				{
					clue: "Condition très utilisée en informatique",
					answer: "si",
					position: 18,
					orientation: "down",
					startx: 13,
					starty: 17
				},
				{
					clue: "Processeur",
					answer: "cpu",
					position: 19,
					orientation: "down",
					startx: 12,
					starty: 18
				},
				{
					clue: "Carte Graphique",
					answer: "gpu",
					position: 20,
					orientation: "down",
					startx: 15,
					starty: 18
				},
				{
					clue: "Toile",
					answer: "web",
					position: 21,
					orientation: "down",
					startx: 17,
					starty: 18
				}
			] 
	
		$('#puzzle-wrapper').crossword(puzzleData);
		
	})
	
})(jQuery)
