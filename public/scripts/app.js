$(() => {
  var checked = $(".cbox");
  checked.click(function() {
    if (checked.prop("checked")) {
      $(".add").text("Hit Enter to Submit");
    }
    if (!checked.prop("checked")) {
      $(".message").val("");
      $(".add").text("Add Item");
    }
    $('.submit-item').on('submit', function(event) {
      event.preventDefault();
      const data = $(this).serialize();
      console.log(this)
      $.post("/api/items", data, (res) => {
        if (res.category) {
          $('.message').val("");
          console.log($('.' + res.category));
          $('.' + res.category).animate({ padding: '70px' }, function() {
            $(this).animate({ padding: '50px' });
          });
        }
      });
    });
  });
});
