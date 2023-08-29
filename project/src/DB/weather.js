const mongoose = require('mongoose')

module.exports = ()=>{
    const Schema = new mongoose.Schema({
        MainName:{
            type:String,
            required:true
        },
        Address:{ // 주소명
            type:String,
            required:true
        },
        baseDate:String,
        baseTime:String,
        nx:Number,
        ny:Number,
        category:String,
        fcstDate:String,
        fcstTime:String,
        fcstValue:String,
        obsrValue:String,
    });
    return mongoose.models.datas || mongoose.model("datas",Schema)
}