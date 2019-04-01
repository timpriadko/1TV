// Environment
var env = {
    apiUrl: "https://api.1tvkr-demo.syntech.info/api/"
};

// Init DateTimepicker
$('#datetimepicker').datetimepicker();

// Blog service
function BlogService() {
    return {
        /**
         * @description Параметры блога
         * @param {string} title - заглавие из инпута формы
         * @param {string} description - причина снятия с публикации из модального окна редактирования
         * @param {string} content - контент блога из формы
         * @param {Array} tags - теги из инпута формы
         * @param {string} publish_in - дата публикации
         * @param {boolean} published - true/false 
         * @param {string} status - published/unpublished/draft/removed_by_admin/removed_by_author
         */


        // Create blog
        newBlog: function({
            title,
            description,
            content,
            tags,
            publish_in,
            published
        }) {
            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (JSON.parse(this.status) < 300) {
                    window.location = "1TV-Blogers-BlogerPage.html";
                }
            };
            xhr.open('POST', env.apiUrl + 'blog/create/');
            xhr.setRequestHeader("Authorization", token);
            xhr.send(JSON.stringify({
                title,
                description,
                content,
                tags,
                publish_in,
                published
            }));
        }
    };
}

// Init Blog service
var blog = BlogService();

// New blog UI
var newBlogform = document.forms["newBlog"];
var titleInput = document.querySelector('.article-title input');
var tagsInput = document.querySelector('.article-tags input');
var publishDate = document.getElementById('datetimepicker');
var publishBtn = document.querySelector('.publish-article button');
var titleValidationMsgWrapper = document.querySelector('.article-title .validation-message-wrapper');
var contentValidationMsgWrapper = document.querySelector('.article-content .validation-message-wrapper');
var dateValidationMsgWrapper = document.querySelector('.delay-article-post .validation-message-wrapper');
var draftBtn = document.querySelector('.save-article button');
var deleteBtn = document.querySelector('.delete-article button');

// Validation
function blogValidation() {
    // title error message
    switch (document.querySelector('.article-title input').value) {
        case '':
            document.querySelector('.article-title .validation-message-wrapper').classList.add('is-invalid');
            break;
        case document.querySelector('.article-title input').value:
            document.querySelector('.article-title .validation-message-wrapper').classList.remove('is-invalid');
            break;
    };
    // content error message
    switch (CKEDITOR.instances.ckeditor.getData()) {
        case '':
            document.querySelector('.article-content .validation-message-wrapper').classList.add('is-invalid');
            break;
        case CKEDITOR.instances.ckeditor.getData():
            document.querySelector('.article-content .validation-message-wrapper').classList.remove('is-invalid');
            break;
    };
}

// Publish new blog handler
function publishNewBlog(e) {

    // Get content data from ckeditor    
    var contentInput = CKEDITOR.instances.ckeditor.getData();

    // // Make 'tags' string to array
    // var tagsArr;

    // function tagsToArr() {
    //     tagsArr = tagsInput.value.split('#').slice(1);
    //     return tagsArr;
    // }
    // tagsToArr();

    // time now
    var date = new Date();
    var dateAndTimeNow = date.getFullYear() + "-" + (((+date.getMonth() + 1) < 10) ? "0" + (+date.getMonth() + 1) : (+date.getMonth() + 1)) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

    // New blog data to send
    var newBlogData = {
            title: document.querySelector('.article-title input').value,
            description: "create",
            content: contentInput,
            tags: [],
            publish_in: (!document.getElementById('datetimepicker').value ? dateAndTimeNow : document.getElementById('datetimepicker').value),
            published: true
        }
        // Init Blog service
    var blog = BlogService();
    blog.newBlog(newBlogData);
}

function publishNewBlogHandler() {
    blogValidation();
    if ((!document.querySelector('.article-title .validation-message-wrapper').classList.contains('is-invalid') &&
            (!document.querySelector('.article-content .validation-message-wrapper').classList.contains('is-invalid')))) {
        publishNewBlog();
    }
};

// Save blog as draft handler
function saveBlogAsNewDraft(e) {
    // Get content data from ckeditor    
    var contentInput = CKEDITOR.instances.ckeditor.getData();

    // Make 'tags' string to array
    var tagsArr;

    function tagsToArr() {
        tagsArr = document.querySelector('#myTags').innerText.split('#').slice(1);
        return tagsArr;
    }
    tagsToArr();

    // time now
    var date = new Date();
    var dateAndTimeNow = date.getFullYear() + "-" + (((+date.getMonth() + 1) < 10) ? "0" + (+date.getMonth() + 1) : (+date.getMonth() + 1)) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

    // Save blog as draft data to send
    var saveBlogAsDraft = {
        title: document.querySelector('.article-title input').value,
        description: "create draft",
        content: contentInput,
        tags: tagsArr,
        publish_in: dateAndTimeNow,
        published: false
    }

    // Init Blog service
    var blog = BlogService();
    blog.newBlog(saveBlogAsDraft);
}

function saveBlogAsNewDraftHandler() {
    blogValidation();
    if (!document.querySelector('.article-title .validation-message-wrapper').classList.contains('is-invalid') &&
        !document.querySelector('.article-content .validation-message-wrapper').classList.contains('is-invalid')
    ) {
        saveBlogAsNewDraft();
    }
};

// Delete blog

// When the user clicks the button, open the modal 
function deleteModal(e) {
    document.getElementById('modalDelete').style.display = "block";
};

// Close the modal
function closeDeleteModal() {
    document.getElementById('modalDelete').style.display = "none";
};

// Delete blog handler
function backToBP(e) {
    window.location = "1TV-Blogers-BlogerPage.html";
};

window.onclick = function(event) {
    if (event.target == document.getElementById('modalDelete')) {
        document.getElementById('modalDelete').style.display = "none";
    }
}

// Tags
$(document).ready(function() {
    var availableTags = [
        "#ActionScript",
        "#AppleScript",
        "Asp",
        "#BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "#Java",
        "#JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme",
        '#кривий рiг',
        '#кривбасводоканал',
        '#криворiжгаз',
        '#Політика ',
        '#Воєнний стан',
        '#Економіка',
    ];
    $("#myTags").tagit({
        autocomplete: {
            delay: 0,
            minLength: 2
        },
        autocomplete: {
            source: availableTags
        },
        placeholderText: "Почніть кожен новий тег з символу #"
    });
});

// var url = 'https://api.1tvkr-demo.syntech.info/api/blog-tags/';
// var xhr = new XMLHttpRequest();
// xhr.open('GET', url);
// xhr.onload = function() { console.log(this.responseText) };
// xhr.send();


// var url = 'https://api.1tvkr-demo.syntech.info/api/blog-tags/';
// var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
// var xhr = new XMLHttpRequest();
// xhr.open('POST', url);
// xhr.onload = function() {console.log(this.responseText)};
// xhr.setRequestHeader("Authorization", token);
// xhr.setRequestHeader('Content-Type', 'application/json');
// xhr.send(JSON.stringify({add: 'криввбасс'}));