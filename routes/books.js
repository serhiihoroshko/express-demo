import Joi from 'joi';
import express from 'express';
export const booksRouter = express.Router();

const books = [
    {id: 1, name: 'The Hobbit, or There and Back Again'},
    {id: 2, name: 'The Fellowship of the Ring'},
    {id: 3, name: 'The Two Towers'},
];

booksRouter.get('/', (req, res) => {
    res.send(books);
});

booksRouter.post('/', (req, res) => {
    const { error } = validateBooks(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const book = {
        id: books.length + 1,
        name: req.body.name
    };
    books.push(book);
    res.send(book);
});

booksRouter.put('/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('The book with the given ID was not found.');

    const { error } = validateBooks(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    book.name = req.body.name;
    res.send(book);
});

booksRouter.delete('/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('The book with the given ID was not found.');

    const index = books.indexOf(book);
    books.splice(index, 1);

    res.send(book);
});

booksRouter.get('/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('The book with the given ID was not found.');
    res.send(book);
});

function validateBooks(book) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(book);
}
