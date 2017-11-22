$(() => {

  // $('.read').on('click',()=>{
  //   window.location.href='/read';
  // });
  // $('.watch').on('click',()=>{
  //   window.location.href='/watch';
  // });
  // $('.buy').on('click',()=>{
  //   window.location.href='/buy';
  // });
  // $('.eat').on('click',()=>{
  //   window.location.href='/eat';
  // });

  $('.lists').on('click', function(event) {

    event.target.className;
    console.log(this);

    console.log( event.target.className );

    window.location.href=`/${event.target.className}`;
  });

  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;
});
