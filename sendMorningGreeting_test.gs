function sendMorningMessage() {
  var now = new Date();
  
  // スクリプトのタイムゾーンを取得
  var timezone = Session.getScriptTimeZone();
  var timeNow = Utilities.formatDate(now, timezone, 'HH:mm');
  
  // 9:40でない場合は終了
  if (timeNow != "09:40") {
    return;
  }
  
  // 土日を除外
  var day = now.getDay();
  if (day == 0 || day == 6) { // 日曜日=0, 土曜日=6
    return;
  }

  // 祝日を除外
  if (isPublicHoliday(now)) {
    return;
  }
  
  // 有給休暇取得日を除外
  if (isOnVacation(now)) {
    return;
  }
  
  // メッセージを送信
  var senderName = "YOUR_NAME"; // 送信者名を入力
  
  var message = {
    "cards": [
      {
        "header": {
          "title": senderName
        },
        "sections": [
          {
            "widgets": [
              {
                "textParagraph": {
                  "text": "おはようございます。テストです。"
                }
              }
            ]
          }
        ]
      }
    ]
  };
  
  var url = "YOUR_Webhook URL"; // Webhook URLを入力
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(message)
  };
    
  UrlFetchApp.fetch(url, options);
}

function isPublicHoliday(date) {
  // 日本の祝日カレンダーを使用
  var calendarId = 'ja.japanese#holiday@group.v.calendar.google.com';
  var calendar = CalendarApp.getCalendarById(calendarId);
  var events = calendar.getEventsForDay(date);
  return events.length > 0;
}

function isOnVacation(date) {
  // デフォルトのカレンダーを取得
  var calendarId = Session.getActiveUser().getEmail();
  var calendar = CalendarApp.getCalendarById(calendarId);
  // 今日の終日イベントでタイトルが「休暇」のものを取得
  var events = calendar.getEventsForDay(date);
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    if (event.isAllDayEvent() && event.getTitle().indexOf('休暇') !== -1) {
      return true;
    }
  }
  return false;
}
