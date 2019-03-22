// Environment
var env = {
    apiUrl: "https://api.1tvkr-demo.syntech.info/api/"
};


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

// Set current blog data to the inputs
var blogData;

function setBlogValue() {
    blogData = JSON.parse(sessionStorage.getItem('currentBlog'));
    console.log(blogData);
    titleInput.value = blogData.title;
    contentInput.value = blogData.content;
    publishDate.value = blogData.publish_in;
}

window.onload = setBlogValue();

// Current blog ID
var currentBlogId = sessionStorage.getItem('currentBlogId');

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
        /      */

        // Delete blog
        deleteBlog: function() {
            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.open('POST', env.apiUrl + 'blog/delete/' + currentBlogId + '/');
            xhr.setRequestHeader("Authorization", token);
            xhr.onload = function() {
                var response = JSON.parse(this.status);
                if (response < 300) {
                    window.location = "1TV-Blogers-BlogerPage.html";
                }
            };
            xhr.send();
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
            xhr.open('POST', env.apiUrl + 'blog/update/' + currentBlogId + '/');
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
    }
}

// Init Blog service
var blog = BlogService();


// Delete blog by Editor handler

// Delete UI
var getDeleteModalBtn = document.getElementById('deleteByAuthor');
var deleteModalBtn = document.querySelector('.delete-unpublish-btn');
// Get the modal
var deleteModal = document.getElementById('modalDelete');
// Get the button that opens the modal
var btn = document.querySelector(".delete");
// Btn that closes the Delete modal
var cancelDelete = document.querySelector('.delete-modal .close')

// When the user clicks the button, open the modal 
function getDeleteModal(e) {
    e.preventDefault();
    deleteModal.style.display = "block";
    // console.log(deleteBlogId);
}

getDeleteModalBtn.addEventListener('click', getDeleteModal);

// Delete handler
function deleteBlog(e) {
    e.preventDefault();

    blog.deleteBlog();
}

deleteModalBtn.addEventListener('click', deleteBlog);

// When the user clicks on <span> (x), close the modal
cancelDelete.onclick = function() {
    deleteModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == deleteModal) {
        deleteModal.style.display = "none";
    }
}


// Validation
var titleValidationMsgWrapper = document.querySelector('.article-title .validation-message-wrapper');
var contentValidationMsgWrapper = document.querySelector('.article-content .validation-message-wrapper');
var dateValidationMsgWrapper = document.querySelector('.delay-article-post .validation-message-wrapper');

function blogValidation() {
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



// Unpublish blog modal

// Get the Unpublish modal
var modal = document.getElementById('modalUnpublish');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    // Validate blog and open the unpublish modal
unpublishPreModalBtn.addEventListener('click', function() {
    blogValidation();
    if (!titleValidationMsgWrapper.classList.contains('is-invalid') &&
        !contentValidationMsgWrapper.classList.contains('is-invalid') &&
        !dateValidationMsgWrapper.classList.contains('is-invalid')
    ) {
        modal.style.display = "block";
    }
});

// Unpublish blog by Editor handler
function unpublishBlog(e) {

    // Get content data from ckeditor    
    var contentData = CKEDITOR.instances.ckeditor.getData();
    console.log(contentData);

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
        content: contentData,
        tags: [],
        publish_in: publishDate.value,
        published: false
    };

    blog.unpublishBlog(unpublishBlog);
}

unpublisBtn.addEventListener("click", unpublishBlog);