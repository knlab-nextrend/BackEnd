const express = require('express');
const app = express();
const {stream} = require('./configs/winston');
const morgan = require('morgan');
const cors = require('cors');

//ToDo : 개발모드, 배포모드에 따라 settings 분기 시키고... 따로 받아주기. (script에서 가능..?)
//const config = require(path.join(__dirname,'..','..', 'configs', 'settings.json'))[dbtype][env];
app.use(express.json());
app.use(cors({
    exposedHeaders: ['authorization'],
  }));

const nextrend = require('./routes/nextrend');
const crawl = require('./routes/crawl');

app.use(morgan('dev',{ stream })); // 개발 : dev -> 자세히 : combined

app.use('/nextrend', nextrend);
app.use('/crawl',crawl);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}/`);
})