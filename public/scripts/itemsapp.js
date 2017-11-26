$(() => {
  markElementComplete();
  deleteElementFromList();
  updateElementToList();
  loadDataIntoList();
  showItemDetails();
});

function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createListItems(item) {
  return $(`
    <li data-db_id="${item.id}">
      <p>${escape(item.name)}</p>
      <form class="update-form">
      <select class='category-select'>
        <option value="">Please select a category</option>
        <option value="watch">watch</option>
        <option value="read">read</option>
        <option value="buy">buy</option>
        <option value="eat">eat</option>
      </select>
        <input class="input-button" type="submit" value="Udate"></input>
      </form>
      <form class="delete-form">
        <input class="input-button" type="submit" value="Delete"></input>
      </form>
      <input class="checkbox" type="checkbox" value="${escape(item.name)}"
              ${item.date_completed == null ? '' : 'checked = "checked"'}">
              Check Complete </input>
      <section style="display: none;"></section>
    </li>

  `);
}

function markElementComplete() {
  $('body').on('click', '.checkbox', function(e) {
    let itemID = $(this).parent().data('db_id');
    $.ajax({
      method: "PUT",
      url: `/api/items/${itemID}/${this.checked}`
    }).done( (message) => {
      if(message.success){
        $('ul').empty();
        loadDataIntoList();
      }
    });
  });
}

// to be completed
function updateElementToList() {
  $('body').on('submit', '.update-form', function(e) {
    e.preventDefault();
    let itemID = $(this).parent().data('db_id');
    let category = $(this).find(":selected").val();
    if(category === "watch" || category === "read" || category === "buy" || category === "eat"){
        $.ajax({
        method: "PUT",
        url: `/api/items/${itemID}/update/category`,
        data: {category: category}
      }).done((results) => {
        $('ul').empty();
        loadDataIntoList();
      });
    }

  });
}

function deleteElementFromList() {

  $('body').on('submit', '.delete-form', function(e) {
    let itemID = $(this).parent().data('db_id');
    e.preventDefault();
    //ajax call
    $.ajax({
      method: "DELETE",
      url: `/api/items/${itemID}`
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
        console.log(item);
        console.log(item.date_completed == null);
        if (!item.date_completed){
          $('.not-complete').append(createListItems(item));
        } else {
          $('.completed').append(createListItems(item));
        }
      }
    }
  });
}

function createDescription(category, item, callback) {

  let discriptBox;
  switch (category){
    case 'eat':
      discriptBox = `
        <div class="jumbotron">
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
      discriptBox = `
      <div class="jumbotron">
      <h1>${escape(item.Title)}</h1>
      <img src="${(item.Poster)}" height="500px" width="300px">
      <p>Released: ${escape(item.Released)}</p>
      <p>Rating: ${escape(item.imdbRating)}</p>
      <p>Type: ${escape(item.Type)}</p>
      <p>Runtime: ${escape(item.Runtime)}</p>
      <p>Genre: ${escape(item.Genre)}</p>
      <p>Plot: ${escape(item.Plot)}</p>
      `
      break;
    case 'read':
      const book = item.GoodreadsResponse.search[0].results[0].work[0];
      //also avaiable: author, small image, publication date
      console.log(book)
      discriptBox = `
        <div class="jumbotron">
          <h2>${escape(book.best_book[0].title[0])}</h2>
          <img src="${book.best_book[0].image_url[0]}">
          <p>Author: ${book.best_book[0].author[0].name}</p>
          <p>Rating: ${book.average_rating[0]}</p>
          <p>Published: ${book.original_publication_year[0]._}</p>
        </div>
      `;
      break;
    case 'buy':
    let firstResult = item[0];
    let itemAttributes = firstResult.ItemAttributes[0];
    title = itemAttributes.Title[0];
    let image;
    if (firstResult.LargeImage)
      image = firstResult.LargeImage[0].URL[0];
    else
      image = firstResult.ImageSets[0].ImageSet[0].HiResImage[0].URL[0];
    let price = firstResult.OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
      discriptBox= `
      <div class="jumbotron">
        <h3>${title}</h3>
        <img src="${image}" height="300px" width="300px">
        <p>Buy Now: <a href="${firstResult.DetailPageURL[0]}">Click Here</a>
        <p>Price:${price}</p>
      </div>

      `;
      break;
  }
  callback(discriptBox);
}

function showItemDetails() {
  $('ul').on('click', 'p', function() {
    if (!$(this).parent().find('section').text()){
      $(this).parent().find('section').text('...loading...');
      const categoryName = $('.category-name').text().toLowerCase().trim();
      $.ajax({
        method: "GET",
        url: `/api/items/${categoryName}/${$(this).text()}`
      }).done((res) => {
        createDescription(categoryName, res, description => {
          $(this).parent().find('section').empty();
          $(this).parent().find('section').append(description);
          $(this).parent().find('section').toggle('fast');
        });
      });
    } else {
      $(this).parent().find('section').toggle('fast');
    }
  });
}


