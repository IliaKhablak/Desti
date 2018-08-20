const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let emailLengthChecker = (email)=>{
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

let usernameLengthChecker = (username)=>{
    if(!username){return false}else{
        if(username.length<3 || username.length>15){return false}else{return true}
    }
}

let validateUsername = (username)=>{
    var re = /^[a-zA-Z0-9]+$/;
    return re.test(username);
}


let validatePassword = (password)=>{
    var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
}

const emailValidators = [
    {validator:emailLengthChecker,message:'E-mail is not valid!'}
]

const usernameValidators = [
    {validator:usernameLengthChecker,message:'User name could not be less than 3 or more than 15 charakters.'},
    {validator:validateUsername,message:'User name could not contain spesific charakters.'}
]

const passwordValidators = [
    {validator:validatePassword,message:'Your password has to be minimum eight characters, at least one letter and one number'}
]

const masterSchema = new Schema({
    name: {type: String, required: true, validate:usernameValidators},
    about: {type: String},
    skills: [{type: String, required: true}],
    createdBy: {type: String, required: true},
});

module.exports = mongoose.model('Master', masterSchema);