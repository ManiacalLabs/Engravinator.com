var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var connect = require('gulp-connect');
var data = require('gulp-data');
var deploy = require('gulp-gh-pages');
var fs = require('fs');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var merge = require('merge-stream');
var numeralFilter = require('nunjucks-numeral-filter');
var nunjucks = require('gulp-nunjucks-render');
var path = require('path');

var DIST = __dirname + '/dist';
var DIST_SELECTOR = DIST + '/**/*';
var SITE = __dirname + '/site';
var CNAME_SELECTOR = SITE + '/assets/CNAME';

var PATHS = {
    CSS: {
        SRC: SITE + '/assets/css/**',
        DEST: DIST + '/css'
    },
    IMAGES: {
        SRC: SITE + '/assets/images/**',
        DEST: DIST + '/images'
    },
    FONTS: {
        SRC: SITE + '/assets/fonts/**',
        DEST: DIST + '/fonts'
    },
    PAGES: {
        SRC: SITE + '/content/**/*.html',
        DATA: SITE + '/content/**/*.json',
        DEST: DIST + '/**/*.html'
    },
    SCRIPTS: { DEST: DIST + '/js' },
    TEMPLATES: { SRC: SITE + '/assets/templates' }
};

var BOWER_SCRIPTS = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/what-input/dist/what-input.min.js',
    'bower_components/foundation-sites/dist/js/foundation.min.js'
];

var BOWER_STYLES = [
    'bower_components/foundation-sites/dist/css/foundation.min.css',
    'bower_components/foundation-sites/dist/css/foundation.min.css.map'
];

var clean_params = {
    read: false,
    allowEmpty: true
};

var DEVEL = process.env.DEVEL ? true : false;
var BETA_URL = process.env.BETA_URL ? process.env.BETA_URL : '';

var site = {
    title: 'Engravinator',
    url: DEVEL ? 'http://localhost:9000' : 'https://engravinator.com',
    time: new Date(),
    beta_url: BETA_URL
};

if (!process.env.URL_ROOT) {
    site.urlRoot = '/';
} else {
    site.urlRoot = process.env.URL_ROOT;
}

/**
 * Removes a given directory
 * @param {String} path The path
 * @returns {Object} The task stream
 */
function cleandir(path) {
    return gulp.src(path, clean_params).pipe(clean());
}

/**
 * Clean all the scripts
 * @returns {Object} The task stream
 */
function cleanscripts() {
    return cleandir(PATHS.SCRIPTS.DEST);
}

/**
 * Clean all the styles
 * @returns {Object} The task stream
 */
function cleanstyles() {
    return cleandir(PATHS.CSS.DEST);
}

/**
 * Clean all the images
 * @returns {Object} The task stream
 */
function cleanimages() {
    return cleandir(PATHS.IMAGES.DEST);
}

/**
 * Clean all the fonts
 * @returns {Object} The task stream
 */
function cleanfonts() {
    return cleandir(PATHS.FONTS.DEST);
}

/**
 * Clean all the pages
 * @returns {Object} The task stream
 */
function cleanpages() {
    return cleandir(PATHS.PAGES.DEST);
}

/**
 * Copies several files into a single location
 * @param {String[]} file_list The list of files to copy
 * @param {String} dest The destination
 * @returns {Object} The task stream
 */
function copylist(file_list, dest) {
    var tasks = [];

    file_list.forEach(function (file) {
        tasks.push(gulp.src(file).pipe(gulp.dest(dest)));
    });

    return merge(tasks);
}

/**
 * Copies all the bower scripts
 * @returns {Object} The task stream
 */
function bowerscripts() {
    return copylist(BOWER_SCRIPTS, PATHS.SCRIPTS.DEST);
}

/**
 * Copy all the bower styles
 * @returns {Object} The task stream
 */
function bowerstyles() {
    return copylist(BOWER_STYLES, PATHS.CSS.DEST);
}

/**
 * Copies all the custom styles
 * @returns {Object} The task stream
 */
function customstyles() {
    return gulp.src(PATHS.CSS.SRC)
        .pipe(cleanCSS())
        .pipe(gulp.dest(PATHS.CSS.DEST))
        .pipe(connect.reload());
}

var styles = gulp.parallel(customstyles, bowerstyles);

/**
 * Copies all the images
 * @returns {Object} The task stream
 */
function images() {
    return gulp.src(PATHS.IMAGES.SRC)
        .pipe(gulp.dest(PATHS.IMAGES.DEST))
        .pipe(connect.reload());
}

/**
 * Copies all the fonts
 * @returns {Object} The task stream
 */
function fonts() {
    return gulp.src(PATHS.FONTS.SRC)
        .pipe(gulp.dest(PATHS.FONTS.DEST));
}

/**
 * Loads the JSON data
 * @param {String} file The filename
 * @returns {String} The json data
 */
function pageData(file) {
    var data_file = path.join(path.dirname(file.path), path.basename(file.path, '.html') + '.json');
    var data = { site: site };
    data.site.path = path.basename(file.path);

    try {
        data.data = JSON.parse(fs.readFileSync(data_file));
    } catch (err) {
        // It's ok if we don't have supplemental data
    }

    if (file.path.endsWith('content/index.html')) {
        try {
            var mk1_file = path.join(path.dirname(file.path), 'mk1/index.json');
            data.data.mk1 = JSON.parse(fs.readFileSync(mk1_file));
        } catch (err) {
            console.log('Unable to import Mk1 info to index.html');
        }
    }

    return data;
}

/**
 * Adds filters to the nunjucks environement
 * @param {Object} env The nunjucks environment
 * @returns {undefined}
 */
function nunjucksEnvironment(env) {
    env.addFilter('numeral', numeralFilter);
}

/**
 * Build the pages
 * @return {Object} The task stream
 */
function pages() {
    var nunjucks_config = {
        path: PATHS.TEMPLATES.SRC,
        manageEnv: nunjucksEnvironment
    };
    return gulp.src(PATHS.PAGES.SRC)
        .pipe(data(pageData))
        .pipe(nunjucks(nunjucks_config))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(DIST))
        .pipe(connect.reload());
}

/**
 * Watch for changes
 * @returns {Object} The task stream
 */
function watch() {
    gulp.watch(PATHS.CSS.SRC, styles);
    gulp.watch(PATHS.IMAGES.SRC, images);
    gulp.watch(PATHS.FONTS.SRC, fonts);
    gulp.watch([ PATHS.TEMPLATES.SRC, PATHS.PAGES.SRC, PATHS.PAGES.DATA ], pages);

    connect.server({
        root: DIST,
        port: 9000,
        livereload: true
    });
}

/**
 * Copies the cname file over for deployment
 * @returns {Object} The task stream
 */
function cname() {
    return gulp.src(CNAME_SELECTOR)
        .pipe(gulp.dest(DIST));
}

/**
 * Deploys the changes to the gh-pages branch
 * @returns {Object} The task stream
 */
function ghpages() {
    return gulp.src(DIST_SELECTOR)
        .pipe(deploy());
}

var cleanall = gulp.parallel(cleanpages, cleanimages, cleanfonts, cleanscripts, cleanstyles);
var assets = gulp.series(bowerscripts, styles, images, fonts, pages);
var default_task = gulp.series(cleanall, assets);

exports.default = default_task;
exports.build = default_task;
exports.clean = cleanall;
exports.dist = default_task;
exports.watch = gulp.series(default_task, watch);
exports.deploy = gulp.series(default_task, cname, ghpages);