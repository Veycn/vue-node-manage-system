
const express = require("express")
const router = express.Router()             // 路由
const User = require("../../models/User")   // 数据
const bcrypt = require("bcrypt")            // 密码加密&比对
const gravatar = require("gravatar")        // 全球公认头像
const jwt = require("jsonwebtoken")         // jsonwebtoken
const key = require('../../config/keys')    // jwt 的 key
const passport = require("passport")   // 引入 passport 验证 token


// $route   Post api/user/register
// @desc    用于测试接口
// @access  public 
router.get("/test", (req, res) => {
    res.json({ msg: "ok" })
})

// $route   Post api/user/register
// @desc    注册成功返回用户 json 数据, 否则返回
// @access  public 
router.post("/register", (req, res) => {
    //res.json({msg: "ok"})
    console.log(req.body)
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json("邮箱已被注册!")
        } else {
            let g = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: g,
                password: req.body.password,
                identity: req.body.identity
            })
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) throw err;
                    newUser.password = hash
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => {
                            console.log(err)
                            res.json({
                                msg: "faild",
                                code: -1
                            })
                        })
                })
            })
        }

    })
})

// $route   Post api/user/login
// @desc    登录成功返回用户 json 数据, 否则返回
// @access  public 

router.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json("用户不存在!")
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        }
                        // jwt.sign("规则", "加密名字", "过期时间", "箭头函数")
                        jwt.sign(rule, key.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) {
                                throw err
                            } else {
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                })
                            }

                        })
                        // res.json({ msg: "success" })
                    } else {
                        return res.status(400).json("密码错误!")
                    }
                })
        })
})

// $route   Post api/user/login
// @desc    返回当前用户
// @access  private

/*
    获取当前登录的用户, 需要验证 token
*/
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log(req)
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})
module.exports = router