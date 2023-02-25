const express = require("express");
const cors = require('cors');

const { dbConnection } = require('../database/config')

class Server {
  
    constructor() {
    this.app = express(); //Le asignamos a una propiedad express, es como instanciar pero ahora usamos App
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      buscar:'/api/buscar',
      categorias:'/api/categorias',
      usuarios:'/api/users',
      productos:'/api/productos'
    }

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
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.buscar, require('../routes/buscar'));
    this.app.use(this.paths.categorias, require('../routes/categorias'));
    this.app.use(this.paths.usuarios, require('../routes/user'));
    this.app.use(this.paths.productos, require('../routes/productos'));
    
  }

  listen(){
    this.app.listen(this.port,()=>{
        console.log("Esta corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
