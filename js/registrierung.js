'use strict'

let succcses = false;

function examineAnswers(){

    succcses = true;

    let fname = document.getElementById("firstName").value;
    let lname = document.getElementById("lastName").value;
    let email = document.getElementById("email").value;
    let email2 = document.getElementById("email2").value;
    let post = document.getElementById("post").value;

    if(fname == ""){
        document.getElementById("firstName").classList.add('is-invalid');
        succcses = false;
    }else{
        document.getElementById("firstName").classList.remove('is-invalid');
        document.getElementById("firstName").classList.add('is-valid');
    }

    if(lname == ""){
        document.getElementById("lastName").classList.add('is-invalid');
        succcses = false;
    }else{
        document.getElementById("lastName").classList.remove('is-invalid');
        document.getElementById("lastName").classList.add('is-valid');
    }

    if(email == email2 && email != ""){
        document.getElementById("email").classList.remove('is-invalid');
        document.getElementById("email").classList.add('is-valid');
        document.getElementById("email2").classList.remove('is-invalid');
        document.getElementById("email2").classList.add('is-valid');
    }else{
        document.getElementById("email").classList.add('is-invalid');
        document.getElementById("email2").classList.add('is-invalid');
        succcses = false;
    }

    if(getAge() >= 18){
        document.getElementById("birthDate").classList.remove('is-invalid');
        document.getElementById("birthDate").classList.add('is-valid');
    }else{
        document.getElementById("birthDate").classList.add('is-invalid');
        succcses = false;
    }

    if(countNumbers(post) >= 5){
        document.getElementById("post").classList.remove('is-invalid');
        document.getElementById("post").classList.add('is-valid');
    }else{
        document.getElementById("post").classList.add('is-invalid');
        succcses = false;
    }

    if(succcses == true){
        //weiterleitung auf nächste Seite
        //alert("erfolgreich regestirert!")
    }
}

function getAge(){
    let today = new Date();
    let birthDateUser = document.getElementById("birthDate").value;
    let birthDate = new Date(birthDateUser);

    let age = today.getFullYear() - birthDate.getFullYear();
    let month = today.getMonth() - birthDate.getMonth();

    if(month < 0 || (month === 0 && today.getDate() < birthDate.getDate())){
        age = age -1;
    }
    return age;
}

function countNumbers(i){
    return (i + "").length;
}