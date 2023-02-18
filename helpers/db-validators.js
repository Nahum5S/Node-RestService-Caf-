const Role = require("../models/role");
const User = require("../models/user");

const isRoleValid = async (rol = '') => {
  const existRol = await Role.findOne({ rol }); //Si existe, es por que esta grabado en la colección de la bd
  if (!existRol) {
    throw new Error(`EL rol ${rol} no está registrado den la BD`);
  }
};

const existEmail = async (correo = '') => {
  const emailExist = await User.findOne({ correo });
  if (emailExist) {
    throw new Error(`El correo ${correo} ya esta registrado, usa otro`);
  }
};

const existUserId = async ( id ) => {
  const idExist = await User.findById( id );
  if ( !idExist ) {
    throw new Error(`El id: ${id} no existe`);
  }
};

module.exports = {
  isRoleValid,
  existEmail,
  existUserId
};
