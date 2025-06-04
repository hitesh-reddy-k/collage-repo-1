
const express = require('express');
const dotenv = require('dotenv');
const Connect = require("../backend/databacesonnect/data.js");
const questions = require("../backend/routes/questionsroute.js");
const cors = require("cors");
const path = require("path")
const user =  require("../backend/routes/userroute.js")
const marks =require("../backend/routes/sem-marksroute.js")
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser")
const messages = require("../backend/routes/message.js")
const community = require("../backend/routes/communityroute.js")


const corsOptions = {
    origin: [
        'https://collage-project-pearl.vercel.app',
        'https://collage-repo-1.vercel.app'
    ],
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
// socketHandler(server);



app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json());
app.use("/question", questions);
app.use("/student",user) 

app.use("/messages",messages)
app.use("/community",community)
app.use("/marks",marks)

dotenv.config({ path: "backend/envfile/config.env" });
console.log("MongoDB URL:", process.env.URL); 

Connect();
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
