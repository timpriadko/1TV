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
var tagsInput = document.querySelector('.article-tags input');
var publishDate = document.getElementById('datetimepicker');
var publishBtn = document.querySelector('.publish-article button');
var titleValidationMsgWrapper = document.querySelector('.article-title .validation-message-wrapper');
var contentValidationMsgWrapper = document.querySelector('.article-content .validation-message-wrapper');
var dateValidationMsgWrapper = document.querySelector('.delay-article-post .validation-message-wrapper');

// Validation
function newBlogValidation() {
    // title error message
    switch (titleInput.value) {
        case '':
            titleValidationMsgWrapper.classList.add('is-invalid');
            break;
        case titleInput.value:
            titleValidationMsgWrapper.classList.remove('is-invalid');
            break;
    };
    // content error message
    switch (CKEDITOR.instances.ckeditor.getData()) {
        case '':
            contentValidationMsgWrapper.classList.add('is-invalid');
            break;
        case CKEDITOR.instances.ckeditor.getData():
            contentValidationMsgWrapper.classList.remove('is-invalid');
            break;
    };
    // date error message
    switch (publishDate.value) {
        case '':
            dateValidationMsgWrapper.classList.add('is-invalid');
            break;
        case publishDate.value:
            dateValidationMsgWrapper.classList.remove('is-invalid');
            break;
    };
}

// Publish new blog handler
function publishNewBlog(e) {

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

publishBtn.addEventListener("click", function() {
    newBlogValidation();
    if (!titleValidationMsgWrapper.classList.contains('is-invalid') &&
        !contentValidationMsgWrapper.classList.contains('is-invalid') &&
        !dateValidationMsgWrapper.classList.contains('is-invalid')
    ) {
        publishNewBlog();
    }
});

// Save blog as draft handler
function saveBlogAsNewDraft(e) {

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

draftBtn.addEventListener("click", function() {
    newBlogValidation();
    if (!titleValidationMsgWrapper.classList.contains('is-invalid') &&
        !contentValidationMsgWrapper.classList.contains('is-invalid') &&
        !dateValidationMsgWrapper.classList.add('is-invalid')
    ) {
        saveBlogAsNewDraft();
    }
});