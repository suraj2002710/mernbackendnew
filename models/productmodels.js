const mongoose = require("mongoose")
const paginate=require("mongoose-paginate-v2")
const productschema = {
    name: {
        type: String,
        required: [true, "please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "please enter description"]
    },
    price: {
        type: Number,
        required: [true, "please enter product price"],
        maxlength: [8, "price can't exceed 8 character"]
    },
    ratings: {
        type: Number,
        default: 0
    },
     image: [
        {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category:{
        type:String,
        required:[true,"please enter product category"]
    },
    stock:{
        type:Number,
        required:[true,"please enter product category"],
        maxlength:[4,"stock can't exceed 4 character"],
        default:1
    },
    numofreview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:String,
                ref:"user",
                required:true
                },
            name:{
                type:String,
                required:true                     
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:String,
        ref:"user",
        required:true
        }
    ,createat:{
        type:Date,
        default:Date.now
    }
}
const schema=new mongoose.Schema(productschema)
schema.plugin(paginate)

const model=new mongoose.model("product",schema)
module.exports=model