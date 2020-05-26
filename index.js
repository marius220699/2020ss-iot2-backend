const axios = require('axios').default;
const express = require('express');
const mongo = require('mongodb');
const cors = require('cors');
const url = 'https://gist.githubusercontent.com/fg-uulm/666847dd7f11607fc2b6234c6d84d188/raw/2ca994ada633143903b10b2bf7ada3fd039cae35/mensa.json';

const app = express();
    app.use(cors());
    app.use(express.json());

async function getData() {
   const client = await mongo.connect('mongodb://localhost:27017/mensa')
     // eslint-disable-next-line no-console
     .catch((err) => { console.log(err); });
   const db = await client.db();
   await axios.get(url)
    .then(async (response) => {
      response.data.forEach(async d => {
        createOrUpdate(d, db);
      });
   })
   .catch(e => {
    console.log(e);
  });
}

async function createOrUpdate(object, db) {
  const r = await db.collection('essen').findOne({category: object.category, day: object.day});

  if (r) {
    await db.collection('essen').replaceOne({category: object.category, day: object.day}, object);
  } else {
    await db.collection('essen').insertOne(object);
  }
}

function valid(input) {
  return input.hasOwnProperty("day") && input.hasOwnProperty("category") && input.hasOwnProperty("name");
}

getData();
setInterval(getData, 5000);


app.get('/api/getData/', async (req, res) => {
  const client = await mongo.connect("mongodb://localhost:27017/mensa").catch(err => { console.log(err); });
  const db = await client.db();
  let data = await db.collection('essen').find().toArray();
  if (data.length === 0) {
    res.status(404).send({message: 'No results found UwU'});
    } else {
      res.status(200).send(data);
    }
});

app.post('/api/addData/:day', async (req, res) => {
  const client = await mongo.connect("mongodb://localhost:27017/mensa").catch(err => { console.log(err); });
  const db = await client.db();
  let getresult = await db.collection('essen').find({name : "Nudelsuppe"}).toArray();
  try {
    if (valid(req.body)) {
      await createOrUpdate(req.body, db);
      res.status(200).send();
    } else {
      res.status(403).send();
    }
  } catch {
    console.log('caught');
    res.status(403).send();
  }
});

app.get('/api/getData/:day', async (req, res) => {
  const client = await mongo.connect("mongodb://localhost:27017/mensa").catch(err => { console.log(err); });
  const db = await client.db();
  let dayonlyData = await db.collection('essen').find({day: req.params.day}).toArray()
    if (dayonlyData.length === 0) {
      res.status(400).send({message: 'No results found UwU'});
    } else {
      res.status(200).send(dayonlyData);
    }
});

// Server starten
app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port 3000!');
});