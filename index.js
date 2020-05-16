const axios = require('axios').default;
const express = require('express');
const mongo = require('mongodb');
const cors = require('cors');

const app = express();
    app.use(cors());
    app.use(express.json());

async function initMongoDB() {
   const client = await mongo.connect('mongodb://localhost:27017/mensa')
     // eslint-disable-next-line no-console
     .catch((err) => { console.log(err); });
   const db = await client.db();
   }
  initMongoDB();

  let data = '';
const uri = 'https://gist.githubusercontent.com/fg-uulm/666847dd7f11607fc2b6234c6d84d188/raw/2ca994ada633143903b10b2bf7ada3fd039cae35/mensa.json';

async function getData() {
  await axios.get(uri)
    .then((req) => {
      data = req.data;
    })
    .catch(() => {
      data = undefined;
    });
}
getData();

app.get('/mensa/:day', (req, res) => {
  if (data !== undefined) {
    switch (req.params.day) {
      case 'Di':
        res.send(data);
        break;
      default:
        res.status(404).send('Error: 404');
        break;
    }
  } else {
    res.status(404).send('Error: 404');
  }
});

app.post('/api/addData/', (req, res) => {
  if (!JSON.stringify(data).includes(JSON.stringify(req.body))) {
    data.push(req.body);
    res.status(200).send();
  } else {
    res.status(418).send();
  }
});

app.get('/api/getData/', (req, res) => {
  // eslint-disable-next-line no-console
  console.log('Access');
  res.status(200).send(data);
});

// Server starten
app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port 3000!');
});


app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});