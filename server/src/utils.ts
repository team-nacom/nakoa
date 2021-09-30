import Count from "./models/count";
import Guide from "./models/guide";
import { customAlphabet } from 'nanoid'
import nodemailer from "nodemailer";

// base64+1
const base64url = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789-_=';
export function baseid(count: number): string {
  const nanoid = customAlphabet(base64url, count);
  return nanoid();
}


export async function sendMail(email: string, subject: string, text: string, html?: string){
  const nacomMail = 'nacommanager@gmail.com';
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: nacomMail,
      pass: 'ylcmjiberhqezzqe'
    }
  });

  let data = {
    from: nacomMail,
    to: email,
    subject: subject,
    text: text,
    html: html
  };

  return await transporter.sendMail(data);
}


// wrapping middleware for unified error logging
export async function handleErrorMiddleware(ctx :any, next :any) {
  try {
    await next();
  } catch (err) {
    //@ts-ignore
    ctx.status = err.status || 500;
    //@ts-ignore
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};

export async function isVerifiedMiddleware(ctx: any, next: any) {
  // @ts-ignore
  if(!ctx.isAuthenticated()){
    ctx.throw(401, "Should log in");
  } else {
    const user = ctx.state.user;
    if(!user.verified){
      ctx.throw(401, "Should verify");
    }
  }
  await next();
}

// utility function for checking admin credential
export function isAdmin(ctx :any): boolean {
  // @ts-ignore
  return ctx.isAuthenticated() && ctx.state.user.email === "nacommanager@gmail.com";
}

// middleware for checking admin credentials
export async function checkAdminMiddleware(ctx :any, next :any) {
  // @ts-ignore
  if(!ctx.isAuthenticated()){
    ctx.throw(401, "Should log in");
  } else {
    const user = ctx.state.user;
    if(user.email != "nacommanager@gmail.com"){
      ctx.throw(401, "Should be admin");
    }
  }
  await next();
};


// utility function for removing all documents and resetting a count of a collection
const collections = ["guide", "cate", "gory"];
export async function resetCollection(name :string) {
  if(!collections.includes(name)) throw Error("??");
  // currently supports only guide collection
  await Guide.deleteMany({}).exec();
  await Count.resetCount(name);
  console.log(`Deleting all documents and resetting count of collection ${name} was successful!`);
}