import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://miss-7f55a-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
export const todoDB = ref(database, "todos")

const shoppingList = document.getElementById('list');

onValue(todoDB, function (snapshot) {
  if (snapshot.exists()) {
    clearShoppingList();
    console.log('onvalue', snapshot.val())
    const data = Object.entries(snapshot.val());
    console.log("🚀 ~ file: index.js:41 ~ data:", data)

    for (let i = 0; i < data.length; i++) {
      appenItemToShoppingList(data[i]);
    }
  } else {
    shoppingList.innerHTML = `<li>No items to show...</li>`;
  }
});

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
 newLi.innerHTML += `<span> 
 Title: ${itemData.title}<br>
 Author Name: ${itemData.author}<br>
 Price: ${itemData.price}/- Rs
</span>`;



  newLi.addEventListener("dblclick", function () {
    let locationToDelete = ref(database, `todos/${itemId}`);
    remove(locationToDelete);
  });

  shoppingList.append(newLi);
}