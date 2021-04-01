// Import required AWS SDK clients and commands for Node.js
import { S3Client, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini"
import pathlib from "path";

// Set the AWS region
const REGION = "ap-northeast-2"; // SEOUL
const BUCKET = process.env.S3_BUCKET;

// Create an S3 client service object
const s3 = new S3Client({
  region: REGION,
  credentials: fromIni({profile: 'nacom-dev'})
});

async function initialRun() {
  if(!BUCKET){
    console.log("Not connecting to S3 bucket...");
    return;
  }
  console.log(`Trying to connect to ${BUCKET}...`);
  try {
    const data = await s3.send(new ListObjectsCommand({
      Bucket: BUCKET,
    }));
    console.log("Initial S3 connection successful!");
  } catch (err) {
    console.error("Error on initial S3 connection");
    console.error(err);
  }
};

initialRun();