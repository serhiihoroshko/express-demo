const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

const books = [
    {id: 1, name: 'bookname1'},
    {id: 2, name: 'bookname2'},
    {id: 3, name: 'bookname3'},
];

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/api/books', (req, res) => {
    res.send(books);
});

app.post('/api/books', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const book = {
        id: books.length + 1,
        name: req.body.name
    };
    books.push(book);
    res.send(book);
});

app.get('/api/books/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) res.status(404).send('The book with given ID was not found');
    res.send(book);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Lissening on port ${port}...`));
