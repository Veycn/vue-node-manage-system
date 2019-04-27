
const express = require("express")
const router = express.Router()                 // 路由
const Profile = require("../../models/Profile")   // 数据
const passport = require("passport")          // 引入 passport 验证 token


// $route   Post api/profiles/add
// @desc    用于测试接口
// @access  public 

router.get("/test", (req, res) => {
  res.json({ msg: 'profile works!' })
})

// $route   Post api/profiles/add
// @desc    添加信息
// @access  private 
router.post(
  '/add',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save().then(profile => {
      res.json(profile);
    });
  }
);

// $route   Post api/profiles
// @desc    获取到所有的 profile 信息
// @access  private 
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile.find()
    .then(profile => {
      if (!profile) return res.status(404).json("没有任何内容!")
      res.json(profile)
    })
    .catch(err => {
      console.log(err)
      return res.status(404).json(err)
    })
})


// $route   Post api/profiles/add
// @desc    获取单个信息
// @access  private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ _id: req.params.id })
      .then(profile => {
        if (!profile) return res.status(404).json("没有任何内容!")
        res.json(profile)
      })
      .catch(err => {
        console.log(err)
        return res.status(404).json(err)
      })
  })

// $route   Post api/profiles/add
// @desc    编辑信息
// @access  private

router.post(
  '/edit/:id',
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};
    // profileFields.type = query.type ? query.type : ''
    // profileFields.describe = query.describe ? query.describe : ''
    // profileFields.income = query.income ? query.income : ''
    // profileFields.expend =  query.expend ? query.expend : ''
    // profileFields.cash =  query.cash ? query.cash : ''
    // profileFields.remark =  query.remark ?　query.remark　: ''
    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: profileFields },
      { new: true }
    ).then(profile => res.json(profile))
  }
)


// $route   Post api/profiles/add
// @desc   删除信息
// @access  private
router.delete(
  "delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ _id: req.params.id })
      .then(profile => {
        profile.save()
          .then(profile => res.json(profile))
          .catch(err => res.status(404).json("删除失败!"))
      })
  })

module.exports = router