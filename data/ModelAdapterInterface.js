/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */
'use strict';

var Jii = require('../BaseJii');
class ModelAdapterInterface {

    preInit() {
        /**
     * @type {object|string[]|null}
     */
        this.attributes = null;
    }

    /**
     *
     * @param {Jii.base.Model} original
     */
    instance(original) {}

    /**
     *
     * @param {Jii.base.Model} original
     * @param {*} proxy
     * @param {object} values
     */
    setValues(original, proxy, values) {}

}
module.exports = ModelAdapterInterface;