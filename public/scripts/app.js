$(() => {
  //code to make the input text box look good
  var checked = $(".cbox");
  checked.click(function() {
    if (checked.prop("checked")) {
      $(".add").text("Hit Enter to Submit");
    }
    if (!checked.prop("checked")) {
      $(".message").val("");
      $(".add").text("Add Item");
    }
  });

  //event on input text submit
  $('.submit-item').on('submit', function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    //send form data to our server to handle api calls
    $.post("/api/items", data, (res) => {
      if (res.category) {
      //on a positive response
        //reset the message box
        $('.message').val("");
        //animate the correct button
        $('.' + res.category).animate({ padding: '70px' }, function() {
          $(this).animate({ padding: '50px' });
        });
      }
    });
  });

});
