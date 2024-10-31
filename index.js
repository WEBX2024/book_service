const express = require('express')
const app = express()
const port = process.env.port || 2001
const cors = require('cors')

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


// mongodb configuration

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://book_store_db:MqZo3mEcTHYs6Cwt@authorization.cmcwb.mongodb.net/?retryWrites=true&w=majority&appName=Authorization";

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

    //create a collection of documents
    const bookCollections = client.db("bookInventory").collection("books");

    //insert a new book to db using post method
    app.post("/upload-book", async(req, res)=>{
      const data= req.body;
      const result = await bookCollections.insertOne(data);
      res.send(result);
    })

    //get all the books from the database
    app.get("/all-books", async(req, res)=>{
      const books =  bookCollections.find();
      const result = await books.toArray();
      res.send(result); 
    })
    // update a book data: patch or update method
    app.patch()

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})