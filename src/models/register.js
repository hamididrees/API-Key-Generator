const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: [30, "maximum 30 letters"],
    },
    email:{
        type: String,
        required: true,
        unique: [true, "this Email is already exists"],
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    apikey: {
        type: String,
        required: true,
    }
})

// converting password into bcrypt hash
userSchema.pre("save", async function(next) {

    if (this.isModified("password")) {
        //const passwordHash = await bcrypt.hash(password, 10);
        console.log(`the current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`the current password is ${this.password}`);

        //the undifined is use to ignore or not save confirm password in DB
        //this.confirmPassword = undefined;
    }
    next();
})

// create model
const Register = new mongoose.model('User', userSchema);

// create user define module to use on other page
module.exports = Register;