const path =  require('path');
const { v4: uuidv4 } =  require('uuid');

const subirArchivo = ( files, extensionesValidas = ["png", "jpg", "jpeg", "gif"], carpeta = '' ) => {

  return new Promise((resolve, reject) => {

    const { archivo } = files;

    const nombreCortado = archivo.name.split("."); //Aquí dividimos el nombre del archivo en cadenas
    const extension = nombreCortado[nombreCortado.length - 1]; //Con eso conseguimos la extension del archivo

    //Validar extension

    if (!extensionesValidas.includes( extension )) {
       return reject(`La extensión ${extension} no esta permitida, se permiten ${extensionesValidas}`);
    }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta , nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = {
  subirArchivo,
};
