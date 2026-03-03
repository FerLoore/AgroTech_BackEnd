//server.ts es el archivo donde se configura el servidor, 
// se conecta a la base de datos y se define el middleware para leer los datos del formulario
import express from 'express'
import router from './router'//conectar a la base de datos

const app = express()

//Cors

//leer datos de forumalario
app.use(express.json())
app.use('/', router)



export default app