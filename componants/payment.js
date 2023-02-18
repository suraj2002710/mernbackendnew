const stripe=require("stripe")("sk_test_51M2a3KSFnmfMitW2NRbj3NPu7XCpsruJOiWf576NEkR44vFL9c1L1DnUSY2NZ1FR6WIvXMMNXnayP4x2eT8mqvQ000zNtzgwMm")

exports.processpayment=async(req,res)=>{
    const mypayment=await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"INR",
        metadata:{
            company:"maycart"
        }
    })
    res.status(200).send({
        success:true,
        client_secret:mypayment.client_secret
    })
}
