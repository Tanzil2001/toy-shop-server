const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ngcnpjb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const allToysCollection = client.db('alltoysDB').collection('toys');


    app.get('/alltoys', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {seller_email: req.query.email}
      }
      const result = await allToysCollection.find(query).toArray();
      res.send(result)
    })


    app.get('/alltoys/:id', async (req,res) =>{
      const id = req.params.id
      console.log(req.params.id);
      const query = {_id: new ObjectId(id)}
      const result = await allToysCollection.findOne(query)
      res.send(result)
    })


    app.get('/alltoys/:text', async (req, res) => {
      console.log(req.params.text);
      if (req.params.text == "Marvel" || req.params.text == "Avengers" || req.params.text == "Star Wars") {
        const result = await allToysCollection.
          find({ sub_category: req.params.text }).toArray()
        return res.send(result)
      }

    })


    app.post('/addtoys', async (req, res) => {
      const body = req.body;
      const result = await allToysCollection.insertOne(body);
      res.send(result);
    })

    app.put('/alltoys/:id', async (req, res)=>{
        const id = req.params.id ;
        const toy = req.body ;
        const filter = {_id: new ObjectId(id)}
        const option = {upsert : true}
        const updatedToy ={
          $set: {
            price : toy.price,
            available_quantity : toy.available_quantity,
            description : toy.description
          }
        }
        const result = await allToysCollection.updateOne(filter, updatedToy, option)
        res.send(result)
    })

    app.delete('/alltoys/:id', async (req, res) =>{
      const id = req.params.id ;
      const query = {_id: new ObjectId(id)} ;
      const result = await allToysCollection.deleteOne(query) ;
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('mera bhi ayega')
})

app.listen(port, () => {
  console.log(`running on port ${port}`);
})