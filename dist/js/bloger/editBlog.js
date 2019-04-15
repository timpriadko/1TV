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
var publishBtn = document.querySelector('.publish-article button');
var saveDraftBtn = document.querySelector('#saveBlogBtn');
var savePublishedBlogChangesBtn = document.querySelector('#savePublishedBlogChangesBtn');
var editExpireMark = document.querySelector('.edited');
var editExpireMarkTime = document.querySelector('.edited-time');
var editExpireMarkContainer = document.querySelector('.expire-edit-container');

// Current blog data
var currentBlogStatus = JSON.parse(sessionStorage.getItem("currentBlog")).status;
var currentBlogId = sessionStorage.getItem('currentBlogId');
var currentBlogTime;

// Set user name
function setUserData() {
    var token = 'Bearer' + ' ' + sessionStorage.getItem("token");
    var xhr = new XMLHttpRequest();
    xhr.open('POST', env.apiUrl + 'blog/me/');
    xhr.setRequestHeader("Authorization", token);
    xhr.onload = function() {
        var userName = JSON.parse(this.response).first_name;
        var userLastName = JSON.parse(this.response).last_name;
        document.querySelector('#block-user-options .user-name').innerText = userName + ' ' + userLastName;
        document.querySelector('.article-form-bottom .article-author input').value = userName + ' ' + userLastName;
    };
    xhr.send();
}

// Set tags func
function oneTagTamplate(tag) {
    return '<li class="tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable">' +
        '<span class="tagit-label">' + tag + '</span>' +
        '<a class="tagit-close">' +
        '<span class="text-icon"></span>' +
        '<span class="ui-icon ui-icon-close"></span>' +
        '</a>' +
        '<input type="hidden" value="криввбас" name="tags" class="tagit-hidden-field">' +
        '</li>';
};

// Set current blog data to the inputs
var blogData;

function setBlogValue() {
    blogData = JSON.parse(sessionStorage.getItem('currentBlog'));
    titleInput.value = blogData.title;
    contentInput.value = blogData.content;
    // set data & time
    if (currentBlogStatus !== "draft") {
        publishDate.value = blogData.publish_in.substring(0, 4) + "-" + blogData.publish_in.substring(5, 7) + "-" + blogData.publish_in.substring(8, 10) + " " + blogData.publish_in.substring(11, 16);
    }

    // Set tags
    for (var i = 0; i < blogData.tags.length; i++) {
        document.querySelector('#myTags').insertAdjacentHTML("afterbegin", oneTagTamplate(blogData.tags[i]));
    };
};

//  Publish time check
function publishTimeCheck() {
    currentBlogTime = JSON.parse(sessionStorage.getItem("currentBlog")).publish_in;
    var blogTimestamp = +Date.parse(currentBlogTime);

    var mayEdit;

    var blogEditionEndTime = new Date(+blogTimestamp + 3600000);
    var nowTime = Date.now();

    if (nowTime > blogEditionEndTime) {
        mayEdit = false;
    } else {
        mayEdit = true;
    }

    return mayEdit;
};

// Edit expire mark
function expireMarkFunc() {
    currentBlogTime = JSON.parse(sessionStorage.getItem("currentBlog")).publish_in;;
    var blogTimestamp = +Date.parse(currentBlogTime);

    var blogEditionEndTime = new Date(+blogTimestamp + 3600000);
    var nowTime = Date.now();

    var timeToExpireEdit = new Date(blogEditionEndTime - nowTime);

    editExpireMarkContainer.insertAdjacentHTML('beforeend', '<span class="edited"><a href="#"><img src="static/img/Icon-edit.svg" alt="Edit icon"></a><span class="edited-time">' + '0.' + timeToExpireEdit.getMinutes() + '</span></span>')
}

// Buttons visibility
function buttonVisibility() {
    //  Publish time check
    var ableToEdit = publishTimeCheck();

    if (currentBlogStatus === "draft") {
        document.querySelector(".unpublish-article").style.display = "none";
        document.querySelector('.savePublishedBlogChangesBtn-block').style.display = "none";
    } else if (currentBlogStatus === "published" && ableToEdit == true) {
        expireMarkFunc();
        // document.querySelector(".unpublish-article").style.display = "none";
        // document.querySelector(".unpublish-article").style.display = "none";
        document.querySelector(".publish-article").style.display = "none";
        document.querySelector('#saveBlogBtn').style.display = "none";
        document.getElementById('datetimepicker').disabled = true;
    } else if (currentBlogStatus === "published" && ableToEdit == false) {
        document.querySelector(".delete-article").style.display = "none";
        document.querySelector(".unpublish-article").style.display = "none";
        document.querySelector(".publish-article").style.display = "none";
        document.querySelector('#saveBlogBtn').style.display = "none";
        document.querySelector('.saveBlogBtn-block').style.display = "none";
        document.getElementById('datetimepicker').disabled = true;
        document.querySelector('.savePublishedBlogChangesBtn-block').style.display = "none";
    } else if (currentBlogStatus === "removed_by_author") {
        document.querySelector(".unpublish-article").style.display = "none";
        document.querySelector(".publish-article").style.display = "none";
        document.querySelector(".delete-article").style.display = "none";
        document.querySelector('.savePublishedBlogChangesBtn-block').style.display = "none";
    } else if (currentBlogStatus === "wait") {
        document.querySelector(".unpublish-article").style.display = "none";
        document.querySelector('.saveBlogBtn-block').style.display = "none";

    }
};

