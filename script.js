let calendar;

document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    document.getElementById('calendarScreen').style.display = 'none';
});

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ja',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        select: function(info) {
            showEventForm(info.startStr);
        },
        eventClick: function(info) {
            if (info.event.url) {
                window.open(info.event.url);
                return false;
            }
        },
        eventDidMount: function(info) {
            const tooltip = new Tooltip(info.el, {
                title: getEventTooltipContent(info.event),
                placement: 'top',
                trigger: 'hover',
                container: 'body',
                html: true
            });
        },
        events: loadEvents() // 保存されたイベントを読み込む
    });
}

function showCalendar() {
    const venue = document.getElementById('venue').value;
    if (venue === 'さいたまスーパーアリーナ') {
        document.getElementById('titleScreen').style.display = 'none';
        document.getElementById('calendarScreen').style.display = 'block';
        calendar.render();
    } else {
        alert('該当する会場が見つかりません。');
    }
}

function backToTitle() {
    document.getElementById('calendarScreen').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'block';
}

function showEventForm(date) {
    document.getElementById('eventForm').style.display = 'block';
    document.getElementById('eventDate').value = date;
}

function saveEvent() {
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventStartTime = document.getElementById('eventStartTime').value;
    const eventEndTime = document.getElementById('eventEndTime').value;
    const eventUrl = document.getElementById('eventUrl').value;
    
    if (!eventName || !eventDate || !eventStartTime || !eventEndTime) {
        alert('全ての必須項目を入力してください。');
        return;
    }

    // 日付と時間を結合
    const startDateTime = `${eventDate}T${eventStartTime}`;
    const endDateTime = `${eventDate}T${eventEndTime}`;
    
    const newEvent = {
        title: eventName,
        start: startDateTime,
        end: endDateTime,
        url: eventUrl,
        extendedProps: {
            date: eventDate,
            startTime: eventStartTime,
            endTime: eventEndTime
        }
    };

    // 新しいイベントをカレンダーに追加
    calendar.addEvent(newEvent);
    
    // イベントをローカルストレージに保存
    saveEventToStorage(newEvent);
    
    // フォームをクリアしてイベントフォームを非表示にする
    document.getElementById('eventName').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventStartTime').value = '';
    document.getElementById('eventEndTime').value = '';
    document.getElementById('eventUrl').value = '';
    document.getElementById('eventForm').style.display = 'none';
    
    alert('イベントが保存されました。');
}

function getEventTooltipContent(event) {
    return `
        <strong>${event.title}</strong><br>
        日付: ${event.extendedProps.date}<br>
        時間: ${event.extendedProps.startTime} - ${event.extendedProps.endTime}<br>
        ${event.url ? `URL: <a href="${event.url}" target="_blank">${event.url}</a>` : ''}
    `;
}

// イベントをローカルストレージに保存する関数
function saveEventToStorage(event) {
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    events.push(event);
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// ローカルストレージからイベントを読み込む関数
function loadEvents() {
    return JSON.parse(localStorage.getItem('calendarEvents')) || [];
}

// ローカルストレージのイベントを初期化する関数
function clearStoredEvents() {
    if (confirm('保存されたイベントを全て削除しますか？')) {
        localStorage.removeItem('calendarEvents');
        calendar.getEvents().forEach(event => event.remove());
        alert('全てのイベントが削除されました。');
    }
}
