$('.thumb').on('click', (function() {
    var id = $(this).attr('data-id');
    var productUrl = $(this).attr('data-url');
    var elem = this;
    $('.like-counter').removeClass('active');

    $.ajax({
        type: 'POST',
        url: productUrl + 'like/',
        data: {
            'user_id': id,
            'product_id': id,
            'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val(),
        },
        success: function (response) {
            var likes = response['likes'];
            $(elem).children('.like-counter').addClass('active');
            if (response.result) {
                $(elem).addClass('active');
                $('.like-counter.active').text(likes);
            } else {
                $('.like-counter.active').text(likes);
                $(elem).removeClass('active');
            }
        },
    });
}));