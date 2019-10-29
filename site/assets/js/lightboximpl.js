/* eslint-env jquery, es6 */

var LIGHTBOX_SELECTOR = '#imagelightbox';

var CLOSE_ID = 'imagelightbox-close';
var CLOSE_SELECTOR = '#' + CLOSE_ID;

var CLOSE_CODE = '<button id="' + CLOSE_ID + '" type="button"></button>';

var OVERLAY_ID = 'imagelightbox-overlay';
var OVERLAY_SELECTOR = '#' + OVERLAY_ID;

var OVERLAY_CODE = '<div id="' + OVERLAY_ID + '"></div>';

var ARROW_PREFIX = 'imagelightbox-arrow';
var ARROW_SELECTOR = '.' + ARROW_PREFIX;
var ARROW_LEFT_ID = ARROW_PREFIX + '-left';
var ARROW_RIGHT_ID = ARROW_PREFIX + '-right';
var ARROW_LEFT_SELECTOR = '#' + ARROW_LEFT_ID;

var ARROW_CODE = '<button class="' + ARROW_PREFIX + ' show-for-medium" id="' + ARROW_LEFT_ID + '" style="display: block" type="button"></button>' +
    '<button class="' + ARROW_PREFIX + ' show-for-medium" id="' + ARROW_RIGHT_ID + '" style="display: block" type="button"></button>';

/**
 * Adds the close button to the page and adds the handlers
 * @param {Object} ilb The instance of the image lightbox
 * @returns {undefined}
 */
function addClose(ilb) {
    var $close = $(CLOSE_CODE);
    $close.appendTo('body');

    $close.on('click touchend', function (e) {
        e.preventDefault();

        ilb.quitImageLightbox();
    });
}

/**
 * Adds the overlay
 * @param {Object} ilb The instance of the image lightbox
 * @returns {undefined}
 */
function addOverlay(ilb) {
    var $overlay = $(OVERLAY_CODE);

    $overlay.appendTo('body');

    $overlay.on('click touchend', function (e) {
        e.preventDefault();

        ilb.quitImageLightbox();
    });
}

/**
 * Adds the arrows to the page and adds the handlers
 * @param {Object} ilb The instance of the image lightbox
 * @param {String} selector The selector for the image gallery
 * @returns {undefined}
 */
function addArrows(ilb, selector) {
    var $arrows = $(ARROW_CODE);

    $arrows.appendTo('body');

    $arrows.on('click touchend', function (e) {
        e.preventDefault();

        var $this = $(this);
        var $target = $(selector + '[href="' + $(LIGHTBOX_SELECTOR).attr('src') + '"]');
        var index = $target.index(selector);

        if ($this.is(ARROW_LEFT_SELECTOR)) {
            index = index - 1;
            if (!$(selector).eq(index).length) {
                index = $(selector).length;
            }
        } else {
            index = index + 1;
            if (!$(selector).eq(index).length) {
                index = 0;
            }
        }

        ilb.switchImageLightbox(index);
        return false;
    });
}

/**
 * Removes all the DOM objects for a given list of selectors
 * @param {String[]} selectors The selectors to remove
 * @returns {undefined}
 */
function removeObjects(selectors) {
    selectors.forEach(function (selector) {
        $(selector).remove();
    });
}

(function ($) {
    var grouplist = new Set();
    $('a[data-imagelightbox]').each(function () {
        grouplist.add($(this).attr('data-imagelightbox'));
    });

    grouplist.forEach(function (group) {
        var group_selector = 'a[data-imagelightbox="' + group + '"]';
        var ilb = $(group_selector).imageLightbox({
            quitOnDocClick: false,
            /**
             * Adds the overlay in and sets up the handlers
             * @returns {undefined}
             */
            onStart: function () {
                addOverlay(ilb);
                addClose(ilb);
                addArrows(ilb, group_selector);
            },
            /**
             * Removes all the overlay
             * @returns {undefined}
             */
            onEnd: function () {
                removeObjects([
                    OVERLAY_SELECTOR,
                    CLOSE_SELECTOR,
                    ARROW_SELECTOR
                ]);
            }
        });
    });
})(jQuery);