const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

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

// let passwordLength = (password)=>{
//     if(!password){return false}else{
//         if(password.length<8 || password.length>35){return false}else{return true}
//     }
//}

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

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true, validate:emailValidators},
    username: {type: String, required: true, unique: true, lowercase: true, validate:usernameValidators},
    password: {type: String, required: true,validate:passwordValidators}
});

userSchema.pre('save', function(next){
    let self = this;
  
    bcrypt.hash(this.password, null, null, function(err,hash){
        // console.log('password here:',self.password);
        // console.log('Hash:',hash);
        if(err){
            // console.log('point No2',err);
            next(err);
        }
        else{
            // console.log('point No3',hash);
            self.password = hash;
            next();
        }
    })
})

userSchema.methods.comparePassword = function(password){
    // let self = this;
    // console.log(this.password)
    return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User', userSchema);