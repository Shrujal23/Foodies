const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { pool, findOrCreateUser, findUserById } = require('../db/database');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    if (user) {
      done(null, user);
    } else {
      // Fallback for demo or OAuth users not in DB
      const fallbackUser = {
        id: id,
        username: 'demo_user',
        display_name: 'Demo User',
        email: 'demo@example.com',
        avatar_url: 'https://ui-avatars.com/api/?name=Demo+User&background=random'
      };
      done(null, fallbackUser);
    }
  } catch (error) {
    console.error('Deserialize user error:', error);
    done(error, null);
  }
});

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const user = await findOrCreateUser({
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value
        });
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  ));
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        const user = await findOrCreateUser({
          id: profile.id,
          username: profile.displayName,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value
        });
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  ));
}

module.exports = passport;
