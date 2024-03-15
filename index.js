const express = require('express');
const app = express();
const path=require("path");
const mongoose=require("mongoose");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


main().then(()=>{
    console.log("connection successfully");
}).catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//index route
app.get("/chats",async(req,res)=>{
    let chats=await Chat.find();
    res.render("index.ejs",{chats});
})

app.get("/",(req,res)=>{
    res.send("app is working");
})

//new route
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})
//Create Route
app.post("/chats",(req,res)=>{
    let {from,to,msg}=req.body;
    let newChat=new Chat( {
        from:from,
        to:to,
        msg:msg,
        created_at:new Date()

    })
    newChat.save().then((res)=>{
        console.log("new data added")
    }).catch((err)=>{
        console.log(err)
    })
    res.redirect("/chats");
});

//edit route
app.get("/chats/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit.ejs",{chat})
    console.log(chat);
});

//UPDATE ROUTE
app.patch("/chats/:id",async(req,res)=>{
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
});

//Delete Route
app.delete("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    let deleteChat=await Chat.findByIdAndDelete(id);
    console.log(deleteChat);
    res.redirect("/chats");
})


app.listen(8080,()=>{
    console.log("app is listening");
})











