const mongoose=require("mongoose");
const Chat=require("./models/chat.js");

main().then(()=>{
    console.log("connection successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats= [
    {
        from:"mohan",
        to:"rohan",
        msg:"kya kar hre ho bhai",
        created_at:new Date()
    },
    {
        from:"sita",
        to:"gita",
        msg:"bajar ja rhi hu",
        created_at:new Date()
    },
    {
        from:"ram",
        to:"shyam",
        msg:"sabji lane ke liye",
        created_at:new Date()
    },
    {
        from:"heera",
        to:"moti",
        msg:"kon si sabji",
        created_at:new Date()
    }
]

// Chat.insertMany(allChats);
Chat.findOneAndDelete({from:"neha"}).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
