const mongoose = require('mongoose')

module.exports = Connect
function Connect(MONGODB_URL){
    mongoose.Promise = global.Promise
    var mongooseOption = {
        // MongoDB의 새로운 URL을 파싱할 수 있도록하여 안전성 확보
        useNewUrlParser: true, 
        // 새로운 토폴로지 옵션을 사용하여 네트워크 연결관리를 하여 안전성 확보
        useUnifiedTopology: true,
        // 연결풀의 최대치를 정하여 동시에 많은 처리를 할 수 있도록함.
        maxPoolSize: 10000
    }
    return new Promise((resolve,reject)=>{
        mongoose.connect(MONGODB_URL,mongooseOption).then((r)=>true).catch((Err)=>console.log(Err))
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
