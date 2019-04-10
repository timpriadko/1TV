$(document).ready(function() {

    $('.preloader').fadeOut();

    var ABSOLUTE_URL = "https://api.1tvkr-demo.syntech.info/";

    var MONTH=["Січня","Лютня","Березня","Квітня","Травня","Червня","Липня","Серпня","Вересня","Жовтня","Листопада","Грудня"];
    var DAY_WEEK=["Пн","Вт","Ср","Чт","Пт","Сб","Нд","Пн","Вт","Ср","Чт","Пт","Сб","Нд"];
    var DAY_WEEK_ING=["mon","tue","wed","thu","fri","sat","sun","mon","tue","wed","thu","fri","sat","sun"];

    var event_start = "00:00";
    var event_end = "24:00";
    var event_select_day = null;
    var event_type = "all";
    var event_date = "month";
    var event_odeum = [];

    var imgListDevare = [];

    // get Exchange Rates
    var today = new Date();
    var today_day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
    var today_month = (today.getMonth() < 9) ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
    var today_year = today.getFullYear();

    var yesterday = new Date(today.setDate(today.getDate()-1));
    var yesterday_day = (yesterday.getDate() < 10) ? '0' + yesterday.getDate() : yesterday.getDate();
    var yesterday_month = (yesterday.getMonth() < 9) ? '0' + (yesterday.getMonth() + 1) : yesterday.getMonth() + 1;
    var yesterday_year = yesterday.getFullYear();

    var today_str = '' + today_year + today_month + today_day;
    var yesterday_str = '' + yesterday_year + yesterday_month + yesterday_day;
    var usd_today,
        usd_yesterday,
        eur_today,
        eur_yesterday;

    function getCSRFToken() {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, 10) == ('csrftoken' + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(10));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // active header links
    var validate_menu = function() {
        $('nav ul li').each(function () {
            var path_link = $(this).children('a').attr('href');
            var path_locate = window.location.pathname;

            if (path_locate === path_link) {
                $(this).addClass('active');
            } else {
                path_locate = path_locate.split('/');
                path_link = path_link.split('/');
                path_locate = path_locate.length > 1 ? path_locate[1] : path_locate[0];
                path_link = path_link.length > 1 ? path_link[1] : path_link[0];
                if (path_locate === path_link) {
                    $(this).addClass('active');
                }
            }
        });
    };
    validate_menu();

    var convDate = function(dat) {
        var dt = dat.split('/');
        if (dt.length === 3) {
            dt = new Date(parseInt(dt[0]), parseInt(dt[1]) - 1, parseInt(dt[2]));
            return dt.getDate() + ' ' + MONTH[dt.getMonth()] + ' ' + dt.getFullYear();
        }
        return dat;
    };

    var news_list_date = function() {
        var prev_date = null;
        $('.news-list li').each(function() {
            var dat = $(this).data('date');
            if (dat) {
                var dat_id = 'date_' + dat.replace(/\//g, '-');
                if (dat !== prev_date && $('#' + dat_id).length === 0) {
                    $(this).before('<h3 class="subtitle" id="' + dat_id + '">' + convDate(dat) + '</h3>');
                }
                prev_date = dat;
            }
        });
    };

    $.get('/menus.json',
        function(data) {

            try {
                var main_pages = data.main;
                var main_pages_compare_f = {};
                var main_pages_compare_h = {};

                var noClass = function(cls) {
                    return (cls === undefined || cls === '' || cls === 'active');
                };

                main_pages.map(function (item, idx) {
                    main_pages_compare_f[ item.slug ] = {'in': item};
                    main_pages_compare_h[ item.slug ] = {'in': item};
                });

                $('footer nav ul li').each(function () {
                    var key = $(this).children('a').attr('href');
                    if ($(this).hasClass('def') || noClass($(this).attr('class'))) {
                        if (main_pages_compare_f[key] === undefined) {
                            main_pages_compare_f[key] = {'out': this};
                        } else {
                            main_pages_compare_f[key]['out'] = this;
                        }
                    }
                });

                for (var j in main_pages_compare_f) {
                    if (main_pages_compare_f[j]['in'] === undefined && main_pages_compare_f[j]['out'] !== undefined) {
                        $(main_pages_compare_f[j]['out']).remove();
                    }
                    if (main_pages_compare_f[j]['out'] === undefined && main_pages_compare_f[j]['in'] !== undefined) {
                        $('footer nav ul').append(
                            $('<li class="def"></li>').append(
                                $('<a href="' + j + '">' + main_pages_compare_f[j]['in']['label'] + '</a>')
                            )
                        );
                    }
                }

                $('header nav ul li').each(function () {
                    var key = $(this).children('a').attr('href');
                    if ($(this).hasClass('def') || noClass($(this).attr('class'))) {
                        if (main_pages_compare_h[key] === undefined) {
                            main_pages_compare_h[key] = {'out': this};
                        } else {
                            main_pages_compare_h[key]['out'] = this;
                        }
                    }
                });
                for (var j in main_pages_compare_h) {
                    if (main_pages_compare_h[j]['in'] === undefined && main_pages_compare_h[j]['out'] !== undefined) {
                        $(main_pages_compare_h[j]['out']).remove();
                    }
                    if (main_pages_compare_h[j]['out'] === undefined && main_pages_compare_h[j]['in'] !== undefined) {
                        $('header nav ul').append(
                            $('<li class="def"></li>').append(
                                $('<a href="' + j + '">' + main_pages_compare_h[j]['in']['label'] + '</a>')
                            )
                        );
                    }
                }
            } catch (err) {}

            try {
                var sections = data.sections;
                var sections_compare = {};
                sections.map(function (item, idx) {
                    sections_compare['/' + item.slug + '.html'] = {'in': item};
                });
                $('header nav ul li.election').each(function () {
                    var key = $(this).children('a').attr('href');
                    if (sections_compare[key] === undefined) {
                        sections_compare[key] = {'out': this};
                    } else {
                        sections_compare[key]['out'] = this;
                    }
                });

                for (var j in sections_compare) {
                    if (sections_compare[j]['in'] === undefined && sections_compare[j]['out'] !== undefined) {
                        $(sections_compare[j]['out']).remove();
                    }
                    if (sections_compare[j]['out'] === undefined && sections_compare[j]['in'] !== undefined) {
                        $('header nav ul').append(
                            $('<li class="election"></li>').append(
                                $('<a href="' + j + '">' + sections_compare[j]['in']['name'] + '</a>')
                            )
                        );
                    }
                }
            } catch (err) {}

            try {
                var custom_pages = data.custom_pages;
                var custom_pages_compare = {};
                custom_pages.map(function (item, idx) {
                    custom_pages_compare['/' + item.slug + '.html'] = {'in': item};
                });
                $('footer nav ul li.transition').each(function () {
                    var key = $(this).children('a').attr('href');
                    if (custom_pages_compare[key] === undefined) {
                        custom_pages_compare[key] = {'out': this};
                    } else {
                        custom_pages_compare[key]['out'] = this;
                    }
                });

                for (var j in custom_pages_compare) {
                    if (custom_pages_compare[j]['in'] === undefined && custom_pages_compare[j]['out'] !== undefined) {
                        $(custom_pages_compare[j]['out']).remove();
                    }
                    if (custom_pages_compare[j]['out'] === undefined && custom_pages_compare[j]['in'] !== undefined) {
                        $('footer nav ul').append(
                            $('<li class="transition"></li>').append(
                                $('<a href="' + j + '">' + custom_pages_compare[j]['in']['name'] + '</a>')
                            )
                        );
                    }
                }
            } catch (err) {}

            validate_menu();
        });

    var getYesterdayRates = function () {
        $.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=' + yesterday_str + '&json',
            function(data) {
                if (data) {
                    var rates = data;
                    usd_yesterday = rates.filter(function(item) {
                        return (item.r030 === 840);
                    });
                    eur_yesterday = rates.filter(function(item) {
                        return (item.r030 === 978);
                    });
                }
                var usd_delta = usd_today[0].rate - usd_yesterday[0].rate;
                var usd_growth = (usd_delta === 0) ?  "" : (usd_delta > 0) ? "up" : "down";
                var usd_rate = usd_today[0] ? (usd_today[0].rate).toFixed(2) : 0;
                var eur_delta = eur_today[0].rate - eur_yesterday[0].rate;
                var eur_growth = (eur_delta === 0) ?  "" : (eur_delta > 0) ? "up" : "down";
                var eur_rate = eur_today[0] ? (eur_today[0].rate).toFixed(2) : 0;
                if (usd_rate) {
                    $("#block-exchange-rates").prepend('<li class="usd '+ usd_growth +'">\n' +
                        '<span>USD</span>\n' + usd_rate +
                        '</li>');
                }
                if (eur_rate) {
                    $("#block-exchange-rates").prepend('<li class="eur '+ eur_growth +'">\n' +
                        '<span>EUR</span>\n' + eur_rate +
                        '</li>');
                }
            }, "json");
    }

    $.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=' + today_str + '&json',
        function(data) {
            if (data) {
                var rates = data;
                usd_today = rates.filter(function(item) {
                    return (item.r030 === 840);
                });
                eur_today = rates.filter(function(item) {
                    return (item.r030 === 978);
                });
                getYesterdayRates();
            }
        }, "json");

    // get weather
    $.get('http://api.openweathermap.org/data/2.5/forecast?id=703845&units=metric&APPID=862a6015926d73e9bed066d1eef3a3a0',
        function(data) {
            if (data) {
                var temp = data.list[0].main.temp;
                if (temp) {
                    var sign = (temp > 0) ? "+" : "";
                    $("#block-exchange-rates").append('<li class="weather"><span>Кривий Ріг </span>' + sign + Math.round(temp) + '&#176;</li>');
                }
            }
        }, "json");
    if ($(window).width() > 1240) {
        $('.scroll').perfectScrollbar({
            minScrollbarLength: 15,
            wheelSpeed: 1
        });
    } else {
        $('.scroll').perfectScrollbar('destroy');
    }


    $(window).scroll(function() {
        if ($(window).scrollTop() >= 600) {
            $('.go-top').show();
        } else {
            $('.go-top').hide();
        }
        if ($(window).width() > 1240) {
            if ($(window).scrollTop() >= 157) {
                $('.block-nav, body').addClass('fixed');
                $('.top-header, .block-logo').hide();
            } else {
                $('.block-nav, body').removeClass('fixed');
                $('.top-header, .block-logo').show();
            }
        }
    });

    $('#search-button').on('click', function() {
        $('.block-search').fadeToggle(150);
        $('.search').toggleClass('close');
        $('#search-str').val('');
    });

    var resetBroadcast = function () {
        $('.tab-item, .tab-content').removeClass('active');
        $('.tab-item[data-content="tab-content-1"]').addClass('active');
        $('#tab-content-1').addClass('active');
        $('.schedule-info').removeClass('show');
        $('.block-broadcast .tabs').removeClass('video-schedule');
        $('.days-list, .section-broadcast tabs').show();
        $('.block-video-schedule').removeClass('delay-3 show');
        $('.schedule-info').removeClass("delay-3 narrow");
        $('.block-broadcast .tabs').removeClass('video-schedule');
        $('.schedule-list-wrapper').addClass('delay-3').removeClass('hide');
        $('#tab-content-2 .preview-item').removeClass('active');
        $('.schedule-info').scrollTop(0);
    };

    $('.broadcast').on('click', function() {
        var block_broadcast = $('.block-broadcast');
        block_broadcast.toggleClass('hide').slideToggle(300);
        $(this).toggleClass('active');
        if (block_broadcast.hasClass('hide')) {
            $('#video').attr('src', '');
            resetBroadcast();
        } else {
            $('#video').attr('src', 'https://live-tv.od.ua/tv/1tvkr/1tvkr.php?w=780&h=570&cnee&a=0&ff=0');
        }
    });

    $('.section-broadcast').on('click', '.tab-item', function() {
        $('.tab-item, .tab-content').removeClass('active');
        $(this).addClass('active');
        var content = $(this).data('content');
        $('#' + content).addClass('active');
        if (content === "tab-content-2") {
            $('#video').attr('src', '');
            $('.block-preview .preview-item').removeClass('active');
            $('.schedule-info').removeClass('show');
            $('.days-list').show();
            $('.day-name').removeClass('show');
        } else {
            $('#video').attr('src', 'https://live-tv.od.ua/tv/1tvkr/1tvkr.php?w=780&h=570&cnee&a=0&ff=0');
        }
    });

    $('.section-broadcast').on('click', '.close-broadcast', function() {
        $('.block-broadcast').slideToggle(300).toggleClass('hide');
        $('.broadcast').toggleClass('active');
        $('#video').attr('src', '');
        resetBroadcast();
    });

    //***************** change video ***********************/
    $('#tab-content-1').on('click', '.preview-item', function() {
        var src = $(this).data('src');
        $('#video').attr('src', src);
        $('#tab-content-1 .preview-item').removeClass('active');
        $(this).addClass('active');
    });

    $('#schedule-block-preview').on('click', '.preview-item', function() {
        var src = $(this).data('src');
        var name = $('.title', this).text();
        $('#video-schedule').attr('src', src);
        $('#tab-content-2 .preview-item').removeClass('active');
        $(this).addClass('active');
        $('#program-name').text(name);
        $('.days-list, .section-broadcast tabs').hide(300);
        $('.schedule-list-wrapper').removeClass('delay-3').addClass('hide');
        $('.block-broadcast .tabs').addClass('video-schedule');
        $('.block-video-schedule').addClass('show delay-3');
        $('.schedule-info').addClass("narrow delay-3");
        if ($(window).width() <= 1240) {
            $('.day-name').removeClass('show');
        }
    });

    $('.content-2-video-name .back').on('click', function () {
        $('.days-list, .section-broadcast tabs').show(300);
        $('.block-video-schedule').removeClass('delay-3 show');
        $('.schedule-info').removeClass("delay-3 narrow");
        $('.block-broadcast .tabs').removeClass('video-schedule');
        $('.schedule-list-wrapper').addClass('delay-3').removeClass('hide');
        $('#tab-content-2 .preview-item').removeClass('active');
        $('.schedule-info').scrollTop(0);
        if ($(window).width() <= 1240) {
            $('.days-list').hide();
            $('.day-name').addClass('show');
        }
    });

    $('.day-name .back').on('click', function () {
        $('.schedule-info').removeClass('show');
        $('.day-name').removeClass('show');
        $('.days-list').show();
    });

    //get program info and videos
    var getProgramInfo = function (url) {
        $('#schedule-block-preview').empty();
        $.get('/episode/projects/' + url + '.json',
            function(data) {
                if (data && data.length > 0) {
                    var title = data[0].fields.project.name;
                    var description = data[0].fields.project.description;
                    $('.schedule-info .block-title').html(title);
                    $('.schedule-info .description').html(description);
                    data.map( function (item) {
                        $('#schedule-block-preview').append('<div class="preview-item video-overlay flex transition" ' +
                            'data-src="'+ item.fields.video_link + '">\n' +
                            '  <div class="img">\n' +
                            '    <img src="'+ item.fields.image + '" alt="" />\n' +
                            '  </div>\n' +
                            '  <div class="info">\n' +
                            '    <h4 class="title">'+ item.fields.title + '</h4>\n' +
                            '    <p class="date">'+ new Date(item.fields.publish_in).getDay() + ' ' + MONTH[new Date(item.fields.publish_in).getMonth()] + ' ' + new Date(item.fields.publish_in).getFullYear() +'</p>\n' +
                            '  </div>\n' +
                            '</div>');
                    });
                }
            }, "json");
    };

    var firstProgram = $('.schedule-list .show').get();
    var firstSlug = $(firstProgram[0]).attr('data-project-slug');
    $(firstProgram[0]).addClass('active');
    getProgramInfo(firstSlug);

    // change program
    $('.schedule-item').on('click', function () {
        $('.schedule-item').removeClass('active');
        $(this).addClass('active');
        var projectSlug = $(this).attr('data-project-slug');
        if (projectSlug) {
            getProgramInfo(projectSlug);
        }
        if ($(window).width() <= 1240) {
            $('.schedule-info').addClass('show');
            $('.days-list').hide();
            $('.day-name').addClass('show');
        }
    });

    // change day of the week
    $('.days-list').on('click', '.days-item', function () {
        var item = $(this);
        var dayWeek = item.data('dayWeek');
        // var scheduleList = $('.schedule-item');
        // console.log(scheduleList);
        $('.days-item').removeClass('active');
        $(this).addClass('active');
        $('.schedule-item').removeClass('show active');
        $('.schedule-item').map( function() {
            if ($(this).hasClass(dayWeek)) {
                $(this).addClass('show');
                if ($('.schedule-item.active').length === 0) {
                    $(this).addClass('active');
                }
            }
        });
    });

    var dayWeek = today.getDay();
    var getDaysWeek = function () {
        for (var i = dayWeek; i < (dayWeek + 7); i++) {
            $('.days-list').append('<div data-day-week="' + DAY_WEEK_ING[i] + '" ' +
                'class="days-item flex align-center justify-center transition ' + (i === dayWeek ? 'active' : "") + '">' + DAY_WEEK[i] + '</div>')
        }
    }

    getDaysWeek();

    //************************* end ****************************/
    if ($(window).width() > 1240) {
        $('.slider').slick({
            slidesToShow: 3,
            slidesToScroll: 3
            // responsive: [
            //     {
            //         breakpoint: 1240,
            //         settings: {
            //             slidesToShow: 2,
            //             slidesToScroll: 2
            //         }
            //     },
            // ]
        });
    } else {
        $('.slider .slider-item:nth-child(1), .slider .slider-item:nth-child(2), .slider .slider-item:nth-child(3)').addClass('show');
    }

    // show all top news
    $('.section-slider .mobile').on('click', function () {
        $('.slider .slider-item').addClass('show');
    })

    $('.slider-videos').slick({
        slidesToShow: 6,
        slidesToScroll: 6,
        responsive: [
            {
                breakpoint: 1240,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                    arrows: false
                }
            },
        ]
    });

    $('body').on('click', '.go-top', function () {
        $('body, html').animate({
            scrollTop: 0
        }, 600);
    });

    // calendar date selection
    $('#calendar-news').on('click', 'td:not(.empty-cell)', function () {
        $('#calendar-news td:not(.empty-cell)').removeClass('today');
        $(this).addClass('today');
    });

    $('#calendar-event-tbody').on('click', 'td:not(.empty-cell, .unobtainable)', function () {
        event_select_day = $(this).attr('data-date');
        event_date = "selectedDay";
        $('.filters-date .day').remove();
        $('.filters-date li').removeClass('active');
        var selectedDay = "" + new Date(event_select_day).getDate() + ' ' + MONTH[new Date(event_select_day).getMonth()] + ' ' + new Date(event_select_day).getFullYear();
        if (selectedDay) {
            $('.filters-date').prepend('<li class="transition active day">'+ selectedDay +'</li>');
        }
        filterEventsList();
    });

    //******************** infinite-scroll index page ************************
    var newItemList = $('#main-infinite-scroll .news-list .new-item').get();
    var lastItem = null,
        lastItemDate = null,
        getNewsUrl = null;
    if (newItemList.length != 0) {
        lastItem = $(newItemList)[newItemList.length - 1];
        lastItemDate = $(lastItem).attr("data-date");
    }
    if (lastItemDate) {
        getNewsUrl = '/news/' + lastItemDate + '.json';
    }
    var centerBlockHeight = $('#news-center-block').height();
    var externBlock = $('#main-infinite-scroll');
    var externBlockHeight = centerBlockHeight;
    var innerBlock = $('#main-infinite-scroll .new-inner');
    var scrollCheckLoading = false;

    var getNewsListMainPage = function () {
        if (getNewsUrl) {
            $.ajax({
                url: getNewsUrl,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    scrollCheckLoading = true;
                }
            }).done(function (data) {
                if (data) {
                    getNewsUrl = data[0].pre_path;
                    if (data.length >= 2) {
                        var dateNewsStr = data[1].fields.publish_in;
                        var dateNews = new Date(dateNewsStr);
                        var dayNews = dateNews.getDate();
                        var monthNews = MONTH[dateNews.getMonth()];

                        $('#main-infinite-scroll .news-list').append('<li class="day-name">\n' +
                            '  <h3 class="subtitle">' + dayNews + ' ' + monthNews + '</h3>\n' +
                            '</li>');
                        for (var i = 1; i < data.length; i++) {
                            var date = new Date(data[i].fields.publish_in);
                            var id = data[i].pk;
                            var newsList = $('#main-infinite-scroll .new-item').filter(function () {
                                return ($(this).attr("data-id") == id);
                            }).get();
                            if (newsList.length === 0) {
                                $('#main-infinite-scroll .news-list').append('<li data-id="' + data[i].pk + '" ' +
                                    'data-date="' + data[i].fields.publish_in + '" class="new-item flex">\n' +
                                    '  <div class="time">' + date.getHours() + ':' + date.getMinutes() + '</div>\n' +
                                    '  <a href="/news/' + data[i].pk + '.html" class="new-info">\n' +
                                    '    <h2 class="new-title transition">' + data[i].fields.title + '</h2>\n' +
                                    '    <div class="new-img">\n' +
                                    '      <img class="transition" src="' + data[i].fields.image + '">\n' +
                                    '    </div>\n' +
                                    '  </a>\n' +
                                    '</li>');
                            }
                        }
                    }
                }

                scrollCheckLoading = false;
            }).fail(function (error) {
                scrollCheckLoading = false;
                if (error.status === 404) {
                    $('#index-left-block .button.mobile').hide();
                }
            });
        }
    };

    if ($(window).width() > 1240) {

        $(innerBlock).css({minHeight: (externBlockHeight + 100) + 'px'});
        $(externBlock).height(centerBlockHeight);

        $('#main-infinite-scroll').on('scroll', function () {
            var innerBlockHeight = $(innerBlock).height();
            var scrollTop = $(this).scrollTop();
            var delta = innerBlockHeight - externBlockHeight - scrollTop;
            if (delta < 500) {
                getNewsListMainPage();
            }
        });
    }

    $('#index-left-block .button.mobile').on('click', function () {
        getNewsListMainPage();
    })

    //***************************** end **************************

    //************************ news page  *************************
    if ($(window).width() > 1240) {
        var newsPageRightBlockHeight = $('#news-page-right-block').height();
        $('#news-page-scroll').height(newsPageRightBlockHeight);
    }

    //************************** tags filter **********************
    var newsPageTagsList = [];

    // tag selection
    $('#tags-news-page').on('click', '.tag-item', function () {
        $(this).toggleClass('active');
        var tag = $(this).attr('data-tag-name');
        if ($(this).hasClass('active')) {
            newsPageTagsList.push(tag);
        } else {
            newsPageTagsList = newsPageTagsList.filter( function (item) {
                return (item != tag);
            });
        }
        if (window.sessionStorage) {
            sessionStorage.setItem("tagsNewsPage", newsPageTagsList.join(';'));
        }
        newsFilteringNewsPage();
    });

    // news filtering
    var newsFilteringNewsPage = function () {
        var activeTags = [];
        var newsPageAllNews = $('#news-page-scroll-wrap .new-item').get();
        if (window.sessionStorage && sessionStorage.getItem("tagsNewsPage")) {
            activeTags = sessionStorage.getItem("tagsNewsPage").split(';');
        }
        if (activeTags.length != 0) {
            $(newsPageAllNews).removeClass('show');
            for (var i = 0; i < newsPageAllNews.length; i++) {
                var k = 0;
                var item = newsPageAllNews[i];
                for (var j = 0; j < activeTags.length; j++) {
                    ($(item).attr('data-tags').split(' ').indexOf(activeTags[j]) >= 0) ? k++ : k;
                }
                if (k > 0) {
                    $(item).addClass('show');
                }
            }
        }
        else {
            $(newsPageAllNews).addClass('show');
        }
        $('#news-page-scroll').scrollTop(0);
    }

    // news filtering when loading page
    var markTagsNewsPage = function () {
        var activeTags = [];
        if (window.sessionStorage && sessionStorage.getItem("tagsNewsPage")) {
            activeTags = sessionStorage.getItem("tagsNewsPage").split(';');
            var tagsList = $('#tags-news-page .tag-item').get();
            tagsList.map( function (item) {
                var tag = $(item).attr('data-tag-name');
                if (activeTags.indexOf(tag) >= 0) {
                    $(item).addClass('active');
                }
            })
        }
    }
    newsFilteringNewsPage();
    markTagsNewsPage();

    //************************** tags filter Analytics Page **********************
    var analyticsPageRightBlockHeight = $('#analytics-page-right-block').height();

    var analyticsPageTagsList = [];
    if (window.sessionStorage && sessionStorage.getItem("tagsAnalyticsPage")) {
        analyticsPageTagsList = sessionStorage.getItem("tagsAnalyticsPage").split(';');
    }

    // tag selection
    $('#tags-analytics-page').on('click', '.tag-item', function () {
        $(this).toggleClass('active');
        var tag = $(this).attr('data-tag-name');
        if ($(this).hasClass('active')) {
            analyticsPageTagsList.push(tag);
        } else {
            analyticsPageTagsList = analyticsPageTagsList.filter( function (item) {
                return (item != tag);
            });
        }
        if (window.sessionStorage) {
            sessionStorage.setItem("tagsAnalyticsPage", analyticsPageTagsList.join(';'));
        }
        analyticsFiltering();
        $('#analytics-page-scroll').scrollTop(0);
    });

    // analytics filtering
    var analyticsFiltering = function () {
        var activeTags = [];
        var analyticsPageAll = $('#analytics-page-scroll .new-item').get();
        if (window.sessionStorage && sessionStorage.getItem("tagsAnalyticsPage")) {
            activeTags = sessionStorage.getItem("tagsAnalyticsPage").split(';');
        }
        if (activeTags.length != 0) {
            $(analyticsPageAll).removeClass('show');
            for (var i = 0; i < analyticsPageAll.length; i++) {
                var k = 0;
                var item = analyticsPageAll[i];
                for (var j = 0; j < activeTags.length; j++) {
                    ($(item).attr('data-tags').split(' ').indexOf(activeTags[j]) >= 0) ? k++ : k;
                }
                if (k > 0) {
                    $(item).addClass('show');
                }
            }
        }
        else {
            $(analyticsPageAll).addClass('show');
        }
    }

    // analytics filtering when Analytics page
    var markTagsAnalyticsPage = function () {
        var activeTags = [];
        if (window.sessionStorage && sessionStorage.getItem("tagsAnalyticsPage")) {
            activeTags = sessionStorage.getItem("tagsAnalyticsPage").split(';');
            var tagsList = $('#tags-analytics-page .tag-item').get();

            // добавление недостающих тегов из sessionStorage
            var tagsArr = tagsList.map( function (item) {
                return $(item).attr('data-tag-name');
            });
            activeTags.map( function (item) {
                if (tagsArr.indexOf(item) === -1) {
                    tagsArr.push(item);
                    $('#tags-analytics-page').append('<li data-tag-name="' + item + '" class="tag-item transition">#' + item + '</li>');
                }
            });

            tagsList = $('#tags-analytics-page .tag-item').get();
            tagsList.map( function (item) {
                var tag = $(item).attr('data-tag-name');
                if (activeTags.indexOf(tag) >= 0) {
                    $(item).addClass('active');
                }
            })
        }
    }

    markTagsAnalyticsPage();
    analyticsFiltering();

    //******************** infinite-scroll analytics page ************************
    var analyticsItemList = $('.analytics .new-item').get();
    var lastAnalyticsItem = null,
        lastAnalyticsItemDate = null,
        getAnalyticsUrl = null;
    if (analyticsItemList.length != 0) {
        lastAnalyticsItem = $(analyticsItemList)[analyticsItemList.length - 1];
        lastAnalyticsItemDate = $(lastAnalyticsItem).attr("data-date");
    }
    if (lastAnalyticsItemDate) {
        // var weekYear = Number(lastAnalyticsItemDate) === 1 ? 52 : (Number(lastAnalyticsItemDate) - 1);
        // var year = Number(lastAnalyticsItemDate) === 1 ? (new Date().getFullYear() - 1) : new Date().getFullYear();
        var weekYear = Number(lastAnalyticsItemDate);
        var year = new Date().getFullYear();

        getAnalyticsUrl = '/analytics/' + year + '/' + weekYear + '.json';
    }

    var scrollAnalyticsCheckLoading = false;

    var addTagsAnalyticsPage = function (tags) {
        var tagsStr = '';
        var tagsList = $('#tags-analytics-page .tag-item').get();
        var tagsArr = tagsList.map( function (item) {
            return $(item).attr('data-tag-name');
        });
        if (tags && tags.length > 0) {
            tags.map( function (item) {
                if (tagsArr.indexOf(item.name) === -1) {
                    $('#tags-analytics-page').append('<li data-tag-name="' + item.name + '" class="tag-item transition">#' + item.name + '</li>');
                }
                tagsStr = tagsStr + ' ' + item.name;
            })
        }
        return tagsStr;
    }

    var getListAnalyticsPage = function () {
        if (getAnalyticsUrl) {
            $.ajax({
                url: getAnalyticsUrl,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    scrollAnalyticsCheckLoading = true;
                }
            }).done(function (data) {
                if (data) {
                    getAnalyticsUrl = data[0].pre_path;
                    if (data.length >= 2) {
                        for (var i = 1; i < data.length; i++) {
                            var date = new Date(data[i].fields.publish_in);
                            var id = data[i].pk;
                            var analyticsList = $('#analytics-page-scroll .new-item').filter(function () {
                                return ($(this).attr("data-id") == id);
                            }).get();
                            if (analyticsList.length === 0) {
                                var tagsStr = addTagsAnalyticsPage(data[i].fields.tags);
                                $('#analytics-page-scroll .news-list').append('<li class="new-item" ' +
                                    'data-tags="' + tagsStr + '" data-id="' + data[i].pk + '">\n' +
                                    '    <a href="/analytics/' + data[i].pk + '.html" class="flex">\n' +
                                    '       <div class="img">\n' +
                                    '          <img class="transition" src="/' + data[i].fields.image + '">\n' +
                                    '       </div>\n' +
                                    '       <div class="info">\n' +
                                    '          <h2 class="new-title transition">' + data[i].fields.title + '</h2>\n' +
                                    '          <p class="description">' + data[i].fields.description + '</p>\n' +
                                    '          <p class="date">'+ date.getDay() + ' ' + MONTH[date.getMonth()] + ' ' + date.getFullYear() +'</p>\n' +
                                    '       </div>\n' +
                                    '    </a>\n' +
                                    '</li>');
                            }
                        }
                    }
                }

                scrollAnalyticsCheckLoading = false;
            }).fail(function (error) {
                scrollAnalyticsCheckLoading = false; console.log(error.status)
                if (error.status === 404) {
                    $('#analytics-page-scroll .button.mobile').hide();
                }
            });
        }
        analyticsFiltering();
    };

    if ($(window).width() > 1240) {

        $('#analytics-page-scroll').height(analyticsPageRightBlockHeight);
        $('#analytics-page-scroll .new-inner').css({minHeight: (analyticsPageRightBlockHeight + 100) + 'px'});

        $('#analytics-page-scroll').on('scroll', function () {
            var innerBlockHeight = $('#analytics-page-scroll .new-inner').height();
            var externBlockHeight = $(this).height();
            var scrollTop = $(this).scrollTop();
            var delta = innerBlockHeight - externBlockHeight - scrollTop;
            if (delta < 500) {
                getListAnalyticsPage();
            }
        });
    }

    $('#analytics-page-scroll .button.mobile').on('click', function () {
        getListAnalyticsPage();
    })

    //***************************** end **************************

