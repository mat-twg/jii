/**
 * @author Vladimir Kozhin <affka@affka.ru>
 * @license MIT
 */

'use strict';

const Jii = require('../BaseJii');
const _isEmpty = require('lodash/isEmpty');
const _trimEnd = require('lodash/trimEnd');
const _isArray = require('lodash/isArray');
const _isString = require('lodash/isString');
const Component = require('../base/Component');
const InvalidConfigException = require('../exceptions/InvalidConfigException');
const MessageSource = require('./MessageSource');
const MessageFormatter = require('./MessageFormatter');

class I18N extends Component {

    preInit() {
        this._messageFormatter = null;
        this.translations = {};

        super.preInit(...arguments);
    }

    /**
     * Translates a message to the specified language.
     *
     * After translation the message will be formatted using [[MessageFormatter]] if it contains
     * ICU message format and `params` are not empty.
     *
     * @param {string} category the message category.
     * @param {string} message the message to be translated.
     * @param {object} params the parameters that will be used to replace the corresponding placeholders in the message.
     * @param {string} language the language code (e.g. `en-US`, `en`).
     * @return {string} the translated and formatted message.
     */
    translate(category, message, params, language) {
        const messageSource = this.getMessageSource(category);
        let translation = messageSource.translate(category, message, language);

        if (translation === false) {
            return this.format(message, params, messageSource.sourceLanguage);
        } else {
            return this.format(translation, params, language);
        }
    }

    /**
     * Formats a message using [[MessageFormatter]].
     *
     * @param {string} message the message to be formatted.
     * @param {object} params the parameters that will be used to replace the corresponding placeholders in the message.
     * @param {string} language the language code (e.g. `en-US`, `en`).
     * @return string the formatted message.
     */
    format(message, params, language) {
        if (!params || _isEmpty(params)) {
            return message;
        }

        if (/{\s*[\d\w]+\s*,/.test(message)) {
            const formatter = this.getMessageFormatter();
            let result = formatter.format(message, params, language);
            if (result === false) {
                let errorMessage = formatter.getErrorMessage();
                Jii.warning(`Formatting message for language '${ language }' failed with error: ${ errorMessage }. The message being formatted was: ${ message }.`);
            } else {
                return result;
            }
        }

        Object.keys(params).forEach(key => {
            message = message.replace(new RegExp('{' + key + '}', 'g'), params[key]);
        });
        return message;
    }

    /**
     * Returns the message source for the given category.
     * @param {string} category the category name.
     * @return MessageSource the message source for the given category.
     * @throws InvalidConfigException if there is no message source available for the specified category.
     */
    getMessageSource(category) {
        if (this.translations[category]) {
            if (!(this.translations[category] instanceof MessageSource)) {
                this.translations[category] = Jii.createObject(this.translations[category]);
            }
            return this.translations[category];
        }

        // try wildcard matching
        let source = null;
        Object.keys(this.translations).forEach(pattern => {
            if (!source && pattern.indexOf('*') !== -1 && category.indexOf(_trimEnd(pattern, '*')) === 0) {
                if (!(this.translations[pattern] instanceof MessageSource)) {
                    this.translations[pattern] = Jii.createObject(this.translations[pattern]);
                }
                return this.translations[pattern];
            }
        });
        if (source) {
            return source;
        }

        // match '*' in the last
        if (this.translations['*']) {
            if (!(this.translations['*'] instanceof MessageSource)) {
                this.translations['*'] = Jii.createObject(this.translations['*']);
            }
            return this.translations['*'];
        }

        throw new InvalidConfigException(`Unable to locate message source for category '${ category }'.`);
    }

    /**
     * Returns the message formatter instance.
     * @return {MessageFormatter} the message formatter to be used to format message via ICU message format.
     */
    getMessageFormatter() {
        if (this._messageFormatter === null) {
            this._messageFormatter = new MessageFormatter();
        } else if (_isArray(this._messageFormatter) || _isString(this._messageFormatter)) {
            this._messageFormatter = Jii.createObject(this._messageFormatter);
        }

        return this._messageFormatter;
    }

    /**
     * @param {string|array|MessageFormatter} value the message formatter to be used to format message via ICU message format.
     * Can be given as array or string configuration that will be given to [[Yii::createObject]] to create an instance
     * or a [[MessageFormatter]] instance.
     */
    setMessageFormatter(value) {
        this._messageFormatter = value;
    }

}
module.exports = I18N;