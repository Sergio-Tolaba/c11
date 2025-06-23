import express from 'express'
import cors from 'cors'
const app = express() 
//Array de productos como objetos literales
const products = [
  {
    "id": 1,
    "nombre": "Uno 1",
    "precio": 19.99,
    "cantidad": 10
  },
  {
    "id": 2,
    "nombre": "Dos 2",
    "precio": 39.99,
    "cantidad": 5
  },
  {
    "id": 3,
    "nombre": "Tres 3",
    "precio": 59.99,
    "cantidad": 3
  }
]
//Middleware
app.use(express.json())
app.use(cors())//Si mi api no usa navegadores, no hace falta ponerlo ya que cors aparece en los navegadores

//Rutas
app.get('/',(req,res)=>{
    //res.send("API Rest con Node.js ") - No es para humanos sino para otras aplicaciones, usa JSON
    res.json({"menssage": "API Rest con Node.js "})
})

app.get('/products', (req, res)=>{
    res.json(products)
})
 

//query no se define  en la ruta Ej /search?nombre=no&precio=10 =>[Object: null protype]{nombre: 'no', precio: '10}//?clave=valor
//Quiero buscar modifico nombre: "Uno 1", antes eran camiseta, pantalon, zapato
//Agrego search que no es un parametro, necesito filtrar o buscar un producto por su nombre (precio, etc)
//Busqueda debe estar antes que .../:id porque sino toma el /search como :id y si no existe muestra:'No existe el producto
//Si a cualquier ruta Ej /products?nombre=Uno => no hace nada porque no tengo una logica para ese query, toma solo la ruta definida
app.get('/products/search', (req, res)=>{
  //console.log(req.query)
  const {nombre} = req.query
  const filteredProducts = products.filter((p)=>p.nombre.toLowerCase().includes(nombre.toLowerCase()))
  res.json(filteredProducts)

})
//param basico
app.get('/products/2', (req, res)=>{
  const product = products.find((item)=>item.id == 2)
  res.json(product)
})
//params se definen en la ruta
app.get('/products/:id', (req, res)=>{//:category/:slug=>escribir el nombre en un formato mas amigable tipo url Ej receta-sergio
  console.log(req.params) // es un objeto y el numero es un string - if (isNan(id){console.log('No es num')})
  //Si quiero el id tengo que desestructurarlo. Tambien puedo validar si esta o no esta el id
  const {id} = req.params//{id, category}
  const product = products.find((item)=>item.id == req.params.id)
  console.log(product)//id que no existe=>undefined
  if (!product){
    res.status(404).json({error: 'No existe el producto'})
  }
  res.json(product)
})

app.post('/products', (req,res)=>{ 
  //console.log(req.body) // Voy a postman, envio Produto 1 pero no llega: undefined. Necesito middleware
  //Luego si tengo esto en consola: { name: 'Producto 1', price: 123 }
  //res.send("POST")//Veo en Postan con status 200 OK
  const {nombre, precio} = req.body
  const newProduct = {
    id: products.length + 1,
    nombre,
    precio
  }
  products.push(newProduct)
  res.status(200).json(newProduct) // Postman: lo muestra en post y en get lo agrega al final
})

const PORT = 3000

app.listen(PORT, (req,res)=>console.log(`http://localhost:${PORT}`))