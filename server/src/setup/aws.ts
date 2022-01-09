// Import required AWS SDK clients and commands for Node.js
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-provider-ini';

// Set the AWS region
const REGION = 'ap-northeast-2'; // SEOUL
export const BUCKET = process.env.S3_BUCKET;

// Create an S3 client service object
export const s3 = new S3Client({
  region: REGION,
  credentials: fromIni({ profile: BUCKET }),
});

async function initialRun() {
  if (!BUCKET) {
    console.log("Can't connect to S3 bucket... Perhaps you're missing an .env entry?");
    return false;
  }
  console.log(`Trying to connect to ${BUCKET}...`);
  try {
    await s3.send(new ListObjectsCommand({
      Bucket: BUCKET,
    }));
    console.log(`Initial S3 connection to ${BUCKET} successful!`);
    return true;
  } catch (err) {
    console.error(`Error on initial S3 connection to ${BUCKET}`);
    console.error(err);
    return false;
  }
}

async function getRootUrl() {
  if (!BUCKET) {
    return '';
  }
  const endpoint = await s3.config.endpoint();
  // i.e. https:// nacom-dev . s3.ap-northeast-2.amazonaws.com /
  const result = `${endpoint.protocol}//${BUCKET}.${endpoint.hostname}${endpoint.path}`;

  return result;
}

export const connectedPromise : Promise<boolean> = initialRun();
export const rootUrlPromise : Promise<string> = getRootUrl();
