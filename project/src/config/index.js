require('dotenv').config();

const ServiceKey = process.env.SERVICE_KEY;
const MongoDBURL = process.env.MONGODB_URL;

module.exports = {
  ServiceKey,
  MongoDBURL,
};
