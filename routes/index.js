var express = require('express');
var validator=require('express-validator');
var router = express.Router();
var path=require('path');
var upload= require("express-fileupload");
var bodyParser=require('body-parser');
var session =require('express-session');
var userModule =require('../modules/user');
var userPostModule =require('../modules/userPost');
var ContactModel =require('../modules/contact');
var FeedbackModel =require('../modules/feedback');

var postShow=userPostModule.find().sort( { date: -1 } );

var bcrypy =require('bcryptjs');
var jwt =require('jsonwebtoken');



//use of session
router.use(session({
  secret: 'MQz_x2^=&f*pa5@BzpSB',
  resave: false,
  saveUninitialized: true,
}));

router.use(bodyParser.json()).use(bodyParser.urlencoded({extended:true}));
//Npm local Storage

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}




//form validator
const { check, validationResult } = require('express-validator');

//middleware

   //Check signUp Email exsites
function checkEmail(req,res,next){
  var email= req.body.email;
 var checkexsiteEmail= userModule.findOne({email:email});
 checkexsiteEmail.exec((err,data)=>{

  if(err) throw err;
  if(data){
   return  res.render('Sign_Up_Form',{ smsg:'You are alredy registerd by this Email, Please log in',errorMsg:" "});
  }
  next();
 });
}  


  


/* GET home page. */
router.get('/', function(req, res, next) {
 


//get loged in User name in index page

    //get post Data which logedin user posted
    
    var loginUserId=req.session.userSession;
    var logedinUser=userModule.findById(loginUserId);

    postShow.exec(function(err,postData){
      if(err) throw err;
      
      logedinUser.exec(function(err,UserData){
       if(err) throw err;
       
       res.render('index', { massege:'',postedUsername:UserData,postData:postData});

      })
     
      
        }); 


        //logedin user Details


  //for post show

 
});





//Get My Profile
router.get('/my-profile', function(req, res, next) {
 

  if(req.session.userSession)
  {
    var loginUserId= req.session.userSession;
  
  var profileDetails=userModule.findById(loginUserId);
  var logedInUserePost=userPostModule.find({posteduserId:loginUserId}).sort( { date: -1 } );
  profileDetails.exec(function(err,data){
    if(err) throw err;

    logedInUserePost.exec(function(err,userPostData){
    if(err) throw err;
    
    res.render('my_profile',{massege:" ",records:data,UserPostData:userPostData});

    });
  

   
     });
  }else{
    res.redirect('/login');
  }
 
});



//Get edit Ptofile
router.get('/edit-profile', function(req, res, next) {
  var loginUserId= req.session.userSession;
  var editProfile=userModule.findById(loginUserId);

  if(req.session.userSession){

  
  editProfile.exec(function(err,data){
 if(err) throw err;
res.render('edit_profile',{massege:" ",records:data});

  });
}
else{
  res.redirect('/login');
}
 
});


//Update Profile

router.post('/profileUpdate',
//Update data validation

[
   check('UserCoverPhoto').trim().escape(),
   check('UserProfilePhoto').trim().escape(),

  check('User_fast_name').not().isEmpty().withMessage('Fast name Must be Field').isAlpha().withMessage('Fast name must be in Charecter')
  .isLength({ min: 3 }).withMessage('Fast name must be atleast 3 Charecter').isLength({max:15}).withMessage('Fast name must be less than 15 Charecter ')
  .trim().escape(),
  
  check('User_lsat_name').not().isEmpty().withMessage('Last name Must be Field').isAlpha().withMessage(' Last name must be in Charecter')
  .isLength({ min: 2 }).withMessage('Fast name must be atleast 2 Charecter').isLength({ max: 15 }).withMessage('Last name must be less than 15 Charecter').trim().escape(),
  
  
  
  check('User_email_id').not().isEmpty().withMessage('Email Must ne Field').isEmail().withMessage('Invalid Email').normalizeEmail(),
  
  check('userbio').isLength({max:100}).withMessage('Bio must be less than 100 charecter').trim().escape()


],
function(req,res,next){

  var errors= validationResult(req) ;

  if(!errors.isEmpty())
  {
    //fatched userdata if the data not validate
    var loginUserId= req.session.userSession;
    var editProfile=userModule.findById(loginUserId);
  
    editProfile.exec(function(err,data){
      if(err) throw err;
      res.render('edit_profile',{massege:errors.mapped(),records:data});
     
       });
  }
  else
  {
  
//if file update
  if(req.files)
  {
    //if Cover Image update
    if(req.files.UserCoverPhoto)
    {
      var cover =req.files.UserCoverPhoto;
      var CoverImg= cover.mv("./public/profileCoverImage/"+cover.name);
      var dataRecord={
        coverImaage: cover.name,
        name:req.body.User_fast_name,
        lastName:req.body.User_lsat_name,
        email:req.body.User_email_id,
        userBio:req.body.userbio
        }  
    }
    // if profile image update 
    else{
  var profile=req.files.UserProfilePhoto;
  var ProfileImg= profile.mv("./public/profileCoverImage/"+profile.name);

var dataRecord={
  profileImage:profile.name,
  name:req.body.User_fast_name,
  lastName:req.body.User_lsat_name,
  email:req.body.User_email_id,
  userBio:req.body.userbio

}
  }
  }
//if user Data Update
  else
  {
  var dataRecord =  {
      name:req.body.User_fast_name,
      lastName:req.body.User_lsat_name,
      email:req.body.User_email_id,
      userBio:req.body.userbio
      }
  }
   //Post Details
  var profileUpdate=userModule.findByIdAndUpdate(req.body.UserId,dataRecord)
profileUpdate.exec(function(err,data){
if(err) throw err;

res.redirect('/my-profile');

});
  }
});





