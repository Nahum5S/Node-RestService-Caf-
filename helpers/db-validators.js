const Role = require("../models/role");
const {User,Categoria, Producto} = require("../models");

const isRoleValid = async (rol = '') => {
  const existRol = await Role.findOne({ rol }); //Si existe, es por que esta grabado en la colección de la bd
  if (!existRol) {
    throw new Error(`EL rol ${rol} no está registrado den la BD`);
  }
};

const existEmail = async (correo = '') => {
  const emailExist = await User.findOne({ correo });
  if (emailExist) {
    throw new Error(`El correo ${correo} ya esta registrado, intenta otro`);
  }
};

const existUserId = async ( id ) => {
  const idExist = await User.findById( id );
  if ( !idExist ) {
    throw new Error(`El usuario con el id: ${id} no existe`);
  }
};

const existCategoria = async ( id ) => {
  const idExist = await Categoria.findById( id );
  if ( !idExist ) {
    throw new Error(`La categoria con el id: ${id} no existe`);
  }
};

const existProducto = async ( id ) => {
  const idExist = await Producto.findById( id );
  if ( !idExist ) {
    throw new Error(`El producto con el id: ${id} no existe`);
  }
};





module.exports = {
  isRoleValid,
  existEmail,
  existUserId,
  existCategoria,
  existProducto
};
