var script = document.createElement('script');
script.onload = function () {

};
script.src = '/static/js/main.js?' + Math.floor(new Date().getTime()/14400000);

document.head.appendChild(script);