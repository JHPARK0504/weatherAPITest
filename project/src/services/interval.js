const moment = require('moment');
const Request = require('./request');
const { Interval } = require('./request');
const Limit_Days = 3 // 제한 일

// 초단기실황조회 
Interval("VeryShortlive_Status_inquiry","Seoul","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",60,"06")
Interval("VeryShortlive_Status_inquiry","Gyeonggi","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",60,"06")
Interval("VeryShortlive_Status_inquiry","Jeju","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",60,"06")
Interval("VeryShortlive_Status_inquiry","Junra","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",60,"06") 

// 초단기예보조회
Interval("Ultra_shortterm_forecast_inquiry","Seoul","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst",30,null)
Interval("Ultra_shortterm_forecast_inquiry","Gyeonggi","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst",30,null)
Interval("Ultra_shortterm_forecast_inquiry","Jeju","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst",30,null)
Interval("Ultra_shortterm_forecast_inquiry","Junra","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst",30,null)
// 단기예보조회
Interval("Short_term_forecast_inquiry","Seoul","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",60,"05")
Interval("Short_term_forecast_inquiry","Gyeonggi","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",60,"05")
Interval("Short_term_forecast_inquiry","Jeju","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",60,"05")
Interval("Short_term_forecast_inquiry","Junra","https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst",60,"05")



function Interval(MainName,Address,BaseURL,Minute,ForceHourTime){
    // Name: 명명
    // Minute : 시간간격
    // ForceHourTime : 강제 시간(05) 시 없으면 null type:String Value:05;
    setTimeout(async function Reload(){
        let i = 0;
        while(moment.duration(moment().diff(moment().add(Limit_Days * -1,"days").add(Minute * (i+1),'minutes'))).asDays()>=0){
            // 현재시간을 넘으면 멈추고 Minute 만큼 기다렸다가 재시작
            // 현재시간에서 Limit_Days로 이동하고
            // Minute * i 더하면 몇분전인지 알 수 있다.
            const P_Date = moment().add(Limit_Days * -1,"days").add(Minute * i,'minutes')

            if(ForceHourTime && ForceHourTime == P_Date.format('HH')){
                const Response = await Request(BaseURL , process.env.ServiceKey , 1 , 10000 , "JSON" , P_Date.format('YYYYMMDD'), ForceHourTime+'00' , Address_Item[Address].nx , Address_Item[Address].ny)
                .then((r)=>r).catch((err)=>false)
                Array.isArray(Response) ? await DB_Input(MainName,Address,Response) : false
            } else if(!ForceHourTime){
                const Response = await Request(BaseURL , process.env.ServiceKey , 1 , 10000 , "JSON" , P_Date.format('YYYYMMDD'), P_Date.format('HHmm') , Address_Item[Address].nx , Address_Item[Address].ny)
                .then((r)=>r).catch((err)=>false)
                Array.isArray(Response) ? await DB_Input(MainName,Address,Response) : false
            }
            i = i + 1
        }
        return setTimeout(Reload,(60*1000) * Minute)
    })
}

async function DB_Input(MainName,Address,Items){
    // Items:Array
    try {   
        for(let i=0;i<Items.length;i++){
            if(!await Model.countDocuments({MainName , Address, ...Items[i]})){ //중복검사
                await Model.create({MainName , Address, ...Items[i]})
            }
        }
        return true
    } catch(e) {
        console.log(e)
        return false
    }
}

module.exports = Interval;