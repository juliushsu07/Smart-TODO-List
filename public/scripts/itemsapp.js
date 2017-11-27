//scripts for the items page


//on document load, handle the events in these functions
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
    <li data-db_id="${item.id}" class="list-group-item">
      <div>
      <h3 class="item-name">${escape(item.name)}</h3>
      <div class="form-group">
        <form class="update-form form-inline">
          <select class='category-select'>
            <option value="">Category</option>
            <option value="watch">watch</option>
            <option value="read">read</option>
            <option value="buy">buy</option>
            <option value="eat">eat</option>
          </select>
          <input class="input-button btn btn-primary" type="submit" value="Update"></input>
        </form>
        <form class="delete-form form-inline">
          <input class="input-button btn btn-primary" type="submit" value="Delete"></input>
        </form>
      </div>
      </div>
      <input class="checkbox" type="checkbox" value="${escape(item.name)}"
              ${item.date_completed == null ? '' : 'checked = "checked"'}">
               </input> <label>Check Complete</label>
      <div class="clearfix"></div>
      <section style="display: none;"></section>
    </li>

  `);
}

function markElementComplete() {
  $('body').on('click', '.checkbox', function(e) {
    let itemID = $(this).closest('li').data('db_id');
    $.ajax({
      method: "PUT",
      url: `/api/items/${itemID}/${this.checked}`
    }).done( (message) => {
      if(message.success){
        let checked = this.checked;
        //animate the list item to change lists
        $(this).closest('li').hide(150, function(){
          if(checked){
            $('.completed').prepend($(this).closest('li'));
          } else {
            $('.not-complete').prepend($(this).closest('li'));
          }
          $(this).closest('li').show(150);
        });
      }
    });
  });
}

//finds the correct category and sends an ajax call to the server
function updateElementToList() {
  $('body').on('submit', '.update-form', function(e) {
    e.preventDefault();
    let itemID = $(this).closest('li').data('db_id');
    let category = $(this).find(":selected").val();
    if(category === "watch" || category === "read" || category === "buy" || category === "eat"){
        $.ajax({
        method: "PUT",
        url: `/api/items/${itemID}/update/category`,
        data: {category: category}
      }).done((results) => {
        //animation
        $(this).closest('li').animate({'margin-left':'25%'},150);
        $(this).closest('li').hide(400);
      });
    }

  });
}

//on delete button press, send an ajax call to delete the item
function deleteElementFromList() {
  $('body').on('submit', '.delete-form', function(e) {
    let itemID = $(this).closest('li').data('db_id');
    e.preventDefault();

    $.ajax({
      method: "DELETE",
      url: `/api/items/${itemID}`
    }).done((itemname) => {
      //animation on completion
      $(this).closest('li').hide(200);
    });
  });
}

//ajax call on load to load items
function loadDataIntoList() {
  $.ajax({
    method: "GET",
    url: "/api/items"
  }).done((items) => {
    let category = $('.category-name').text();
    let categoryFiltered = category.toUpperCase().trim();
    for (item of items) {
      //check that the item is from the list we want
      if (item.category.toUpperCase().trim() === categoryFiltered) {
        //sort into correct list
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
//because all the apis are slightly different, we need to handle them separately

  let discriptBox;
  switch (category){
    case 'eat':
      discriptBox = `
        <div class="container">
          <div class="jumbotron row description-box">
            <h2 class="col col-sm-12">${escape(item.name)}</h2>
            <div class="col-sm-8 col-lg-6">
              <img src="${(item.image_url)}" height="275px" width="275px">
            </div>
            <div class="col-sm-4 col-lg-6">
              <p>${escape(item.is_closed)=="true" ? "Open now." : "Closed"}
              <p>Food Type : ${escape(item.categories[0].title)}</p>
              <p>Address: ${escape(item.location.address1)}</p>
              <p>Rating: ${escape(item.rating)} / 5 </p>
              <p>Phone #: ${escape(item.phone)}</p>
              <a href="${item.url}">Visit Website</a>
            </div>
          </div>
        </div>
      `;
      break;
    case 'watch':
      discriptBox = `
      <div class="container">
        <div class="jumbotron row description-box">
          <h2 class="col-sm-12">${escape(item.Title)}</h2>
          <div class="col-sm-8 col-lg-6">
            <img src="${(item.Poster)}" width="275px">
          </div>
          <div class="col-sm-4 col-lg-6">
            <p>Released: ${escape(item.Released)}</p>
            <p>Rating: ${escape(item.imdbRating)}</p>
            <p>Type: ${escape(item.Type)}</p>
            <p>Runtime: ${escape(item.Runtime)}</p>
            <p>Genre: ${escape(item.Genre)}</p>
            <p>Plot: ${escape(item.Plot)}</p>
          </div>
        </div>
      </div>
      `
      break;
    case 'read':
      const book = item.GoodreadsResponse.search[0].results[0].work[0];
      discriptBox = `
        <div class="container">
          <div class="jumbotron row description-box">
            <h2 class="col-sm-12">${escape(book.best_book[0].title[0])}</h2>
            <div class="col-sm-6">
              <img src="${book.best_book[0].image_url[0]}"  width="175px">
            </div>
            <div class="col-sm-6">
              <p>Author: ${book.best_book[0].author[0].name}</p>
              <p>Rating: ${book.average_rating[0]}</p>
              <p>Published: ${book.original_publication_year[0]._}</p>
            </div>
          </div>
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
      <div class="container">
        <div class="jumbotron row description-box">
          <h2 class="col-sm-12">${title}</h2>
          <div class="col-sm-8 col-lg-6">
            <img src="${image}" height="275px" width="275px">
          </div>
          <div class="col-sm-4 col-lg-6">
            <p>Buy Now: <a href="${firstResult.DetailPageURL[0]}">Click Here</a>
            <p>Price:${price}</p>
          </div>
        </div>
      </div>
      `;
      break;
  }
  callback(discriptBox);
}

//when you click the item, do an ajax call
//and recieve information to display
function showItemDetails() {
  $('ul').on('click', 'h3', function() {
    let $section = $(this).closest('li').find('section');
    if (!$section.text()){
      $section.text('...loading...');
      const categoryName = $('.category-name').text().toLowerCase().trim();
      $.ajax({
        method: "GET",
        url: `/api/items/${categoryName}/${$(this).text()}`
      }).done((res) => {
        createDescription(categoryName, res, description => {
          $section.empty();
          $section.append(description);
          $section.toggle('fast');
        });
      });
    } else {
      $section.toggle('fast');
    }
  });
}


