const { response } = require("express");
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req, res = response) =>{

    const {correo, password} = req.body;

    try {

        //Verificar si el correo existe
        const usuario =  await User.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //Verificar la contraseña
        const validPassword = bcrypt.compareSync( password,usuario.password );
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo salio mal'
        })
    }
}




module.exports = {
    login
}