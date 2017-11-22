function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createListItems(items) {
  let $items = `
    <li> <input type="checkbox" name="" value="Harry Potter" class="item"> ${escape(items)} </li>
  `;
  return $items;
}

function loadDataIntoList() {
  $.ajax({
    method: "GET",
    url: "/api/items"
  }).done((items) => {

    let category = $('h1').closest('header').text();
    let categoryFiltered = category.toUpperCase().trim();

    for (item of items) {
      if (item.category.toUpperCase().trim() === categoryFiltered ) {
        $('ul').append(createListItems(item.name));
      }
    }
  });
}

$(() => {
  loadDataIntoList();
});
