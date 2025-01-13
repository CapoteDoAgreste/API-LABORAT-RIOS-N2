require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@bancobancoso.f1abl.mongodb.net/?retryWrites=true&w=majority&appName=BancoBancoso`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  if (!client.isConnected) {
    await client.connect();
  }
  return client;
}

module.exports = connectDB;
