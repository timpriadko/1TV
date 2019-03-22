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
            xhr.open('POST', env.apiUrl + 'blog/create/');
            xhr.setRequestHeader("Authorization", token);
            xhr.onload = function() {
                var response = JSON.parse(this.status);
                if (response < 300) {
                    window.location = "1TV-Blogers-BlogerPage.html";
                }
            };
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

// All forms UI
var draftBtn = document.querySelector('.save-article button')

// New blog UI
var newBlogform = document.forms["newBlog"];
var titleInput = document.querySelector('.article-title input');
// var contentInput = document.getElementById('ckeditor');
var tagsInput = document.querySelector('.article-tags input');
var publishDate = document.getElementById('datetimepicker');
var publishBtn = document.querySelector('.publish-article button');



// Publish new blog handler
function publishNewBlog(e) {
    e.preventDefault();

    // Get content data from ckeditor    
    var contentInput = CKEDITOR.instances.ckeditor.getData();

    // Make 'tags' string to array
    var tagsArr;

    function tagsToArr() {
        tagsArr = tagsInput.value.split('#').slice(1);
        return tagsArr;
    }
    tagsToArr();

    // New blog data to send
    var newBlogData = {
        title: titleInput.value,
        description: "create",
        content: contentInput,
        tags: [],
        publish_in: publishDate.value,
        published: true
    }

    blog.newBlog(newBlogData);
}

publishBtn.addEventListener("click", publishNewBlog);

// Save blog as draft handler
function saveBlogAsNewDraft(e) {
    e.preventDefault();

    // Get content data from ckeditor    
    var contentInput = CKEDITOR.instances.ckeditor.getData();

    // Make 'tags' string to array
    var tagsArr;

    function tagsToArr() {
        tagsArr = tagsInput.value.split('#').slice(1);
        return tagsArr;
    }
    tagsToArr();

    // Save blog as draft data to send
    var saveBlogAsDraft = {
        title: titleInput.value,
        description: "create",
        content: contentInput,
        tags: [],
        publish_in: publishDate.value,
        published: false
    }

    blog.newBlog(saveBlogAsDraft);
}

draftBtn.addEventListener("click", saveBlogAsNewDraft);

// // Validation
// var titleValidationMsgWrapper = document.querySelector('.article-title .validation-message-wrapper');
// var contentValidationMsgWrapper = document.querySelector('.article-content .validation-message-wrapper');
// var dateValidationMsgWrapper = document.querySelector('.delay-article-post .validation-message-wrapper');

// function validation() {
//     if (!titleInput.value) {
//         titleValidationMsgWrapper.classList.add('is-invalid');
//         if (!document.querySelector('.cke_wysiwyg_frame').contentDocument.querySelector('p').textContent) {
//             contentValidationMsgWrapper.classList.add('is-invalid');
//         } else if (document.querySelector('.cke_wysiwyg_frame').contentDocument.querySelector('p').textContent) {
//             contentValidationMsgWrapper.classList.remove('is-invalid');
//         }
//     } else if (!document.querySelector('.cke_wysiwyg_frame').contentDocument.querySelector('p').textContent) {
//         contentValidationMsgWrapper.classList.add('is-invalid');
//         if (titleInput.value) {
//             titleValidationMsgWrapper.classList.remove('is-invalid');
//         }
//     } else if (titleInput.value && titleValidationMsgWrapper.classList.contains('is-invalid')) {
//         titleValidationMsgWrapper.classList.remove('is-invalid');
//         if (!contentValidationMsgWrapper.classList.contains('is-invalid')) {
//             modal.style.display = "block";
//         }
//     } else if (document.querySelector('.cke_wysiwyg_frame').contentDocument.querySelector('p').textContent && contentValidationMsgWrapper.classList.contains('is-invalid')) {
//         contentValidationMsgWrapper.classList.remove('is-invalid');
//         if (!titleValidationMsgWrapper.classList.contains('is-invalid')) {
//             modal.style.display = "block";
//         }
//     } else if (!titleValidationMsgWrapper.classList.contains('is-invalid') && !contentValidationMsgWrapper.classList.contains('is-invalid')) {
//         modal.style.display = "block";
//     }
// }

// draftBtn.addEventListener("click", validation);
// publishBtn.addEventListener("click", validation);