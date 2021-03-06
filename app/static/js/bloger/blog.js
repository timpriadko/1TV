// Environment
var env = {
    apiUrl: "https://api.1tvkr-demo.syntech.info/api/"
};

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
var publishDate = document.getElementById('datetimepicker');
var publishBtn = document.querySelector('.publish-article button');
var titleValidationMsgWrapper = document.querySelector('.article-title .validation-message-wrapper');
var contentValidationMsgWrapper = document.querySelector('.article-content .validation-message-wrapper');
var dateValidationMsgWrapper = document.querySelector('.delay-article-post .validation-message-wrapper');
var draftBtn = document.querySelector('.save-article button');
var deleteBtn = document.querySelector('.delete-article button');

// Validation
function blogValidation() {
    // no title error message
    switch (document.querySelector('.article-title input').value) {
        case '':
            document.querySelector('.article-title .validation-message-wrapper').classList.add('is-invalid');
            break;
        case document.querySelector('.article-title input').value:
            document.querySelector('.article-title .validation-message-wrapper').classList.remove('is-invalid');
            break;
    };
    // no content error message
    switch (CKEDITOR.instances.ckeditor.getData()) {
        case '':
            document.querySelector('.article-content .validation-message-wrapper').classList.add('is-invalid');
            break;
        case CKEDITOR.instances.ckeditor.getData():
            document.querySelector('.article-content .validation-message-wrapper').classList.remove('is-invalid');
            break;
    };
    // // to long title error message
    // function titleInputLength() {
    //     if (titleInput.value.length >= 50) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // };
    // switch (titleInputLength()) {
    //     case true:
    //         document.querySelector('.article-title .validation-message-wrapper').classList.add('is-to-long');
    //         break;
    //     case false:
    //         document.querySelector('.article-title .validation-message-wrapper').classList.remove('is-to-long');
    //         break;
    // };
}

// Publish new blog handler
function publishNewBlog(e) {

    // Get content data from ckeditor    
    var contentInput = CKEDITOR.instances.ckeditor.getData();

    // Make 'tags' string to array
    var tagsArr = [];
    var tagsList = document.querySelectorAll('#myTags li .tagit-label');

    function tagsToArr() {
        for (var i = 0; i < tagsList.length; i++) {
            tagsArr.push(tagsList[i].innerText)
        };
        return tagsArr;
    };

    // time now
    var date = new Date();
    var dateAndTimeNow = date.getFullYear() + "-" + (((+date.getMonth() + 1) < 10) ? "0" + (+date.getMonth() + 1) : (+date.getMonth() + 1)) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

    // New blog data to send
    var newBlogData = {
            title: document.querySelector('.article-title input').value,
            description: "create",
            content: contentInput,
            tags: tagsToArr(),
            publish_in: (!document.getElementById('datetimepicker').value ? dateAndTimeNow : document.getElementById('datetimepicker').value),
            published: true
        }
        // Init Blog service
    var blog = BlogService();
    blog.newBlog(newBlogData);
    // console.log(newBlogData);
}

function publishNewBlogHandler() {
    blogValidation();
    if (!document.querySelector('.article-title .validation-message-wrapper').classList.contains('is-invalid') &&
        !document.querySelector('.article-content .validation-message-wrapper').classList.contains('is-invalid')) {
        publishNewBlog();
    }
};

// Save blog as draft handler
function saveBlogAsNewDraft(e) {
    // Get content data from ckeditor    
    var contentInput = CKEDITOR.instances.ckeditor.getData();

    // Make 'tags' string to array
    var tagsArr = [];
    var tagsList = document.querySelectorAll('#myTags li .tagit-label');

    function tagsToArr() {
        for (var i = 0; i < tagsList.length; i++) {
            tagsArr.push(tagsList[i].innerText)
        };
        return tagsArr;
    };

    // time now
    var date = new Date();
    var dateAndTimeNow = date.getFullYear() + "-" + (((+date.getMonth() + 1) < 10) ? "0" + (+date.getMonth() + 1) : (+date.getMonth() + 1)) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

    // Save blog as draft data to send
    var saveBlogAsDraft = {
        title: document.querySelector('.article-title input').value,
        description: "create draft",
        content: contentInput,
        tags: tagsToArr(),
        publish_in: (!document.getElementById('datetimepicker').value ? dateAndTimeNow : document.getElementById('datetimepicker').value),
        published: false
    }

    // Init Blog service
    var blog = BlogService();
    blog.newBlog(saveBlogAsDraft);
    // console.log(saveBlogAsDraft);
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
// Get tags from server by typing

// debounce
function debounce(f, ms) {

    var timer = null;

    return function(...args) {
        var onComplete = function() {
            f.apply(this, args);
            timer = null;
        }

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(onComplete, ms);
    };
}

// Get tags from server func
var getTagsHandler;
var newTag;

$(document).ready(function() {
    $("#myTags").tagit({
        placeholderText: "Почніть вводити новий тег",
        autocomplete: {
            source: getTagsHandler = debounce(function(request, response) {
                $.ajax({
                    dataType: "json",
                    type: 'Get',
                    url: 'https://api.1tvkr-demo.syntech.info/api/blog-tags/?search=' + document.querySelector('.tagit-new input').value,
                    cache: false,
                    success: function(data) {
                        if (document.querySelector('.tagit-new input').value.length && !data.length) {
                            newTag = prompt('На даний момент такого тега не існує. Додати новий тег?');
                            setTimeout(function() {
                                // Set new tag from prompt to UI
                                document.querySelector('#myTags').lastChild.previousSibling.firstElementChild.innerText = newTag;
                                // Send new tag
                                if (document.querySelector('.tagit-new input').value.length) {
                                    var url = 'https://api.1tvkr-demo.syntech.info/api/blog-tags/';
                                    var xhr = new XMLHttpRequest();
                                    xhr.open('POST', url);
                                    xhr.send(JSON.stringify({
                                        add: newTag
                                    }));
                                };
                            }, 100)
                            console.log(newTag);
                        } else {
                            response($.map(data, function(item) {
                                return item;
                            }));
                        }
                    },
                    error: function(data) {
                        console.log(data)
                    }
                });
            }, 1000)
        }
    });
});