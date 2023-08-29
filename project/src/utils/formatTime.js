// formatTime 함수 정의
function formatTime(timeString) {
    const hour = timeString.substring(0, 2);
    const minute = timeString.substring(2, 4);
    return `${hour}시 ${minute}분`;
}

module.exports = formatTime;