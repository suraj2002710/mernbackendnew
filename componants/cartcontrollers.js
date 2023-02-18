const e = require("express");
const model=require( "../models/cartmodel")

exports.addtocart=async(req,res)=>{
    try {
        const {id,name,price,image,stock,quantity}=req.body
        const datas=await model.create({
            id:id,
            name:name,
            price:price,
            image:image,
            stock:stock,
            quantity:quantity,
            user_id:req.user.id
        })
        const data=await model.find({user_id:req.user.id})

        console.log(data);
        res.status(200).send({
            data
        })
    } catch (error) {
        console.log(error);
    }
}

exports.removeitem=async(req,res)=>{
    try {
        await model.remove({id:req.params.id})
        
        const data=await model.find({user_id:req.user.id})
            console.log(data);
        res.status(200).send({
            // msg:"quantity update successfully",
   data
        })

    } catch (error) {
        console.log(error);
    }
}

exports.updatequatnity=async(req,res)=>{
    try {
        const finddata=await model.find({id:req.query.id})
        console.log(finddata[0].user_id);
        if(finddata){
            const newqty=finddata[0].quantity
            const itemid=finddata[0].id
            // console.log(itemid);
            const datas=await model.updateOne({id:itemid},{quantity:req.query.qty})
            // console.log(finddata.user_id);
            const data=await model.find({user_id:finddata[0].user_id})
            
                        res.status(200).send({
                            // msg:"quantity update successfully",
                   data                                                })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.loadcartitems=async(req,res)=>{
    try {
        const data=await model.find({user_id:req.user.id})

        if(!data){
            res.status(401).send({
                msg:"no cart found",
                data
            })
        }
        else{
            res.status(200).send({
            data
            })
        }
    
    } catch (error) {
        console.log(error);
    }
}