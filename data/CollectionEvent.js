/**
 * @author Vladimir Kozhin <affka@affka.ru>
 * @license MIT
 */
'use strict';

var Jii = require('../BaseJii');
var Event = require('../base/Event');
class CollectionEvent extends Event {

    preInit() {
        /**
     *
     * @type {boolean}
     */
        this.isSorted = false;
        /**
     * @type {boolean}
     */
        this.isFetch = false;
        /**
     *
     * @type {Jii.base.Model[]}
     */
        this.removed = [];
        /**
     *
     * @type {Jii.base.Model[]}
     */
        this.added = [];
        super.preInit(...arguments);
    }

}
module.exports = CollectionEvent;