const list = document.querySelector("ul");
const inputfield = document.querySelector("input[type=text]");
const addButton = document.querySelector("#add");
const pickUpHead = document.querySelector("#pickUpHead");
const pickUpMsg = document.querySelector("#pickUpMsg");

addButton.addEventListener("click", getItemFromInputField);
document.addEventListener("keydown", detectActionKeys);

//trying to fetch all items from the API
getAllProducts();
function detectActionKeys(evtobj) {
  if (evtobj.keyCode == 13) getItemFromInputField(); // checks if enter is pressed
}

function updatePickUpList() {
  let msg = pickUpMsg.innerText;
  let itemsArr = Array.from(list.querySelectorAll("li"));
  itemsArr = itemsArr.map((item) =>
    item.hidden === false &&
    !item.querySelector("SPAN").classList.contains("taken")
      ? item.querySelector("SPAN").innerText
      : ""
  );

  msg = "";
  itemsArr.map((item) => (item != "" ? (msg += item + ", ") : item));
  msg = msg.slice(0, msg.length - 2);
  pickUpMsg.innerText = msg;
}

// adds item to HTML list
function addItemToList(newProduct) {
  let { id, name } = newProduct; // destructing new product
  // creating three new elements: list item(li), span tag(span) and delete button (deleteButton)
  let li = document.createElement("li");
  let span = document.createElement("span");
  let editField = document.createElement("input");
  let deleteButton = document.createElement("button");
  let checkbox = document.createElement("input");

  // adding the span tag that'll wrap the text later, the delete button and the checkbox
  li.append(checkbox, span, editField, deleteButton);

  span.innerText = name; // inserting the input text to the list item
  deleteButton.innerText = "Delete"; // inserting 'delete' text to the button
  span.classList.add("item"); // adding 'item' class to each span tag to later span the text within
  deleteButton.classList.add("del"); // adding 'del' class to each delete button to later style it
  li.id = `product${id}`; // inserting a unique id to each li
  checkbox.type = "checkbox";
  editField.classList.add("editF"); // hide editField

  // appending the new list item to the list, and pushing it to the end of the not picked up items array
  list.appendChild(li);

  pickUpHead.hidden = false;
  deleteButton.addEventListener("click", async () => {
    try {
      await axios.delete(
        `http://localhost:3000/products/${li.id.substring(7)}`
      );
      li.remove();
      updatePickUpList();
    } catch (e) {
      console.log(e);
      alert("Error deleting product!");
    }
  });
  checkbox.addEventListener("change", function (e) {
    let txt = e.target.nextSibling;
    if (txt.classList.contains("taken")) {
      txt.classList.remove("taken");
      updatePickUpList();
      return;
    }
    txt.classList.add("taken");
    updatePickUpList();
    // alert(txt.innerText);
  });
  span.addEventListener("click", () => revealUpdateField(span, editField));
  editField.addEventListener("blur", () => updateItem(span, editField, id));

  updatePickUpList();
  inputfield.focus();
}

// adds item to the server
async function addProductToServer(newProduct) {
  let listLength = list.childNodes.length;
  let newItem = {
    id: listLength + "",
    name: newProduct,
  };
  try {
    const { data: itemToAdd } = await axios.post(
      "http://localhost:3000/products",
      newItem
    );
    return itemToAdd;
  } catch (e) {
    console.log(e);
    alert("Error posting product!");
  }
}

// updates the content of an item (both sides)
function revealUpdateField(s, ef) {
  s.style.display = "none"; // hide span
  ef.style.display = "inline"; // reveal edit field
  ef.focus();
  ef.value = s.innerText;
}

async function updateItem(s, ef, id) {
  let newProduct = ef.value;

  if (!/[a-zA-z]/g.test(newProduct)) {
    ef.focus();
    ef.classList.add("UDerr");
    setTimeout(() => ef.classList.remove("UDerr"), 1500);
    return;
  }

  let newli = {
    name: newProduct,
    id: id,
  };
  try {
    const { data: updated } = await axios.put(
      `http://localhost:3000/products/${newli.id}`,
      newli
    );
    console.log(updated);
    s.innerText = updated.name;
    s.style.display = "inline";
    ef.style.display = "none";
    updatePickUpList();
  } catch (e) {
    console.log(e);
    alert("Error updating product!");
  }
}
// gets the string that's in the input field
async function getItemFromInputField() {
  let newProduct = inputfield.value;
  // add validation check with regex to check there are no numbers
  if (!newProduct) {
    // if the input field is empty alert and return
    alert("Please enter a valid product!");
    return;
  }
  try {
    inputfield.value = "";
    let newItem = await addProductToServer(newProduct);
    addItemToList(newItem);
  } catch (e) {
    console.log(e);
    alert("Could not add product!");
  }
}

// gets all products from the server and makes a list of them
function getAllProducts() {
  axios
    .get("http://localhost:3000/products")
    .then((res) => {
      const products = res.data;
      products.forEach((product) => addItemToList(product));
    })
    .catch((err) => {
      console.log(err);
      alert("Error fetching products!");
    });
}
