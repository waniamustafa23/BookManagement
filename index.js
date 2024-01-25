import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://miss-7f55a-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
export const todoDB = ref(database, "todos")

const titleField = document.getElementById('title-field');
const priceField = document.getElementById('price-field');
const buttonEl = document.getElementById('add-to-cart');
const shoppingList = document.getElementById('shopping-list');
const authorList = document.getElementById('author-field');
const img = document.getElementById('image-field');
const imgContainer = document.getElementById('image-field'); // Updated variable name

buttonEl.addEventListener("click", function () {
  let title = titleField.value;
  let price = priceField.value;
  let author = authorList.value;
  let image1 = img.value;
  let cont = imgContainer.value;

  if (title && price && author && image1 && cont) {
    const newItemRef = push(todoDB);
    const newItemKey = newItemRef.key;

    // Use the key to set the data
    set(ref(database, `todos/${newItemKey}`), {
      title: title,
      price: price,
      author: author,
      image1: image1,
      cont: cont
    });
    clearInputFields();
  } else {
    alert("Please enter title, price, author name, and image URL.");
  }
});

onValue(todoDB, function (snapshot) {
  if (snapshot.exists()) {
    clearShoppingList();
    const data = Object.entries(snapshot.val());
    for (let i = 0; i < data.length; i++) {
      appenItemToShoppingList(data[i]);
    }
  } else {
    shoppingList.innerHTML = `<li>No items to show...</li>`;
  }
});

function clearInputFields() {
  titleField.value = "";
  priceField.value = "";
  authorList.value = "";
  img.value = "";
  imgContainer.value = "";
}

function clearShoppingList() {
  shoppingList.innerHTML = "";
}

function appenItemToShoppingList(item) {
  let itemId = item[0];
  let itemData = item[1];

  let newLi = document.createElement("li");

  // Create a separate div for the image
  let imageDiv = document.createElement("div");
  imageDiv.classList.add("image-container");

  // Create an image element and set its source based on user input
  let imgElement = document.createElement("img");
  imgElement.src = itemData.image1;

  // Append the image to the image div
  imageDiv.appendChild(imgElement);

  // Append the image div to the list item
  newLi.appendChild(imageDiv);

  // Append other details to the list item
  newLi.innerHTML += `<span>${itemData.title} ${itemData.author} - ${itemData.price}/. Rs</span>`;

  // Double-click event to delete the item
  newLi.addEventListener("dblclick", function () {
    let locationToDelete = ref(database, `todos/${itemId}`);
    remove(locationToDelete);
  });

  // Append the list item to the shopping list
  shoppingList.appendChild(newLi);
}
