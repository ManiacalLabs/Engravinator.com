[![Build Status](https://github.com/ManiacalLabs/Engravinator.com/workflows/Build%20Page/badge.svg)](https://github.com/ManiacalLabs/Engravinator.com/actions?query=workflow%3A%22Build+Page%22)

# Engravinator.com Site Code

This code drives the [Engravinator](http://engravinator.com) site.  For information about the Engravinator project, checkout the [GitHub repo](https://github.com/ManiacalLabs/Engravinator)

# Add new mod
Adding a new mod to the mods page is pretty straight forward

1. Host your mod somewhere (we prefer GitHub and an Open Source license)
2. Get a photo / render of your mod in a PNG file that is 350px x 150px
3. Add the photo to `site/assets/images/mk1/mods/`
4. Update the `site/content/mk1/mods/index.json` file and add your mod to the `mods` list in the JSON file with the following information
    * **title**: The name of the mod.
    * **url**: The link to the mod.
    * **image**: The PNG filename that is in the `site/assets/images/mk1/mods/` directory.
    * **description**: A concise description of what the mod does.
5. Create a PR with your new mod

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
[GitHub Actions](https://github.com/ManiacalLabs/Engravinator.com/actions?query=workflow%3A%22Build+Page%22) deploys the site using [github pages deploy action](https://github.com/JamesIves/github-pages-deploy-action) to the gh-pages branch.