// @ts-nocheck : typing doesn't work nicely with passports
import Router from 'koa-router';
import passport from 'koa-passport';

import User, {givenOptions} from '../models/user';

const router = new Router();

async function validateAllTokens(ctx, next, checkNickname = true) {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const nickRegex = /^[ -~가-힣]{2,100}$/;
  const body = ctx.request.body;

  if(!body || !body.email || !body.password || (checkNickname && !body.nickname)) {
    ctx.throw(400, "Missing field");
  } else if (!emailRegex.test(body.email)) {
    ctx.throw(400, "Invalid email address");
  } else if (32 < body.password.length || body.password.length < 8) {
    ctx.throw(400, "Invalid password length");
  } else if (checkNickname && !nickRegex.test(body.nickname)) {
    ctx.throw(400, "Invalid nickname");
  }
  await next();
}

const validateLoginTokens = (ctx, next) => validateAllTokens(ctx, next, false);

// information about current session
router.get('/', (ctx) => {
  if(ctx.isAuthenticated()){
    const user = ctx.state.user;
    ctx.body = {
      "isAuth": true,
      "email": user.email,
      "nickname": user.nickname
    };
  } else {
    ctx.body = {
      "isAuth": false
    };
  }
});

// register new user (email, password)
router.post('/register', validateAllTokens);
router.post('/register', async (ctx, next) => {
  // log out if logged in
  if(ctx.isAuthenticated()) ctx.logout();

  // requested user object
  const userObj = ctx.request.body;
  const { password, ...cloneWithoutPassword } = userObj;
  const user = new User(cloneWithoutPassword);

  if(['email', 'nickname'].some(field => !user.get(field))) {
    ctx.throw(400, "Missing Field");
  } else if(await User.findByUsername(user.get(givenOptions.usernameField))) {
    ctx.throw(400, "Existing User");
  } else {
    try {
      await user.setPassword(userObj.password);
      await user.save();
    } catch (err) {
      console.error(err);
      ctx.throw(500, err.message);
    }
    console.log(`New user ${userObj.email} successfully registered!`);
    ctx.body = "Success";
  }
});

// login (email, password)
router.post('/login', validateLoginTokens);
router.post('/login', (ctx) => {
  return passport.authenticate('local', {}, (err, user) => {
    if(user === false){
      ctx.throw(401, "Login Failed");
    } else {
      ctx.body = "Success";
      return ctx.login(user);
    }
  })(ctx);
});

router.post('/logout', (ctx) => {
  ctx.logout();
  ctx.body = "Success";
});

export default router;