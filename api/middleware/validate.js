'use strict';

/**
 * @middleware validate
 * @description Intercepte les erreurs de validation express-validator
 * et renvoie une réponse 422 formatée.
 */

const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error:  'Données invalides.',
      fields: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = validate;
