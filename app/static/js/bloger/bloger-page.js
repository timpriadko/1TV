// Environment
var env = {
    apiUrl: "https://api.1tvkr-demo.syntech.info/api/"
};

// Контейнер блогов
var _blogsContainer = document.querySelector('.table-body-block');

// Класс для работы с шаблонами
function BlodsUI() {
    return {

        // Шаблон блога
        _blogRowTemplate: function(blog) {
            var statusImg;

            function statusImgFunc() {
                if (blog.status == 'published') {
                    statusImg = '<img src="static/img/Icon-notification-filled.svg" alt="Icon-notification-filled"';
                } else if (blog.status == 'draft') {
                    statusImg = '<img src="static/img/Icon-notification-empty.svg" alt="Icon-notification-empty"';
                } else {
                    statusImg = '<img src="static/img/Icon-notification-empty.svg" alt="Icon-notification-empty"';
                };
                return statusImg;
            };
            statusImgFunc();
            return '<div class="post-row d-flex flex-column flex-md-row">' +
                '<div class="blog-id" style="display: none">' + blog.id + '</div>' +
                '<div class="post-create-date col-md-2 d-flex justify-content-center justify-content-md-start">' + blog.created_in.substring(8, 10) + "." + blog.created_in.substring(5, 7) + "." + blog.created_in.substring(0, 4) + '</div>' +
                '<div class="post-name col-md-4 d-flex justify-content-center justify-content-md-start">' + blog.title + '</div>' +
                '<div class="post-status unpublished col-md-2 d-flex justify-content-center justify-content-md-start">' + blog.status + '</div>' +
                '<div class="post-publish-date col-md-2 d-flex justify-content-center justify-content-md-start">' + blog.publish_in.substring(8, 10) + "." + blog.publish_in.substring(5, 7) + "." + blog.publish_in.substring(0, 4) + "," + " " + blog.publish_in.substring(11, 16) + '</div>' +
                '<div class="post-actions col-md-2">' +
                '<a href="#" class="watch">' +
                '<img src="static/img/Icon-watch.svg" alt="Icon-watch">' +
                '</a>' +
                '<a href="#" class="notification publish" onclick="getPublishModal(event)">' +
                statusImg +
                '</a>' +
                '<a href="#" class="edit">' +
                '<img src="static/img/Icon-edit.svg" alt="Icon-edit" onclick="currentBlogData(event)">' +
                '</a>' +
                '<a href="#" class="delete">' +
                '<img src="static/img/Icon-delete.svg" alt="Icon-delete" onclick="getDeleteModal(event)">' +
                '</a>' +
                '</div>' +
                '</div>';
        },

        // Добавление шаблона блогов на страницу
        addBlogs: function(blogs) {
            var template = this._blogRowTemplate(blogs);
            _blogsContainer.insertAdjacentHTML("afterbegin", template);
        },

        // Шаблон сообщения о том, что результаты поиска отсутствуют
        _noResultsTemplate() {
            return '<div class="col s12">' +
                '<h4 class="center-align">' + 'No results found' + '</h4>' +
                '</div>'
        },

        // Выводит сообщение о том, что результаты поиска отсутствуют
        noResults() {
            var template = this._noResultsTemplate();
            _blogsContainer.insertAdjacentHTML("afterbegin", template);
        }
    }
}

// Create instance BlodsUI
var blogsUI = BlodsUI();

// ID блога, который будет удаляться
var deleteBlogId;

// Blogs array
var blogs;

// Bloger service
function BlogerService() {
    return {
        // Get blog-list
        blogList: function() {

            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.open('POST', env.apiUrl + 'blog/list/');
            xhr.onload = function() {
                sessionStorage.setItem('blogs', this.responseText);
                // get response in UI
                blogs = JSON.parse(this.responseText);
                blogs.forEach(function(blogs) {
                    return blogsUI.addBlogs(blogs);
                });
                console.log(JSON.parse(this.responseText));
            };
            xhr.setRequestHeader("Authorization", token);
            xhr.send();

            // parse response
            // blogs = JSON.parse(sessionStorage.getItem('blogs'));
        },

        // Delete blog
        deleteBlog: function() {
            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.open('POST', env.apiUrl + 'blog/delete/' + deleteBlogId + '/');
            xhr.onload = function() {
                if (JSON.parse(this.status) < 300) {
                    window.location.reload();
                }
            }
            xhr.setRequestHeader("Authorization", token);
            xhr.send();
        }
    };
}

// Init Blog service
var bloger = BlogerService();

// Init "Get blog-list"
window.onload = bloger.blogList();


// Edit blog

// UI
var editBtn = document.querySelector(".edit");


// Blog to reduct handler
var currentBlogId;
var currentBlog;

function currentBlogData(e) {
    // Select and set current blog id to session starage
    currentBlogId = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
    sessionStorage.setItem('currentBlogId', currentBlogId);

    // Current blog to session starage
    currentBlog = blogs.find(item => item.id === +currentBlogId)
    console.log(blogs.find(item => item.id === +currentBlogId));
    sessionStorage.setItem('currentBlog', JSON.stringify(currentBlog));

    window.location = "1TV-Blogers-Editor-EdtitArticle.html";
}


// Delete blog
var deleteModalBtn = document.querySelector('.delete-unpublish-btn');

// Get the modal
var modal = document.getElementById('modalDelete');

// Get the button that opens the modal
var btn = document.querySelector(".delete");

// Get the <span> element that closes the modal
var cancel = document.querySelector(".close");

// When the user clicks the button, open the modal 
function getDeleteModal(e) {
    modal.style.display = "block";
    var blogToDeleteId = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
    deleteBlogId = blogToDeleteId;
    console.log(blogToDeleteId);
}

// Close the modal
document.querySelector("#modalDelete .close").addEventListener('click', function() {
    modal.style.display = "none";
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Delete blog handler
function deleteBlog(e) {
    e.preventDefault();

    bloger.deleteBlog();
    modal.style.display = "none";
}

deleteModalBtn.addEventListener("click", deleteBlog);


// Publish blog

// Get publish modal
var publishModal = document.getElementById('modalPublish');
// Publish button that opens the modal
var getPublishModalBtn = document.querySelector(".publish");
// When the user clicks the button, open the modal
function getPublishModal(e) {
    publishModal.style.display = "block";
    var currentId = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
    console.log(currentId);
}
// Close the modal
document.querySelector("#modalPublish .close").addEventListener('click', function() {
    modal.style.display = "none";
})

// Publish block handler
// function publishBlog(e) {
//     e.preventDefault();

// }