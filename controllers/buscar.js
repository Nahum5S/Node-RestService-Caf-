const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const {Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = '' ,res = response) =>{

    const esMongoId = ObjectId.isValid( termino ); //True

    if( esMongoId ){
        const usuario = await Usuario.findById(termino);
        res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const usuarios = await  Usuario.find({  //Si queremos contar el número de respuestas solo es cuestión de cambiar el find por el count
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        results: (usuarios) ? [usuarios] : []
    });

}

const buscarCategorias = async (termino = '' ,res = response) =>{

    const esMongoId = ObjectId.isValid( termino ); //True

    if( esMongoId ){
        const categoria = await Categoria.findById( termino );
        res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const categorias = await  Categoria.find({ nombre: regex, estado:true });
    res.json({
        results: (categorias) ? [categorias] : []
    });

}

const buscarProductos = async (termino = '' ,res = response) =>{

    const esMongoId = ObjectId.isValid( termino ); //True

    if( esMongoId ){
        const producto = await Producto.findById( termino )
                                                .populate('categoria','nombre');
        res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const productos = await  Producto.find({ nombre: regex, estado:true })
                                            .populate('categoria','nombre');
    res.json({
        results: (productos) ? [productos] : []
    });

}

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case 'usuarios':
        buscarUsuarios( termino, res );
      break;
    case 'categorias':
        buscarCategorias( termino, res );
      break;
    case 'productos':
        buscarProductos( termino, res );
      break;
    default:
      res.status(500).json({
        msg: "Aún no existe esta busqueda",
      });
  }
 
};

module.exports = {
  buscar
};
