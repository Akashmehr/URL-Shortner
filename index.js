const express = require('express');
const path = require('path');
const urlRoute = require('./routes/url');
const { connectToMongoDb } = require('./connection');
const URL = require('./models/url');

const staticRoute = require('./routes/staticRouter');


const app = express();
const PORT = 8001;

app.use(express.json());
app.use(express.urlencoded({extended : false}))

connectToMongoDb("mongodb://127.0.0.1:27017/short-url").then(() => console.log("MongoDb Connected"));



app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use('/url', urlRoute);
app.use('/',staticRoute);

app.get('/test', async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls,
    });
});

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    });
    res.redirect(entry.redirectURL);
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});