const app = require('express')();
const mongoose = require('mongoose');
const Model = require('./src/DB/weather')(); // mongodb Data 스키마
const formatDate = require('./src/utils/formatData');
const formatTime = require('./src/utils/formatTime'); 
const categoryMapping = require('./src/config/categoryMapping'); 
const skyMapping = require('./src/config/skyMapping'); 
require('dotenv').config();

const Address_Item = {
    // nx : 예보지점 x좌표 , ny : 예보지점 y 좌표
    Seoul:{
        nx:37,
        ny:127,
    },
    Gyeonggi:{
        nx:36,
        ny:127
    },
    Jeju:{
        nx:126,
        ny:33
    },
};

app.get("/api/DB", async (req, res) => {
    try {
        const data = await Model.find({
            MainName: req.query.MainName,
            Address: req.query.Address
        }).select({ _id: 0, __v: 0 }).lean();

        if (data && Array.isArray(data)) {
            const formattedData = data.map(Items => {
                const formattedItem = {
                    ...Items,
                    baseDate: formatDate(Items.baseDate),
                };
                if (Items.baseDate) {
                    formattedItem.발표일자 = formatDate(Items.baseDate);
                    delete formattedItem.baseDate;
                }
                if (Items.baseTime) {
                    formattedItem.발표시간 = formatTime(Items.baseTime);
                    delete formattedItem.baseTime;
                }
                if (Items.fcstDate) {
                    formattedItem.예측일자 = formatDate(Items.fcstDate);
                    delete formattedItem.fcstDate;
                }
                if (Items.fcstTime) {
                    formattedItem.예측시간 = formatTime(Items.fcstTime);
                    delete formattedItem.fcstTime;
                }
        
                const categoryDisplayName = categoryMapping[Items.category];
                if (categoryDisplayName) {
                    formattedItem.category = categoryDisplayName;
                }

                if (formattedItem.MainName === "VeryShortlive_Status_inquiry") {
                    formattedItem.MainName = "초단기실황";
                }else if(formattedItem.MainName === "Ultra_shortterm_forecast_inquiry") {
                    formattedItem.MainName = "초단기예보조회";
                }else {
                    formattedItem.MainName = "단기예보조회";
                }

                return formattedItem;
            });
            formattedData.sort((a, b) => (a.예측일자 > b.예측일자) ? 1 : -1);

            res.send(formattedData);
        } else {
            res.send([]);
        }


    } catch (err) {
        console.error(err);
        res.status(404).send(false);
    }
});

// 최저기온 최고기온
app.get("/api/lowAndHighTemperature", async (req, res) => {
    try {
        const address = req.query.Address; // Address 쿼리 파라미터 추가

        if (!Address_Item[address]) {
            return res.status(400).send("Invalid Address"); // 잘못된 주소일 경우 에러 처리
        }

        const data = await Model.find({
            MainName: "Ultra_shortterm_forecast_inquiry", // 필요한 데이터가 초단기실황 데이터에서 나온다고 가정합니다.
            Address: address,
            category: "T1H" // 기온 데이터만 추출
        }).select({ _id: 0, __v: 0 }).lean();

        if (data && Array.isArray(data)) {
            const temperatureData = {};

            data.forEach(item => {
                const date = item.fcstDate;
                const temperature = parseFloat(item.fcstValue); // 기온 데이터를 숫자로 변환
                if (!temperatureData[date]) {
                    temperatureData[date] = {
                        최저온도: temperature,
                        최고온도: temperature,

                    };
                } else {
                    // 최저 온도 및 최고 온도 업데이트
                    temperatureData[date].최저온도 = Math.min(temperatureData[date].최저온도, temperature);
                    temperatureData[date].최고온도 = Math.max(temperatureData[date].최고온도, temperature);
                }
            });

            const formattedTemperatureData = Object.entries(temperatureData).map(([date, temperatures]) => ({
                날짜: date,
                최저온도: temperatures.최저온도.toFixed(1), // 소수점 1자리까지 표시
                최고온도: temperatures.최고온도.toFixed(1),
            }));

            formattedTemperatureData.sort((a, b) => (a.날짜 > b.날짜) ? 1 : -1);

            res.send(formattedTemperatureData);
        } else {
            res.send([]);
        }
    } catch (err) {
        console.error(err);
        res.status(404).send(false);
    }
});

//날짜와 시간별 하늘 상태
app.get("/api/sky", async (req, res) => {
    try {
        const address = req.query.Address;

        if (!Address_Item[address]) {
            return res.status(400).send("Invalid Address");
        }

        const data = await Model.find({
            MainName: "Ultra_shortterm_forecast_inquiry",
            Address: address,
            category: "SKY" // "SKY" 카테고리만 추출
        }).select({ _id: 0, __v: 0 }).lean();

        if (data && Array.isArray(data)) {
            const skyData = data.map(item => ({
                날짜: item.fcstDate,
                시간: formatTime(item.fcstTime),
                하늘상태: skyMapping[item.fcstValue] || "알 수 없음"
            }));

            res.send(skyData);
        } else {
            res.send([]);
        }
    } catch (err) {
        console.error(err);
        res.status(404).send(false);
    }
});

app.get('/api/DB_delete',()=>{
    return Model.deleteMany({}).then((r)=>res.send(true)).catch((err)=>res.status(404).send(false))
})
app.listen(3000,(err)=>{
    if(err) {
        console.log(err)
        return 
    }
    require('./src/DB/connect')(process.env.MONGODB_URL).then((r)=>true).catch((err)=>false) // mongodb 연결
    console.log("3000 Port 생성완료")
})