window.onload = function() {
    // Set user name
    setUserData();
    // init set current blog data to the inputs
    setBlogValue();
    //  Init buttons visibility func
    buttonVisibility();
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
            xhr.onload = function() {
                if (JSON.parse(this.status) < 300) {
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
        },

        // Publish draft
        publishDraft: function({
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
                    window.location = "1TV-Blogers-BlogerPage.html"
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

        // Save draft
        saveDraft: function({
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
            xhr.open('POST', env.apiUrl + 'blog/create/' + currentBlogId + '/');
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
};

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
var titleInput = document.querySelector('.article-title input');
var titleValidationMsgWrapper = document.querySelector('.article-title .validation-message-wrapper');
var contentValidationMsgWrapper = document.querySelector('.article-content .validation-message-wrapper');

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
};


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
    var tagsArr = [];
    var tagsList = document.querySelectorAll('#myTags li .tagit-label');

    function tagsToArr() {
        for (var i = 0; i < tagsList.length; i++) {
            tagsArr.push(tagsList[i].innerText)
        };
        return tagsArr;
    };

    // Unpublish blog data to send
    var unpublishBlog = {
        title: titleInput.value,
        description: "update",
        content: contentData,
        tags: tagsToArr(),
        publish_in: publishDate.value,
        published: 'false'
    };

    blog.unpublishBlog(unpublishBlog);
}

unpublisBtn.addEventListener("click", unpublishBlog);


// Publish draft handler

function publishDraft(e) {
    // Get content data from ckeditor    
    var contentData = CKEDITOR.instances.ckeditor.getData();

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

    // Publish draft data to send
    var publishDraftData = {
        title: titleInput.value,
        description: "update",
        content: contentData,
        tags: tagsToArr(),
        publish_in: dateAndTimeNow,
        published: 'true'
    };

    blog.publishDraft(publishDraftData);
};

publishBtn.addEventListener("click", function() {
    blogValidation();
    if (!titleValidationMsgWrapper.classList.contains('is-invalid') &&
        !contentValidationMsgWrapper.classList.contains('is-invalid')
    ) {
        publishDraft();
    }
});


// Save draft handler
function saveDraftHndler(e) {
    // Get content data from ckeditor    
    var contentData = CKEDITOR.instances.ckeditor.getData();

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

    // Publish draft data to send
    var savehDraftData = {
        title: titleInput.value,
        description: "draft",
        content: contentData,
        tags: tagsToArr(),
        publish_in: (!publishDate.value ? dateAndTimeNow : publishDate.value),
        published: false
    };

    blog.saveDraft(savehDraftData);
};

saveDraftBtn.addEventListener('click', function() {
    blogValidation();
    if (!titleValidationMsgWrapper.classList.contains('is-invalid') &&
        !contentValidationMsgWrapper.classList.contains('is-invalid')
    ) {
        saveDraftHndler();
    }
});

// Save changes in published blog handler
function saveChangesInPublishedBlog(e) {
    // Get content data from ckeditor    
    var contentData = CKEDITOR.instances.ckeditor.getData();

    // Make 'tags' string to array
    var tagsArr = [];
    var tagsList = document.querySelectorAll('#myTags li .tagit-label');

    function tagsToArr() {
        for (var i = 0; i < tagsList.length; i++) {
            tagsArr.push(tagsList[i].innerText)
        };
        return tagsArr;
    };

    // Publish changes data to send
    var publishChangesData = {
        title: titleInput.value,
        description: "updete published",
        content: contentData,
        tags: tagsToArr(),
        publish_in: publishDate.value,
        published: true
    };

    blog.publishDraft(publishChangesData);
}

savePublishedBlogChangesBtn.addEventListener('click', function() {
    blogValidation();
    if (!titleValidationMsgWrapper.classList.contains('is-invalid') &&
        !contentValidationMsgWrapper.classList.contains('is-invalid')) {
        saveChangesInPublishedBlog();
    }
});

// Status in Edit Page
document.querySelector('.current-blog-status').innerText = currentBlogStatus;

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