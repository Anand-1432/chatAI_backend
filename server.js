const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const Gallery = require('./model/galleryModel');

/// config /////////////////////////////
dotenv.config();
require('./database/conn');

const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

/// configuration openAI  /////////////////////
const configuration = new Configuration({
    organization: "org-FroRlfj7ydIk7t1niXW1zL10",
    apiKey: process.env.API_KEY
});
const openai = new OpenAIApi(configuration);


//// routes //////////////////////////////
app.get('/', (req, res) => {
    res.send("hellow form chatGPT backend");
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: message,
            max_tokens: 200,
            temperature: .5
        });
        res.status(200).json({ message: response.data.choices[0].text });
    } catch (error) {
        console.log(error);
    }
})

app.post("/image", async (req, res) => {
    try {
        const { prompt } = req.body;
        const aiResponse = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: "512x512",
            response_format: "b64_json"
        })
        res.status(201).json({ image: aiResponse.data.data[0].b64_json });
    } catch (error) {
        console.log(error);
    }
});

app.post('/add_community', async (req, res) => {
    try {
        const { user, title, url } = req.body;
        const response = await Gallery({
            user, title, url
        })
        const result = await response.save();
        res.json({ sucess: true, data: result });
    } catch (error) {
        console.log(error);
    }
})

app.get('/gallery', async (req, res) => {
    try {
        const gallery = await Gallery.find();
        res.json({ success: true, data: gallery });
    } catch (error) {
        console.log(error);
    }
})



/////// listening port
app.listen(port, () => {
    console.log(`listening at port ${port}`);
})