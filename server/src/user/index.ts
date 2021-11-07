// @ts-nocheck : typing doesn't work nicely with passports
import Router from 'koa-router';
import passport from 'koa-passport';

import User, {givenOptions} from '../models/user';
import createHttpError from 'http-errors';
import {isVerifiedMiddleware} from '../utils';

const router = new Router();

async function validateAllTokens(ctx, next, checkNickname = true) {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const nickRegex = /^[ -~가-힣]{2,100}$/;
  const body = ctx.request.body;

  if(!body || !body.email || !body.password || (checkNickname && !body.nickname)) {
    ctx.throw(400, "Missing field");
  } else if (!emailRegex.test(body.email)) {
    ctx.throw(400, "Invalid email address");
  } else if (body.password.length > 3885) {
    ctx.throw(400, "Invalid password length");
  } else if (checkNickname && !nickRegex.test(body.nickname)) {
    ctx.throw(400, "Invalid nickname");
  }
  await next();
}

const validateLoginTokens = (ctx, next) => validateAllTokens(ctx, next, false);


// information about current session
router.get('/mypage', async (ctx) => {
  if(ctx.isAuthenticated()){
    const docs = await User.findById(ctx.state.user._id)
                           .populate({path: 'guides', options: { sort: { 'createDate': -1 } }})
                           .select("nickname guides")
                           .lean();

    ctx.body = docs;
  }
  else {
    ctx.body = null;
  }
});

// Get user information
router.get('/profile/:nickname', async (ctx) => {
  const nickname = ctx.params.nickname;
  const user = await User.findOne({ nickname })
                         .populate({ path: 'guides', options: { sort: { 'createDate': -1 }}})
                         .select('nickname guides')
                         .lean();

  if (user) {
    ctx.body = {
      nickname: user.nickname,
      guides: user.guides,
    }
  } else {
    ctx.body = null;
  }
})

// information about current session
router.get('/', (ctx) => {
  if(ctx.isAuthenticated()){
    const user = ctx.state.user;
    ctx.body = {
      "isAuth": true,
      "email": user.email,
      "nickname": user.nickname,
      "verified": user.verified,
      "bio": user.bio,
      "website": user.website,
      "affiliation": user.affiliation,
    };
  } else {
    ctx.body = {
      "isAuth": false
    };
  }
});

// verify email
router.get('/verify/:email/:secret', async (ctx) => {
  const email = ctx.params.email;
  const secret = ctx.params.secret;

  try {
    const user = await User.findOne({email: email}).exec();
    const success = await user.checkEmailVerification(secret);
    if(success){
      await User.findOneAndUpdate({email: email},
        {$set: {verified: true}, $unset: {verifyHash: ""}});
      ctx.body = "Success";
    } else {
      ctx.throw(400);
    }
  } catch (e) {
    ctx.throw(404, e);
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
      const info = await user.sendEmailVerification();
      console.log(`Email sent: ${info.messageId}`);
    } catch (err) {
      console.error(err);
      ctx.throw(500, err.message);
    }
    console.log(`New user ${userObj.email} successfully registered! Please check your e-mail to verify this account.`);
    ctx.body = "Success";
  }
});

router.put('/edit', isVerifiedMiddleware, async (ctx) => {
  const obj = ctx.request.body;
  if (ctx.state.user.email != obj.email) ctx.throw(400);
  let skimmedObj = {};
  if (obj.bio != null) skimmedObj.bio = obj.bio;
  if (obj.website != null) skimmedObj.website = obj.website;
  if (obj.affiliation != null) skimmedObj.affiliation = obj.affiliation;
  await User.findOneAndUpdate({"email": obj.email} , { $set: skimmedObj });
  ctx.body = "Success";
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

// Get specific guide with given index
router.get('/:index(\\d+)', async (ctx) => {
});


export default router;