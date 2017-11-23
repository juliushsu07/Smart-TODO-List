function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createListItems(itemname) {
  const $form = $(`
    <form>
       <input type="submit" value="Delete">
    </form>
  `);

  $form.on('submit', (e) => {
    //ajax call
    e.preventDefault();
    // e.stopPropagation();
    $.ajax({
      method: "DELETE",
      url: `/api/items/${itemname}`
    }).done((itemname) => {
      loadDataIntoList();
    });
  });

  const $itemname = $(`
      <li>
        <input type="checkbox" value="${itemname}" class="itemname"> <p>${escape(itemname)}</p>
      </li>
     `);

  $itemname.append($form);

  return $itemname;
}

function loadDataIntoList() {
  $.ajax({
    method: "GET",
    url: "/api/items"
  }).done((items) => {
    $('ul').empty();
    let category = $('h1').closest('header').text();
    let categoryFiltered = category.toUpperCase().trim();
    for (item of items) {
      if (item.category.toUpperCase().trim() === categoryFiltered) {
        $('ul').append(createListItems(item.name));
      }
    }
  });
}


function createDescription(item) {
  let title = `
    <div>
      <h1>${escape(item)}</h1>
      <p>This is ${escape(item)}!</p>
    </div>
  `;
  return title;
}


let slideDown = function() {
  $('ul').on('click', 'p', function() {
    let description = createDescription($(this).text());
    $('section').empty();
    $('section').append(description);
    $('section').toggle(() => {});
  });
}


$(() => {
  loadDataIntoList();
  slideDown();
});
