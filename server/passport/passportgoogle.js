const users = require("../models/users");
const GoogleStrategy = require("passport-google-oauth20");

module.exports = function (passport) {
  // stores only the user id in the cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // fetch the user using the id in the cookie
  passport.deserializeUser((id, done) => {
    users.findById(id).then((user) => {
      done(null, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        callbackURL: process.env.GOOGLE_CALLBACK,
        clientID: "149909023249-chnggqc1ekl5829ebnlsqorma48p8l9f.apps.googleusercontent.com",
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        // callbackURL: "abcd",
        // clientID: "abcd",
        // clientSecret: "abcd",
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        users
          .findOne({ email: profile.emails[0].value })
          .then((currentUser) => {
            if (currentUser) {
              console.log("Existing User: " + currentUser);
              done(null, currentUser);
            } else {
              new users({
                name: profile.displayName,
                email: profile.emails[0].value,
                photo: profile.photos[0].value,
              })
                .save()
                .then((newUser) => {
                  console.log(newUser);
                  done(null, newUser);
                });
            }
          });
      }
    )
  );
};
