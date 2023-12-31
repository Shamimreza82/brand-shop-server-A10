const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express(); 
const port = process.env.PORT || 5000; 


//middelware

app.use(cors()); 
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mrdhuyw.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection

    const productsCollection = client.db("productsDB").collection("products")
    const cartCollection = client.db("cartDB").collection("cart")
    const brandCollection = client.db("brand-image").collection("image")
    

    app.post('/products', async (req, res) => {
        const product = req.body; 
        console.log(req.body);
        const result = await productsCollection.insertOne(product)
        res.send(result)
    })

    app.get('/products', async (req, res) => {
        const result = await productsCollection.find().toArray()
        res.send(result)
    })

    app.get('/products/:id', async (req, res) => {
        const id = req.params.id
        console.log(req.params.id);
        const query = {
             brand: id,    
        }
        const result = await productsCollection.find(query).toArray()
        res.send(result)
    })

     // --------------------------------------

    // app.get('/products/:id', async (req, res) => {
    //     const id = req.params.id
    //     console.log(req.params.id);
    //     const query = {
    //          brand: id,    
    //     }
    //     const result = await brandCollection.find(query).toArray()
    //     res.send(result)
    // })

    // --------------------------------------



    app.get('/productDetails/:id', async (req, res) => {
        const id = req.params.id
        console.log(req.params.id);
        const query = {
             _id: new ObjectId(id),    
        }
        const result = await productsCollection.find(query).toArray()
        res.send(result)
    })
    

    app.post('/productsCart', async (req, res) => {
        const product = req.body; 
        console.log(req.body);
        const result = await cartCollection.insertOne(product)
        res.send(result)
    })

    app.get('/productsCart', async (req, res) => {
        const result = await cartCollection.find().toArray()
        res.send(result)
    })


    app.delete('/productsCart/:id', async (req, res) => {
        const id = req.params.id
        console.log(id);
        const query = {
            _id: new ObjectId(id),    
       }
       const result = await cartCollection.deleteOne(query)
       res.send(result)
    })


    app.get('/updateProduct/:id', async (req, res) => {
      const id = req.params.id
      console.log(req.params.id);
      const query = {
           name: id,    
      }
      console.log(query);
      const result = await productsCollection.findOne(query)
      res.send(result)
  })

  app.put('/updateProduct/:id', async (req, res) => {
      const id = req.params.id; 
      const product = req.body; 
      console.log(id, product);
      const filter = {name: id}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: product.name,
          brand: product.brand,
          category:product.category,
          price:product.price,
          image:product.image,
          description:product.description,
        },
      };
      const result = await productsCollection.updateOne(filter, updateDoc, options)
      res.send(result)
  })



    




    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//----------------------------------------------------------------------------------------

app.get('/', (req, res) => {
    res.send("This is my server");
}) 

app.listen(port, () => {
    console.log( `This is server Running ${port}`);
})


