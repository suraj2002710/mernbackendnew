const mongoose = require('mongoose')
const obj = {
    id: {
        type: String,
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: String
    },
    stock: {
        type: String
    },
    quantity: {
        type: Number
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
}
const schema = new mongoose.Schema(obj)
const model=new mongoose.model("cart",schema)

module.exports=model