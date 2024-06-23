import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: [3, "First Name Must Contain At Least 3 Characters!"]
    },

    lastName:{
        type: String,
        required: true,
        minLength: [3, "Last Name Must Contain At Least 3 Characters!"]
    },

    email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "Please Provide A Valid Email!"]
    },

    phone:{
        type: String,
        required: true,
        minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
        maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    },

    nic:{
        type: String,
        required: true,
        minLength: [13, "NIC Must Contain Exact 13 Digits!"],
        maxLength: [13, "NIC Must Contain Exact 13 Digits!"],
    },

    dob: {
        type: Date, //MM/DD/YYYY
        required: [true, "DOB is required!"],
    },

    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },

    password: {
        type: String,
        minLength: [8, "Password Must Contain At Least 8 Charafcters!"],
        required: true,
        select: false // this is for not getting password values
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Patient", "Doctor"],
    },

    doctorDepartment:{
        type: String,
    },

    docAvatar: {
        public_id: String,
        url: String,
    },

    });
//as user enter password but we get it in unique ##.. form for this to compare
    userSchema.pre("save", async function (next) {
        if (!this.isModified("password")) {
          next();
        }
        this.password = await bcrypt.hash(this.password, 10);
      });
      
      userSchema.methods.comparePassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      };
      
      //for generating token
      userSchema.methods.generateJsonWebToken = function () {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_EXPIRES,
        });
      };

    export const User = mongoose.model("User", userSchema);