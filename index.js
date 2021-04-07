const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
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
    console.log("connection error", err);
  const foodCollection = client.db("spicy-kitchen").collection("foodItems");
 
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
//   client.close();
});







app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})