const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const port = 3000;


// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.etjzxzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri)
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const coffeesCollection = client.db('coffeeDb').collection('coffees')
        const usersCollection = client.db('coffeeDb').collection('users')
        // Get coffee data from database 
        app.get('/coffees',async(req,res)=>{
            const result = await coffeesCollection.find().toArray()
            res.send(result)
        })
        // get coffee single data data 
        app.get('/coffees/:id',async(req,res)=>{
            const id = req.params.id 
            const query = {_id: new ObjectId(id)}
            const result = await coffeesCollection.findOne(query)
            res.send(result)
        })
        // Post coffee data 
        app.post('/coffees',async(req,res)=>{
            const coffee = req.body;
            const result = await coffeesCollection.insertOne(coffee)
            res.send(result)
        })
        // Update coffee data
        app.put('/coffees/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:new ObjectId(id)}
            const options = { upsert: true };
            const updatedDoc = req.body;
            console.log(updatedDoc);
            const updatedDocument = {
                $set:updatedDoc
            }
            const result = await coffeesCollection.updateOne(query,updatedDocument,options)
            res.send(result)
        })
        // delete coffee data
        app.delete('/coffees/:id',async(req,res)=>{
            const id = req.params.id 
            const query = {_id: new ObjectId(id)}
            const result = await coffeesCollection.deleteOne(query)
            res.send(result)
        })
        // Users Api

        app.get('/users', async(req,res)=>{
            const result = await usersCollection.find().toArray()
            res.send(result);
        })

        app.post('/users',async(req,res)=>{
            const users = req.body;
            const result = await usersCollection.insertOne(users)
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
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})