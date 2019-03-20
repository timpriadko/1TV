// Environment
var env = {
    apiUrl: "https://api.1tvkr-demo.syntech.info/api/"
};

// Blog service
function BlogService() {
    return {
        /**
        /      * @description Параметры блога
        /      * @param {string} title - заглавие из инпута формы
        /      * @param {string} description - причина снятия с публикации из модального окна редактирования
        /      * @param {string} content - контент блога из формы
        /      * @param {Array} tags - теги из инпута формы
        /      * @param {string} publish_in - дата публикации
        /      * @param {boolean} published - true/false 
        /      * @param {string} status - published/unpublished/draft/removed_by_admin/removed_by_author
        /      */

        // Delete blog
        deleteBlog: function() {
            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.open('OPTIONS', env.apiUrl + 'blog/delete/1/');
            xhr.setRequestHeader("Authorization", token);
            return xhr.send();
        },

        // Unpublish blog
        unpublishBlog: function({
            title,
            description,
            content,
            tags,
            publish_in,
            published
        }) {
            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.open('OPTIONS', env.apiUrl + 'blog/update/1/');
            xhr.setRequestHeader("Authorization", token);
            return xhr.send(JSON.stringify({
                title,
                description,
                content,
                tags,
                publish_in,
                published
            }));
        }
    }
}

// Init Blog service
var blog = BlogService();

// Blog UI
var newBlogform = document.forms["newBlog"];
var titleInput = document.querySelector('.article-title input');
var contentInput = document.getElementById('ckeditor');
var tagsInput = document.querySelector('.article-tags input');
var publishDate = document.getElementById('datetimepicker');

// Edit UI
var deleteBtn = document.querySelector('.delete-article button')
var unpublishDescription = document.getElementById('unpublish-description');
var unpublishPreModalBtn = document.querySelector('.unpublish-article button');
var unpublisBtn = document.querySelector('.modal-unpublish-btn');

// Delete blog by Editor handler
function deleteBlog(e) {
    e.preventDefault();

    blog.deleteBlog();
}

deleteBtn.addEventListener("click", deleteBlog);

// Unpublish blog by Editor handler
function unpublishBlog(e) {
    e.preventDefault();

    // Make 'tags' string to array
    var tagsArr;

    function tagsToArr() {
        tagsArr = tagsInput.value.split('#').slice(1);
        return tagsArr;
    }
    tagsToArr();

    // Unpublish blog data to send
    var unpublishBlog = {
        title: titleInput.value,
        description: "update",
        content: contentInput.value,
        tags: [],
        publish_in: publishDate.value,
        published: false
    }

    blog.unpublishBlog(unpublishBlog);
}

unpublisBtn.addEventListener("click", unpublishBlog);

// Validation
var titleValidationMsgWrapper = document.querySelector('.article-title .validation-message-wrapper');
var contentValidationMsgWrapper = document.querySelector('.article-content .validation-message-wrapper');

unpublishPreModalBtn.onclick = function() {
    if (!titleInput.value) {
        titleValidationMsgWrapper.classList.add('is-invalid');
        if (!document.querySelector('.cke_wysiwyg_frame').contentDocument.querySelector('p').textContent) {
            contentValidationMsgWrapper.classList.add('is-invalid');
        } else if (document.querySelector('.cke_wysiwyg_frame').contentDocument.querySelector('p').textContent) {
            contentValidationMsgWrapper.classList.remove('is-invalid');
        }
    } else if (!document.querySelector('.cke_wysiwyg_frame').contentDocument.querySelector('p').textContent) {
        contentValidationMsgWrapper.classList.add('is-invalid');
        if (titleInput.value) {
            titleValidationMsgWrapper.classList.remove('is-invalid');
        }
    } else if (titleInput.value && titleValidationMsgWrapper.classList.contains('is-invalid')) {
        titleValidationMsgWrapper.classList.remove('is-invalid');
        if (!contentValidationMsgWrapper.classList.contains('is-invalid')) {
            modal.style.display = "block";
        }
    } else if (document.querySelector('.cke_wysiwyg_frame').contentDocument.querySelector('p').textContent && contentValidationMsgWrapper.classList.contains('is-invalid')) {
        contentValidationMsgWrapper.classList.remove('is-invalid');
        if (!titleValidationMsgWrapper.classList.contains('is-invalid')) {
            modal.style.display = "block";
        }
    } else if (!titleValidationMsgWrapper.classList.contains('is-invalid') && !contentValidationMsgWrapper.classList.contains('is-invalid')) {
        modal.style.display = "block";
    }
}