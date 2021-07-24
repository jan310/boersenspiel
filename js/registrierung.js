'use strict'

let success = false;

function examineAnswers(){

    success = true;

    let fname = document.getElementById("firstName").value;
    let lname = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let email2 = document.getElementById("email2").value;
    let post = document.getElementById("post").value;

    if(fname == ""){
        document.getElementById("firstName").classList.add('is-invalid');
        success = false;
    }else{
        document.getElementById("firstName").classList.remove('is-invalid');
        document.getElementById("firstName").classList.add('is-valid');
    }

    if(lname == ""){
        document.getElementById("lastName").classList.add('is-invalid');
        success = false;
    }else{
        document.getElementById("lastName").classList.remove('is-invalid');
        document.getElementById("lastName").classList.add('is-valid');
    }

    if(emailIsValid(email) == true){
        document.getElementById("email").classList.remove('is-invalid');
        document.getElementById("email").classList.add('is-valid');
        document.getElementById("emailID").style.visibility = "hidden";
    }else{
        document.getElementById("emailID").style.visibility = "visible";
        document.getElementById("email").classList.add('is-invalid');
        success = false;
    }

    if(email == email2 && emailIsValid(email2) == true){
        document.getElementById("email2").classList.remove('is-invalid');
        document.getElementById("email2").classList.add('is-valid');
        document.getElementById("email2ID").style.visibility = "hidden";
    }else{
        document.getElementById("email2ID").style.visibility = "visible";
        document.getElementById("email2").classList.add('is-invalid');
        success = false;
    }

    if(calculateOlderThen18()){
        document.getElementById("birthDate").classList.remove('is-invalid');
        document.getElementById("birthDate").classList.add('is-valid');
        document.getElementById("birthDateID").style.visibility = "hidden";
    }else{
        document.getElementById("birthDateID").style.visibility = "visible";
        document.getElementById("birthDate").classList.add('is-invalid');
        success = false;
    }

    if(countNumbers(post) != 0 && countNumbers(post) != 5){
        document.getElementById("postID").style.visibility = "visible";
        document.getElementById("post").classList.add('is-invalid');
        success = false;
    }

    if(countNumbers(post) == 5){
        document.getElementById("post").classList.remove('is-invalid');
        document.getElementById("post").classList.add('is-valid');
        document.getElementById("postID").style.visibility = "hidden";
    }

    if(countNumbers(post) == 0){
        document.getElementById("postID").style.visibility = "hidden";
    }

    if(success == true){
        //weiterleitung auf nächste Seite
        //window.location.href="weiterleitung.html";
        var myModal = new bootstrap.Modal(document.getElementById('weiterleitungModal'), {backdrop: "static"})
        myModal.show();
    }
}

function calculateOlderThen18(){
    let inputBirthDate = document.getElementById("birthDate").value;
    let UserDate = new Date(inputBirthDate);
    let currentDate = new Date();

    let age = currentDate.getFullYear() - UserDate.getFullYear();
    let month = currentDate.getMonth() - UserDate.getMonth();
    
    if(month < 0) age = age - 1; 

    if(currentDate.getDate() < UserDate.getDate() && month == 0) age = age - 1;

    if(age >= 18) return true;
    if(age < 18) return false;
}

function countNumbers(i){
    return (i + "").length;
}

function routingGame(){
    window.location.href="boersenspiel.html";
}

function emailIsValid(emailValidation){
    //Email validation mit regular expression
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailValidation)
}