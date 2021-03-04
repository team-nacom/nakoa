// @ts-nocheck : typing doesn't work nicely with passports
import passport from "koa-passport";
import User from '../models/user';

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());