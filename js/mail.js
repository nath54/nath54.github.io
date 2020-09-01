
var disponible=true;

function sendEmail() {
    //
    var name=document.getElementById("name").value;
    var email=document.getElementById("email").value;
	//
	if(disponible){
		Email.send({
		Host: "smtp.gmail.com",
		Username : "<sender’s email address>",
		Password : "<email password>",
		To : '<recipient’s email address>',
		From : "<sender’s email address>",
		Subject : "<email subject>",
		Body : "<email body>",
		}).then(
			message => alert("mail sent successfully")
		);
	}
	else{
		alert("fonction pas encore disponible");
	}
}