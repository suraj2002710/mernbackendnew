const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")

const { default: isEmail } = require("validator/lib/isEmail");
const obj = {
    name: {
        type: String,
        required: [true, "please enter your name"],
        maxLength: [30, "only 30 character"],
        minLength: [3, "only 3 character"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        validator: [validator.isEmail, "valid email enter"]
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength: [8, "atleast 8 character"],
        select:false
    },
    avtar:
        [
            {

                public_id: {
                    type: String,
                    required: true
                },
                url: {

                    type: String,
                    required: true
                }
            }
        ],
        role:{
            type:String,
            default:"user"
        },
        create_at:{
            type:Date,
            default:Date.now()
        },
        resetpasswordToken:String,
        resetpasswordexpire:Date
}

const schema=new mongoose.Schema(obj)
 
schema.pre("save",async function (next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcryptjs.hash(this.password,10)
})

 //JWT TOKEN
 schema.methods.getjwttoken= function(){
        return  jwt.sign({id:this._id},process.env.jwt_sceretkey,{
            expiresIn:process.env.expire
        })
 }
 

const model=new mongoose.model("users",schema)



module.exports=model