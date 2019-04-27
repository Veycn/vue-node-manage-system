
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    // 类型
    type: {
        type: String,
    },
    // 描述
    describe: {
        type: String,
    },
    // 收入
    income: {
        type: String,
        required: true
    },
    //支出
    expend: {
        type: String,
        required: true
    },
    // 现金
    cash: {
        type: String,
        required: true
    },
    // 备注
    remark: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)