//get Edit Password


router.get('/Change_Password', function(req, res, next) {

  var loginUserId= req.session.userSession;
  var editProfile=userModule.findById(loginUserId);




  if(req.session.userSession){
    editProfile.exec(function(err,data){
  if(err) throw err;
   res.render('changePassword',{Msg:" ",userData:data,errorMsg:" ", successMsg:" "});

    })

 
 
}
else{
  res.redirect('/login');
}
 
});




//Post Method Update password
//Update password

router.post('/updateUserpassword',
[
  // check not empty fields
  check('currentPassword').not().isEmpty().withMessage('Current password must be Field').isLength({ min: 8 })
  .withMessage('Current must be atleast 8 Charecter').trim().escape(),

  check('UpdatePassword').not().isEmpty().withMessage('New password must be Field').isLength({ min: 8 })
  .withMessage('New password must be atleast 8 Charecter').trim().escape()
],



function(req,res){
  var userSessionId=req.session.userSession;
  var errors= validationResult(req) ;
  var editProfile=userModule.findById(userSessionId);
  //if geting error show the errors
  if(!errors.isEmpty())
  {
    editProfile.exec(function(err,data){
      if(err) throw err;
      res.render('changePassword', {errorMsg:errors.mapped(),successMsg:"",Msg:" ",userData:data}); 
    
        });
   
  
  }else
  {
// find user details
    userModule.findById( userSessionId ,
       
      function(error, result){
       if(error){
        res.render('changePassword',{Msg:"Opps! something went wrong... ",successMsg:" ",errorMsg:"",userData:""});
       }
       if ( result ){
        // when result variable contains document
        // check old password matched or not 
        const isMatch = bcrypy.compareSync(req.body.currentPassword, result.password);
        // if old  password is match
        if (isMatch){
          // bycript the new password
          epassword =bcrypy.hashSync(req.body.UpdatePassword,15);
          // if old password and new password is same
          if(bcrypy.compareSync(req.body.UpdatePassword, result.password))
          {
            editProfile.exec(function(err,data){
              if(err) throw err;
              res.render('changePassword',{Msg:"Current password and new password getting same try different password ",userData:data,successMsg:" ",errorMsg:""}); 
            
                });
           
          }
          else
          {
            //stor new password
        var newPassword={
          password:epassword
        }
        //update old password by the new one
         var profileUpdate=userModule.findByIdAndUpdate(userSessionId,newPassword)
         profileUpdate.exec(function(err,data){
         if(err) throw err;
         
         res.render('changePassword',{ Msg:" ", successMsg:"Password Changed successfully login with new password",errorMsg:"",userData:data});
        //if password changed session Destroy
         req.session.destroy(function(err) {
          if(err) throw err; 
        });


         
         });
        }
        } else {
          // password not matched
          res.render('changePassword', { Msg:'Opps! current password not matched',successMsg:" " ,errorMsg:"",userData:""});
        }
      }


      })
        
  }
});










//Login Get
router.get('/login', function(req, res, next) {
 
  if(req.session.userSession){
    res.redirect('/')
  }
  else{
    res.render('Log_In_Form', { massege:'' });
  }
  
});


//Log Out Section

router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});




