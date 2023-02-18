const model = require('../models/usermodel')
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const cloudinary=require("cloudinary").v2
const fs=require("fs")
const { forgotPassword_sendmail } = require('../middelware/Emailverify')
exports.register = async (req,res) => {
    try {
        console.log("user",req.file);
        const { name, email, password } = req.body
        const img=await cloudinary.uploader.upload(req.file.path,{
            folder:"userimage",
            width:150,
            crop:"scale"
        })
        console.log(img.public_id);
        const user = await model.create({
            name, email, password,
            avtar: [{
                public_id: img.public_id,
                url: img.secure_url
            }]
        })
        console.log(user);
        fs.unlink(req.file.path,(err)=>{
            if(err) throw err
            console.log("delete");
        })
        const token = await jwt.sign({ id: user._id }, "surajsurajsfhfashjsahfjdhsfakjhfsdkjahajfbfdshalgh", {
            expiresIn:"1d"
        })
    let admin
    if(user.role=="admin"){
        admin=true
    }

        res.cookie("auth", token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true
        })
        res.status(201).json({
            success: true,
            token,
            authenticat:true,
            data:user,
            isadmin:admin
        })
    } catch (error) {
        console.log(error);
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await model.findOne({ email: email }).select("+password")
        const matchpass = await bcryptjs.compare(password, user.password)
        if (!email || !password) {
            res.status(404).json({
                msg: "enter password and email"
            })
        }
       else if(!user) {
            res.status(401).json({
                msg: "invalid password and email"
            })
        }
       else if(!matchpass) {
            res.status(401).json({
                msg: "invalid password and email"
            })
        }

       else{
         const token = await jwt.sign({ id: user._id }, "surajsurajsfhfashjsahfjdhsfakjhfsdkjahajfbfdshalgh", 
        {
          expiresIn:"1d"
        })

        let admin
        if(user.role=="admin"){
            admin=true
        }
        res.cookie('auth', token, {
            expires:new Date(Date.now()+1*24*60*60*1000),
            httpOnly: true,
            withCredentials: true,
        }).status(200).json({
            success: true,
            token,
            authenticat:true,
            data:user,
            isadmin:admin
        })
    }
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            error:"invalid email or password"
        })
    }
}


//logout 

exports.logout = async (req, res) => {
    try {
        res.cookie("auth", null, {
            expires:new Date(Date.now())
            , httpOnly: true
        })

        res.json({
            msg: "you are logout"
        })
    } catch (error) {
        console.log(error);
    }
}


//forgot password

exports.forgotpassword_mail = async (req, res) => {
    try {
        const email=req.body.email
        console.log(email);
        const data = await model.findOne({ email: req.body.email })
        console.log(data._id);
        if (!data) {
            res.status(401).send({
                msg: "do not exit email"
            })
        }
        else {
            const token=await jwt.sign({"auth":data._id},"surajsurajsfhfashjsahfjdhsfakjhfsdkjahajfbfdshalgh",{
                expiresIn:"15m"
            })
            forgotPassword_sendmail(email,token)
            
        }
    } catch (error) {
        console.log(error);
    }
}

// forgotpassword
exports.forgotpassword=async(req,res)=>{
    try{
    const pass = req.body.newpassword
    const confirmpass = req.body.confirmpassword
    if (pass != confirmpass) {
        res.send({
            msg: "newpassword and confirmpassword do not match"
        })
    }
    else {
        const data=await jwt.verify(req.params.token,"surajsurajsfhfashjsahfjdhsfakjhfsdkjahajfbfdshalgh")
        console.log(data);
        const hash = await bcryptjs.hash(pass, 10)
        let dat = await model.updateOne({ _id: data.auth}, { password: hash })
        console.log(dat);
        res.status(200).send({
            msg: "password change",
            // dat
        })
    }}catch(error){
        console.log(error);
    }
}






//get user details

exports.userdetails = async (req, res) => {
    console.log("user",req.user.id);
    const data = await model.findById(req.user.id)
    let admin=false
    if(data.role=="admin"){
        admin=true
    }
    console.log("admin",admin);
    res.status(200).send({
        success: true,
        data,
        authenticat:true,
        isadmin:admin
    })
}

exports.UserProfileUpdate = async (req, res) => {
    try {
        let newuser = {
            name: req.body.name,
            email: req.body.email,
        }
        // add avatar
        console.log("files=======>",req.file);
        const user=await model.findById(req.user.id)
        let img=user.avtar[0].public_id
        console.log("img",img);
        await  cloudinary.uploader.destroy(img)

        let image= await cloudinary.uploader.upload(req.file.path,{
            folder:"userimage",
            width:150,
            crop:"scale"
        })

        console.log(image.secure_url);
            fs.unlink(req.file.path,(err)=>{
                if(err) throw console.log(err);
                console.log("deleted");
            })
            let avtar=[
                {
                    public_id:image.public_id,
                    url:image.secure_url
                }
            ]
            let update_user={...newuser,avtar}
            
        const data = await model.findByIdAndUpdate(req.user.id, update_user, { new: true, runvalidators: true, useFindAndModify: false })
        console.log(data);
        res.status(200).send({
            success: true,
            data,
        })
    }catch(err){
        console.log(err);
    }
}

//get all user (admin) 
exports.getalluser = async (req, res) => {
    const data = await model.find()
    res.status(200).send({
        success: true,
        data
    })
}

//get single user admin
exports.getsingleuser = async (req, res) => {

    try {
        const data = await model.findById(req.params.id)

        if (!data) {
            res.status(400).send({
                msg: `user not found this userId ${req.params.id} `
            })
        }
        else {
            res.status(200).send({
                success: true,
                data
            })
        }
    } catch (err) {
        console.log(err);
    }
}


// update role --admin
exports.UserProfileUpdateAdmin = async (req, res) => {
    let newuser = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    // add avatar
    
    const data = await model.findByIdAndUpdate(req.params.id, newuser, { new: true, runvalidators: true, useFindAndModify: false })
    console.log(data);
    res.status(200).send({
        success: true,
        data
    })
}

// delete user ---admin
exports.UserProfileDelete = async (req, res) => {

    const data = await model.findById(req.params.id)
    if (!data) {
        res.status(400).send({
            msg: `user not found this userId ${req.params.id} `
        })
    }
    else {
        data.remove()
        res.status(200).send({                      
            success: true,                          
            msg:"user successfully delete"
            
        })
    }
}


exports.test=async(req,res)=>{
    // const data=await jwt.sign({"auth":"suraj@gmail.com"},"surajsurajsfhfashjsahfjdhsfakjhfsdkjahajfbfdshalgh",{
    //     expiresIn:"5m"
    // })
    const data=await jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoIjoic3VyYWpAZ21haWwuY29tIiwiaWF0IjoxNjc0OTcxMjI0LCJleHAiOjE2NzQ5NzE1MjR9.5TDRE_DhIE77VttQ0aksOa4-XLffG_f-ICwXVgjbkUE","surajsurajsfhfashjsahfjdhsfakjhfsdkjahajfbfdshalgh")
    console.log(data);

}
