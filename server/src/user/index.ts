// @ts-nocheck : typing doesn't work nicely with passports
import Router from 'koa-router';
import passport from 'koa-passport';

import User from '../models/user';

const router = new Router();

router.use(passport.session());

// information about current session
router.get('/', (ctx) => {
  if(ctx.isAuthenticated()){
    const user = ctx.state.user;
    ctx.body = {
      "isAuth": true,
      "username": user.username // TODO email, name, uid
    };
  } else {
    ctx.body = {
      "isAuth": false
    };
  }
});

router.post('/register', async (ctx, next) => {
  // log out if logged in
  if(ctx.isAuthenticated()) ctx.logout();

  // requested user object
  const userObj = ctx.request.body;
  const user = new User({username: userObj.username});

  await Promise.resolve()
    .then(() => {
      if (!user.get("username")) {
        throw new Error("Missing Username");
      }
    })
    .then(() => User.findByUsername(user.get("username")))
    .then(existingUser => {
      if (existingUser) {
        throw new Error("Existing User");
      }
    })
    .then(() => user.setPassword(userObj.password))
    .then(() => user.save())
    .then(() => {
      console.log(`New user ${userObj.username} successfully registered!`);
      ctx.redirect('/user/');
    })
    .catch(err => {
      console.log('An error occured while registering:\n', err);
      ctx.body = String(err);
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/',
    failureRedirect: '/user/'
  })
);

router.post('/logout', (ctx) => {
  ctx.logout();
  ctx.redirect('/user/');
});

export default router;