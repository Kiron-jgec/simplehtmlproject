const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost:27017/meme',{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true});
var conn =mongoose.Collection;

var contactSchema = new mongoose.Schema({

   
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

var ContactModel = mongoose.model('Contact_Messege',contactSchema)

module.exports = ContactModel;