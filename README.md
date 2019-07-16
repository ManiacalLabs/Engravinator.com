# Engravinator.com Site Code

This code drives the [Engravinator](http://engravinator.com) site.  For information about the Engravinator project, checkout the [GitHub repo](https://github.com/ManiacalLabs/Engravinator)

# Structure
The site is driven by [Nunjucks](https://mozilla.github.io/nunjucks/) and [Foundation](https://foundation.zurb.com/sites.html) and then compiled using [Gulp](https://gulpjs.com/).

## Templates
Main templates go in the `site/assets/templates` folder with helpers and smaller reusable templates going in the `site/assets/templates/partials` folder.

## Content
Content in the `site/content` folder is rendered out using `npm run build` and is generated into the `dist` folder.

## Local development
Local development requires node and npm to be installed.
1. Run `npm install` to set up the environment
2. Run `npm run bower` to download the static assets from bower
3. Run `npm run watch` to start up a local server at `http://localhost:9000` with the contents of the site.  Changes should force the server to refresh.

## Deployment
[Travis-ci.org](https://travis-ci.org/ManiacalLabs/Engravinator.com/) deploys the site using [gulp-gh-pages](https://www.npmjs.com/package/gulp-gh-pages) to the gh-pages branch.