const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const User =  require('../models/user');

const validarJWT = async(req = request, res = response, next) =>{

    const token =  req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        //Leer el usuario que corresponde al uid
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await User.findById(uid);

        //Verificar si el uid no sea null
        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            });
        }

        //Verificar si el uid tiene estado true
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no válido - usuario estado inactivo'

            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        });
        
    }
}



module.exports = {
    validarJWT
}