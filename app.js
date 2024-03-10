const express = require('express');
const serverConnect = require('./config/db');
const bodyParser = require('body-parser');
// const path = require('path');
const indexRoute = require('./routes/index.route');
const adminRoute = require("./routes/admin.routes")
const errorHandler = require('./validation/validationErrorHandler');
var path = require("path");
var cors = require('cors')

var app = express();
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', indexRoute);
app.use('/admin', adminRoute)

//  handle Error
app.use(errorHandler.handleError());
app.use('/adminPanel', express.static(path.join(__dirname, 'dist', 'petWroldAdmin')));
app.get('/adminPanel/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'petWroldAdmin', 'index.html'));
})
app.use('/upload',express.static(path.join(__dirname,'upload')));
// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'views','index.html'));
// });

// app.use('/template', express.static(path.join(__dirname, 'template')));

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }

// }));

app.use(cors({
  origin: ['http://localhost:4200'],
  "methods": "GET,PUT,POST,PATCH",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  credentials: true
}));


// app.listen(process.env.PORT || 3001, () => {
//   console.log(`✨ MAGIC WILL HAPPEN ON`, + process.env.PORT);
// });


const port = process.env.PORT || 3001;

app.listen(port);

console.log(" MAGIC WILL HAPPEN ON  ===> 👉	", + port);
