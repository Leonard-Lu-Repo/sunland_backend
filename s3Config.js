require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");

const s3Config = { region: process.env.AWS_REGION };
if (process.env.NODE_ENV === "development") {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}
const s3 = new S3Client(s3Config);
module.exports = s3;
