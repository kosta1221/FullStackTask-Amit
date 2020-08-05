const list = document.querySelector('ul');
const inputfield = document.querySelector('input[type=text]');
const addButton = document.querySelector('#add');
const undoButton = document.querySelector('#undo');
const pickUpHead = document.querySelector('#pickUpHead');
const pickUpMsg = document.querySelector('#pickUpMsg');
const undoStack = [];

addButton.addEventListener("click", addItem);
undoButton.addEventListener("click", undo);
document.addEventListener("keydown", detectActionKeys);

//trying to fetch all items from the API
getAllProducts();
console.log("hi");
function detectActionKeys(evtobj) {
    // let evtobj = window.event? event : e;

    if (evtobj.keyCode == 90 && evtobj.ctrlKey) undo(); // Checks if ctrl && z are pressed at the same time
    if (evtobj.keyCode == 13) getItemFromInputField(); // checks if enter is pressed
}

function undo() {
    // if the stack is empty alert and return
    if(!undoStack[0]) { 
        alert("Nothing to undo!");
        updatePickUpList();
        return;
    }
    undoStack.pop().hidden = false;
    updatePickUpList();
}

function updatePickUpList() {
    let msg = pickUpMsg.innerText;
    let itemsArr = Array.from(list.querySelectorAll('li'));
    itemsArr = itemsArr.map(item => (item.hidden === false && !item.querySelector('SPAN').classList.contains('taken'))? 
    item.querySelector('SPAN').innerText : "");

    msg = "";
    itemsArr.map(item => (item!="")? msg += item + ", ": item);
    msg = msg.slice(0,msg.length - 2);
    pickUpMsg.innerText = msg;
    
}
function addItem(newItem) {
    // let newItem = inputfield.value;
    // if(!newItem) {
    //     // if the input field is empty alert and return
    //     alert("Please enter a product!");
    //     return;
    // }
    // inputfield.value = '';

    // creating three new elements: list item(li), span tag(span) and delete button (deleteButton)
    let li = document.createElement('li');
    let span = document.createElement('span');
    let deleteButton = document.createElement('button');
    let checkbox = document.createElement('input');

    // adding the span tag that'll wrap the text later, the delete button and the checkbox
    li.appendChild(checkbox)
    li.appendChild(span);
    li.appendChild(deleteButton);

    span.innerText = newItem; // inserting the input text to the list item
    deleteButton.innerText = "Delete"; // inserting 'delete' text to the button
    span.classList.add("item"); // adding 'item' class to each span tag to later span the text within
    deleteButton.classList.add("del"); // adding 'del' class to each delete button to later style it
    checkbox.type = "checkbox";

    // appending the new list item to the list, and pushing it to the end of the not picked up items array
    list.appendChild(li);
    
    pickUpHead.hidden = false;
    // deleteButton.addEventListener("click", e => li.remove())
    deleteButton.addEventListener("click", function(){
        undoStack.push(li);
        li.hidden = true;
        updatePickUpList();
    });
    checkbox.addEventListener("change", function(e){
        let txt = e.target.nextSibling;
        if(txt.classList.contains('taken')) {
            txt.classList.remove('taken');
            updatePickUpList();
            return;
        }
        txt.classList.add('taken');
        updatePickUpList();
        // alert(txt.innerText);
    });

    updatePickUpList();
    inputfield.focus();
}
function getItemFromInputField() {
    let newItem = inputfield.value;
    if(!newItem) {
        // if the input field is empty alert and return
        alert("Please enter a product!");
        return;
    }
    inputfield.value = '';
    addItem(newItem);
}
function getAllProducts() {
    axios.get("http://localhost:3000/products")
    .then(res => {
        const products = res.data;
        products.forEach(product => addItem(product.name));
    })
    .catch(err => console.log(err));
}