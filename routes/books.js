import Joi from 'joi';
import mongoose from 'mongoose';
import express from 'express';
export const booksRouter = express.Router();

const Book = mongoose.model(
  'Book',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 255,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Judgment',
        'Survival',
        'Peace and war',
        'Love',
        'Heroism',
        'Good and evil',
        'Circle of life',
        'Suffering',
        'Deception',
        'Coming of age',
      ],
      lowercase: true,
      trim: true,
    },
    author: String,
    tags: {
      type: Array,
      validate: {
        isAsync: true,
        validator: function (tagValue, callback) {
          setTimeout(() => {
            const result = tagValue && tagValue.length > 0;
            callback(result);
          }, 1000);
        },
        message: 'A book should have at least one tag.',
      },
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
      type: Number,
      required: function () {
        return this.isPublished;
      },
      get: (getValue) => Math.round(getValue),
      set: (setValue) => Math.round(setValue),
    },
  })
);

booksRouter.get('/', async (req, res) => {
  const books = await Book.find().sort('name');

  res.send(books);
});

booksRouter.post('/', async (req, res) => {
  const { error } = validateBooks(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let book = new Book({ name: req.body.name });
  book = await book.save();

  res.send(book);
});

booksRouter.put('/:id', async (req, res) => {
  const { error } = validateBooks(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!book)
    return res.status(404).send('The book with the given ID was not found.');

  res.send(book);
});

booksRouter.delete('/:id', async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book)
    return res.status(404).send('The book with the given ID was not found.');

  res.send(book);
});

booksRouter.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book)
    return res.status(404).send('The book with the given ID was not found.');

  res.send(book);
});

function validateBooks(book) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(book);
}
