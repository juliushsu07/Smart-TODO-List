function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createListItems(itemname) {
  return $(`
    <li>
      <input class="checkbox" type="checkbox" value="${escape(itemname)}">
      <p>${escape(itemname)}</p>
      <form class="update-form">
        <input type="submit" value="Udate">
      </form>
      <form class="delete-form">
        <input type="submit" value="Delete">
      </form>
      <section>
      </section>

    </li>
  `);
}

// to be completed
function markElementComplete() {
  $('body').on('click', '.checkbox', function(e) {
    if (this.checked) {
      console.log("Marked complete!")
    }
  });

}

// to be completed
function updateElementToList() {
  $('body').on('submit', '.update-form', function(e) {
    console.log(this);
    e.preventDefault();
    console.log("Updating");
  });
}

function deleteElementFromList() {

  $('body').on('submit', '.delete-form', function(e) {
    let itemname = $(this).parent().find('p').text();
    e.preventDefault();
    //ajax call
    $.ajax({
      method: "DELETE",
      url: `/api/items/${itemname}`
    }).done((itemname) => {
      $('ul').empty();
      loadDataIntoList();
    });
  });
}

function loadDataIntoList() {
  $.ajax({
    method: "GET",
    url: "/api/items"
  }).done((items) => {
    let category = $('.category-name').text();
    let categoryFiltered = category.toUpperCase().trim();
    for (item of items) {
      if (item.category.toUpperCase().trim() === categoryFiltered) {
        $('ul').append(createListItems(item.name));
      }
    }
  });
}

function createDescription(category, item) {
  let discriptBox
  switch (category) {
    case 'eat':
      discriptBox = `
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
      break;
    case 'watch':
      break;
    case 'read':
      break;
    case 'buy':
      break;
  }
  return discriptBox;
}

function showItemDetails() {
  $('ul').on('click', 'p', function() {
    const categoryName = $('.category-name').text().toLowerCase().trim();
    $.ajax({
      method: "GET",
      url: `/api/items/${categoryName}/${$(this).text()}`
    }).done((res) => {
      let description = createDescription(categoryName, res);
      $(this).parent().find('section').empty();
      $(this).parent().find('section').append(description);
      $(this).parent().find('section').toggle(() => {});
    });
  });
}

$(() => {
  markElementComplete();
  deleteElementFromList();
  updateElementToList();
  loadDataIntoList();
  showItemDetails();
});
