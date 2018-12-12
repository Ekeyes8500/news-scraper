//global var for string manipulation
var commentBtnStr;

//global var for checking if comment was made
var commentMade = false;

//event handler for when comment button is clicked on to be expanded
$(document).on("click", ".comment-btn", function(){
    eventId = $(this).attr("data-id");

    //comment state is either 'open' or 'closed', used to determine button behavior
    commentState = $(this).attr("data-state");
    //find the comment div for posting purposes
    commentDiv = $(this).closest("div").children("div");
    //find button for posting comments
    var commentButton = $(this).closest("button")
    
    //if comments are 'closed', open comments from database
    if (commentState == "closed"){
        //capture the text of comment button, used to update comment count if user makes comment
        commentBtnStr = $(commentButton).text();

        //set button to open to change behavior
        $(this).attr("data-state", "open");
        $(commentButton).text("Close")
        $.ajax({
            method:"GET",
            url:"api/events/"+eventId
        })
        .then(function(data){
            //cycle through existing comments and display
            for (var i = 0; i < data.comments.length; i++){
                var commentContent = data.comments[i].comment;
                var commentName = data.comments[i].name;
                var commentBlock = $("<p>").text(commentName + ": " + commentContent);
                $(commentDiv).append(commentBlock);
            }

            //set up commenting form for users
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
    //if comment button is open, begin closing behavior
    } else if (commentState == "open"){
        //set state attr to closed
        $(this).attr("data-state", "closed")
        //empty comment div
        $(commentDiv).html("");
        //empty comment form if user didn't make comment
        $("#commentForm").html("")
        //a check to see if the user made a comment, if they did, update the comment button string
        if (commentMade == true){
            var splitString = commentBtnStr.split(" ")
            var newNumber = parseInt(splitString[1]) + 1;
            var newButton = splitString[0] + " " + newNumber;
            $(this).text(newButton);
            commentMade = false;
        //if no comment made, revert to old string
        } else {
            $(this).text(commentBtnStr)
        }
        
    }
})

//event handle for user posting comment
$(document).on("click", ".btn-success", function(){
    var postId = $(this).attr("data-id");
    var commentName = $("#nameInput").val();
    var commentContent = $("#commentInput").val();
    commentMade = true;
    commentDiv = $(this).parent().parent()
    //create new string to be displayed on comment div
    var newCommentAppend = commentName + ": " + commentContent;
    $.ajax({
        method: "POST",
        url: "/api/events/" + postId,
        data:{
            name: commentName,
            comment: commentContent
        }
    //after comment sent to db, append comment and close form
    }).then(function(data){
        console.log(data);
        $(commentDiv).append(newCommentAppend);
        $("#commentForm").html("");
    })
})

//event hanlder for when clean and scrape button is clicked
$(document).on("click", "#scraper", function(){
    //first, a call to scrape new events
    $.ajax({
        method: "GET",
        url: "/api/scrape"
    }).then(function(){
        //after deletion of old events is completed, update event listings
        $.ajax({
            method: "GET",
            url: "/api/delete"
        }).then(function(){
            location.reload();
        })
        
    })
})