const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient,Suggestion, Payload } = require('dialogflow-fulfillment');
const express = require("express");
const MODEL_NAME = "gemini-1.5-pro";
const sheetdb = require('sheetdb-node');
const cors = require("cors");
require('dotenv').config();
const API_KEY = "AIzaSyBLbFEUeBpP-W6welyodGdyYb3jh_33paw";
var config = {
  address: 'tdrc4gkyadmng',
  auth_login: '8p35lqwp',
  auth_password: '4haqimqx6wnccgvt57wb',
};
var client = sheetdb(config);

async function runChat(queryText) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // console.log(genAI)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 50,
    };

    const chat = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chat.sendMessage(queryText);
    const response = result.response;
    return response.text();
}

const webApp = express();
const PORT = process.env.PORT || 5000;
webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());
webApp.use(cors());

webApp.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});
webApp.get('/', (req, res) => {
    res.sendStatus(200);
    res.send("Status Okay")
});

webApp.post('/dialogflow', async (req, res) => {

    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    
    function hi(agent) {
        const responses = [
          "Hello! I'm here to provide information about our products. How can I assist you today?",
"Hi! I'm available to answer any questions about our offerings. How can I help you today?",
"Greetings! I'm here to support you with details about our solutions. How can I assist you today?",
"Hello there! I'm ready to help you with information about our services. How can I assist you today?",
"Hi! I'm here to offer assistance with any inquiries about our features. How can I help you today?"
      ];

  
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      agent.add(randomResponse);
      const payload = {
        "richContent": [
            [
                {
                    "type": "chips",
                    "options": [
                        {
                            "text": "Services",
                           
                        },
                        {
                            "text": "Contact ",
                           
                        }
                    ]
                }
            ]
        ]
    };
    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }))
   

    }

function contactinfo(agent) {
    const { userName , userPhone ,  userEmail,userGender,Services,compnay} = agent.parameters;
    
    agent.add("Thank you for contacting us. Our team will reach out to you soon.")
    console.log(userName.name , userPhone , userEmail,userGender,Services,compnay);

    client.create({ Name: userName.name, Email:userEmail,"Phone No.":userPhone,Gender:userGender,Services :Services , Company: compnay}).then(function(data) {
      console.log(data + "sheet data");
    }, function(err){
      console.log(err+ "eoor");
    });
   
    var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mzainali1199@gmail.com',
    pass: 'hdiy gxey jiqd hjqa'
  }
});

var mailOptions = {
  from: 'mzainali1199@gmail.com',
  to: userEmail,
  subject: 'Thanks for Joining us🎉',
  html:`<body style="font-family: Arial, sans-serif; margin: 0; margin-top: 5px; padding: 0;">
    <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 0px; background-color: #f9f9f9;">
        
        <div style="background-color: #0b959f; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; margin-top: 0px;">
            <h2 style="margin: 0;">Thanks for conatct us</h2>
        </div>
        
        <div style="padding: 20px; padding-top: 5px;">
            <p >Dear ${userName.name},</p>
            <p >We're excited  to inform you that we've successfully received your information! Our team will be in touch with you shortly. Stay tuned!</p>

            
            <p style="text-align: center;">If you have any questions or need help, please feel free to contact us. <a style="font-size: 14px;" href="">abc@gmail.com</a> </p>
            <div style="text-align: center;">
                <a href="https://saylaniwelfare.com/" target="_blank" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: white; background-color: #0b959f; text-align: center; border-radius: 5px; text-decoration: none;">Visit Website</a>
            </div>
        </div>
        <div style=" font-size: 12px; color: #777; text-align: center;">
            
            <p>&copy; 2024 Company Name. All rights reserved. <a href="https://zainali.vercel.app/" target="_blank">zain ali</a></p>
        </div>
    </div>
</body>`
};


transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


}
function services(agent) {
    agent.add("we provide following services")
    const payload = {
        "richContent": [
            [
                {
                    "type": "chips",
                    "options": [
                        {
                            "text": "Custom software development.  ",
                           
                        },
                        {
                            "text": "Web development ",
                           
                        },
                        {
                            "text": "Digital Marketing",
                           
                        },
                        {
                            "text": "SEO ",
                           
                        },
                        {
                            "text": "Content Writing",
                           
                        },
                        {
                            "text": "Cybersecurity solutions",
                           
                        },
                        {
                            "text": "Managed IT ",
                           
                        }
                    ]
                }
            ]
        ]
    };
    agent.add(new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true }))
   
}

    async function fallback() {
        let action = req.body.queryResult.action;
        let queryText = req.body.queryResult.queryText;

        if (action === 'input.unknown') {
            let result = await runChat(queryText);
            agent.add(result);
            console.log(result)
        }else{
            agent.add(result);
            console.log(result)
        }
    }
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', hi);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('contactinfo', contactinfo);
    intentMap.set('services', services);

    agent.handleRequest(intentMap);
});

webApp.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});