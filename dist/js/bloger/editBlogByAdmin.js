// Environment
var env = {
    apiUrl: "https://api.1tvkr-demo.syntech.info/api/"
};

var xhr = new XMLHttpRequest();

// Blog service
class BlogService {
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

    // Delete blog
    deleteBlog() {
        var token = 'Bearer' + ' ' + localStorage.getItem("token");
        xhr.open('OPTIONS', env.apiUrl + 'blog/delete/1/');
        xhr.setRequestHeader("Authorization", token);
        return xhr.send();
    }

    // Unpublish blog
    unpublishBlogByAdmin({
        title,
        description,
        content,
        tags,
        publish_in,
        published
    }) {
        var token = 'Bearer' + ' ' + localStorage.getItem("token");
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

// Init Blog service
var blog = new BlogService();

// Blog UI
var newBlogform = document.forms["newBlog"];
var titleInput = document.querySelector('.article-title input');
var contentInput = document.getElementById('ckeditor');
var tagsInput = document.querySelector('.article-tags input');
var publishDate = document.getElementById('datetimepicker');

// Edit UI
var deleteByAuthorBtn = document.getElementById('deleteByAuthor');
var deleteByAdminBtn = document.getElementById('deleteByAdmin');
var unpublishDescription = document.getElementById('unpublish-description');
var unpublisBtn = document.querySelector('.modal-unpublish-btn');

// Delete blog by Editor handler
function deleteBlog(e) {
    e.preventDefault();

    console.log('+');
    blog.deleteBlog();
}

deleteByAdminBtn.addEventListener("click", deleteBlog);

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

    blog.unpublishBlogByAdmin(unpublishBlog);
}

unpublisBtn.addEventListener("click", unpublishBlog);