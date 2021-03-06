const mongoose = require('mongoose');
const validator = require('validator');

const NotFoundError = require('../errors/not-found-err');
const NotEnoughRightsError = require('../errors/not-enough-rights-err');
const {
  articleNotFoundMessage,
  notEnoughRightsMassage,
} = require('../errors/error-messages');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  text: {
    type: String,
    required: true,
    minlength: 2,
  },
  date: {
    type: Date,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

articleSchema.statics.removeIfOwner = function (owner, articleId) {
  return this.findById(articleId).select('+owner')
    .then((article) => {
      if (!article) {
        return Promise.reject(new NotFoundError(articleNotFoundMessage));
      }

      if (article.owner._id.toString() === owner) {
        return article.remove();
      }

      return Promise.reject(new NotEnoughRightsError(notEnoughRightsMassage));
    });
};

module.exports = mongoose.model('article', articleSchema);
