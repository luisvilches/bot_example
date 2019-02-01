const Semplice = require('semplice');
const request = require("request");
const server = new Semplice();

const token = 'EAAgRJjZBRJdsBAEBF79ZBFFR7yoZBwPvUCpcSWKui2tY8EtFVZCwQHzZCZAiwtHbNr3z4iuTBFaR0uqZCobqKJqoS0YNxS0bQfqMZAYjJd4csHXocg8ZCOuRBpAbyNUaiEMKli0GlDrV4lJaDHXpAOfxIjoZCLqeCjQ0rdDOKvCQ5HSm3hTzRfCae0';

const routes = [
    {
        path:'/',
        method:'GET',
        controller: function(req,res,utils){
            res.send(200,{message:"Se ha desplegado de manera exitosa el Cavernicola ChatBot :D!!!"});
        }
    },
    {
        path:'/webhook',
        method:'GET',
        controller: function(req,res,utils){
            if (req.queryString["hub.verify_token"] === token) {
                // Mensaje de exito y envio del token requerido
                console.log("webhook verificado!");
                res.status(200).send(req.queryString["hub.challenge"]);
            } else {
                // Mensaje de fallo
                console.error("La verificacion ha fallado, porque los tokens no coinciden");
                res.sendStatus(403);
            }
        }
    },
    {
        path:'/webhook',
        method:'POST',
        controller: function(req,res,utils){
            if (req.body.object == "page") {
                // Si existe multiples entradas entraas
                req.body.entry.forEach(function(entry) {
                    // Iterara todos lo eventos capturados
                    entry.messaging.forEach(function(event) {
                        if (event.message) {
                            process_event(event);
                        }
                    });
                });
                res.sendStatus(200);
            }
        }
    }
];

routes.map(e => server.addRoute(e));

server.listen((process.env.PORT || 5000), () => console.log('El servidor webhook esta escchando!'))



// Funcion donde se procesara el evento
function process_event(event){
    // Capturamos los datos del que genera el evento y el mensaje 
    var senderID = event.sender.id;
    var message = event.message;
    
    // Si en el evento existe un mensaje de tipo texto
    if(message.text){
        // Crear un payload para un simple mensaje de texto
        var response = {
            "text": 'Enviaste este mensaje: ' + message.text
        }
    }
    
    // Enviamos el mensaje mediante SendAPI
    enviar_texto(senderID, response);
}

// Funcion donde el chat respondera usando SendAPI
function enviar_texto(senderID, response){
    // Construcicon del cuerpo del mensaje
    let request_body = {
        "recipient": {
          "id": senderID
        },
        "message": response
    }
    
    // Enviar el requisito HTTP a la plataforma de messenger
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
          console.log('Mensaje enviado!')
        } else {
          console.error("No se puedo enviar el mensaje:" + err);
        }
    }); 
}