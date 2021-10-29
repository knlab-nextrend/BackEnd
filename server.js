const express = require('express');
const app = express();
const db = require("./configs/db");
const {stream} = require('./configs/winston');
const morgan = require('morgan');

//ToDo : 개발모드, 배포모드에 따라 settings 분기 시키고... 따로 받아주기. (script에서 가능..?)
//const config = require(path.join(__dirname,'..','..', 'configs', 'settings.json'))[dbtype][env];
app.use(express.json());

const nextrend = require('./routes/nextrend');
const solr = require('./routes/solr');
const els = require('./routes/els');

app.use(morgan('dev',{ stream })); // 개발 : dev -> 자세히 : combined

//ToDo : jwt 토큰 발급으로 보안강화
//app.set('jwt-secret', db.secret);

app.use('/nextrend', nextrend);
app.use('/solr',solr);
app.use('/els',els);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}/`);
})