
export async function checkAdmin(ctx :any, next :any) {
  // @ts-ignore
  if(!ctx.isAuthenticated()){
    ctx.throw(401, "Should log in");
  } else {
    const user = ctx.state.user;
    if(user.email != "admin"){
      ctx.throw(401, "Should be admin");
    }
  }
  await next();
};

export async function handleError(ctx :any, next :any) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};

// unified error logging