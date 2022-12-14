const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
   res.send('The Kitchen server is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5fubjmc.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
   try {
      // services collection
      const serviceCollection = client.db('kitchen-a11').collection('services')

      // review collection
      const reviewCollection = client.db('kitchen-a11').collection('reviews')

      // services api 

      app.get('/services', async (req, res) => {
         const query = {};
         const cursor = serviceCollection.find(query);
         const services = await cursor.toArray();
         res.send(services);
      })

      app.post('/services', async (req, res) => {
         const service = req.body;
         const result = await serviceCollection.insertOne(service)
         res.send(result);
      })

      app.get('/services/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) }
         const service = await serviceCollection.findOne(query);
         res.send(service)
      })

      // reviews api 
      app.get('/reviews', async (req, res) => {
         let query = {}
         if (req.query.email) {
            query = {
               email: req.query.email
            }
         }
         const cursor = reviewCollection.find(query)
         const reviews = await cursor.toArray()
         res.send(reviews)
      })
      //review insert
      app.post('/reviews', async (req, res) => {
         const review = req.body;
         const result = await reviewCollection.insertOne(review)
         res.send(result);
      })


      //delete
      app.delete('/reviews/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) }
         const result = await reviewCollection.deleteOne(query)
         res.send(result)
      })
   }
   finally { }
}
run().catch(error => console.error(error));




app.listen(port, () => {
   console.log(`genius car server is running on ${port}`);
})