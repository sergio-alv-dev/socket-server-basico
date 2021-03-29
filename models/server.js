// Servidor de Express
const express = require('express');
const http    = require('http');
const socketio= require('socket.io');
const path    = require('path');
const Sockets = require('./socket');
const cors    = require('cors');

class Server {

    constructor() {

        this.app  = express();
        this.port = process.env.PORT;

        //  Http server
        this.server = http.createServer( this.app );
        
        // Configuración del socket server
        this.io = socketio( this.server, {cors: {
            origin: "*",
            methods: ["GET", "POST"]
          }} );
    }

    middlewares() {
        
        // Despliegue del directorio público
        this.app.use( express.static( path.resolve( __dirname, '../public') ) );

        // cors
        this.app.use( cors() );
        // para permitir ejecución de los socket vía protocolo file
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            next();
          });
    }

    configurarSockets() {
        new Sockets( this.io );
    }

    execute() {

        // Inicializar middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();
        
        // Inicializar Server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en puerto: ' , this.port );
        });
    }
    
    
}



module.exports = Server;