const { response } = require("express");
const Usuario = require("../models/user");
const bcrypt = require("bcryptjs");

const userGet = async (req, res = response) => {
  const { limite = 0, desde = 0 } = req.query;
  const query = { estado: true };

  //El total y el user son posicionales, total va con count y find con users
  const [total, users] = await Promise.all([//Necesitamos que ambas consultas se hagan al mismo tiempo ya que una depende de la otra por lo tanto
    Usuario.countDocuments(query),//Agregamos la promise.all para que las ejecute al mismo tiempo y reducir el tiempo de espera
    Usuario.find(query)
      .skip(Number(desde)) 
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    users
  });
};

const userPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contraseña
  const salt = bcrypt.genSaltSync(); //Este método es para el número de vueltas para hacer la desencriptación
  usuario.password = bcrypt.hashSync(password, salt);

  //Guardar en la db
  await usuario.save();

  res.json({
    usuario,
  });
};

const userPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO: Validar contra las base de datos
  if (password) {
    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync(); //Este método es para el número de vueltas para hacer la desencriptación
    resto.password = bcrypt.hashSync(password, salt);
  }
  const user = await Usuario.findByIdAndUpdate(id, resto);
  res.json(user);
};

const userDelete = async(req, res = response) => {
  const {id} = req.params;

  //Fisicamente lo borramos
  //const user = await Usuario.findByIdAndDelete( id );

  const user = await Usuario.findByIdAndUpdate(id, {estado:false});

  res.json(user);
};

module.exports = {
  userGet,
  userPut,
  userPost,
  userDelete,
};
