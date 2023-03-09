const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {

  try {
    //const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({ nombre });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const actualizarImagen = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvidó validar esto",
      });
  }

  // Limpiar imagenes previas

  if ( modelo.img ){
    //Borrar la imagen del servidor 
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if( fs.existsSync( pathImagen ) ){
      fs.unlinkSync ( pathImagen );
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

const actualizarImagenCloudinary = async (req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvidó validar esto",
      });
  }

  // Limpiar imagenes previas

  if ( modelo.img ){
    const nombreArr = modelo.img.split('/');//Separamos el url en una cadena especificando dividir por /
    const nombre = nombreArr[ nombreArr.length -1]; //Con esto obtenemos la última parte de la URL que es el nombre de la imagen
    const [ public_id ] = nombre.split('.'); //Desestructuramos para solo obtener el nombre de la imagen si el jpg
    cloudinary.uploader.destroy( public_id );//Eliminamos la imagen anterior
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
  modelo.img = secure_url;

  await modelo.save();

   res.json( modelo );
};


const mostrarImagen = async(req, res = response) =>{

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case 'productos':
      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvidó validar esto",
      });
  }

  // Limpiar imagenes previas

  if ( modelo.img ){
    //Traemos la url del cloud
    return res.status(200).json(modelo.img);
  }
    //Si no tiene una imagen entonces mandamos una por defecto
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    return res.sendFile( pathImagen );

}


module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
};