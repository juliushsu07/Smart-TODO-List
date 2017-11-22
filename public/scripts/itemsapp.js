$(() => {


function createListItems(items){
  let $items = `
    <li> <input type="checkbox" name="" value="Harry Potter" class="item"> ${items} </li>
  `
  return $items;

}


$.ajax({
    method: "GET",
    url: "/api/items"
  }).done((items) => {
    var category = $('h1').text()
    for(item of items) {

      console.log(item.category.toUpperCase().trim() );
      console.log(category.toUpperCase().trim());

      if(item.category.toUpperCase().trim() == category.toUpperCase().trim()) {
        console.log("here");

        $('ul').append(createListItems(item.name));

      }

      // $("<div>").text(item.name).appendTo($("body"));
    }
  });




});