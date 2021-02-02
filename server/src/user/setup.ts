import passport from "koa-passport";
import {Strategy as LocalStrategy} from 'passport-local';

import User from '../models/user';

// fetch user by name
async function fetchUser(name: String) {
  const userQuery = await User.findOne({ name: name }).select('name password');
  return userQuery;
};

passport.serializeUser(function(user, done) {
  // @ts-ignore
  done(null, user.name)
});

passport.deserializeUser(async function(name: String, done) {
  try {
    const user = await fetchUser(name);
    // @ts-ignore
    done(null, user);
  } catch(err) {
    done(err)
  }
});

passport.use(new LocalStrategy(function(name: String, password: String, done) {
  fetchUser(name)
    .then(user => {
      // @ts-ignore
      if (name === user.name && password === user.password) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch(err => done(err));
}));
