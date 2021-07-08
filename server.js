const express = require('express');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const axios = require('axios');
const hbs = require('nodemailer-express-handlebars');

// load environment variables
require('dotenv').config();

const app = express();

// set the view engine
app.set('view engine', 'handlebars');

// define the port
const port = process.env.PORT || 3000;

// getting all the environment variables
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const serverUrl = process.env.SERVER_URL;
const emailHost = process.env.EMAIL_HOST;
const clientToken = process.env.CLIENT_TOKEN;

// custom constants
const subject = 'CyberManipal | The Tech News You Need';
let mailingList = "";

// custom list of greetings to pick randomly from
const greetingList = [
    "Here's your weekly dose of byte sized cybersecurity news.",
    "Wanna hear about the latest in tech? Read it on CyberManipal.",
    "(sudo apt-get) update yourself with this handout of cybersecurity news.",
    "If you are looking for tech news, look no further.",
    "Glance through curated, informative news from the realms of technology."
]

// schedule the cron to hand out newsletters every thursday
cron.schedule('5 * * * *', async () => {
    try {
        // fetch the latest news to be hadned out
        const resNews = await axios.get(`${serverUrl}/api/news?page=0`);
        let latestFive = resNews.data.data.slice(0, 5);

        // format the date field and the link field
        latestFive.forEach(news => {
            news.link = `https://wearemist.in/news/article/${news._id}`
            let tempDate = new Date(news.date);
            news.date = tempDate.toDateString();
        })
        
        // fetch the subscribers
        const resEmails = await axios.get(`${serverUrl}/api/newsletter`, {
            headers: {
                "client_token" : clientToken
            }
        });
        subscriberList = resEmails.data.data;
        
        // create the mailing list
        let tempList = [];
        subscriberList.forEach(sub => {
            tempList.push(sub.email)
        });
        mailingList = tempList.join(", ");
    
        // create a transporter object
        const transporter = nodemailer.createTransport({
            host: emailHost, // configure to use your mail host
            port: 465,
            secure: true, // use SSL
            auth: {
                user: email,
                pass: password,
            },
        });

        // transporter options for hbs
        var options = {
            viewEngine : {
                extname: '.hbs', // handlebars extension
                layoutsDir: 'views/email/', // location of handlebars templates
                defaultLayout: 'index', // name of main template
                partialsDir: __dirname + 'views/email/partials/'
            },
            viewPath: 'views/email',
            extName: '.hbs'
        }

        // apply hbs config
        transporter.use('compile', hbs(options));

        // defining all the email options
        const messageOptions = {
            from: email,
            to: mailingList,
            subject: subject,
            template: 'index',
            context: {
                news: latestFive,
                greeting: greetingList[Math.floor(Math.random() * greetingList.length)]
            }
        }

        // send the email
        transporter.sendMail(messageOptions, () => {
            // optional callback here
        });

        console.log('Emails for ' + new Date().toISOString().slice(0, 10) + ' sent successfully');
    } catch (e) {
        console.log(e);
    }
});

// buffer route
app.get("*", (req, res) => {
    res.status(200).send("<h4 style='font-family: sans-serif'>Wait for next Thursday for your newsletter</h4>");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});