const router=require('express').Router()
const order=require("../componants/ordercomponant")
const authenticate=require("../middelware/jwtverify")
router.route("/ordercreate").post(authenticate.isauthenticate,order.ordercreate)
router.route("/singleorderfind/:id").get(authenticate.isauthenticate,order.getsingleorder)
router.route("/orderme").get(authenticate.isauthenticate,order.myorder)
router.route("/admin/order").get(authenticate.isauthenticate,order.getallorder)
router.route("/admin/orderupdate/:id").put(authenticate.isauthenticate,order.updateorder)
router.route("/admin/orderdelete/:id").delete(authenticate.isauthenticate,order.deleteorder)

module.exports=router