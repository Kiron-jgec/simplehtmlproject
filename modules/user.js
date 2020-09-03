const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost:27017/meme',{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true});
var conn =mongoose.Collection;
var profile="profile.jpg";
var cover="cover.jpg";
    
var userSchema = new mongoose.Schema({

   
    name :{
        type:String,
        massege: "Name must be in only Charecter",
        minimum: 3,
        massege: "Name must be atlist 3 Charecter",
        maxlength:20,
        massege: "Name must be less than 20 Charecter",
        required:true,
        massege: "Name must be field"

    },
    lastName :{
        type:String,
        massege: "Last name must be in only Charecter",
        
        maxlength:15,
        massege: "Last name must be less than 15 Charecter",
      

    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true
        } 
    },
    password:{
        type:String, 
        minimum: 8,
        description: "Password must be atlist 8 Charecter",
        required:true,
        description: "Name must be field"
    },

    profileImage:{
     type:String,
     default :profile
    },
    coverImaage:{
      type:String,
      default :cover
     
    },

    userBio:{
        type:String, 
        maxlength:100,
        massege: "Bio must be less than 100 Charecter",
    },
   
    date:{
        type:Date,
        default:Date.now
    }

});

var userModel = mongoose.model('userDetails',userSchema)

module.exports =userModel;