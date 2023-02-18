const express = require("express");
const cors = require('cors');

const { dbConnection } = require('../database/config')

class Server {
  
    constructor() {
    this.app = express(); //Le asignamos a una propiedad express, es como instanciar pero ahora usamos App
    this.port = process.env.PORT;
    this.usuariosPath = '/api/users';
    

    //Conectar a BD
    this.conectarDB();
  

    //Middlewares
    this.middlewares();

    //Rutas de mi aplicación
    this.routes();

  }

  async conectarDB(){
    await dbConnection();
  }

  middlewares(){
    
    //CORS
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use( express.static('public'));
  }

  routes() {
    this.app.use(this.usuariosPath, require('../routes/user'));
    
  }

  listen(){
    this.app.listen(this.port,()=>{
        console.log("Esta corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
