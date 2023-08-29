const axios = require('axios');

function Request(Base_URL , ServiceKey , pageNo , numOfRows , dataType , base_date, base_time , nx , ny){
    const URL = Base_URL+`?serviceKey=${ServiceKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=${dataType}&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
    return new Promise((resolve,reject)=>{
        return axios.get(URL).then((r)=>{
            const Result = Response_Parse(r)
            return Result ? resolve(Result) : reject(false)
        }).catch((err)=>reject(false))
    })
}
function Response_Parse(r){
    try {
        if(Array.isArray(r.data.response.body.items.item)) return r.data.response.body.items.item;
    } catch(e) {
        return false
    }
}

module.exports = Request;