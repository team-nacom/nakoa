import { Document, model, Model, Schema } from "mongoose";
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini"

// Set the AWS region
const REGION = "ap-northeast-2"; // SEOUL
const BUCKET = process.env.S3_BUCKET;

// Create an S3 client service object
const s3 = new S3Client({
  region: REGION,
  credentials: fromIni({profile: 'nacom-dev'})
});


export interface FileDocument extends Document {
    path: string,
    mime: string, // is this needed?
    createDate: number
    updateDate: number
}

const fileSchema = new Schema<FileDocument>({
    path: { type: String, required: true },
    mime: String,
    createDate: { type: Number, default: Date.now },
    updateDate: { type: Number, default: Date.now }
});

export default model<FileDocument>('File', fileSchema, 'files');

export async function uploadFileToS3(path: string, fileStream: Buffer): Promise<void> {
    const params = {
        Body: fileStream,
        Key: path,
        Bucket: BUCKET
    };
    await s3.send(new PutObjectCommand(params));
}