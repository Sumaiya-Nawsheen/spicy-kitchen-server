const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const  ObjectId  = require('mongodb').ObjectID;
require('dotenv').config();


const port = process.env.PORT || 5055;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kypi0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    
  const foodCollection = client.db("spicy-kitchen").collection("foodItems");
  const customersCollection = client.db("spicy-kitchen").collection("customer");
 

app.get('/foodItems', (req,res) => {
  foodCollection.find()
  .toArray((err, items) => {
    res.send(items)
    
  })
})


  app.post ('/addProduct', (req, res) => {
    const newFood = req.body;
    console.log('adding new food:', newFood)
    foodCollection.insertOne(newFood)
    .then(result =>{
       console.log("inserted count:" ,result.insertedCount)
       res.send(result.insertedCount>0);
    })
  })

  app.get('/checkout/:id', (req,res) => {
    foodCollection.find({_id: ObjectId (req.params.id)})
    .toArray((err, items) => {
      console.log(items)
      res.send(items[0]);
      
    })
  })

  app.post('/addOrders', (req, res) => {
    const orderedItem = req.body;
    customersCollection.insertOne(orderedItem)
    .then (result => {
      res.send(result.insertedCount>0);
      console.log(result.insertedCount)
    })
    console.log(orderedItem)
  })

  app.get('/totalOrders', (req,res) => {
    console.log(req.query.email);
    customersCollection.find({email: req.query.email})
    .toArray((err, items) => {
      console.log(items)
      res.send(items);
      
    })
  })


//   client.close();
});







app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})