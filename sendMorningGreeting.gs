function sendMorningMessage() {
  const now = new Date();
  
  // スクリプトのタイムゾーンを取得
  const timezone = Session.getScriptTimeZone();
  const timeNow = Utilities.formatDate(now, timezone, 'HH:mm');
  
  // 9:40〜9:41の間に発火した場合のみ継続
  if (timeNow < "09:40" || timeNow >= "09:42") {
    return;
  }
  
  // 土日を除外
  if (now.getDay() === 0 || now.getDay() === 6) {
    return;
  }
  // 祝日を除外
  if (isPublicHoliday(now)) {
    return;
  }
  // 有給を除外
  if (isOnVacation(now)) {
    return;
  }
  
  // メッセージを送信
  // const senderName = "氏名"; // 送信者名を入力
  
  const message = {
    "text": "おはようございます。よろしくお願いします。"
    // "text": "おはようございます。メール担当します。よろしくお願いします。" // メール担当時のテンプレ
  };
  
  var url = "YOUR_Webhook_URL"; // Webhook URLを入力
  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(message)
  };
    
  UrlFetchApp.fetch(url, options);
}

function isPublicHoliday(date) {
  // 日本の祝日カレンダーを使用
  const calendarId = 'ja.japanese#holiday@group.v.calendar.google.com';
  const calendar = CalendarApp.getCalendarById(calendarId);
  const events = calendar.getEventsForDay(date);
  return events.length > 0;
}

function isOnVacation(date) {
  // デフォルトのカレンダーを取得
  const calendarId = Session.getActiveUser().getEmail();
  const calendar = CalendarApp.getCalendarById(calendarId);
  // 今日の終日イベントでタイトルが「休」のものを取得
  const events = calendar.getEventsForDay(date);
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (event.isAllDayEvent() && event.getTitle().indexOf('休') !== -1) {
      return true;
    }
  }
  return false;
}
