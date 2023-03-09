const { response } = require("express");
const bcrypt = require('bcryptjs')

const User = require('../models/user');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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


const googleSignIn = async(req, res = response) =>{
    const { id_token } = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await User.findOne({correo});

        if( !usuario ){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: 'uwu',
                img,
                google: true
            };

            usuario = new User( data );
            await usuario.save();
        }

        // Si el usuario existe en la DB
        if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador - Usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    }
}


const renovarToken = async(req, res = response) => {

    const { usuario } = req;

    //Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    })


}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}