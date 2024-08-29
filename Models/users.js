var mongoose =  require('mongoose')
const {Schema} =  mongoose

const userSchama =  new Schema({
    user_name :  String,
    user_email :  String,
    user_number :  String,
    user_password :  String
})

const userModel =  mongoose.model("user",userSchama);
module.exports = userModel;