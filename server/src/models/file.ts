import { Document, model, Schema } from "mongoose";
import { PutObjectCommand, PutObjectCommandInput, GetObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET, connectedPromise } from "../setup/aws";

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

export async function uploadFileToS3(path: string, fileStream: Buffer, type: string): Promise<void> {
    if(! (await connectedPromise)) throw Error("S3 not connected. Cannot upload file to S3.");
    const params: PutObjectCommandInput = {
        Bucket: BUCKET,
        ACL: 'public-read',
        Key: path,
        // ContentType: type,
        Body: fileStream
    };
    await s3.send(new PutObjectCommand(params));
}