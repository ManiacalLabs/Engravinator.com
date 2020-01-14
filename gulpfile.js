const fs = require('fs');
const path = require('path');
const through = require('through2');

const lodash = require('lodash');
const merge = require('merge-stream');

const gulp = require('gulp');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect');
const data = require('gulp-data');
const frontmatter = require('gulp-front-matter');
const htmlmin = require('gulp-htmlmin');
const markdown = require('gulp-markdown');
const uglify = require('gulp-uglify');

const nunjucks = require('gulp-nunjucks-render');
const numeralFilter = require('nunjucks-numeral-filter');

const DIST = __dirname + '/dist';
const SITE = __dirname + '/site';
const DOCS = __dirname + '/docs';

const PATHS = {
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

const BOWER_SCRIPTS = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/what-input/dist/what-input.min.js',
    'bower_components/foundation-sites/dist/js/foundation.min.js'
];

const BOWER_MAPS = [
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

const BOWER_STYLES = [
    'bower_components/foundation-sites/dist/css/foundation.min.css'
];

const DOC_NAVIGATION_LINES = [
    '<div class="doc_nav grid-x grid-padding-x">',
    '<div class="cell small-4 text-left">',
    '{% if data.prev_url %}',
    '<a class="nav_prev" href="{{ data.prev_url }}">&larr; {{ data.prev_text }}</a>',
    '{% endif %}',
    '</div>',
    '<div class="cell small-4 text-center">',
    '{% if data.home_url %}',
    '<a class="nav_home" href="{{ data.home_url }}">Home</a>',
    '{% endif %}',
    '</div>',
    '<div class="cell small-4 text-right">',
    '{% if data.next_url %}',
    '<a class="nav_next" href="{{ data.next_url }}">{{ data.next_text }} &rarr;</a>',
    '{% endif %}',
    '</div>',
    '</div>'
];

const DOC_PRE_LINES = [
    '{% extends "base.html" %}',
    '{% block content %}',
    '<div class="grid-container">',
    lodash.join(DOC_NAVIGATION_LINES, '\n')
];

const DOC_POST_LINES = [
    lodash.join(DOC_NAVIGATION_LINES, '\n'),
    '</div>',
    '{% endblock %}'
];

const DOCS_PRE = lodash.join(DOC_PRE_LINES, '\n');
const DOCS_POST = lodash.join(DOC_POST_LINES, '\n');

const clean_params = {
    read: false,
    allowEmpty: true
};

const DEVEL = process.env.DEVEL ? true : false;
const BETA_URL = process.env.BETA_URL ? process.env.BETA_URL : '';

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

const bower = gulp.parallel(bowerscripts, bowermaps, bowerstyles);

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

const styles = gulp.parallel(customstyles);

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

const scripts = gulp.parallel(customscripts, jslibraries);

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
    const data_file = path.join(path.dirname(file.path), path.basename(file.path, '.' + extension) + '.json');
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
    const data = getJsonForFile(file, 'html');
    const file_data = { data: lodash.assign({}, file.data) };

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
    const pre_file = Buffer.from(DOCS_PRE, 'utf8');
    const contents = Buffer.from(file.contents, 'utf8');
    const post_file = Buffer.from(DOCS_POST, 'utf8');

    const total_length = pre_file.length + contents.length + post_file.length;

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
    const style_class = level === 1 ? 'text-center' : '';
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');

    return `<h${level} class="${style_class}" id="${id}">${text}</h${level}>`;
}

/**
 * Build the docs
 * @return {Object} The task stream
 */
function docs() {
    const nunjucks_config = {
        path: PATHS.TEMPLATES.SRC,
        manageEnv: nunjucksEnvironment
    };

    const frontmatter_config = {
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
    const data = getJsonForFile(file, 'html');

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
    const nunjucks_config = {
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

const pages = gulp.series(static_html, docs);
const cleanall = gulp.parallel(cleanpages, cleanimages, cleanfonts, cleanscripts, cleanstyles);
const assets = gulp.series(bower, styles, scripts, images, docimages, fonts, pages);
const default_task = gulp.series(cleanall, assets);

exports.default = default_task;
exports.build = default_task;
exports.clean = cleanall;
exports.dist = default_task;
exports.watch = gulp.series(default_task, watch);