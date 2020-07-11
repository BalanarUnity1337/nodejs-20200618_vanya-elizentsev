const userModel = require('../../models/User');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const user = await userModel.findOne({email});

      if (!user) {
        done(null, false, 'Нет такого пользователя');
      } else {
        if (!await user.checkPassword(password)) {
          done(null, false, 'Неверный пароль');
        } else {
          done(null, user, 'OK');
        }
      }
    }
);
