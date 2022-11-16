const express = require('express');
const app = express();
const {stream} = require('./configs/winston');
const morgan = require('morgan');
const cors = require('cors');
<<<<<<< HEAD
=======
const bodyParser = require('body-parser');
>>>>>>> 4eb73263aa397f263d894e5d2b35198f54b3df69

//ToDo : 개발모드, 배포모드에 따라 settings 분기 시키고... 따로 받아주기. (script에서 가능..?)
//const config = require(path.join(__dirname,'..','..', 'configs', 'settings.json'))[dbtype][env];
app.use(express.json());
<<<<<<< HEAD
=======
app.use(bodyParser.urlencoded({extended:true}));
>>>>>>> 4eb73263aa397f263d894e5d2b35198f54b3df69
app.use(cors({
    exposedHeaders: ['authorization'],
  }));

const nextrend = require('./routes/nextrend');
const crawl = require('./routes/crawl');
const file = require('./routes/file');

app.use(morgan('dev',{ stream })); // 개발 : dev -> 자세히 : combined

app.use('/nextrend', nextrend);
app.use('/crawl',crawl);
app.use('/file',file);

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, 'SIGINT');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}/`);
})