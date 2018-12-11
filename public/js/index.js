$(document).on("click", "button", function(){
    eventId = $(this).attr("data-id");
    commentState = $(this).attr("data-state");
    console.log(eventId);
})