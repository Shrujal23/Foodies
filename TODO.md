# Login Fix TODO

## Completed
- [x] Added bcrypt and passport-google-oauth20 to package.json
- [x] Updated schema.sql to include password_hash and make email UNIQUE
- [x] Added database functions: createUserWithPassword, findUserByEmail, findUserById, verifyPassword
- [x] Updated login route to validate against database
- [x] Updated register route to hash password and save to DB
- [x] Fixed deserializeUser to fetch from DB

## Remaining
- [ ] Install backend dependencies (npm install in foodies/backend)
- [ ] Run database migration to update users table with new schema
- [ ] Restart backend server
- [ ] Test login with registered credentials
- [ ] Ensure OAuth still works
