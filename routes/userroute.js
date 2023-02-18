const router=require("express").Router()
const authenticate=require("../middelware/jwtverify")

const users=require("../componants/usercontroller")
const { upload } = require("../middelware/image")
router.post("/register",upload.single('image'),users.register)
router.post("/login",users.login)
router.get("/logout",users.logout)
router.post("/forgotpass",users.forgotpassword_mail)
router.put("/forgotpassword/:token",users.forgotpassword)
router.get("/me",authenticate.isauthenticate,users.userdetails)
router.put("/updateprofile",authenticate.isauthenticate,upload.single("image"),users.UserProfileUpdate)
router.get("/me",authenticate.isauthenticate,users.userdetails)

//add admin function in these two apis 
router.get("/alluser",authenticate.isauthenticate,users.getalluser)
router.get("/singleuser/:id",authenticate.isauthenticate,users.getsingleuser)

router.put("/admin/userupdate/:id",authenticate.isauthenticate,users.UserProfileUpdateAdmin)
router.delete("/admin/userdelet/:id",authenticate.isauthenticate,users.UserProfileDelete)

router.get("/test",users.test)



module.exports=router

