// @ts-nocheck : typing doesn't work nicely with passports
import Router from 'koa-router';
import passport from 'koa-passport';

import User, {givenOptions} from '../models/user';

const router = new Router();

router.use(passport.session());

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

router.post('/register', async (ctx, next) => {
  // log out if logged in
  if(ctx.isAuthenticated()) ctx.logout();

  // requested user object
  const userObj = ctx.request.body;
  const { password, ...cloneWithoutPassword } = userObj;
  const user = new User(cloneWithoutPassword);

  await Promise.resolve()
    .then(() => {
      if(['email', 'nickname'].some(field => !user.get(field))){
        throw new Error("Missing Field");
      }
    })
    .then(() => User.findByUsername(user.get(givenOptions.usernameField)))
    .then(existingUser => {
      if (existingUser) {
        throw new Error("Existing User");
      }
    })
    .then(() => user.setPassword(userObj.password))
    .then(() => user.save())
    .then(() => {
      console.log(`New user ${userObj.email} successfully registered!`);
      ctx.body = "Success";
    })
    .catch(err => {
      console.log('An error occured while registering:\n', err);
      ctx.body = "Error : " + err.message;
    });
});

router.post('/login', (ctx) => {
  return passport.authenticate('local', {}, (err, user) => {
    if(user === false){
      ctx.body = "Failure";
    } else {
      ctx.body = "Success";
      return ctx.login(user);
    }
  })(ctx);
});

router.post('/logout', (ctx) => {
  ctx.logout();
  ctx.body = "Success";
  // ctx.redirect('/user/');
});

export default router;