const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("pcBuilders");
    const productCollection = db.collection("products");
    const categoryCollection = db.collection("categories");

    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();

      res.send({ status: true, data: products });
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const products = await productCollection.findOne({
        _id: ObjectId(id),
      });

      res.send({ status: true, data: products });
    });

    app.get("/categories", async (req, res) => {
      const categories = await categoryCollection.find({}).toArray();

      res.send({ status: true, data: categories });
    });

    app.get("/productsCategory/:category", async (req, res) => {
      const category = req.params.category;
      const products = await productCollection.find({ category }).toArray();

      res.send({ status: true, data: products });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
