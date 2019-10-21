/* eslint-env jquery, es6 */
(function ($) {
    var grouplist = new Set();
    $('a[data-imagelightbox').each(function () {
        grouplist.add($(this).attr('data-imagelightbox'));
    });

    grouplist.forEach(function (group) {
        $('a[data-imagelightbox="' + group + '"').imageLightbox();
    });
})(jQuery);