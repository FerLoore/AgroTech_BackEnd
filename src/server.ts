//server.ts es el archivo donde se configura el servidor, 
// se conecta a la base de datos y se define el middleware para leer los datos del formulario
import express from 'express'
import router from './router'//conectar a la base de datos
import cors from "cors";

const app = express()

//Cors
app.use(cors({
    origin: (origin, callback) => {
        // Permitir cualquier puerto de localhost en desarrollo
        if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


//leer datos de forumalario
app.use(express.json())
app.use('/', router)



export default app