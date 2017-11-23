
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createListItems(itemname) {
  console.log(itemname);
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


function createEatDescription(item) {
  let title = `
    <div>
      <h1>${escape(item.name)}</h1>
      <p>Are they open? ${escape(item.is_closed)}
      <p>Food Type : ${escape(item.categories[0].title)}</p>
      <img src="${(item.image_url)}" height="300px" width="300px">
      <p>Address: ${escape(item.location.address1)}</p>
      <p>Rating: ${escape(item.rating)}</p>
      <p>Phone #: ${escape(item.phone)}</p>
      <a href="${item.url}">Visit Link</a>
    </div>
  `;
  return title;
}


let slideDown = function() {
  $('ul').on('click', 'p', function() {
    $.ajax({
      method: "GET",
      url: `/api/items/${$(this).text()}`
    }).done((res) => {
      console.log(res)
      let description = createEatDescription(res);
      $('section').empty();
      $('section').append(description);
      $('section').toggle(() => {});
     })
  });
}


$(() => {
  loadDataIntoList();
  slideDown();
});
