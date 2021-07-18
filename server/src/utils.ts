import Count from "./models/count";
import Guide from "./models/guide";


// wrapping middleware for unified error logging
export async function handleErrorMiddleware(ctx :any, next :any) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};


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