const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: [2, "Name must be at least 3 characters long"],
        required: [true, "Name is required"]
    }, 
    lastName: {
        type: String,
        minLength: [2, "Last name must be at least 3 characters long"],
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        minLength: [3, "Email must be at least 3 characters long"],
        unique: [true, "Username is already taken"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        }          
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        validate: [
            { validator: (value) => /^(?=.*[a-z])/.test(value), message: "Password must include a lowercase" },
            { validator: (value) => /^(?=.*[A-Z])/.test(value), message: "Password must include a UPPERCASE" },
            { validator: (value) => /^(?=.*\d)/.test(value), message: "Password must include a number" },
        ]
    }
}, { timestamps: true, versionKey: false })

/* Campos virtuales que no se guardan en la DB */
UserSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);

/* Prevalidaciones al modelo */
UserSchema.pre('validate', function (next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});

/* Funciones que se ejecutan antes de guardar */
UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
      .then(hash => {
        this.password = hash;
        next();
      });
  });
  
const User = mongoose.model("User", UserSchema);

module.exports = User;