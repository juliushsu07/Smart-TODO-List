$(() => {
  $('.submit-item').on('submit', function(event){
    event.preventDefault();
    const data = $(this).serialize();
    $.post("/api/items", data, (res) => {
      if(res.category){
        $('.submit-text-input').val("");
        console.log($('.'+res.category));
        $('.'+res.category).animate({padding: '70px'}, function(){
          $(this).animate({padding: '50px'});
        });
      }
    });
  });
});
