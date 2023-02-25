const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { crearCategoria, categoriaGet, categoriGetById, categoriaPut, categoriaDelete } = require('../controllers/categorias');
const { existCategoria } = require('../helpers/db-validators');
const { esAdminRol } = require('../middlewares/validar-roles');

const router = Router();

//Crear una validación personalizada del id

//Obtener todas las categorias - publico
router.get('/', categoriaGet );

//Obtener una categoria por id - publico
router.get('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom( existCategoria ),
    validarCampos
], categoriGetById);

//Crear una categoria - privado - cualquier persona conn un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos 
], crearCategoria)

//Actualizar una categoria - privado - cualquier persona conn un token válido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existCategoria ),
    validarCampos
],categoriaPut)

//Borrar una categoria -admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existCategoria ),
    validarCampos
],categoriaDelete);



module.exports = router;