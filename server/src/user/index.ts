import Router from 'koa-router';
import passport from 'koa-passport';

const router = new Router();

router.use(passport.session());

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