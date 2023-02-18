const model=require("../models/usermodel")

exports.authorize=(prm)=>{
    return((req,res,next)=>{
    model.findById({_id:req.user._id},(err,data)=>{
        if (err) throw err

        console.log(data.role,prm);
        let a = data.role
        if(a!=prm){
        //   res.status(403).send({
        //         msg:"access only login"
        //     })
        return next(  res.send("not"))
        console.log("not");
        }    
    })
    // next()
    
})
}    