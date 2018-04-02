'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // can be replaced with your app ID if publishing
var facts = require('./facts');
var GET_FACT_MSG_EN = [
    "Here's your fact: ",
    "I hope you'll like this fact: ",
    "Here is your AI fact: ",
    "What about this one: ",
    "Here you go: "
]
// Test hooks - do not remove!
exports.GetFactMsg = randomPhrase(GET_FACT_MSG_EN);
var APP_ID_TEST = "mochatest";  // used for mocha tests to prevent warning
// end Test hooks
/*
    TODO (Part 2) add messages needed for the additional intent
    TODO (Part 3) add reprompt messages as needed
*/
var languageStrings = {
    "en": {
        "translation": {
            "FACTS": facts.FACTS_EN,
            "SKILL_NAME": "My History Facts",  // OPTIONAL change this to a more descriptive name
            "GET_FACT_MESSAGE": randomPhrase(GET_FACT_MSG_EN),
            "NO_FACT_WITH_YEAR": "I am so sorry. I couldn't fine a fact with the year you asked for. But here you go some other fact instead. I hope you like it: ",
            "HELP_MESSAGE": "You can say tell me a fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!"
        }
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // set a test appId if running the mocha local tests
    if (event.session.application.applicationId == "mochatest") {
        alexa.appId = APP_ID_TEST
    }
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

/*
    TODO (Part 2) add an intent for specifying a fact by year named 'GetNewYearFactIntent'
    TODO (Part 2) provide a function for the new intent named 'GetYearFact' 
        that emits a randomized fact that includes the year requested by the user
        - if such a fact is not available, tell the user this and provide an alternative fact.
    TODO (Part 3) Keep the session open by providing the fact with :askWithCard instead of :tellWithCard
        - make sure the user knows that they need to respond
        - provide a reprompt that lets the user know how they can respond
    TODO (Part 3) Provide a randomized response for the GET_FACT_MESSAGE
        - add message to the array GET_FACT_MSG_EN
        - randomize this starting portion of the response for conversational variety
*/

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random fact from the facts list
        // Use this.t() to get corresponding language data
        var factArr = this.t('FACTS');
        var randomFact = randomPhrase(factArr);

        // Create speech output
        var speechOutput = this.t("GET_FACT_MESSAGE") + randomFact;
        var repromptMessage = this.t("REPROMPT_MESSAGE");
        this.emit(':askWithCard', speechOutput, repromptMessage, this.t("SKILL_NAME"), randomFact);
    },
     'GetNewYearFactIntent': function () {
        //TODO your code here
        this.emit('GetYearFact');
    },
    'GetYearFact': function () {
        //TODO your code here
        // get all facts for the Skill and store it to an array
        var factArr = this.t('FACTS');
        // This line will extract YEAR from the slot
        var year = this.event.request.intent.slots["FACT_YEAR"].value;
        // if there is a year and it is not false algorithm will try to find fact with that year
        if (year){
            // define fact as an empty string
            var fact = "";
            //This loop will iterate through list of facts and for each fact we test if the year is inside
            for(var i = 0; i < factArr.length; i++){
                if(factArr[i].includes(year)){
                //If the fact with that year is found we change fact from empty string to that fact and
                // we break from loop.
                fact = factArr[i];
                break;
                }
            }
            //This is to check if fact variable is still an empty string or not, if yes we return a random fact
            // with message for the user that their fact couldn't be found
            if (fact.length === 0){
                var randomFact = randomPhrase(factArr);
                var speechOutput = this.t("NO_FACT_WITH_YEAR") + randomFact;
                //Using REPROMPT_MESSAGE to inform user how to activate next function
                var repromptMessage = this.t("REPROMPT_MESSAGE");
                this.emit(':askWithCard', speechOutput, repromptMessage, this.t("SKILL_NAME"), randomFact);
            }
            //if everything went good, this is where we tell alexa to speek that fact back to the user
            var speechOutput = this.t("GET_FACT_MESSAGE") + fact;
            var repromptMessage = this.t("REPROMPT_MESSAGE");
            this.emit(':askWithCard', speechOutput, repromptMessage, this.t("SKILL_NAME"), fact);
        }
        //This else statement is used if a year is not detected in the users query, in that case we return a random fact
        else{
            var randomFact = randomPhrase(factArr);
            var speechOutput = this.t("GET_FACT_MESSAGE") + randomFact;
            this.emit(':askWithCard', speechOutput, this.t("SKILL_NAME"), randomFact);
        }
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function randomPhrase(phraseArr) {
    // returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};
