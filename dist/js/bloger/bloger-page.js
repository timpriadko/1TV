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
                '<h4 class="center-align">' + 'Блогiв ще немає' + '</h4>' +
                '</div>'
        },

        // Выводит сообщение о том, что результаты поиска отсутствуют
        noResults() {
            var template = this._noResultsTemplate();
            _blogsContainer.insertAdjacentHTML("afterbegin", template);
        },

        // Очищает контейнер с блогами
        clearContainer() {
            return _blogsContainer.innerHTML = '<div class="posts-table-block"></div>';
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
        blogList: function(firstItem, lastItem) {

            var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
            var xhr = new XMLHttpRequest();
            xhr.open('POST', env.apiUrl + 'blog/list/');
            xhr.onload = function() {
                sessionStorage.setItem('blogs', this.responseText);
                // get response in UI
                blogs = JSON.parse(this.responseText);
                totalBlogs = blogs.length;
                blogs.slice(firstItem, lastItem).forEach(function(blogs) {
                    // Show a number of blogs
                    document.querySelector('#total-posts').innerText = totalBlogs;
                    return blogsUI.addBlogs(blogs);
                });
                console.log(blogs);
            };
            xhr.setRequestHeader("Authorization", token);
            xhr.send();
        },

        // Publish blog
        publishBlog: function({
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
                    // publishModal.style.display = "none";
                    window.location.reload();
                }
            };
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
window.onload = function() {

    var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
    var xhr = new XMLHttpRequest();
    xhr.open('POST', env.apiUrl + 'blog/list/');
    xhr.onload = function() {
        sessionStorage.setItem('blogs', this.responseText);
        blogs = JSON.parse(this.responseText);
        totalBlogs = blogs.length;
        // Init pagination JQuery plugin
        $(function($) {
            $(".pagination").pagination({
                items: totalBlogs,
                itemsOnPage: 10,
                cssStyle: "compact-theme"
            })
            // document.querySelector('#compact-pagination .prev').innerHTML = '<span class="prev-arrow"></span>';
            // document.querySelector('#compact-pagination .next').innerHTML = '<span class="next-arrow"></span>';
        });
        // get response in UI
        blogs.slice(-10).forEach(function(blogs) {
            // Show a number of blogs
            document.querySelector('#total-posts').innerText = totalBlogs;
            return blogsUI.addBlogs(blogs);
        });
        console.log(blogs);
    };
    xhr.setRequestHeader("Authorization", token);
    xhr.send();
};


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
};

// Close the modal
document.querySelector("#modalDelete .close").addEventListener('click', function() {
    modal.style.display = "none";
});

// Delete blog handler
function deleteBlog(e) {
    e.preventDefault();

    bloger.deleteBlog();
    modal.style.display = "none";
};

deleteModalBtn.addEventListener("click", deleteBlog);


// Publish blog

// Get publish modal
var publishModal = document.getElementById('modalPublish');

// Publish button that opens the modal
var getPublishModalBtn = document.querySelector(".publish");

// When the user clicks the button, open the modal
function getPublishModal(e) {
    // Select and set current blog id to session starage
    currentBlogId = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
    sessionStorage.setItem('currentBlogId', currentBlogId);

    // Current blog to session starage
    currentBlog = blogs.find(item => item.id === +currentBlogId)
    sessionStorage.setItem('currentBlog', JSON.stringify(currentBlog));

    if ((JSON.parse(sessionStorage.getItem('currentBlog')).status == 'draft')) {
        publishModal.style.display = "block";
    }
};

// Close the modal
document.querySelector("#modalPublish .close").addEventListener('click', function() {
    publishModal.style.display = "none";
});

// Publish block handler
function publishBlogHandler(e) {
    e.preventDefault();

    // time now
    var date = new Date();
    var dateAndTimeNow = date.getFullYear() + "-" + (((+date.getMonth() + 1) < 10) ? "0" + (+date.getMonth() + 1) : (+date.getMonth() + 1)) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

    // Get current blog data

    // Publish draft data to send
    var publishDraftData = {
        title: currentBlog.title,
        description: "publish draft",
        content: currentBlog.content,
        tags: [],
        publish_in: dateAndTimeNow,
        published: 'true'
    };

    console.log(publishDraftData);
    bloger.publishBlog(publishDraftData);
}

document.querySelector('.publish-btn').addEventListener('click', publishBlogHandler);

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == publishModal) {
        publishModal.style.display = "none";
    }
};



// Pagination
var paginationBlock = document.getElementById('compact-pagination');
var paginationPages = document.querySelector('#compact-pagination ul');


// Display calculated blogs 
paginationBlock.addEventListener('click', function(e) {
    firstItem = -(+e.target.innerText * 10);
    var lastItem = firstItem + 10;
    console.log(e.target.innerText);

    // Prev, next arrows
    // document.querySelector('#compact-pagination .prev').innerHTML = '<span class="prev-arrow"></span>';
    // document.querySelector('#compact-pagination .next').innerHTML = '<span class="next-arrow"></span>';

    // Clear container
    blogsUI.clearContainer();

    if (e.target.innerText == 1) {
        bloger.blogList(-10);
    } else if (e.target.innerText == 'Prev') {
        var currentPage = document.querySelector('#compact-pagination .active').innerText;
        if (currentPage == 1) {
            bloger.blogList(-10);
        } else {
            firstItem = -(+currentPage * 10);
            lastItem = firstItem + 10;
            bloger.blogList(firstItem, lastItem);
            console.log(currentPage);
        }
    } else if (e.target.innerText == 'Next') {
        currentPage = document.querySelector('#compact-pagination .active').innerText;
        if (currentPage == 1) {
            bloger.blogList(-10);
        } else {
            firstItem = -(+currentPage * 10);
            lastItem = firstItem + 10;
            bloger.blogList(firstItem, lastItem);
            console.log(currentPage);
        }
    } else {
        bloger.blogList(firstItem, lastItem);
    }

});

{/* <span class="prev-arrow"></span> */}