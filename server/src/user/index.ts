// @ts-nocheck : typing doesn't work nicely with passports
import Router from 'koa-router';
import passport from 'koa-passport';

import User from '../models/user';

const router = new Router();

router.use(passport.session());

router.post('/register', async (ctx, next) => {
  const userObj = ctx.request.body;
  console.log('registering user');
  User.register(new User({username: userObj.username}), userObj.password, function(err) {
    if (err) {
      // handle different errors differently
      console.log('error while user register!', err);
      ctx.body = err;
      next(err);
    } else {
      console.log(`New user ${userObj.username} successfully registered!`);
    }
  });
  ctx.redirect('/user/check');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/check',
    failureRedirect: '/user/login',
  })
);

router.post('/logout', (ctx) => {
  ctx.logout();
  ctx.redirect('/user/check');
});

// replace with root
router.get('/check', (ctx) => {
  if(ctx.isAuthenticated()){
    const user = ctx.state.user; // returned user type
    ctx.body = `Hello, ${user.username}`;
  } else {
    ctx.body = 'You are not logged in.';
  }
});

export default router;