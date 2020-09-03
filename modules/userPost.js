const mongoose =require('mongoose');

mongoose.connect('mongodb://localhost:27017/meme',{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true});
var conn =mongoose.Collection;

var userPostSchema = new mongoose.Schema({

    user_meme_text :{
        type:String,
        massege: "post must be in only Charecter",
        minimum: 1,
        massege: "post must be atlist 1 Charecter",
       

    },
    postedImageMemeName :{
        type:String
       
       
       

    },
    postedImageMemeTitle :{
        type:String,
       
       

    },
    postedImagememeType :{
        type:String
       
      
       

    },
    posteduserName :{
        type:String
       
      
       

    },
    posteduserId :{
        type :String
       
      
       

    },
    postedUserLastname :{
        type:String,
       
        required:true
       

    },
    postedUserEmail:{
        type:String,
       
        required:true
       

    },
    userProfileImg:{
        type:String,
       
        required:true
       

    },


    
    date:{
        type:Date,
        default:Date.now
    }

});

var userPost = mongoose.model('post',userPostSchema)

module.exports =userPost;