// calendar
function CalendarEvents(id, year, month) {
    var Dlast = new Date(year,month+1,0).getDate(),
        D = new Date(year,month,Dlast),
        DNlast = new Date(D.getFullYear(),D.getMonth(),Dlast).getDay(),
        DNfirst = new Date(D.getFullYear(),D.getMonth(),1).getDay(),
        calendar = '<tr>',
        month=["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"];
    if (DNfirst != 0) {
        for(var  i = 1; i < DNfirst; i++) calendar += '<td class="empty-cell">';
    }else{
        for(var  i = 0; i < 6; i++) calendar += '<td>';
    }
    for(var  i = 1; i <= Dlast; i++) {
        if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
            calendar += '<td data-date="' + D.getFullYear() + '/' + (D.getMonth() + 1) + '/' + i + '">' + i + '</td>';
        } else if (new Date(D.getFullYear(),D.getMonth(),i) > new Date()) {
            calendar += '<td data-date="' + D.getFullYear() + '/' + (D.getMonth() + 1) + '/' + i + '">' + i + '</td>';
        } else{
            calendar += '<td class="unobtainable">' + i + '</td>';
        }
        if (new Date(D.getFullYear(),D.getMonth(),i).getDay() == 0) {
            calendar += '<tr>';
        }
    }
    for(var  i = DNlast; i < 7; i++) calendar += '<td class="empty-cell">&nbsp;';
    document.querySelector('#'+id+' tbody').innerHTML = calendar;
    document.querySelector('#'+id+' thead td:nth-child(1)').innerHTML = month[D.getMonth()] +' '+ D.getFullYear();
    document.querySelector('#'+id+' thead td:nth-child(1)').dataset.month = D.getMonth();
    document.querySelector('#'+id+' thead td:nth-child(1)').dataset.year = D.getFullYear();
    // if (document.querySelectorAll('#'+id+' tbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
    //     document.querySelector('#'+id+' tbody').innerHTML += '<tr><td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;';
    // }
}

CalendarEvents("calendar-events", new Date().getFullYear(), new Date().getMonth());
// переключатель минус месяц
document.querySelector('#calendar-events thead tr:nth-child(1) td:nth-child(2)').onclick = function() {
    CalendarEvents("calendar-events", document.querySelector('#calendar-events thead td:nth-child(1)').dataset.year, parseFloat(document.querySelector('#calendar-events thead td:nth-child(1)').dataset.month)-1);
}
// переключатель плюс месяц
document.querySelector('#calendar-events thead tr:nth-child(1) td:nth-child(3)').onclick = function() {
    CalendarEvents("calendar-events", document.querySelector('#calendar-events thead td:nth-child(1)').dataset.year, parseFloat(document.querySelector('#calendar-events thead td:nth-child(1)').dataset.month)+1);
}