const express = require('express');
const app = express();
const path=require("path");
const mongoose=require("mongoose");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");
const ExpressError=require("./ExpressError.js");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

main().then(()=>{
    console.log("connection successfully");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakeWhatsapp');
}

//index route
app.get("/chats",wrapAsync( async(req,res)=>{
        let chats=await Chat.find();
        res.render("index.ejs",{chats}); 
}));

app.get("/",(req,res)=>{
    res.send("app is working");
})

//new route
app.get("/chats/new",(req,res)=>{
    // throw new ExpressError(404,"Page not found"); 
    res.render("new.ejs");
})
//Create Route
app.post("/chats",wrapAsync(async(req,res,next)=>{
        let {from,to,msg}=req.body;
        let newChat=new Chat( {
            from:from,
            to:to,
            msg:msg,
            created_at:new Date()
        })
        await newChat.save();
        res.redirect("/chats");
}));

//edit route
app.get("/chats/:id/edit",wrapAsync(async(req,res)=>{
        let {id}=req.params;
        let chat=await Chat.findById(id);
        res.render("edit.ejs",{chat})
        console.log(chat);
}));

function wrapAsync(fn){
     return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
     }
}
//Show Route
app.get("/chats/:id",wrapAsync( async(req,res,next)=>{
        let {id}=req.params;
        let chat= await Chat.findById(id);
    if(!chat){
       return next( new ExpressError(404,"Chat not found"));
    }
        res.render("edit.ejs",{chat});
}));

//UPDATE ROUTE
app.patch("/chats/:id",wrapAsync( async(req,res)=>{
        let {id}=req.params;
        let chat=await Chat.findById(id);
        let {msg:newMsg}=req.body;
        Chat.findByIdAndUpdate(id,
           {msg:newMsg},
           {returnDocument:true, new:true}
            ).then((res)=>{
           console.log(res)
        }).catch((err)=>{
           console.log(err)
        })
        res.redirect("/chats");
}));

//Delete Route
app.delete("/chats/:id",wrapAsync(async(req,res)=>{
        let {id}=req.params;
        let deleteChat=await Chat.findByIdAndDelete(id);
        console.log(deleteChat);
        res.redirect("/chats");
}));


const handleValidationErr=(err)=>{
    console.log("Hey bro, I am a validation err");
    // console.dir(err);
    return err;
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if (err.name==="ValidationError"){
        err=handleValidationErr(err);
    }
    next(err);
})

// Error handler middleware
app.use((err,req,res,next)=>{
    let {status=500, message="some error occurded"}=err;
    res.status(status).send(message);
})

app.listen(8080,()=>{
    console.log("app is listening");
})











