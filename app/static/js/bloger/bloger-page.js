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
            return '<div class="post-row d-flex flex-column flex-md-row">' +
                '<div class="blog-id" style="display: none">' + blog.id + '</div>' +
                '<div class="post-create-date col-md-2 d-flex justify-content-center justify-content-md-start">' + blog.created_in + '</div>' +
                '<div class="post-name col-md-4 d-flex justify-content-center justify-content-md-start">' + blog.title + '</div>' +
                '<div class="post-status unpublished col-md-2 d-flex justify-content-center justify-content-md-start">' + blog.status + '</div>' +
                '<div class="post-publish-date col-md-2 d-flex justify-content-center justify-content-md-start">' + blog.publish_in + '</div>' +
                '<div class="post-actions col-md-2">' +
                '<a href="#" class="watch">' +
                '<img src="static/img/Icon-watch.svg" alt="Icon-watch">' +
                '</a>' +
                '<a href="#" class="notification">' +
                '<img src="static/img/Icon-notification-filled.svg" alt="Icon-notification-filled">' +
                '</a>' +
                '<a href="#" class="edit">' +
                '<img src="static/img/Icon-edit.svg" alt="Icon-edit">' +
                '</a>' +
                '<a href="#" class="delete">' +
                '<img src="static/img/Icon-delete.svg" alt="Icon-delete">' +
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
            };
            xhr.setRequestHeader("Authorization", token);
            xhr.send();

            // parse response
            var blogs = JSON.parse(sessionStorage.getItem('blogs'));
            console.log(blogs);

            // get response in UI
            blogs.forEach(function(blogs) {
                return blogsUI.addBlogs(blogs);
            });
        },

        // Delete blog
        deleteBlog: function() {
            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.open('POST', env.apiUrl + 'blog/delete/' + deleteBlogId + '/');
            xhr.setRequestHeader("Authorization", token);
            return xhr.send();
        }
    };
}

// Init Blog service
var bloger = BlogerService();

bloger.blogList();


// Переход на страницу редактирования

// UI
var editBtn = document.querySelector(".edit");

// Blog to reduct
var currentBlogId;
var currentBlog;

function currentBlogData(e) {
    e.preventDefault();

    // Select and set current blog id to session starage
    currentBlogId = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
    sessionStorage.setItem('currentBlogId', currentBlogId);

    // Current blog to session starage
    currentBlog = blogs.find(item => item.id === +currentBlogId)
    console.log(blogs.find(item => item.id === +currentBlogId));
    sessionStorage.setItem('currentBlog', JSON.stringify(currentBlog));

    window.location = "1TV-Blogers-Editor-EdtitArticle.html";
}

// init currentBlogData()
$('.edit').bind('click', currentBlogData);


// Delete modal
var deleteModalBtn = document.querySelector('.delete-unpublish-btn');

// Get the modal
var modal = document.getElementById('modalDelete');

// Get the button that opens the modal
var btn = document.querySelector(".delete");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
function getDeleteModal(e) {
    e.preventDefault();
    modal.style.display = "block";
    var blogToDeleteId = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
    deleteBlogId = blogToDeleteId;
    console.log(deleteBlogId);
}

$('.delete').bind('click', getDeleteModal);

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

// Delete blog handler
function deleteBlog(e) {
    e.preventDefault();

    bloger.deleteBlog();
    modal.style.display = "none";
}

deleteModalBtn.addEventListener("click", deleteBlog);