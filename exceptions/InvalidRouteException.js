/**
 * @author Vladimir Kozhin <affka@affka.ru>
 * @license MIT
 */

'use strict';

var Jii = require('../BaseJii');
var ApplicationException = require('./ApplicationException');

/**
 * @class Jii.exceptions.InvalidRouteException
 * @extends Jii.exceptions.ApplicationException
 */
module.exports = Jii.defineClass('Jii.exceptions.InvalidRouteException', /** @lends Jii.exceptions.InvalidRouteException.prototype */{

	__extends: ApplicationException

});
