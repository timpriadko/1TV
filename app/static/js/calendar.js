const MONTH = ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"];
let calendarDate = $('#calendar2 #date').attr('data-date');
let today = new Date(),
    month,
    year;

if (calendarDate) {
    month = parseInt(calendarDate.split("/")[1]) - 1;
    year = calendarDate.split("/")[0];
} else {
    month = today.getMonth();
    year = today.getFullYear();
}

// перерисовка календаря
const getCalendar = function (newYear, newMonth) {
    if (newYear && newMonth) {
        $.ajax({
            url: '/calendar/' + newYear +'/' + (newMonth + 1) + '.html',
            type: 'GET',
            dataType: 'html',
        }).done(function (data) {
            $('.news-calendar-wrap #calendar2').remove();
            $('.news-calendar-wrap').append(data);
            $('#calendar2 td.title').text('' + MONTH[newMonth] + ' ' + newYear + '');
            month = newMonth;
            year = newYear;
        }).fail(function () {});
    }
};

// //установка текущего месяца
//$('#calendar2 td.title').text('' + MONTH[month] + ' ' + year + '');

//переключение календаря назад
$('.news-calendar-wrap').on('click', '#calendar2 td.prev', function () {
    let date = new Date(year, month - 1, 1);
    getCalendar(date.getFullYear(), date.getMonth());
});

//переключение календаря вперед
$('.news-calendar-wrap').on('click', '#calendar2 td.next', function () {
    let date = new Date(year, month + 1, 1);
    getCalendar(date.getFullYear(), date.getMonth());
});