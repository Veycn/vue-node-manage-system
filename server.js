const express = require("express")
const mongoose = require("mongoose")
const app = new express()
const db = require("./config/keys.js").mongoURI
const bodyParser = require("body-parser")
const passport = require("passport")

// 引入 api 模块中的各个模块 user, profiles
const user = require('./routes/api/user.js')
const profiles = require("./routes/api/profiles.js")

/* ======================非常重要============================
    使用 body-parser 中间件, 且使用此中间件一定要在引入路由之前
    一个HTTP请求体解析的中间件,
    使用这个模块可以解析JSON、Raw、文本、URL-encoded格式的请求体
*/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
/* ====================================================== */


// 引入路由模块并使用
app.use('/api/user', user)
app.use('/api/profiles/', profiles)


// 连接 MongoDB
mongoose.connect(db, {useNewUrlParser: true}).then(() => {
    console.log("MongoDB connected")
}).catch(err => {
    console.log(err)
})

// 初始化 passport, 不初始化不可使用
app.use(passport.initialize())
require("./config/passport")(passport)

// 默认入口
app.get("/", (req, res) => {
    res.send("Hello, world!")
})



const port = process.env.PORT | 5000;
app.listen(port, () => {
    console.log("Server is running at port: " + port )
})