var mongoose = require( 'mongoose' );

// mongoose.connect( 'localhost:27017/LightningRound' );
mongoose.connect( 'mongodb://heroku_4b0t62zk:3us4r9ksmsvhfu4kn4qdtrb3uq@ds161162.mlab.com:61162/heroku_4b0t62zk' );

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  totalQuizzes: { type: Number, default: 0},
  wonQuizzes: { type: Number, default: 0},
  totalAnswers: { type: Number, default: 0},
  correctAnswers: { type: Number, default: 0}
});

var userModel = mongoose.model( 'userModel', userSchema);

module.exports = userModel;
