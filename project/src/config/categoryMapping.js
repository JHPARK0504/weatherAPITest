// category별로 의미하는 형태로 변경
const categoryMapping = {
    "T1H": "기온(도)",
    "RN1": "강수량(mm)",
    "POP": "강수확률(%)",
    "UUU": "동서바람성분(m/s)",
    "VVV": "남북바람성분(m/s)",
    "REH": "습도(%)",
    "PTY": "강수형태(코드값)",
    "VEC": "풍향(deg)",
    "WSD": "풍속(m/s)",
    "WAV": "파고(M)",
    "SNO": "적설량(범주 1cm)",
    "PCP": "1시간 강수량(mm)",
    "SKY": "하늘상태(코드값)",
};

module.exports = categoryMapping;