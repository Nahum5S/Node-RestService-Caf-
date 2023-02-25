const { response } = require("express");
const Producto = require("../models/producto");



const productoGet = async(req = require, res =  response) =>{
    const { limite = 0, desde = 0} = req.query;
    const query = { estado: true };

    const [ total, producto ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario','nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        producto
    });


}

const productoGetById = async(req, res = response) =>{
    const { id } =  req.params;

    const producto = await Producto.findById(id)
                           .populate('usuario','nombre')
                           .populate('categoria','nombre');

    res.json(producto);
}

const crearProducto = async(req, res =  response) =>{

    const { estado, usuario, ...body} = req.body;
    const productoDB = await Producto.findOne({nombre: body.nombre.toUpperCase()});

    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    const data = {
        ...body,
        nombre : body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await new Producto(data);
    await producto.save();
    res.status(201).json(producto);
}

const productoPut = async(req, res = response) =>{
    const { id } = req.params;
    const { estado, usuario, ...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const productoUp = await Producto.findByIdAndUpdate(id, data, { new:true });
    
    res.json(productoUp);
}

const productoDelete = async(req, res = response) =>{
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, { new:true });

    res.json(producto);
}


module.exports = {
    productoGet,
    productoGetById,
    crearProducto,
    productoPut,
    productoDelete
}