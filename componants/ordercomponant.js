const model = require('../models/ordermodel')
const product = require("../models/productmodels")

exports.ordercreate = async (req, res) => {
    try {
        const { shipinginfo, orderItems, paymentInfo, itemprice, shippingprice, taxprice, totalprice } = req.body
        const data = await model.create({
            shipinginfo,
            orderItems,
            paymentInfo,
            itemprice,
            shippingprice,
            taxprice,
            totalprice,
            paidat: Date.now(),
            user: req.user.id,
        })
        res.status(200).send({
            success: true,
            data
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getsingleorder = async (req, res) => {
    try {
            console.log("id=====>",req.params.id);
        const data = await model.findById(req.params.id).populate(
            { path: "users", select: 'name email', strictPopulate: false });

        if (!data) {
            res.send({
                msg: "data not found"
            })
        }

        res.status(200).send({
            success: true,
            data
        })
    } catch (err) {
        console.log(err);
    }
}

//loged in user order
exports.myorder = async (req, res) => {
    const data = await model.find({ user: req.user.id })
    if (!data) {
        res.send({
            msg: "data not found"
        })
    }

    res.status(200).send({
        success: true,
        data
    })
}
//get all user order
exports.getallorder = async (req, res) => {
    const data = await model.find()
    if (!data) {
        res.send({
            msg: "data not found"
        })
    }

    let totalamt = 0
    data.forEach(element => {
        totalamt += data.totalprice
    });
    res.status(200).send({
        success: true,
        totalamt,
        data
    })
}

//update user order
exports.updateorder = async (req, res) => {
    try {
        const data = await model.findById(req.params.id)
        if (!data) {
            res.send({
                msg: "data not found"
            })
        }

        if (data.orderstatus === 'Dilivered') {
            res.send({
                msg: "product has been allready dilivered"
            })
        }
        else {

            data.orderItems.forEach(async (ele) => {
                // updatestock(ele.product,ele.quantity)
                const p = await product.findById(ele.product)
                // console.log(p);
                let stok = p.stock - ele.quantity
                const d = await p.updateOne({ stock: stok })
                console.log(d);
            })

            console.log(data.product);
            data.orderstatus = req.body.status
            if (req.body.status === 'Dilivered') {
                data.deliveredat = Date.now()
            }

            await data.save({ validatorBeforeSave: false })
            res.status(200).send({
                success: true,
                data
            })
        }
    } catch (err) {
        console.log(err);
    }
}

async function updatestock(id, quantiity) {
    const prod = await product.findById(id)
    prod.stock -= quantiity
    await prod.save({ validatorBeforeSave: false })
}

//delete user order
exports.deleteorder = async (req, res) => {
    const data = await model.findById(req.params.id)
    if (!data) {
        res.send({
            msg: "data not found"
        })
    }

    await data.remove()

    res.status(200).send({
        success: true,
    })
}