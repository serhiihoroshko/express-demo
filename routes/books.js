import { Book, validateBook } from '../models/book.js';
import { auth } from '../middleware/auth.js';
import express from 'express';
import { admin } from '../middleware/admin.js';
import { asyncMiddleware } from '../middleware/async.js';
export const book = express.Router();

book.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const books = await Book.find().sort('name');
    res.send(books);
  })
);

book.post(
  '/',
  asyncMiddleware(auth, async (req, res) => {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let book = new Book({
      name: req.body.name,
      category: req.body.category,
      author: req.body.author,
      tags: req.body.tags,
      isPublished: req.body.isPublished,
      price: req.body.price,
    });
    book = await book.save();

    res.send(book);
  })
);

book.put(
  '/:id',
  asyncMiddleware(auth, async (req, res) => {
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!book)
      return res.status(404).send('The book with the given ID was not found.');

    res.send(book);
  })
);

book.delete(
  '/:id',
  asyncMiddleware([auth, admin], async (req, res) => {
    const book = await Book.findByIdAndRemove(req.params.id);

    if (!book)
      return res.status(404).send('The book with the given ID was not found.');

    res.send(book);
  })
);

book.get(
  '/:id',
  asyncMiddleware(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (!book)
      return res.status(404).send('The book with the given ID was not found.');

    res.send(book);
  })
);
