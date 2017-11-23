
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createListItems(item) {
  let $items = `
      <li> <input type="checkbox" value="${item.name}" class="item"> ${escape(item.name)}</li>
      <form action="/api/items/${item.name}" method="POST">
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
        $('ul').append(createListItems(item));
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
  $('ul').on('click', 'li', function() {
    console.log($('h1').text().trim())
    if($('h1').text().trim() == 'eat'){

      $.ajax({
        method: "GET",
        url: `/api/items/eat/${$(this).text()}`
      }).done((res) => {
        console.log(res)
        let description = createEatDescription(res);
        $('section').empty();
        $('section').append(description);
        $('section').toggle(() => {});
         })

    } else if($('h1').text().trim() == 'watch'){
      console.log('aaaaaaaaa');
      $.ajax({
        method: "GET",
        url: `/api/items/watch/${$(this).text()}`
      }).done((res) => {
        console.log('result::')
        console.log(res)
        //let description = createEatDescription(res);
        //$('section').empty();
        //$('section').append(description);
        //$('section').toggle(() => {});
     })
    }
  });

}


$(() => {
  loadDataIntoList();
  slideDown();
});
