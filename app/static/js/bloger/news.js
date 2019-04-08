// Контейнер новостей с прокруткой
var newsSection = document.getElementById('news-page-scroll');

newsSection.onscroll = function() {

    if (newsSection.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+
        newsSection.addEventListener("wheel", onWheel);
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        newsSection.addEventListener("mousewheel", onWheel);
      } else {
        // Firefox < 17
        newsSection.addEventListener("MozMousePixelScroll", onWheel);
      }
    } else { // IE8-
        newsSection.attachEvent("onmousewheel", onWheel);
    }

    // Это решение предусматривает поддержку IE8-
    function onWheel(e) {
      e = e || window.event;

      // deltaY, detail содержат пиксели
      // wheelDelta не дает возможность узнать количество пикселей
      // onwheel || MozMousePixelScroll || onmousewheel
      var delta = e.deltaY || e.detail || e.wheelDelta;

      var info = document.getElementById('delta');

      console.log(delta);
      if (newsSection.scrollTop === 0 && delta < 0) {
        window.scrollBy({ top: -500, behavior: 'smooth' });
      }

      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

};