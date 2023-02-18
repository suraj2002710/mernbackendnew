const model = require("../models/productmodels")
const catcherror = require("../middelware/catcherror");
const { name } = require("ejs");
const cloudinary=require("cloudinary").v2
const fs=require('fs')


//create product admin
exports.createproduct = async (req, res) => {
    console.log("sff");
    try {
        req.body.user = req.user.id
        let images=req.files
        console.log("images",images);
        let image=[]
        for(i=0;i<images.length;i++){
            let imgcloud= await cloudinary.uploader.upload(images[i].path,{
                folder:"products"})
                console.log(imgcloud.secure_url);
                image.push({
                    public_id:imgcloud.public_id,
                    url:imgcloud.secure_url
                })
        }
        // images.forEach(async(imag) => {
        //     console.log(imag.path);
            
        // })
        console.log("image",image);
        req.body.image=image
        console.log(req.body);
        const product = await model.create(req.body)
        
        images.forEach((ig)=>{
            fs.unlink(ig.path,err=>{
                if(err) throw err
                console.log("success deleted");
            })
        })

        res.status(200).json({
            msg: "productcreate",
            product,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

exports.paginate = async (req, res) => {
    await model.paginate({}, { page: req.query.page, limit: req.query.limit }).then((response) => {
        console.log(response);
    }).catch(err => {
        console.log(err);
    })
    res.send("sgjfgh")
}

//allproduct fetch 
exports.getallproduct = async(req, res) => {
    // console.log(adsj);
    
    const key = req.query.key?req.query.key:""
    console.log(key);
    let b=key.trim()
    const greater_than_equal = req.query.gte?req.query.gte:""

    console.log(greater_than_equal);
    const lessthan_equal=req.query.lte?req.query.lte:""
    let resultpage = 8
    let page = req.query.page >= 1 ? req.query.page : 1;
    let a=(page - 1) *resultpage
    console.log(a);
    try {
        const product = await model
            .find({
                $or:[
                    {"name":{$regex:b,$options:"i"}},
                    {"category":{$regex:b,$options:"i"}},
                    {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
                ]
            }).limit(resultpage)
            .skip(a)
        const prodcount = await model.countDocuments()
        //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
        res.status(200).json({
            succuess: true,
            product,
            prodcount
        })
    } catch (error) {
        console.log(error);
        res.status(200).json({
          error
        })
    }
}

//allproduct fetch 
exports.getallsproduct = async(req, res) => {
    // console.log(adsj);
   
    try {
        const key = req.query.key?req.query.key:""
    const greater_than_equal = req.query.gte?req.query.gte:""
    const lessthan_equal=req.query.lte?req.query.lte:""
    const cate=req.query.cate?req.query.cate:""
    let resultpage = 8
    let page = req.query.page >= 1 ? req.query.page : 1;
    let a=(page - 1) *resultpage
        if(req.query.key && req.query.gte && req.query.lte){

        const product = await model
            .find({
                "$and":[
                    {"name":{$regex:key,$options:"i"}},
                    {"category":{$regex:cate,$options:"i"}},
                    {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
                ]
            }).limit(resultpage)
            .skip(a)

        const prodcount = await model.countDocuments()
        //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
        res.status(200).json({
            succuess: true,
            product,
            prodcount,
            resultpage
        })
    }
    
    else if(req.query.gte && req.query.lte &&req.query.cate){
        
        const product = await model
            .find({
                "$and":[
                    // {"name":{$regex:key,$options:"i"}},
                    {"category":{$regex:cate,$options:"i"}},
                    {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
                ]
            }).limit(resultpage)
            .skip(a)
            const prodcount = await model.countDocuments()
        //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
        res.status(200).json({
            succuess: true,
            product,
            prodcount,
            resultpage,
        })
    }
    else if(req.query.key){
        
        const product = await model
            .find({
                "$or":[
                    {"name":{$regex:key,$options:"i"}},
                    {"category":{$regex:key,$options:"i"}},
                    // {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
                ]
            }).limit(resultpage)
            .skip(a)
        const prodcount = await model.countDocuments()
        //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
        res.status(200).json({
            succuess: true,
            product,
            prodcount,
            resultpage
        })
    }

    else if(req.query.cate){
        console.log("cate",cate);
        const product = await model
            .find(
                    // {"name":{$regex:key,$options:"i"}},
                    {"category":{$regex:cate,$options:"i"}},
                    // {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
            ).limit(resultpage)
            .skip(a)
        const prodcount = await model.countDocuments()
        //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
        res.status(200).json({
            succuess: true,
            product,
            prodcount,
            resultpage
        })
    }

    else{
        const product = await model
        .find({
            "$or":[
                {"name":{$regex:key,$options:"i"}},
                {"category":{$regex:key,$options:"i"}},
                // {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
            ]
        }).limit(resultpage)
        .skip(a)
    const prodcount = await model.countDocuments()
    //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
    res.status(200).json({
        succuess: true,
        product,
        prodcount,
        resultpage
    })
    }
    } catch (error) {
        console.log(error);
        res.status(200).json({
          error
        })
    }
}








//fillter and search with PRICE
exports.getallproduct_price = async (req, res) => {
    try {
        let resultpage = 5
        let page = req.params.page >= 1 ? req.params.page : 1;

        const product = await model.find({ price: { $gte: req.params.gte, $lte: req.params.lt } })
            .limit(resultpage)
            .skip(resultpage * page)
        console.log("ffhfhgg", product);
        res.status(200).json({
            succuess: true,
            product
        })
    } catch (error) {
        console.log(error);
    }
}


//getproductdetails

exports.getproductdetails = async (req, res) => {
    try {

        const product = await model.findById(req.params.id)
        if (!product) {
            res.status(500).json({
                succuess: false,
                msg: "product not found"
            })
        }
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        console.log(error);
    }
}

// update product
exports.updateproduct = async (req, res) => {
    try {
console.log(req.body);
        const product = await model.findById(req.params.id)
        if (!product) {
            res.status(500).json({
                succuess: false,
                msg: "product not found"
            })
        }
        
        let images=req.files
        console.log("images",images);
        console.log("body",req.body);
        let image=[]
        for(i=0;i<images.length;i++){
            let imgcloud= await cloudinary.uploader.upload(images[i].path,{
                folder:"products"})
                console.log(imgcloud.secure_url);
                image.push({
                    public_id:imgcloud.public_id,
                    url:imgcloud.secure_url
                })
        }

        req.body.image=image
       const updateproduct= await model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, usefindAndModify: false })

        product.image.forEach(async(it)=>{
            await cloudinary.uploader.destroy(it.public_id)
            console.log(it.public_id);
        })
        images.forEach((ig)=>{
            fs.unlink(ig.path,err=>{
                if(err) throw err
                console.log("success deleted");
            })
        })

        res.status(200).json({
            success: true,
            updateproduct
        })
    } catch (error) {
        console.log(error);
    }
}

//delete product

exports.deleteproduct = async (req, res) => {
    try {

        const product = await model.findById(req.params.id)
        if (!product) {
            res.status(500).json({
                succuess: false,
                msg: "product not found"
            })
        }
        console.log(product.image);
        product.image.forEach(async(it)=>{
            await cloudinary.uploader.destroy(it.public_id)
            console.log(it.public_id);
        })
        await product.remove()

        res.status(200).json({
            success: true,
            msg: "product delete success"
        })
    } catch (error) {
        console.log(error);
    }
}


// create review and update review

exports.createreviews = async (req, res) => {
    const { rating, comment, productid } = req.body
    // console.log(req.user.id);
    const reviews = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await model.findById(productid)
    const isreview = await product.reviews.find(rev => rev.user === req.user.id)
    // console.log(product.reviews,isreview);
    if (isreview) {
        product.reviews.forEach(ele => {
            if (ele.user.toString() === req.user._id.toString()) {
                (ele.rating = rating), (ele.comment = comment)
            }
        });
    }
    else {
        console.log("hello");
        product.reviews.push(reviews)
        product.numofreview = product.reviews.length
    }

    console.log(product.reviews.length);
    let avg = 0
    product.reviews.forEach(ele => {
        avg += ele.rating
    })
    product.ratings = avg / product.reviews.length

    await product.save({ validateBeforeSave: false })
    res.status(200).send({
        success: true,
        product
    })
}

//getall productreviews

exports.getallproductreviews = async (req, res) => {
    const data = await model.findById(req.query.productid)
    if (!data) {
        res.status(401).send({
            msg: "does'not exits product"
        })
    }

    res.status(200).send({
        success: true,
        reviews: data.reviews
    })
}


exports.deletereviews = async (req, res) => {
    try {
        const data = await model.findById(req.query.productid)
        if (!data) {
            res.status(401).send({
                msg: "does'not exits product"
            })
        }
        // console.log(typeof (data.reviews));
        console.log(data.reviews);
        const reviews = data.reviews.filter((rev) => 
            rev._id.toString() !== req.query.id.toString()
        )

        let avg = 0
        console.log(reviews);
        reviews.forEach(rev => {
            avg += rev.rating
            console.log(rev.rating);
        })

        const rating = avg / reviews.length

        const numofreview = reviews.length

        const updata = await model.findByIdAndUpdate(req.query.productid, { reviews, rating, numofreview }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).send({
            success: true,
            updata
        })
    } catch (error) {
            console.log(error);
    }
}




///admin's
//admin products
exports.admin_products=async(req,res)=>{
    try {
    const key = req.query.key?req.query.key:""
    const greater_than_equal = req.query.gte?req.query.gte:""
    const lessthan_equal=req.query.lte?req.query.lte:""
    const cate=req.query.cate?req.query.cate:""
    let resultpage = 8
    let page = req.query.page >= 1 ? req.query.page : 1;
    let a=(page - 1) *resultpage
        if(req.query.key && req.query.gte && req.query.lte){
            
        const product = await model
            .find({
                "$and":[
                    {"name":{$regex:key,$options:"i"}},
                    {"category":{$regex:cate,$options:"i"}},
                    {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
                ]
            }).select("-reviews")
        const prodcount = await model.countDocuments()
        //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
        res.status(200).json({
            succuess: true,
            product,
            prodcount
        })
    }
    
    else if(req.query.gte && req.query.lte &&req.query.cate){
        
        const product = await model
            .find({
                "$and":[
                    // {"name":{$regex:key,$options:"i"}},
                    {"category":{$regex:cate,$options:"i"}},
                    {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
                ]
            }).select("-reviews")
            const prodcount = await model.countDocuments()
        //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
        res.status(200).json({
            succuess: true,
            product,
            prodcount
        })
    }
    else if(req.query.key){
        
        const product = await model
            .find({
                "$or":[
                    {"name":{$regex:key,$options:"i"}},
                    {"category":{$regex:key,$options:"i"}},
                    // {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
                ]
            }).select("-reviews")
        const prodcount = await model.countDocuments()
        //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
        res.status(200).json({
            succuess: true,
            product,
            prodcount,
            
        })
    }

    else if(req.query.cate){
        console.log("cate",cate);
        const product = await model
            .find(
                    // {"name":{$regex:key,$options:"i"}},
                    {"category":{$regex:cate,$options:"i"}},
                    // {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
            ).select("-reviews")
        const prodcount = await model.countDocuments()
        //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
        res.status(200).json({
            succuess: true,
            product,
            prodcount
        })
    }

    else{
        const product = await model
        .find({
            "$or":[
                {"name":{$regex:key,$options:"i"}},
                {"category":{$regex:key,$options:"i"}},
                // {"price":{$gte:greater_than_equal,$lte:lessthan_equal}}
            ]
        }).select("-reviews")
    const prodcount = await model.countDocuments()
    //    const page= await model.paginate({},{page:req.query.page,limit:req.query.limit})
    res.status(200).json({
        succuess: true,
        product,
        prodcount
    })
    }
    } catch (error) {
        console.log(error);
        res.status(200).json({
          error
        })
    }
}

