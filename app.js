//express
const express = require ('express');
const app = express();

//logger
const morgan = require ('morgan');
app.use(morgan('dev'));

//static file serving
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/public'));

//html post: body parsing
const bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//html templating engine
const nunjucks = require('nunjucks');
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
const env = nunjucks.configure('views', {noCache: true});
require('./filters')(env);

const AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));


const models = require('./models');

const wikiRouter = require('./routes/wiki');
app.use('/wiki', wikiRouter);
app.use('/users', require('./routes/users'));

app.get('/', function (req, res) {
   res.render('index');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});

models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
	console.log('Connected to the database ...');
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error);
