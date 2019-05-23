/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');
const SJ_PROD_URI_BASE = 'https://api.scholarjet.com/api/';


//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Scholarjet Assistant';
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const handlers = {
    'LaunchRequest': function () {
        console.log('Event = ' + JSON.stringify(this.event));
        this.emit(':ask', 'Welcome to scholarjet assistant', 'You can ask things like blah');
    },
    'SubmissionCountIntent': function () {
        console.log('Event = ' + JSON.stringify(this.event));
        console.log('\n\n\n\n\n\n');

        let authBody = {};
        authBody.username = process.env.SJ_ADMIN_EMAIL;
        authBody.password = process.env.SJ_ADMIN_PASSWORD;

        let option = {};
        option.json = authBody;

        request.post(SJ_PROD_URI_BASE + 'authentication', option, (err, res, body) => {
            if (res || body) {
                console.log(res.body.token);
                var bearerToken = { 'bearer': res.body.token };
                if (bearerToken) {
                    var authorization = {'Authorization': 'Bearer ' + res.body.token};
                    // authorization.auth = bearerToken;
                    const options = {
                        url: SJ_PROD_URI_BASE + 'useractivitypoints',
                        headers: authorization
                    };
                    console.log('sending auth with this token ', options);
                    request.get(options, (err, res, body) => {
                        if (err) {
                            console.log('There was an error getting this request');
                            console.log(err);
                        }
                        if (res || body ) {
                            console.log('successfully received the request body');
                            console.log(res.body);
                            this.response.speak('Francisco is a dumbass');
                            this.emit(':responseReady');
                        }
                    })
                }
            }
            if (err) {
                console.log('There was an error requesting for bearer token: ');
                console.log(err);
            }
        });

        // request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
        //         console.log('yeah boi? ', res);
        //         console.log('yeah boi? ', body);
        //     if (err) {
        //         return console.log(err);
        //     }
        //     console.log(body.url);
        //     console.log(body.explanation);
        // });
    },
    'AMAZON.HelpIntent': function () {
        // for local testing
        console.log('Event = ' + JSON.stringify(this.event));

        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        // for local testing
        console.log('Event = ' + JSON.stringify(this.event));

        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        // for local testing
        console.log('Event = ' + JSON.stringify(this.event));

        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function getAuthorization() {

}
