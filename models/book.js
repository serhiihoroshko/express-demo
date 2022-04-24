import Joi from 'joi';
import mongoose from 'mongoose';

export const Book = mongoose.model(
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
    },
    author: String,
    tags: {
      type: Array,
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

export function validateBook(book) {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    category: Joi.string().required(),
    author: Joi.string(),
    tags: Joi.array(),
    isPublished: Joi.boolean(),
    price: Joi.number(),
  });

  return schema.validate(book);
}
