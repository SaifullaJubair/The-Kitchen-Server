const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
   res.send('The Kitchen server is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5fubjmc.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://kitchen-a11:1XiWjVFoMeGDWkIt@cluster0.5fubjmc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
   try {
      const serviceCollection = client.db('kitchen-a11').collection('services')
      app.get('/services', async (req, res) => {
         const query = {};
         const cursor = serviceCollection.find(query);
         const services = await cursor.toArray();
         res.send(services);
      })
   }
   finally { }
}
run().catch(error => console.error(error));




app.listen(port, () => {
   console.log(`genius car server is running on ${port}`);
})