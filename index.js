const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvmqfi7.mongodb.net/?retryWrites=true&w=majority`;

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


        const toysCollection = client.db('toyDB').collection('toys');


        app.post('/addToys', async (req, res) => {
            const toys = req.body;
            const result = await toysCollection.insertOne(toys);
            console.log(result);
            res.send(result);
        })


        app.get('/allToys', async (req, res) => {
            const result = await toysCollection.find().toArray();
            res.send(result);
        })


        // Show data by specific users in My Toys Page
        app.get('/myToys/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await toysCollection.find({ sellerEmail: req.params.email }).toArray();
            res.send(result);
        });

        app.delete('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })


        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { toyPhoto: 1, toyName: 1, sellerName: 1, sellerEmail: 1, toyPrice: 1, toyRating: 1, quantity: 1, toyDetails: 1 }
            }
            const result = await toysCollection.findOne(query, options);
            res.send(result);
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
    res.send('Baby Wheels Server Running');
})

app.listen(port, () => {
    console.log(`Baby Wheels Server Running Port: ${port}`);
})