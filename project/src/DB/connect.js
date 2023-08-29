const mongoose = require('mongoose')

module.exports = Connect
function Connect(Mongo_DB_URL){
    mongoose.Promise = global.Promise
    var mongooseOption = {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        maxPoolSize: 10000
    }
    return new Promise((resolve,reject)=>{
        mongoose.connect(Mongo_DB_URL,mongooseOption).then((r)=>true).catch((Err)=>console.log(Err))
        mongoose.connection.once("open", ()=>{
            console.log("MongoDB 연결 성공")
            return resolve(true)
        })
        mongoose.connection.on("error",async (err)=>{
            console.log("MongoDB 연결 실패!! ",new Date())
            return reject(false)
        })   
    })
}
