const router=require('express').Router()
const order=require("../componants/ordercomponant")
const { processpayment } = require('../componants/payment')
const authenticate=require("../middelware/jwtverify")

router.post("/proceess/payment",authenticate.isauthenticate,processpayment)

module.exports=router