//index.ts es el punto de entrada de la aplicación, aquí se configura el servidor y se inicia la aplicación
import server from './server' // Agrega el .ts solo para probar si el IDE lo reconoce
import colors from 'colors'

///////////////////////////////////////////////////////////////////////
const port = process.env.PORT || 9090

//Routing
server.listen(port, () => {
    console.log(colors.bgCyan.blue.bold(`Server is running on port: ${port}`))
})