//************************** Blog Page *********************************************************
    var blogPageRightBlockHeight = $('#blog-page-right-block').height();
    var blogPageTagsList = [];
    if (window.sessionStorage && sessionStorage.getItem("tagsBlogPage")) {
        blogPageTagsList = sessionStorage.getItem("tagsBlogPage").split(';');
    }

    // blog selection
    $('#tags-blog-page').on('click', '.tag-item', function () {
        $(this).toggleClass('active');
        var tag = $(this).attr('data-tag-name');
        if ($(this).hasClass('active')) {
            blogPageTagsList.push(tag);
        } else {
            blogPageTagsList = blogPageTagsList.filter( function (item) {
                return (item != tag);
            });
        }
        if (window.sessionStorage) {
            sessionStorage.setItem("tagsBlogPage", blogPageTagsList.join(';'));
        }
        blogFilteringBlogsPage();
        $('#blog-page-scroll').scrollTop(0);
    });

    // blog filtering
    var blogFilteringBlogsPage = function () {
        var activeTags = [];
        $('#blog-page-scroll-wrap .blog-page-item').removeClass('last');
        var blogPageAllNews = $('#blog-page-scroll-wrap .blog-page-item').get();
        if (window.sessionStorage && sessionStorage.getItem("tagsBlogPage")) {
            activeTags = sessionStorage.getItem("tagsBlogPage").split(';');
        }
        if (activeTags.length != 0) {
            $(blogPageAllNews).removeClass('show');
            for (var i = 0; i < blogPageAllNews.length; i++) {
                var k = 0;
                var item = blogPageAllNews[i];
                for (var j = 0; j < activeTags.length; j++) {
                    ($(item).attr('data-tags').split(' ').indexOf(activeTags[j]) >= 0) ? k++ : k;
                }
                if (k > 0) {
                    $(item).addClass('show');
                }
            }
        }
        else {
            $(blogPageAllNews).addClass('show');
            $("#blog-page-scroll-wrap .blog-page-item:first-child").addClass('last');
        }
    }

    // blog filtering when loading page
    var markTagsBlogPage = function () {
        var activeTags = [];
        if (window.sessionStorage && sessionStorage.getItem("tagsBlogPage")) {
            activeTags = sessionStorage.getItem("tagsBlogPage").split(';');
            var tagsList = $('#tags-blog-page .tag-item').get();
            tagsList.map( function (item) {
                var tag = $(item).attr('data-tag-name');
                if (activeTags.indexOf(tag) >= 0) {
                    $(item).addClass('active');
                }
            })
        }
    }
    blogFilteringBlogsPage();
    markTagsBlogPage();

    //******************** infinite-scroll Blogs page ************************
    var blogsItemList = $('.blog-page-list .blog-page-item').get();
    var lastBlogsItem = null,
        lastBlogsItemDate = null,
        getBlogsUrl = null;
    if (blogsItemList.length != 0) {
        lastBlogsItem = $(blogsItemList)[blogsItemList.length - 1];
        lastBlogsItemDate = $(lastBlogsItem).attr("data-date");
    }
    if (lastBlogsItemDate) {
        // var weekYear = Number(lastBlogsItemDate) === 1 ? 52 : (Number(lastBlogsItemDate) - 1);
        // var year = Number(lastBlogsItemDate) === 1 ? (new Date().getFullYear() - 1) : new Date().getFullYear();
        var weekYear = Number(lastBlogsItemDate);
        var year = new Date().getFullYear();

        getBlogsUrl = '/blog/' + year + '/' + weekYear + '.json';
    }

    var scrollBlogsCheckLoading = false;

    var addTagsBlogsPage = function (tags) {
        var tagsStr = '';
        var tagsList = $('#tags-blog-page .tag-item').get();
        var tagsArr = tagsList.map( function (item) {
            return $(item).attr('data-tag-name');
        });
        if (tags && tags.length > 0) {
            tags.map( function (item) {
                if (tagsArr.indexOf(item.name) === -1) {
                    $('#tags-blog-page').append('<li data-tag-name="' + item.name + '" class="tag-item transition">#' + item.name + '</li>');
                }
                tagsStr = tagsStr + ' ' + item.name;
            })
        }
        return tagsStr;
    }

    var getListBlogsPage = function () {
        if (getBlogsUrl) {
            $.ajax({
                url: getBlogsUrl,
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    scrollBlogsCheckLoading = true;
                }
            }).done(function (data) {
                if (data) {
                    getBlogsUrl = data[0].pre_path;
                    if (data.length >= 2) {
                        for (var i = 1; i < data.length; i++) {
                            var date = new Date(data[i].fields.publish_in);
                            var id = data[i].pk;
                            var blogsList = $('#blog-page-scroll .blog-page-item').filter(function () {
                                return ($(this).attr("data-id") == id);
                            }).get();
                            if (blogsList.length === 0) {
                                var tagsStr = addTagsBlogsPage(data[i].fields.tags);
                                $('#blog-page-scroll .blog-page-list').append('<li class="blog-page-item" ' +
                                    'data-tags="' + tagsStr + '" data-id="' + data[i].pk + '">\n' +
                                    '  <a href="/blog/' + data[i].pk + '.html" class="flex">\n' +
                                    '    <div class="img">\n' +
                                    '      <img class="transition" src="/' + data[i].fields.blogger.image + '">\n' +
                                    '    </div>\n' +
                                    '    <div class="info">\n' +
                                    '      <h2 class="blog-title transition">' + data[i].fields.title + '</h2>\n' +
                                    '      <p class="description">' + data[i].fields.content + '</p>\n' +
                                    '      <p class="name">' + data[i].fields.blogger.first_name + ' ' + data[i].fields.blogger.last_name + '</p>\n' +
                                    '      <p class="date">' + date.getDay() + ' ' + MONTH[date.getMonth()] + ' ' + date.getFullYear() +'</p>\n' +
                                    '    </div>\n' +
                                    '  </a>\n' +
                                    '</li>');
                            }
                        }
                    }
                }

                scrollBlogsCheckLoading = false;
            }).fail(function (error) {
                scrollBlogsCheckLoading = false;
                if (error.status === 404) {
                    $('#blog-page-scroll .button.mobile').hide();
                }
            });
        }
        blogFilteringBlogsPage();
    };


    if ($(window).width() > 1240) {

        $('#blog-page-scroll').height(blogPageRightBlockHeight - 36);
        $('#blog-page-scroll .new-inner').css({minHeight: (blogPageRightBlockHeight + 75) + 'px'});

        $('#blog-page-scroll').on('scroll', function () {
            var innerBlockHeight = $('#blog-page-scroll .new-inner').height();
            var externBlockHeight = $(this).height();
            var scrollTop = $(this).scrollTop();
            var delta = innerBlockHeight - externBlockHeight - scrollTop;
            if (delta < 500) {
                getListBlogsPage();
            }
        });
    }

    $('#blog-page-scroll .button.mobile').on('click', function () {
        getListBlogsPage();
    })


    //***************************** end **************************

    //select
    if ($.fn && $.fn.niceSelect) {
        $('select').niceSelect();
    }

    var resetSelectTime = function () {
        $('.time-start .current').text("00:00");
        $('.time-end .current').text("24:00");
        $('.time-end .option, .time-start .option').removeClass('hide selected focus');
        $( $('.time-start .option').get(0) ).addClass('selected focus');
        $( $('.time-end .option').get(-1) ).addClass('selected focus');
        event_start = "00:00";
        event_end = "24:00";
    };

    var filterEventsList = function () {
        var eventList = $('.events-list .event-item');
        var arr = $(eventList).get();
        var calendar = $('#calendar-event-tbody td:not(.empty-cell, .unobtainable)');
        $(calendar).removeClass("mark");
        var calendarDays = $(calendar).get();
        var startTime = Number(event_start.replace(':',''));
        var endTime = Number(event_end.replace(':',''));
        $(eventList).addClass('show');
        $(eventList).hide();
        $('.events-list .text-error').remove();
        if (event_type && event_type !== "all") {
            arr.map(function (item) {
                if ($(item).attr('data-event-type') !== event_type) {
                    $(item).removeClass('show');
                }
            })
        }
        if (event_odeum && event_odeum.length > 0) {
            arr.map(function (item) {
                var arrOdeum = $(item).attr('data-event-odeum').split(', ');
                var eventShow = false;
                arrOdeum.map( function (odeum) {
                    if (event_odeum.indexOf(odeum) >= 0) {
                        eventShow = true;
                    }
                })
                if (!eventShow) {
                    $(item).removeClass('show');
                }
            })
        }
        if (startTime && endTime) {
            arr.map(function (item) {
                var arrTime = $(item).attr('data-event-time').split(', ');
                var eventShow = false;
                arrTime.map( function (time) {
                    var eventTime = Number(time.replace(':',''));
                    if ( (eventTime >= startTime) && (eventTime < endTime) ) {
                        eventShow = true;
                    }
                })
                if (!eventShow) {
                    $(item).removeClass('show');
                }
            })
        }
        if (event_date) {
            var today = new Date(new Date().getTime() - new Date().getTime() % 86400000);
            var tomorrow = new Date(new Date().setDate(today.getDate() + 1) - new Date().setDate(today.getDate() + 1) % 86400000);
            var sat = new Date( (new Date().setDate(today.getDate()+ 6 - today.getDay())) - (new Date().setDate(today.getDate()+ 6 - today.getDay())) % 86400000);
            var mon = new Date( (new Date().setDate(today.getDate()+ 8 - today.getDay())) - (new Date().setDate(today.getDate()+ 8 - today.getDay())) % 86400000);
            var dayNextMonth = new Date( new Date(today.getFullYear(), today.getMonth() + 1, 2) - new Date(today.getFullYear(), today.getMonth() + 1, 1) % 86400000 );
            var start, end;

            switch (event_date) {
                case 'today':
                    start = today;
                    end = today;
                    calendarDays.map( function(item) {
                        var itemDate = new Date($(item).attr('data-date'));
                        if (itemDate.getDate() === today.getDate() && itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear()) {
                            $(item).addClass('mark');
                        }
                    });
                    break;

                case 'tomorrow':
                    start = tomorrow;
                    end = tomorrow;
                    calendarDays.map( function(item) {
                        var itemDate = new Date($(item).attr('data-date'));
                        if (itemDate.getDate() === tomorrow.getDate() && itemDate.getMonth() === tomorrow.getMonth() && itemDate.getFullYear() === tomorrow.getFullYear()) {
                            $(item).addClass('mark');
                        }
                    });
                    break;

                case 'weekend':
                    start = sat;
                    end = mon;
                    calendarDays.map( function(item) {
                        var itemDate = new Date($(item).attr('data-date'));
                        var date = new Date(itemDate - new Date().getTimezoneOffset()*60*1000);
                        if (date >= sat && date < mon) {
                            $(item).addClass('mark');
                        }
                    });
                    break;

                case 'week':
                    start = today;
                    end = mon;
                    calendarDays.map( function(item) {
                        var itemDate = new Date($(item).attr('data-date'));
                        var date = new Date(itemDate - new Date().getTimezoneOffset()*60*1000);
                        if (date >= today && date < mon) {
                            $(item).addClass('mark');
                        }
                    });
                    break;

                case 'selectedDay':
                    start = new Date(new Date(event_select_day) - new Date().getTimezoneOffset()*60*1000);
                    end = start; console.log(end)
                    calendarDays.map( function(item) {
                        var itemDate = $(item).attr('data-date');
                        if (itemDate === event_select_day) {
                            $(item).addClass('mark');
                        }
                    });
                    break;

                case 'month':
                    start = today;
                    end = dayNextMonth;
                    break;

                default:
                    break;
            }
            arr.map(function (item) {
                var eventStartDay = new Date($(item).attr('data-event-start'));
                var eventEndDay = new Date($(item).attr('data-event-end'));
                var startDay = new Date(eventStartDay - new Date().getTimezoneOffset()*60*1000);
                var endDay = new Date(eventEndDay - new Date().getTimezoneOffset()*60*1000);
                if ((startDay > end) || (endDay < start) ) {
                    $(item).removeClass('show');
                }
            })
        }
        $('.events-list .show').show();
        if ($('.events-list .event-item.show').get().length === 0) {
           $('.events-list').append('<p class="text-error">За даним запитом подій не знайдено</p>')
        }
    };

    resetSelectTime();
    filterEventsList();

    // checked filters
    $('.filters-event li').on('click', function() {

        

        var filterEvent = $(this).attr('data-event-type');
        $('.filters-event li').removeClass('active');
        $(this).addClass('active');
        event_type = filterEvent;
        filterEventsList();
    });

    $('.event-item .event-type').on('click', function() {
        var eventType = $(this).parent().parent().attr('data-event-type');
        event_type = eventType;
        $('.filters-event li').removeClass('active');
        $('.filters-event li').map( function () {
            if ($(this).attr('data-event-type') === event_type) {
                $(this).addClass('active');
            };
        });
        filterEventsList();
    });

    $('.filters-date li').on('click', function() {
        var filterDate = $(this).attr('data-event-date');
        $('.filters-date li').removeClass('active');
        $('.filters-date .day').remove();
        $(this).addClass('active');
        event_date = filterDate;
        filterEventsList();
    });

    $('.time-start').change(function() {
        var value = Number($(this).val().slice(0, 2));
        event_start = $(this).val();
        $('.time-end .option').removeClass('hide selected focus');
        var optionList = $('.time-end .option').get();
        optionList.map( function (item) {
            if (Number($(item).attr('data-value').slice(0, 2)) <= value ) {
                $(item).addClass('hide').removeClass('selected focus');
            }
        });
        if (Number(event_end.slice(0, 2)) <= value) {
            var option = $('.time-end .option').get(value);
            var text = $(option).text();
            $(option).addClass('selected focus')
            $('.time-end .current').text(text);
            event_end = String(value + 1) + ":00";
        }
        filterEventsList();
    });

    $('.time-end').change(function() {
        var value = $(this).val();
        event_end = value;
        filterEventsList();
    });

    $('.all-time').on('click', function() {
        resetSelectTime();
        filterEventsList();
    });

    $('#all-event-type').on('click', function() {
        event_type = "all";
    });

    $('#reset-odeum').on('click', function() {
        $('.odeum-list .odeum-name').removeClass("checked");
        event_odeum = [];
        filterEventsList();
    });

    $('.event-odeum span').on('click', function() {
        var odeum = $(this).attr('data-name');
        var odeumList = $('.odeum-list .odeum-name');
        $(odeumList).removeClass('checked');
        event_odeum = [];
        event_odeum.push(odeum);
        odeumList.get().map(function (item) {
            if ($(item).attr('data-name') === odeum) {
                $(item).addClass("checked");
            }
        });
        filterEventsList();
    });

    $('.odeum-list .odeum-name').on('click', function() {
        if ($(this).hasClass('all')) {
            if ( $(this).hasClass("checked") ) {
                event_odeum = event_odeum.filter( function (item) {
                    return item != "all";
                });
            }
            if ( !$(this).hasClass("checked") ) {
                $('.odeum-list .odeum-name').addClass("checked");
                var odeumList = $('.odeum-list .odeum-name:not(.all)').get();
                odeumList.map( function (item) {
                    var odeum = $(item).attr('data-name');
                    if ( odeum && (event_odeum.indexOf(odeum) < 0) ) {
                        event_odeum.push(odeum);
                    }
                });
            } 
            else if ($(this).hasClass("checked")) {
                $('.odeum-list .odeum-name').removeClass("checked");
                event_odeum = [];
            }
        } else {
            $('.odeum-list .odeum-name.all').removeClass('checked');
            var odeum = $(this).attr('data-name');
            $(this).toggleClass("checked");
            if (odeum) {
                if ( $(this).hasClass("checked") && (event_odeum.indexOf(odeum) < 0) ) {
                    event_odeum.push(odeum);
                }
                if ( !$(this).hasClass("checked") ) {
                    event_odeum = event_odeum.filter( function (item) {
                        return item != odeum;
                    })
                }
            }
        }
    });

    $('#apply-filters').on('click', function() {
        filterEventsList();
    });

    // плавный скролл до якоря на странице Видео
    $(".all-programs-list").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        if ($(window).width() > 1240) {
            $('body,html').animate({scrollTop: top - 90}, 1000);
        } else $('body,html').animate({scrollTop: top - 140}, 1000);
    });

    $('.show-program-list').on("click", function () {
        if ($(this).hasClass('show')) {
            $(this).removeClass('show');
            $(this).text('Розгорнути');
            $('.all-programs-list').slideUp(300);
        } else {
            $(this).addClass('show');
            $(this).text('Сгорнути');
            $('.all-programs-list').slideDown(300);
        }
    });

    //show filters (page Events List)
    $('.show-filter-button').on("click", function () {
        if ($(this).hasClass('show')) {
            $(this).removeClass('show');
            $(this).text('Показати фільтри');
            $('.filters-bar, .column-5.page-event').slideUp(300);
        } else {
            $(this).addClass('show');
            $(this).text(' Приховати фільтри');
            $('.filters-bar, .column-5.page-event').slideDown(300);
        }
    });


    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    var imgList = [];

    $('.file-upload input[type=file]').on('change', function (e) {
        var fileReader = new FileReader();
        fileReader.onload = function () {
            var file = fileReader.result;  // data <-- in this var you have the file data in Base64 format
            imgList.push(file);
            $(".img-list").append(
                $('<div class="img-item img-item-upload"></div>')
                    .append($('<img title="Клікніть щоб видалити." />').attr('src', file))
                    .on('click', function() {
                        $(this).remove()
                    })
            );
        };
        fileReader.readAsDataURL($(this).prop('files')[0]);
    });

    //отправка формы "Сообщить новость"
    $('#form-report-button').on('click',  function() {
        var form = $('#form-report').serializeArray();
        var data = Object();
        $.each(form, function( key, value ){
            data[value['name']] = value['value'];
        });

        data['file'] = [];

        $('.img-item-upload img').each(function(){
            data['file'].push($(this).attr('src'));
        });
        var showError = function() {
            alert('Сталася помилка при відправленні новини(( Будь-ласка, спробуйте згодом.');
        };

        $.ajax({
            url: ABSOLUTE_URL + 'api/report/',
            type: 'POST',
            data: JSON.stringify(data),
            cache: false,
            processData: false,
            success: function (respond, status, jqXHR) {
                if (respond['result'] === 'ok') {
                    $('#form-report').hide();
                    $('.block-form').append(
                        $('<h1>Дякуємо!</h1><h3>Новина успішно надіслана!</h3>')
                    );
                } else {
                    showError();
                }
            },
            error: function (jqXHR, status, errorThrown) {
                console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
                showError();
            }
        });
    });

    // выбор картинок для удаления (страница Сообщить новость)
    $('.img-list').on('click', '.checkbox',  function() {
        var checkbox = $(this);
        if ($(checkbox).hasClass('selected')) {
            $(checkbox).removeClass('selected');

        } else {
            $(checkbox).addClass('selected');
        }
        var checkboxCount = $('.img-list .checkbox.selected').get();
        if (checkboxCount.length > 0) {
            $('#devare-imgs .count').text('(' + checkboxCount.length + ')');
            $('#devare-imgs ').addClass('show');
        } else {
            $('#devare-imgs ').removeClass('show');
            $('#devare-imgs .count').text("");
        }

    });

    // удаление картинок (страница Сообщить новость)
    $('#devare-imgs').on('click', function() {
        var indexList = [];
        var arr = $('.img-list .img-item .checkbox').get();
        arr.map( function (item, ind) {
            if ($(item).hasClass('selected')) {
                indexList.push(ind);
            }
        });
        console.log(imgList)
        indexList.map( function (index) {
            $('.img-list .img-item:nth-child(' + (index+1) + ')').remove();
            imgList.splice(index, 1);
        });

        // var multySelect = $('#id_images option').get();
        // var imgList = $('.img-list .img-item').get();
        // multySelect.map( function (item) {
        //     if (imgListDevare.indexOf($(item).val()) >= 0) {
        //         $(item).remove();
        //     }
        // });
        // imgList.map( function (item) {
        //     if (imgListDevare.indexOf($(item).attr("data-id")) >= 0) {
        //         $(item).remove();
        //     }
        // });
        // $(this).removeClass('show');
        // imgListDevare = [];
    });

    // показ/скрытие меню
    $('.toogle').on('click', function() {
        $(".header-menu").fadeToggle(400);
        $(this).toggleClass('click');
        $(".block-nav").fadeToggle();
        $(".block-nav .wrap").toggleClass('show');
        $(".social-network").toggleClass('show');
    });

    //************************** tags filter Blogger Page **********************
    var bloggerPageTagsList = [];

    // tag selection
    $('#tags-blogger-page').on('click', '.tag-item', function () {
        $(this).toggleClass('active');
        var tag = $(this).attr('data-tag-name');
        if ($(this).hasClass('active')) {
            bloggerPageTagsList.push(tag);
        } else {
            bloggerPageTagsList = bloggerPageTagsList.filter( function (item) {
                return (item != tag);
            });
        }
        if (window.sessionStorage) {
            sessionStorage.setItem("tagsBloggerPage", bloggerPageTagsList.join(';'));
        }
        blogFilteringBloggerPage();
    });

    // blog filtering
    var blogFilteringBloggerPage = function () {
        var activeTags = [];
        var blogPageAllBlog = $('#author-blog-list .blog-item').get();
        if (window.sessionStorage && sessionStorage.getItem("tagsBloggerPage")) {
            activeTags = sessionStorage.getItem("tagsBloggerPage").split(';');
        }
        if (activeTags.length != 0) {
            $(blogPageAllBlog).removeClass('show');
            for (var i = 0; i < blogPageAllBlog.length; i++) {
                var k = 0;
                var item = blogPageAllBlog[i];
                for (var j = 0; j < activeTags.length; j++) {
                    ($(item).attr('data-tags').split(' ').indexOf(activeTags[j]) >= 0) ? k++ : k;
                }
                if (k > 0) {
                    $(item).addClass('show');
                }
            }
        }
        else {
            $(blogPageAllBlog).addClass('show');
        }
    };

    // blog filtering when loading page
    var markTagsBloggerPage = function () {
        var activeTags = [];
        if (window.sessionStorage && sessionStorage.getItem("tagsBloggerPage")) {
            activeTags = sessionStorage.getItem("tagsBloggerPage").split(';');
            var tagsList = $('#tags-blogger-page .tag-item').get();
            tagsList.map( function (item) {
                var tag = $(item).attr('data-tag-name');
                if (activeTags.indexOf(tag) >= 0) {
                    $(item).addClass('active');
                }
            })
        }
    };
    blogFilteringBloggerPage();
    markTagsBloggerPage();

    function getSearchResult() {
        var str = $('#search-str').val();
        if (str && str.length > 0) {

            var data = {
                'query': str
            };

            // $.each( files, function( key, value ){
            //     data.append( key, value );
            // });

            var csrftoken = getCSRFToken();

            $.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    if (!csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });

            if( data ) {
                // // AJAX запрос
                $.ajax({
                    url: ABSOLUTE_URL + 'api/search/',
                    // url: '/api/search/',
                    type: 'POST',
                    data: data,
                    // dataType: 'jsonp',
                    // cache: false,
                    // processData: false,
                    // contentType: false,
                    success: function (respond, status, jqXHR) {
                        if (respond) {
                            var newsList = JSON.parse(respond.search_news);
                            var episodesList = JSON.parse(respond.search_episodes);
                            var resultNewsList = $('.result-news-list');
                            var resultVideoList = $('.result-videos-list');
                            $('.result-news-list li').remove();
                            $('.result-videos-list li').remove();

                            if (episodesList && episodesList.length > 0) {
                                episodesList.map( function (item) {
                                    $(resultVideoList).append('<li class="video-item">\n' +
                                        '      <a href="' + item.fields.url + '">\n' +
                                        '        <div class="img">\n' +
                                        '          <img src="/' + item.fields.image_url + '" alt="" />\n' +
                                        '        </div>\n' +
                                        '        <div class="info">\n' +
                                        '          <h4 class="title transition">' + item.fields.title + '</h4>\n' +
                                        '          <p class="date">'+ new Date(item.fields.publish_in).getDay() + ' ' + MONTH[new Date(item.fields.publish_in).getMonth()] + ' ' + new Date(item.fields.publish_in).getFullYear() +'</p>\n' +
                                        '        </div>\n' +
                                        '      </a>\n' +
                                        '    </li>');
                                });
                            }

                            if (newsList && newsList.length > 0) {
                                newsList.map( function (item) {
                                    $(resultNewsList).append('<li class="new-item transition">\n' +
                                        '          <a href="/' + item.fields.url + '" class="new-info">\n' +
                                        '            <h2 class="new-title transition">' + item.fields.title + '</h2>\n' +
                                        '            <p class="description">' + item.fields.description + '</p>\n' +
                                        '            <div class="time">'+ new Date(item.fields.publish_in).getDay() + ' ' + MONTH[new Date(item.fields.publish_in).getMonth()] + ' ' + new Date(item.fields.publish_in).getFullYear() +'</div>\n' +
                                        '          </a>\n' +
                                        '        </li>');
                                });
                            }

                            if ($('.search-result li').get().length === 0) {
                                $(resultNewsList).append('<li class="new-item transition">За даним запитом ничого не знайдено</li>')
                            }
                            $('.search-result').removeClass('hide').slideDown(300);
                        }
                    },
                    error: function (jqXHR, status, errorThrown) {
                        console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
                    }
                });
            }
        }
    }

    //search
    $('.header-search-button').on('click', function() {
        getSearchResult();
    });

    $('.close-search-result').on('click', function() {
        $('.search-result').addClass('hide').slideUp(300);
        $('.result-news-list li').remove();
        $('.result-videos-list li').remove();
    });

    $("#search-str").keyup(function(event){
        if(event.keyCode == 13){
            getSearchResult();
        }
    });

    news_list_date();

});
