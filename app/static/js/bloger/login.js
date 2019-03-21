// Environment
var env = {
    apiUrl: "https://api.1tvkr-demo.syntech.info/api/"
};
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
                console.log(JSON.parse(this.responseText));
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
                }
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
    }

}

// InitAuthService
const auth = AuthService();

// UI
const logoutBtn = document.getElementById('logout');
const form = document.forms["loginForm"];
const phoneInput = form.elements["phoneInput"];
const passwordInput = form.elements["passwordInput"];
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpInput = form.elements["otpInput"];

// Send OTP handler
function sendOtpHandler(e) {
    e.preventDefault();

    auth.sendOtp(phoneInput.value, passwordInput.value);
}

sendOtpBtn.addEventListener("click", sendOtpHandler);

// Login handler
function loginHandler(e) {
    e.preventDefault();

    auth.login(phoneInput.value, passwordInput.value, otpInput.value);

    // if (sessionStorage.getItem("token")) {
    //     window.location = "1TV-Blogers-BlogerPage.html";
    // };
}

form.addEventListener("submit", loginHandler);

// Logout handler
function logoutHandler(e) {
    e.preventDefault();

    auth.logout();
}

logoutBtn.addEventListener("click", logoutHandler);