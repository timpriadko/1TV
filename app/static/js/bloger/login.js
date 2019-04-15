// Environment
var env = {
    apiUrl: "https://api.1tvkr-demo.syntech.info/api/"
};


// UI
const form = document.forms["loginForm"];
const phoneInput = form.elements["phoneInput"];
const passwordInput = form.elements["passwordInput"];
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpInput = form.elements["otpInput"];

// Login service
function AuthService() {
    return {
        /**
         * @description Отправляет OTP(one time password)
         * @param {String} tel - "tel" с инпута формы входа
         * @param {String} password - "password" с инпута формы входа
         */
        sendOtp: function(tel, password) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', env.apiUrl + 'login/');
            xhr.onload = function() {
                console.log(this.responseText);
                if (JSON.parse(this.status) < 300) {
                    if (document.querySelector(".auth-bloger form .no-match").classList.contains('expanded')) {
                        document.querySelector(".auth-bloger form .no-match").classList.remove('expanded')
                        document.querySelector(".auth-bloger form .otp-sent").classList.add('expanded');
                        document.querySelector(".auth-bloger form .otp-sent .tel-num").innerText = phoneInput.value.substring(0, 6) + '-' + phoneInput.value.substring(6, 9) + '-' + phoneInput.value.substring(9, 11) + '-' + phoneInput.value.substring(11, 13);
                        document.querySelector(".auth-bloger form .otp").classList.add('expanded');
                        document.querySelector(".auth-bloger form .send-btn").classList.add('expanded');
                    } else {
                        document.querySelector(".auth-bloger form .otp-sent").classList.add('expanded');
                        document.querySelector(".auth-bloger form .otp-sent .tel-num").innerText = phoneInput.value.substring(0, 6) + '-' + phoneInput.value.substring(6, 9) + '-' + phoneInput.value.substring(9, 11) + '-' + phoneInput.value.substring(11, 13);
                        document.querySelector(".auth-bloger .otp").classList.add('expanded');
                        document.querySelector(".auth-bloger form .send-btn").classList.add('expanded');
                    }
                } else if (JSON.parse(this.status) == 401) {
                    if (document.querySelector(".auth-bloger form .otp-sent").classList.contains('expanded')) {
                        document.querySelector(".auth-bloger form .otp-sent").classList.remove('expanded');
                        document.querySelector(".auth-bloger form .no-match").classList.add('expanded');
                    } else {
                        document.querySelector(".auth-bloger form .no-match").classList.add('expanded');
                    }
                } else if (JSON.parse(this.status) == 503) {
                    document.querySelector(".auth-bloger form .try-later").classList.add('expanded');
                };
            };
            xhr.send(JSON.stringify({ tel, password }));
        },


        /**
         * @description Отправляет форму входа на сервер
         * @param {String} tel - "tel" с инпута формы входа
         * @param {String} password - "password" с инпута формы входа
         * @param {Number} otp - "otp" с инпута
         */
        login: function(tel, password, otp) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', env.apiUrl + 'login/');
            xhr.onload = function() {
                var response = JSON.parse(this.responseText);
                sessionStorage.setItem('token', response.token);
                if (this.status === 202) {
                    window.location = "1TV-Blogers-BlogerPage.html";
                } else if (JSON.parse(this.status) == 401) {
                    if (document.querySelector(".auth-bloger form .otp-sent").classList.contains('expanded')) {
                        document.querySelector(".auth-bloger form .otp-sent").classList.remove('expanded');
                        document.querySelector(".auth-bloger form .no-match").classList.add('expanded');
                        document.querySelector(".auth-bloger form .no-match").innerText = "Неправильно введено одноразовий код";
                    } else {
                        document.querySelector(".auth-bloger form .no-match").classList.add('expanded');
                        document.querySelector(".auth-bloger form .no-match").innerText = "Неправильно введено одноразовий код";
                    }
                } else if (JSON.parse(this.status) == 503) {
                    document.querySelector(".auth-bloger form .try-later").classList.add('expanded');
                };
                console.log(response);
            };
            xhr.send(JSON.stringify({ tel, password, otp }));
        },

        /**
         * @description Выход из аккаунта
         */
        logout: function() {
            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.setRequestHeader("Authorization", token);
            xhr.open('GET', env.apiUrl + 'logout/');
            return xhr.send();
        }
    };
};

// InitAuthService
const loginService = AuthService();

// Send OTP handler
function sendOtpHandler(e) {
    e.preventDefault();

    loginService.sendOtp(phoneInput.value, passwordInput.value);
};

sendOtpBtn.addEventListener("click", sendOtpHandler);

// Login handler
function loginHandler(e) {
    e.preventDefault();

    loginService.login(phoneInput.value, passwordInput.value, otpInput.value);
};

form.addEventListener("submit", loginHandler);