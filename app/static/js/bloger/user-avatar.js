// Show user options on click
$('#user-avatar').on('click', function() {
    $('.block-user-options').fadeToggle(150);
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
            // xhr.setRequestHeader("Authorization", token);
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
}

logoutBtn.addEventListener("click", logoutHandler);