// UI
var userAvatar = document.querySelector('#user-avatar');
var userOptionsBlock = document.querySelector('#block-user-options');

// Show user options on click
userAvatar.addEventListener('click', function() {
    if (userOptionsBlock.style.display == "none") {
        userOptionsBlock.style.display = "block";
    } else {
        userOptionsBlock.style.display = "none";
    }
});

window.addEventListener('click', function(e) {
    if (e.target == userOptionsBlock) {
        userOptionsBlock.style.display = "none";
    }
});

// Logout

// Environment
var env = {
    apiUrl: "https://api.1tvkr-demo.syntech.info/api/"
};

// Logout UI
const logoutBtn = document.getElementById('logout');

function Logout() {
    return {
        /**
         * @description Выход из аккаунта
         */
        logout: function() {
            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.open('GET', env.apiUrl + 'logout/');
            return xhr.send();
        }
    }

}

// InitAuthService
const auth = Logout();

// Logout handler
function logoutHandler(e) {
    e.preventDefault();

    auth.logout();

    sessionStorage.clear();

    if (!sessionStorage.getItem("token")) {
        window.location = "index.html";
    };
};

logoutBtn.addEventListener("click", logoutHandler);