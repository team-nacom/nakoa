import { Document, model, Model, Schema } from "mongoose";
import { PutObjectCommand, GetObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET, connected } from "../setup/aws";

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
    if(!connected) throw Error("S3 not connected. Cannot upload file to S3.");
    console.log(path);
    const params = {
        Body: fileStream,
        Key: path,
        Bucket: BUCKET,
        ACL: 'public-read',
        // ContentType: 'text/plain'
    };
    await s3.send(new PutObjectCommand(params));
}