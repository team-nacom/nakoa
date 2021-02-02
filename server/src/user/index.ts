import Router from 'koa-router';
import passport from 'koa-passport';

import User from '../models/user';

const router = new Router();

router.use(passport.session());

router.post('/register', async (ctx) => {
  const userObj = ctx.request.body;

  if(!userObj || !userObj.name || !userObj.password) {
    console.error(`User is ill-formed ${userObj}`);
    ctx.throw(400);
  } else if(await User.exists({ name: userObj.name })) {
    console.error(`User with username ${userObj.name} already exists`);
    ctx.throw(400);
  } else {
    const user = new User(userObj);
    await user.save()
      .then(doc => { console.log(`New user ${userObj.name} successfully created`); ctx.redirect('/user/check'); })
      .catch(err => { console.error(err); ctx.throw(500); });
  }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/check',
    successMessage: 'Welcome',
    failureRedirect: '/user/login',
    failureMessage: 'Login failure'
  })
);

router.post('/logout', (ctx) => {
  // @ts-ignore
  ctx.logout();
  ctx.redirect('/user/check');
});

router.get('/check', (ctx) => {
  // @ts-ignore
  if(ctx.isAuthenticated()){
    const user = ctx.state.user; // returned user type
    ctx.body = `Hello, ${user.name}`;
  } else {
    ctx.body = 'You are not logged in.';
  }
});

export default router;