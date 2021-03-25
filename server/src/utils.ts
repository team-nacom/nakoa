
export function isAdmin(ctx :any): boolean {
  // @ts-ignore
  return ctx.isAuthenticated() && ctx.state.user.email === "nacommanager@gmail.com";
}

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


// unified error logging
export async function handleErrorMiddleware(ctx :any, next :any) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};
