const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require ("../models/user.model");
const PasswordToken = require("../models/passwordToken.model");
// const { sendConfirmationEmail, sendPasswordToken } = require("../config/email.config");
const { generateTempToken } = require("../utils/generateToken");

const secretKey = process.env.JWT_SECRET_KEY;

/* Controladores Basicos CRUD */
module.exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        const emailResponse = await sendConfirmationEmail(req.body);
        console.log(emailResponse);
        res.status(200);
        res.json(newUser);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
};
module.exports.findAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200);
        res.json(users);
    } catch (error) {
        res.status(500);
        res.json({ error: error });
    }
};
module.exports.findUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (user) {
            res.status(200);
            res.json(user);
            return;
        }
        res.status(404);
        res.json({ error: "User not found" });
    } catch (error) {
        res.status(500);
        res.json({ error: error });
    }
};
module.exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
        res.status(200);
        res.json(updatedUser);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
};
module.exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.deleteOne({ _id: req.params.id });
        res.status(200);
        res.json(deletedUser);

    } catch (error) {
        res.status(500);
        res.json({ error: error });
    }
};


/* METODOS DE SESSION */

module.exports.login = async (req, res) => {
    try {
        /* Buscar el usuario */
        const user = await User.findOne({ email: req.body.email });
        /* Si no existe paro y retorno resultado */
        if (user === null) {
            res.status(404);
            res.json({
                errors: {
                    email: {
                        message: "User not found"
                    }
                }
            });
            return
        }
        /* Si existe revisamos contraseñas */
        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        /* Si contraseña no coincide paro y retorno resultado */
        if (validatePassword === false) {
            res.status(400);
            res.json({
                errors: {
                    password: {
                        message: "Wrong Password"
                    }
                }
            });
            return
        }
        /* Si contraseña ok generar jwt y cookie */
        const newJWT = jwt.sign({
            _id: user._id,
            level: user.level
        }, secretKey, { expiresIn: '10m' });

        res.cookie("userToken", newJWT, { httpOnly: true });
        res.status(200);
        res.json({ msg: "logged ok" });
    }

    catch (error) {
        res.status(500);
        res.json({
            errors: {
                server: {
                    message: error
                }
            }
        });
    }
};
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('userToken');
        res.status(200);
        res.json({ msg: 'Logout successful.' });
    } catch (error) {
        res.status(500);
        res.json({
            errors: {
                server: {
                    message: error
                }
            }
        });
    }
};

/* RESET PASSWORD */

module.exports.passwordResetToken = async (req, res) => {
    const { email } = req.query;
    console.log(email);
    try {
        /* Buscamos si existe usuario con el email */
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(404);
            res.json({ error: "User not found" });
            return;
        }
        /* Buscamos si ese usuario que si existe ya tiene un token */
        const token = await PasswordToken.findOne({ user: user._id });
        console.log(token);
        /* Si tiene Token lo eliminamos */
        if (token) {
            await PasswordToken.deleteOne({ _id: token._id });
        }
        /* Generacion Token */
        const rawToken = generateTempToken(6);
        const newToken = await PasswordToken.create({ token: rawToken, user: user._id, valid: true });
        const emailToken = await sendPasswordToken({ user: user, token: rawToken });
        /* console.log(emailToken); */
        res.status(200);
        res.json(newToken);
    } catch (error) {
        res.status(500);
        res.json({
            errors: {
                server: {
                    message: error
                }
            }
        });
    }
}

module.exports.passwordReset = async (req, res) => {
    const { email, password, confirmPassword, token } = req.body;
    const data = {
        password, confirmPassword
    }
    console.log(email, password, confirmPassword, token);
    try {
        /* Busca el usuario por email */
        const user = await User.findOne({ email: email });
        /* Si no existe finaliza */
        if (!user) {
            res.status(404);
            res.json({ error: "User not found" });
            return;
        }
        /* Busca si el usuario tiene token activo */
        const activeToken = await PasswordToken.findOne({ user: user._id });
        console.log(token);
        /* Si no hay token o el token ya no es válido */
        if (!activeToken || !activeToken.valid) {
            res.status(401);
            res.json({ error: "Token Expired" });
            return;
        }
        /* Valida el token ingresado con el hash de la DB */
        const validate = await bcrypt.compare(token, activeToken.token);
        /* Si no concuerdan, Finaliza */
        if (!validate) {
            res.status(401);
            res.json({ error: "Invalid Token" });
            return;
        }

        /* Actualizacion de contraseña */
        const userPatch = await User.findOneAndUpdate({ email: email }, data, { new: true, runValidators: true });
       /* Quema el token ( lo vuelve inválido) */
        const tokenPatch = await PasswordToken.findOneAndUpdate({ user: user._id }, { valid: false }, { new: true, runValidators: true });
        console.log(tokenPatch);
        res.status(200);
        res.json(userPatch);
    } catch (error) {
        res.status(500);
        res.json({
            errors: {
                server: {
                    message: error
                }
            }
        });
    }
}