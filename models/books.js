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

export function validateBook(book) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(book);
}
