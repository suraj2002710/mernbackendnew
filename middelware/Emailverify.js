const nodemailer=require("nodemailer")

async function forgotPassword_sendmail(email,token) {
    let transport=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:"surajaheer448@gmail.com",
            pass:"ldagvdxmsszpnshx"
        }
    })
    let info=await transport.sendMail({
        from:"surajaheer448@gmail.com",
        to:email,
        subject:"Email verification",
        text:"hello suraj",
        html:`<a href="http://localhost:3000/forgotpass/${token}">verify</a>`
    })

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}

module.exports={forgotPassword_sendmail}