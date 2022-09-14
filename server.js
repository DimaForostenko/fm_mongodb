const http=require('http');
const express = require('express');
const yup= require('yup');
const mongoose = require('mongoose');
const createError=require("http-errors");
const { Schema } = mongoose;

const emailSchema=yup.string().email('Icorrect email');

const contentSchema=yup.string()
                        .matches(/^[a-z0-9\s]{5,255}/i)
                        .required('Content is required');

const postSchema=new Schema({
  content:{
    type:String,
    required:true,
    validate:{
      validator:(v)=>contentSchema.isValidSync(v),
      message:(props) => `${props.value} is not a valid content!`
    }
  },
  autor:{
    login:String,
    email:{
      type:String,
      validate:{
        validator:(v)=>contentSchema.isValidSync(v),
        message:(props) => `${props.value} is not a valid email!`
      }
    },
    rate:Number
  },
  isCorrect:{type:Boolean,default: false},
  publishAt:{type: Date,default: Date.now}
});
const Post= mongoose.model('Post',postSchema);

mongoose.connect('mongodb://localhost:27017/fm_mongodb')
         .catch((err)=>console.log(err.message))


const app=express();

app.use(express.json());
app.post('/',async (req,res,next)=>{
  try{
const {body}=req;
   const newPost=await Post.create(body);
   if(!newPost){
    next(createError(400));
   }

   res.status(201).send(newPost)
  }catch(error){
    next(error)
  }
});
app.get('/',async (req,res,next)=>{
  try{
   const AllPost= await Post.find() ;
   res.status(200).post(AllPost); 
  }catch{

  }
});

// app.use((error,req,res,next)=>{
//   console.log(error)
// });

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
  console.log('server starter at port = ' + PORT);
})