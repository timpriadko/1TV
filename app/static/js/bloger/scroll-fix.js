 // Контейнер с прокруткой
var scrollSection = document.getElementById('analytics-page-scroll');

scrollSection.onscroll = function() {

    if (scrollSection.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+
        scrollSection.addEventListener("wheel", onWheel);
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        scrollSection.addEventListener("mousewheel", onWheel);
      } else {
        // Firefox < 17
        scrollSection.addEventListener("MozMousePixelScroll", onWheel);
      }
    } else { // IE8-
      scrollSection.attachEvent("onmousewheel", onWheel);
    }

    // Это решение предусматривает поддержку IE8-
    function onWheel(e) {
      e = e || window.event;

      // deltaY, detail содержат пиксели
      // wheelDelta не дает возможность узнать количество пикселей
      // onwheel || MozMousePixelScroll || onmousewheel
      var delta = e.deltaY || e.detail || e.wheelDelta;

      var info = document.getElementById('delta');

      // Scroll window to top when section scroll is max
      if (scrollSection.scrollTop === 0 && delta < 0) {
        window.scrollBy({ top: -500, behavior: 'smooth' });
      }
      // Scroll window to bottom when section scroll is min
      if (scrollSection.scrollTop === (scrollSection.scrollHeight - scrollSection.clientHeight) && delta > 0) {
        window.scrollBy({ top: 500, behavior: 'smooth' });
      }

      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }

}; 