var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var VoiceResponse = require('twilio').twiml.VoiceResponse;
var client = require("twilio")(accountSid, authToken);
var survey = require('../survey_data');
var db = require("../models");

var questions = ["From 1 being worst and 5 being excellent. How would you qualify the service given?",
    "From 1 being worst and 5 being excellent. How would you qualify the foods and beverage?",
    "From 1 being worst and 5 being excellent. How satisfy where you with the overall experience",
    "Thank you for your time"]

var questionIndex;

module.exports = function (app) {
    app.post("/call", function (request, response) {
        var CelaLlamar = request.body.celular;
        //console.log("El cel a llamar es " + CelaLlamar);
        var url = "https://64351e22.ngrok.io/voice"

        var options = {
            to: CelaLlamar,
            from: process.env.TWILIO_PHONE,
            url: url,
        };

        // Place an outbound call to the user, using the TwiML instructions
        // from the /outbound route
        client.calls.create(options,
            function (err, call) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Llama exitosa SID: " + call.sid)
                }
            })

    })

    // Create a route that will handle Twilio webhook requests, sent as an
    // HTTP POST to /voice in our application
    app.post('/voice', (request, response) => {
        // Use the Twilio Node.js SDK to build an XML response
        var twiml = new VoiceResponse();
        var celular = request.body.Called;
        questionIndex = 0;
        //!Revisar se es la primer pregunta del celular
        if (questionIndex === 0) {
            db.Result.create({
                celular: celular,
                preguntas_completas:0,
            }).then(function (dbResult) {
                //response.json(dbResult)
            });
        }
        if (questionIndex < questions.length) {
            const gather = twiml.gather({
                numDigits: 1,
                action: "/gather",
            });
            gather.say(questions[questionIndex]);


            // If the user doesn't enter input, loop
            //twiml.redirect('/voice');

            // Render the response as XML in reply to the webhook request
            response.type('text/xml');
            response.send(twiml.toString());
        };
        console.log("El celular al que llame es " + celular);

    });

    //* Esto nos permite hacer las siguientes respuestas 
    app.post('/survey', (request, response) => {
        // Use the Twilio Node.js SDK to build an XML response
        var twiml = new VoiceResponse();
        var celular = request.body.Called;
        
        
    
        if (questionIndex < questions.length) {
            const gather = twiml.gather({
                numDigits: 1,
                action: "/gather",
            });
            gather.say(questions[questionIndex]);


            // If the user doesn't enter input, loop
            //twiml.redirect('/voice');

            // Render the response as XML in reply to the webhook request
            response.type('text/xml');
            response.send(twiml.toString());
        };
        console.log("El celular al que llame es " + celular);

    });





    // Create a route that will handle <Gather> input
    app.post('/gather', (request, response) => {
        // Use the Twilio Node.js SDK to build an XML response
        const twiml = new VoiceResponse();
        var celular = request.body.Called;
        var input = request.body.Digits;
        //!Acomoda la respuestas segun sea la pregunta
        if (questionIndex === 0) {
            db.Result.update({
                pregunta_1: input,
                preguntas_completas:1,

            }, {
                    where: {
                        celular: celular,
                        complete: false,
                        preguntas_completas:0,
                    }
                }).then(function (dbTodo) {
                   // response.json(dbTodo);
                });
        }
        if (questionIndex === 1) {
            db.Result.update({
                pregunta_2: input,
                preguntas_completas:2,

            }, {
                    where: {
                        celular: celular,
                        complete: false,
                        preguntas_completas:1,
                    }
                }).then(function (dbTodo) {
                   // response.json(dbTodo);
                });
        }
        if (questionIndex === 2) {
            db.Result.update({
                pregunta_3: input,
                complete: true,
                preguntas_completas:3,

            }, {
                    where: {
                        celular: celular,
                        complete: false,
                        preguntas_completas:2,
                    }
                }).then(function (dbTodo) {
                   // response.json(dbTodo);
                });
        }
        questionIndex++;
        twiml.redirect('/survey');
        response.type('text/xml');
        response.send(twiml.toString());

        console.log("El celular al que llame es gather " + celular);
        console.log("Las respuesta de la pregunta " + questionIndex + " es " + input);


    });



}