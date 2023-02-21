const { response } = require('express')


const esAdminRol = (req, res = response, next) =>{//Este es para que solo si es admin permita el paso

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre} = req.usuario;
    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: ` ${nombre}  no tiene permisos de administrador - No tiene permitido `
        });
    }

    next();
}


const tieneRol = ( ...roles ) => {//Este puede permitir que más de un rol pase, pero nosotros lo definimos
    return ( req, res = response, next ) =>{

        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if( !roles.includes( req.usuario.rol ) ) {
            return res.status(401).json({
                msg: `El servicio equiere uno de estos roles ${ roles }`
            });
        }


        next();
    }
}

module.exports ={
    esAdminRol, tieneRol
}