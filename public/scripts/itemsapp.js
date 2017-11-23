function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createListItems(item) {
  let $items = `
      <li> <input type="checkbox" value="${item}" class="item"> ${escape(item)}</li>
      <form action="/api/items/${item}" method="POST">
         <input type="submit" value="Delete">
      </form>
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
      if (item.category.toUpperCase().trim() === categoryFiltered) {
        $('ul').append(createListItems(item.name));
      }
    }
  });
}

function createDescription(item){
  let title = `
    <div>
      <h1>${escape(item)}</h1>
      <p>This is ${escape(item)}!</p>
    </div>
  `;
  return title;
}


let slideDown = function() {
  $('ul').on('click', 'li', function() {
    let description = createDescription($(this).text());
    $('section').empty();
    $('section').append(description);
    $('section').toggle( () => {});
  });
}


$(() => {
  loadDataIntoList();
  slideDown();
});
