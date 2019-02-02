const Semplice = require('semplice');
const request = require("request");
const server = new Semplice();

const token = 'EAAgRJjZBRJdsBAEMTtsCDZB4lbWwD9uReYJvWykoRFrBZAygOcKIFaII24AZBxBcZBayTWh5279EaE5CyXiKTt7VFLDf119wcXqayrWc0ZBeSFyrLPCKZAehuciZBIALLxsg668eRmT5RqChsdEgSot3ePVBZCDfiZCxP18Du17XEYMlS53BFgEZBM7';
const tkn = '123456';

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
            validFacebook(req,res,tkn,function(){
                console.log('okidoki')
            })
        }
    },
    // {
    //     path:'/webhook',
    //     method:'POST',
    //     controller: function(req,res,utils){
            
    //     }
    // }
];

routes.map(e => server.addRoute(e));

server.listen((process.env.PORT || 5000), () => console.log('El servidor webhook esta escchando!'))

function validFacebook(req,res,tkn,callback){
    if(req.queryParams['hub.verify_token'] === tkn){
        console.log(req.queryParams);
        console.log(req.queryParams['hub.verify_token'],tkn,req.queryParams['hub.challenge']);
        res.writeHead(200,{'Content-Type': 'application/html;charset=utf-8'});
        res.write(req.queryParams['hub.challenge']);
    } else {
        res.send(502,'tu no deberias estas acá');
    }
}


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