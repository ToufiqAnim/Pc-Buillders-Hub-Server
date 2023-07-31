const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
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
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("pcBuilders");
    const productCollection = db.collection("products");
    const categoryCollection = db.collection("categories");

    // Define API routes
    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send({ status: true, data: products });
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send({ status: true, data: product });
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

    // 404 Not Found
    app.use((req, res, next) => {
      res.status(404).send({ status: false, message: "Not Found" });
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

run()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error running the application:", err);
  });
