var fs = require('fs');
var path = require('path');
var through = require('through2');

var lodash = require('lodash');
var merge = require('merge-stream');

var gulp = require('gulp');
var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var connect = require('gulp-connect');
var data = require('gulp-data');
var frontmatter = require('gulp-front-matter');
var htmlmin = require('gulp-htmlmin');
var markdown = require('gulp-markdown');
var uglify = require('gulp-uglify');

var nunjucks = require('gulp-nunjucks-render');
var numeralFilter = require('nunjucks-numeral-filter');

var DIST = __dirname + '/dist';
var SITE = __dirname + '/site';
var DOCS = __dirname + '/docs';

var PATHS = {
    CSS: {
        SRC: SITE + '/assets/css/**',
        DEST: DIST + '/css'
    },
    IMAGES: {
        SRC: SITE + '/assets/images/**',
        DEST: DIST + '/images',
        BOWER_DEST: DIST + '/img'
    },
    FONTS: {
        SRC: SITE + '/assets/fonts/**',
        DEST: DIST + '/fonts'
    },
    DOCS: {
        SRC: DOCS + '/**/*.md',
        IMAGES: {
            SRC: DOCS + '/mk1/img/**',
            DEST: DIST + '/mk1/img/'
        },
        DATA: DOCS + '/**/*.json',
        DEST: DIST + '/**/*.html'
    },
    PAGES: {
        SRC: SITE + '/content/**/*.html',
        DATA: SITE + '/content/**/*.json',
        DEST: DIST + '/**/*.html'
    },
    SCRIPTS: {
        SRC: SITE + '/assets/js/**',
        DEST: DIST + '/js'
    },
    LIBRARIES: {
        SRC: SITE + '/assets/jslibs/**',
        DEST: DIST + '/js'
    },
    TEMPLATES: { SRC: SITE + '/assets/templates' }
};

var BOWER_SCRIPTS = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/what-input/dist/what-input.min.js',
    'bower_components/foundation-sites/dist/js/foundation.min.js'
];

var BOWER_MAPS = [
    {
        src: 'bower_components/what-input/dist/maps/what-input.min.js.map',
        dest: PATHS.SCRIPTS.DEST + '/maps'
    },
    {
        src: 'bower_components/foundation-sites/dist/js/foundation.min.js.map',
        dest: PATHS.SCRIPTS.DEST
    },
    {
        src: 'bower_components/foundation-sites/dist/css/foundation.min.css.map',
        dest: PATHS.CSS.DEST
    }
];

var BOWER_STYLES = [
    'bower_components/foundation-sites/dist/css/foundation.min.css'
];

var DOCS_PRE = '{% extends "base.html" %}\n{% block content %}\n<div class="grid-container">\n';
var DOCS_POST = '</div>\n{% endblock %}';

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
 * Copies all the bower maps
 * @returns {Object} The task stream
 */
function bowermaps() {
    var tasks = [];

    BOWER_MAPS.forEach(function (map) {
        tasks.push(gulp.src(map.src).pipe(gulp.dest(map.dest)));
    });

    return merge(tasks);
}

/**
 * Copy all the bower styles
 * @returns {Object} The task stream
 */
function bowerstyles() {
    return copylist(BOWER_STYLES, PATHS.CSS.DEST);
}

var bower = gulp.parallel(bowerscripts, bowermaps, bowerstyles);

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

var styles = gulp.parallel(customstyles);

/**
 * Copies all the custom scripts
 * @returns {Object} The task stream
 */
function customscripts() {
    return gulp.src(PATHS.SCRIPTS.SRC)
        .pipe(uglify())
        .pipe(gulp.dest(PATHS.SCRIPTS.DEST))
        .pipe(connect.reload());
}

/**
 * Copies all the javascript libraries
 * @returns {Object} The task stream
 */
function jslibraries() {
    return gulp.src(PATHS.LIBRARIES.SRC)
        .pipe(gulp.dest(PATHS.LIBRARIES.DEST));
}

var scripts = gulp.parallel(customscripts, jslibraries);

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
 * Copies the docs images
 * @returns {Object} The task stream
 */
