const express=require("express")
const router=express.Router()
const authenticate=require("../middelware/jwtverify")
const {authorize}=require("../middelware/auth")
const cart=require("../componants/cartcontrollers")

router.post("/addtocart",authenticate.isauthenticate,cart.addtocart)

router.delete("/removeitem/:id",authenticate.isauthenticate,cart.removeitem)
router.get('/loaditem',authenticate.isauthenticate,cart.loadcartitems)

router.put('/updateitem',cart.updatequatnity)
module.exports=router
