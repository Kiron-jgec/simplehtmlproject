const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost:27017/meme',{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true});
var conn =mongoose.Collection;

var feedbackSchema = new mongoose.Schema({

   
    name :{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true 
    },
    messege:{
        type:String, 
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    }

});

var FeedbackModel = mongoose.model('feedback_meseges',feedbackSchema)

module.exports = FeedbackModel;