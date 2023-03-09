const express = require("express");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const  { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require("../sockets/controller");

class Server {
  
    constructor() {
    this.app = express(); //Le asignamos a una propiedad express, es como instanciar pero ahora usamos App
    this.port = process.env.PORT;
    this.server = createServer( this.app );
    this.io = require('socket.io')(this.server);

    this.paths = {
      auth: '/api/auth',
      buscar:'/api/buscar',
      categorias:'/api/categorias',
      usuarios:'/api/users',
      productos:'/api/productos',
      uploads:'/api/uploads'
    }

    //Conectar a BD
    this.conectarDB();  

    //Middlewares
    this.middlewares();

    //Rutas de mi aplicación
    this.routes();

    //Sockets
    this.sockets();
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

    //Uploads
    this.app.use( fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
  }));
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.buscar, require('../routes/buscar'));
    this.app.use(this.paths.categorias, require('../routes/categorias'));
    this.app.use(this.paths.usuarios, require('../routes/user'));
    this.app.use(this.paths.productos, require('../routes/productos'));
    this.app.use(this.paths.uploads, require('../routes/uploads'));
    
  }

  sockets(){
    this.io.on('connection', ( socket ) => socketController (socket, this.io) )

  }

  listen(){
    this.server.listen(this.port,()=>{
        console.log("Esta corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
