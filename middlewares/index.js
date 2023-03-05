const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validarArchivo');

module.exports={
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivo
}