//Signup get
router.get('/signup', function(req, res, next) {

  if(req.session.userSession){
    res.redirect('/');
  }else{
    res.render('Sign_Up_Form',{smsg:' ', errorMsg:' '});
  }
  
});



//Signup Post
router.post('/SignUp',checkEmail,
//Sign Up form validation
[
check('name').not().isEmpty().withMessage('Fast name Must be Field').isAlpha().withMessage('Fast name must be in Charecter')
.isLength({ min: 3 }).withMessage('Fast name must be atleast 3 Charecter').isLength({max:15}).withMessage('Fast name must be less than 15 Charecter ')
.trim().escape(),

check('lastName').isAlpha().withMessage(' last name must be in Charecter')
.isLength({ max: 15 }).withMessage('Last name must be less than 15 Charecter').trim().escape(),



check('email').not().isEmpty().withMessage('Email Must ne Field').isEmail().withMessage('Invalid Email').normalizeEmail(),

check('password').not().isEmpty().withMessage('Email Must be Field').isLength({min:8}).withMessage('Password must be minimum 8 charecter')
.trim().escape()

],
 function(req, res, next) {
 var errors= validationResult(req) ;



 
if(!errors.isEmpty())
{

  res.render('Sign_Up_Form', { smsg:' ',  errorMsg:errors.mapped()}); 

}
else
{



var name= req.body.name;
var lastName= req.body.lastName;
var email= req.body.email;
var password=req.body.password;
var confirmPassword= req.body.confirmPassword
if(password != confirmPassword)
{
  res.render('Sign_Up_Form', {smsg:' ', errorMsg:'Password  Not Matching...', }); 
}
else{
epassword =bcrypy.hashSync(password,15);
var userDetails =new userModule({
name:name,
lastName:lastName,
email:email,
password:epassword,
});


userDetails.save((error,doc)=>{

  if(error) throw error;
 res.render('Sign_Up_Form', { smsg:'Register Successfully', errorMsg:' ' });
});
}
}
 
});







//Log in Section


//login Post
router.post(
  '/login',
  [
    // check not empty fields
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()
  ],
  function(req, res){
    // check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('Log_In_Form', {  massege:'invalid inputs' });
    }

    // check email exist or not
    userModule.findOne(
      { email : req.body.email },
      function(error, result){
        // check error
        if (error){
          res.render('Log_In_Form', {  massege:'Something went wrong..' });
        }

        // result is empty or not
        if ( result ){
          // when result variable contains document
          // match password
          const isMatch = bcrypy.compareSync(req.body.password, result.password);
          //create User token
         
          // check password is match
          if (isMatch){
            // password matched
           
            req.session.userSession= result._id;
            
  
            res.redirect('/');
          } else {
            // password not matched
            res.render('Log_In_Form', {  massege:'Password not matched. Login Fail...' });
          }
        } else {
          // user document don't exists
         
          res.render('Log_In_Form', {  massege:"User id don't exsits please, sign up " });
        }

      }
    );
  }
);




//  Post insert Section

//Text post Section

router.post('/textPost', 

[check('user_meme_text').not().notEmpty().trim().escape()],




function(req, res, next) {
  var errors= validationResult(req) ;


 //Save in Database
  if(req.session.userSession){
  

    if(!errors.isEmpty())
    {
    
      res.redirect('/'); 
    
    }



    else{
   

      var user_meme_text= req.body.user_meme_text;
    

      var loginUserId= req.session.userSession;

      var logedinUser=userModule.findById(loginUserId);

      logedinUser.exec(function(err,data){
        if(err) throw err;
      var userdata=data;
      var  PosteduserId=userdata._id;
      var  posteduserName =userdata.name;
      var  postedUserLastname=userdata.lastName;
      var postedUserEmail=userdata.email;
      var postedUserProfileImg=userdata.profileImage
   
      var userPost =new userPostModule({

        user_meme_text:user_meme_text,
        posteduserId: PosteduserId,
        posteduserName:posteduserName,
        postedUserLastname: postedUserLastname,
        postedUserEmail:postedUserEmail,
        userProfileImg:postedUserProfileImg



      })

        userPost.save((error,doc)=>{

          if(error) throw error;
          res.redirect('/');
        })
     
       
        });



       




    }



  }else{
    res.render('Log_In_Form', { massege:''   });
  }
  
});



//For Image Post