function docimages() {
    return gulp.src(PATHS.DOCS.IMAGES.SRC)
        .pipe(gulp.dest(PATHS.DOCS.IMAGES.DEST))
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
 * Adds filters to the nunjucks environement
 * @param {Object} env The nunjucks environment
 * @returns {undefined}
 */
function nunjucksEnvironment(env) {
    env.addFilter('numeral', numeralFilter);
}

/**
 * Loads the JSON data
 * @param {String} file The filename
 * @param {String} extension The file extension
 * @returns {String} The json data
 */
function getJsonForFile(file, extension) {
    var data_file = path.join(path.dirname(file.path), path.basename(file.path, '.' + extension) + '.json');
    var data = { site: site };
    data.site.path = path.basename(file.path);

    try {
        data.data = JSON.parse(fs.readFileSync(data_file));
    } catch (err) {
        // It's ok if we don't have supplemental data
    }

    return data;
}

/**
 * Loads the JSON data
 * @param {String} file The filename
 * @returns {String} The json data
 */
function docsData(file) {
    var data = getJsonForFile(file, 'html');
    var file_data = { data: lodash.assign({}, file.data) };

    return lodash.assign({}, file_data, data);
}

/**
 * Add templating to docs
 * @param {Object} file The file
 * @param {Function} enc The transform function
 * @param {Function} cb The callback
 * @returns {undefined}
 */
function templateDocs(file, enc, cb) {
    var pre_file = Buffer.from(DOCS_PRE, 'utf8');
    var contents = Buffer.from(file.contents, 'utf8');
    var post_file = Buffer.from(DOCS_POST, 'utf8');

    var total_length = pre_file.length + contents.length + post_file.length;

    file.contents = Buffer.concat([ pre_file, contents, post_file ], total_length);
    cb(null, file);
}

/**
 * Render out the header
 * @param {String} text The text
 * @param {Number} level The level
 * @returns {String} The heading
 */
function heading_render(text, level) {
    var style_class = level === 1 ? 'text-center' : '';
    var id = text.toLowerCase().replace(/[^\w]+/g, '-');

    return `<h${level} class="${style_class}" id="${id}">${text}</h${level}>`;
}

/**
 * Build the docs
 * @return {Object} The task stream
 */
function docs() {
    var nunjucks_config = {
        path: PATHS.TEMPLATES.SRC,
        manageEnv: nunjucksEnvironment
    };

    var frontmatter_config = {
        property: 'data',
        remove: true
    };

    var markdown_render = new markdown.marked.Renderer();
    markdown_render.heading = heading_render;

    return gulp.src(PATHS.DOCS.SRC)
        .pipe(frontmatter(frontmatter_config))
        .pipe(markdown({renderer: markdown_render}))
        .pipe(through.obj(templateDocs))
        .pipe(data(docsData))
        .pipe(nunjucks(nunjucks_config))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(DIST))
        .pipe(connect.reload());
}

/**
 * Loads the JSON data
 * @param {String} file The filename
 * @returns {String} The json data
 */
function pageData(file) {
    var data = getJsonForFile(file, 'html');

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
 * Build the docs
 * @return {Object} The task stream
 */
function static_html() {
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
    gulp.watch(PATHS.DOCS.IMAGES.SRC, docimages);
    gulp.watch(PATHS.FONTS.SRC, fonts);
    gulp.watch(PATHS.SCRIPTS.SRC, scripts);
    gulp.watch([ PATHS.TEMPLATES.SRC, PATHS.PAGES.SRC, PATHS.PAGES.DATA, PATHS.DOCS.SRC, PATHS.DOCS.DATA ], pages);

    connect.server({
        root: DIST,
        host: '0.0.0.0',
        port: 9000,
        livereload: true
    });
}

var pages = gulp.series(static_html, docs);
var cleanall = gulp.parallel(cleanpages, cleanimages, cleanfonts, cleanscripts, cleanstyles);
var assets = gulp.series(bower, styles, scripts, images, docimages, fonts, pages);
var default_task = gulp.series(cleanall, assets);

exports.default = default_task;
exports.build = default_task;
exports.clean = cleanall;
exports.dist = default_task;
exports.watch = gulp.series(default_task, watch);