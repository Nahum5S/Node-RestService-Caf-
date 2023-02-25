const { Router } = require('express');
const { check } = require('express-validator');
const { productoGet, productoGetById, crearProducto, productoPut, productoDelete } = require('../controllers/productos');
const { existCategoria, existProducto } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { esAdminRol } = require('../middlewares/validar-roles');

const router = Router();

//Crear una validación personalizada del id

//Obtener todos los productos - publico
router.get('/', productoGet );

//Obtener una categoria por id - publico
router.get('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom( existProducto ),
    validarCampos
], productoGetById);

//Crear una categoria - privado - cualquier persona conn un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria no es un id de mongo').isMongoId(),
    check('categoria').custom( existCategoria ),
    validarCampos 
], crearProducto)

//Actualizar una categoria - privado - cualquier persona conn un token válido
router.put('/:id',[
    validarJWT,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existProducto ),
    validarCampos
],productoPut)

//Borrar una categoria -admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existProducto ),
    validarCampos
],productoDelete);



module.exports = router;