router.post('/imgPost',

[
  check('imgMeme').trim().escape(),
  check('memeTitle').trim().escape(),
  check('memetype').trim().escape(),

],


function(req,res){
  var errors= validationResult(req) ;
  

  if(req.session.userSession){


    if(!errors.isEmpty())
    {
    
      res.redirect('/'); 
    
    }
    else
    {


      var loginUserId= req.session.userSession;
      var logedinUser=userModule.findById(loginUserId);

      logedinUser.exec(function(err,data){

        if(err) throw err;
        var userDeatils=data;


      var file=req.files.imgMeme;

     
     var fileName= file.mv("./public/uploads/"+file.name);

      //Post Details
      var imagePostName=file.name;
      var imgepostTitle=req.body.memeTitle;
      var imagePostType=req.body.memetype;
      //user Details
      var  PosteduserId=userDeatils._id;
      var postedUsername=userDeatils.name;
      var postedUserLastname=userDeatils.lastName;
      var postedUserEmail=userDeatils.email;
      var postedUserProfileImg=userDeatils.profileImage
    

      var userPost =new userPostModule({

       
        postedImageMemeName:imagePostName,
        postedImageMemeTitle:imgepostTitle,
        postedImagememeType:imagePostType,
        posteduserId: PosteduserId,
        posteduserName:postedUsername,
        postedUserLastname: postedUserLastname,
        postedUserEmail:postedUserEmail,
        userProfileImg:postedUserProfileImg
  
    });
    

    userPost.save((error,doc)=>{

      if(error) throw error;
      res.redirect('/');
    });

  }
      )}
}
  
  
  
  else{

    res.render('Log_In_Form', { massege:''   });

  }


});



/*Adtional pages*/


//contact Page
router.get('/contact', function(req, res, next) {
 

 res.render('contact',{error:" ",succMsg:""});
   
  });
  



  //Aditional post methodes


  //contact page
  router.post('/contact',

  [
    check('name').not().isEmpty().withMessage('Fast name Must be Field')
    .isLength({ min: 2 }).withMessage('Name must be atleast 2 Charecter').isLength({max:25}).withMessage('Name must be less than 25 Charecter ')
    .trim().escape(),
  
    check('email').not().isEmpty().withMessage('Email must be field').isEmail().withMessage('You entered a invalid email').normalizeEmail(),
    
    check('massege').not().isEmpty().withMessage('Messege must be Field').isLength({min:2}).withMessage('Messege must be atleast 2 charecter')
    .trim().escape()
    
    ],
  
  
  
  function(req, res) {
    var errors= validationResult(req) ;
    if(!errors.isEmpty())
    {
      console.log(errors);
      res.render('contact',{error:errors.mapped(), succMsg:""});
    }
    else
    {
     name=req.body.name;
     email=req.body.email;
     messege=req.body.massege;
     
     var Contact_Messege = new ContactModel({
      name:name,
      email:email,
      messege:messege
    
    
      });
      Contact_Messege.save((error,doc)=>{

        if(error) throw error;
        res.render('contact',{ succMsg:"Thanks, "+name+" for massegeing us, we must reply soon. ", error:" "});
      });
      
    
     
    
    
    }
  
      
     });
     
//feedback Page
router.get('/feedback', function(req, res, next) {
 

  res.render('feedback',{error:" ",succMsg:""});
    
   });


//feedb Post method
   router.post('/feedback',

   [
     check('name').not().isEmpty().withMessage('Fast name Must be Field')
     .isLength({ min: 2 }).withMessage('Name must be atleast 2 Charecter').isLength({max:25}).withMessage('Name must be less than 25 Charecter ')
     .trim().escape(),
   
     check('email').not().isEmpty().withMessage('Email must be field').isEmail().withMessage('You entered a invalid email').normalizeEmail(),
     
     check('massege').not().isEmpty().withMessage('Messege must be Field').isLength({min:2}).withMessage('Messege must be atleast 2 charecter')
     .trim().escape()
     
     ],
   
   
   
   function(req, res) {
     var errors= validationResult(req) ;
     if(!errors.isEmpty())
     {
       console.log(errors);
       res.render('feedback',{error:errors.mapped(), succMsg:""});
     }
     else
     {
      name=req.body.name;
      email=req.body.email;
      messege=req.body.massege;
      
      var feedback_meseges = new FeedbackModel({
       name:name,
       email:email,
       messege:messege
     
     
       });
       feedback_meseges.save((error,doc)=>{
 
         if(error) throw error;
         res.render('feedback',{ succMsg:name+" ,thanks for your feedback  ", error:" "});
       });
       
     
      
     
     
     }
   
       
      });
   





module.exports = router;
