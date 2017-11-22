function readLists() {
  $('.lists').on('click', function(event) {
    event.target.className;
    window.location.href = `/${event.target.className}`;
  });
}

$(() => {
  readLists();
});
