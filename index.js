const express = require("express")
const app = express()
require("dotenv").config()
const cors = require('cors')
const router = require("./routes/productrout")
const connectdatabase = require("./config/database")
const userroute = require("./routes/userroute")
const orderroutes = require("./routes/orderroute")
const cookieparser = require("cookie-parser")
const paymentrouter=require("./routes/paymentroutes")
const cloudinary=require("cloudinary").v2
const cartrouter=require("./routes/cartroutes")
const path=require("path")
const multer = require("multer")
const port=process.env.PORT || 3333
cloudinary.config({ 
  cloud_name: 'dpmds1cyi', 
  api_key: '388756442354748', 
  api_secret: 'sQIoQ3jti8fDAyHjIlwc96nvBiQ' 
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
};
app.use(cors(corsOptions))
app.use(cookieparser())
connectdatabase()
app.use("/api", router)
app.use("/api", userroute)
app.use("/api", orderroutes)
app.use("/api", cartrouter)
app.use("/api",paymentrouter)
app.listen(port, () => {
    console.log("server started",port);
})