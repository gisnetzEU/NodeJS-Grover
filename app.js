const debug = require('debug')('app.inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');

//const logger = require('./logger');
const Joi = require('joi');
const app = express();
var morgan = require('morgan');

app.use(express.json()); //body var1=valor1
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Configuracion de entornos
console.log('Aplicacion' + config.get('nombre'));
console.log('BDServer' + config.get('configDB.host'));
//$env:NODE_ENV="development"
//$env:NODE_ENV="production"

//Uso de Middleware de tercero - Morgan

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  //console.log("Morgan habilitado");
  debug('Morgan esta habilitado');
}

//Trabajos con la base de datos
//$env:DEBUG = "*"
debug('Conectando con la bd...');

//app.use(logger);

// app.use(function (req, res, netx) {
//   console.log('Autenticando');
//   netx();
// })


// app.get(); //peticion
// app.post(); //envio de datos
// app.put(); //actualizacion
// app.delete(); //eliminacion

const usuarios = [
  { id: 1, nombre: 'Giselle' },
  { id: 2, nombre: 'Pablo' },
  { id: 3, nombre: 'Ana' },
]

app.get('/', (req, res) => {
  res.send('Hola mundo desde Express')
});

app.get('/api/usuarios', (req, res) => {
  res.send(usuarios);
});

// app.get('/api/usuarios/:id', (req, res) => {
//   res.send(req.params.id);
// });

/*http://localhost:5000/api/usuarios/2*/

// app.get('/api/usuarios/:year/:mes', (req, res) => {
//   res.send(req.params);
// });

/*http://localhost:5000/api/usuarios/2020/2*/

// app.get('/api/usuarios/:year/:mes', (req, res) => {
//   res.send(req.query);
// });

/*http://localhost:5000/api/usuarios/2?sexo=M*/

app.get('/api/usuarios/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) res.status(404).send('El usuario no fue encontrado');
  res.send(usuario);
});

/*http://localhost:5000/api/usuarios/2*/

//Middleware

/* app.post('/api/usuarios', (req, res) => {
  if (!req.body.nombre  || req.body.nombre.length <= 2) {
    //400 bad request
    res.status(400).send('Debe ingresar un nombre que tenga mínimo 3 letras');
    return;
  }
  const usuario = {
    id: usuarios.length + 1,
    nombre: req.body.nombre
  };
  usuarios.push(usuario);
  res.send(usuario);
})

//http://localhost:5000/api/usuarios
 */


app.post('/api/usuarios', (req, res) => {

  /*   let body = req.body;
    console.log(body.nombre);
    res.json({
      body
    }) */

  const schema = Joi.object({
    nombre: Joi.string().min(3).required()
  });

  const { error, value } = validarUsuario(req.body.nombre);

  if (!error) {
    const usuario = {
      id: usuarios.length + 1,
      nombre: value.nombre
    };
    usuarios.push(usuario);
    res.send(usuario);
  }
  else {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
  }
})

app.put('/api/usuarios/:id', (req, res) => {

  let usuario = existeUsuario(req.params.id);

  if (!usuario) {
    res.status(404).send('El usuario no fue encontrado');
    return;
  }

  const { error, value } = validarUsuario(req.body.nombre);

  if (error) {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
    return;
  }

  usuario.nombre = value.nombre;
  res.send(usuario);

})

app.delete('/api/usuarios/:id', (req, res) => {
  let usuario = existeUsuario(req.params.id);
  if (!usuario) {
    res.status(404).send('El usuario no fue encontrado');
    return;
  }

  const index = usuarios.indexOf(usuario);
  usuarios.splice(index, 1);

  res.send(usuarios);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}...`)
});

function existeUsuario(id) {
  return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom) {

  const schema = Joi.object({
    nombre: Joi.string().min(3).required()
  });
  return (schema.validate({ nombre: nom }))
}


//GET
//http://localhost:3000/api/usuarios

// [
//   {
//       "id": 1,
//       "nombre": "Giselle"
//   },
//   {
//       "id": 2,
//       "nombre": "Lila"
//   },
//   {
//       "id": 3,
//       "nombre": "Ana"
//   }
// ]

//POST
// {
//   "nombre": "Pedro"
// }
//http://localhost:3000/api/usuarios
//
// {
//   "id": 4,
//   "nombre": "Pedro"
// }

//put
//http://localhost:3000/api/usuarios/5
//El usuario no fue encontrado


//DELETE 
//http://localhost:3000/api/usuarios/3