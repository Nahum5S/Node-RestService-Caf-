const { validationResult } = require('express-validator');


const validarCampos = (req, res, next) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){//Si hay errores
        return res.status(400).json(errors);
    }

    next();//Verifica si el el campo se ejecuto sin errores, por lo tanto pasará al siguiente a validar

}


module.exports ={
    validarCampos
}