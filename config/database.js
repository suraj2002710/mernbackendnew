const mongoose=require("mongoose")
mongoose.set('strictQuery', true)
const connectdatabase=()=>{
    // mongodb+srv://surajaheer2002:suraj12345@cluster0.hcq5sxu.mongodb.net/Ecommerce?retryWrites=true&w=majority
    mongoose.connect("mongodb+srv://surajaheer2002:suraj12345@cluster0.hcq5sxu.mongodb.net/Ecommerce?retryWrites=true&w=majority").then((data)=>{
        console.log("mongo connect",data.connection.host);
    }).catch(err=>{
        console.log(err);
    })
}

module.exports=connectdatabase