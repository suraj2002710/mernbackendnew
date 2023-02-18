const jwt=require("jsonwebtoken")
const model=require("../models/usermodel")
exports.isauthenticate=async(req,res,next)=>{
    try {
        const {auth}=req.cookies
        console.log(auth);
        if(!auth){
            res.json({
                msg:'please login',
                authenticat:false
            })
        }
        else{
            const decodedata=await jwt.verify(auth,"surajsurajsfhfashjsahfjdhsfakjhfsdkjahajfbfdshalgh")
            // console.log(decodedata);
           
            req.user=await model.findById(decodedata.id)
            
            next()
        }
    } catch (error) {
        console.log(error);
    }
    
}
