const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
const router = express.Router();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use(function(req, res, next) {
    app.locals.test = 0;  
    next();
});

router.use(function(req, res, next) {
    if (!req.route)
        return next (new Error("<script> window.location = '/'; </script>"));  
    next();
});

router.use(function(err, req, res, next){
    res.send(err.message);
});

router.use(function(req, res){
    res.send(app.locals.test + '');
});

app.post("/exit", function(req, res, next){
    req.session.destroy(function(err) {});
    res.send({ "session": "true" });
});

app.set('port', process.env.PORT || 3030);

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

app.use(router);