//global var for string manipulation
var commentBtnStr;

//global var for checking if comment was made
var commentMade = false;

$(document).on("click", ".comment-btn", function(){
    eventId = $(this).attr("data-id");
    commentState = $(this).attr("data-state");
    commentDiv = $(this).closest("div").children("div");
    console.log(commentState);
    var commentButton = $(this).closest("button")
    
    if (commentState == "closed"){
        commentBtnStr = $(commentButton).text();
        console.log(commentBtnStr);
        $(this).attr("data-state", "open");
        $(commentButton).text("Close")
        $.ajax({
            method:"GET",
            url:"api/events/"+eventId
        })
        .then(function(data){
            for (var i = 0; i < data.comments.length; i++){
                var commentContent = data.comments[i].comment;
                var commentName = data.comments[i].name;
                var commentBlock = $("<p>").text(commentName + ": " + commentContent);
                console.log(commentBlock);
                $(commentDiv).append(commentBlock);
            }
            commentForm = $("<div>");
            $(commentForm).addClass("form-group");
            $(commentForm).attr("id", "commentForm")

            nameLabel = $("<label>");
            $(nameLabel).text("Name: ");

            nameInput = $("<input>");
            $(nameInput).addClass("form-control");
            $(nameInput).attr("placeholder", "Enter name here");
            $(nameInput).attr("id", "nameInput")

            commentLabel = $("<label>");
            $(commentLabel).addClass("mt-2");
            $(commentLabel).text("Comment: ");

            commentInput = $("<input>");
            $(commentInput).addClass("form-control");
            $(commentInput).attr("placeholder", "Enter comment here");
            $(commentInput).attr("id", "commentInput");

            submitButton = $("<button>");
            $(submitButton).addClass("btn");
            $(submitButton).addClass("btn-success");
            $(submitButton).addClass("mt-2");
            $(submitButton).attr("data-id", eventId)
            $(submitButton).text("Submit");

            $(commentDiv).append(commentForm);
            $(commentForm).append(nameLabel);
            $(commentForm).append(nameInput);
            $(commentForm).append(commentLabel);
            $(commentForm).append(commentInput);
            $(commentForm).append(submitButton)

        })
    } else if (commentState == "open"){
        $(this).attr("data-state", "closed")
        $(commentDiv).html("");
        $("#commentForm").html("")
        if (commentMade == true){
            var splitString = commentBtnStr.split(" ")
            var newNumber = parseInt(splitString[1]) + 1;
            var newButton = splitString[0] + " " + newNumber;
            $(this).text(newButton);
            commentMade = false;
        } else {
            $(this).text(commentBtnStr)
        }
        
    }
})

$(document).on("click", ".btn-success", function(){
    var postId = $(this).attr("data-id");
    var commentName = $("#nameInput").val();
    var commentContent = $("#commentInput").val();
    commentMade = true;
    commentDiv = $(this).parent().parent()
    var newCommentAppend = commentName + ": " + commentContent;
    $.ajax({
        method: "POST",
        url: "/api/events/" + postId,
        data:{
            name: commentName,
            comment: commentContent
        }
    }).then(function(data){
        console.log(data);
        $(commentDiv).append(newCommentAppend);
        $("#commentForm").html("");
    })
})