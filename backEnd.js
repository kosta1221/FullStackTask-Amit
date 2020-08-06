const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let i = 3;
let shoppingList = [
    {
        id: "1",
        name: "kotej"
    },
    {
        id: "2",
        name: "tomato"
    },
    {
        id: "3",
        name: "milk"
    }
];

app.get('/products', (req, res) => {
    res.send(shoppingList);
});

app.get('/products/:id', (req, res) => {
    for (const product of shoppingList) {
        if (product.id === req.params.id) {
            res.send(product);
        }
    }
});

app.post('/products', (req, res) => {
    shoppingList.push(req.body);
    res.send(req.body);
});

app.put('/products/:id', (req, res) => {
    shoppingList.forEach((product, i) => {
        if (product.id === req.params.id) {
            shoppingList[i] = req.body;
            res.send(req.body);
        }
    });

});

app.delete('/products/:id', (req, res) => {
    shoppingList.forEach((product, i) => {
        if (product.id === req.params.id) {
            shoppingList.splice(i, 1);
            res.send(req.params.id + " id was deleted");
        }
    });

});

app.listen(3000);