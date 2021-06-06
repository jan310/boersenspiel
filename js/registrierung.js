

function examineAnswers(){

    let fname = document.getElementById("firstName").value;
    let lname = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let email2 = document.getElementById("email2").value;
    let birthDate = document.getElementById("birthDate").value;
    let post = document.getElementById("post").value;

    if(fname == ""){
        document.getElementById("firstName").style.border = "1px solid red";
        document.getElementById("firstName").placeholder = "Dies ist ein Pflichtfeld, bitte Namen angeben";
    }else{
        document.getElementById("firstName").style.border = "1px solid darkgoldenrod";
    }
}