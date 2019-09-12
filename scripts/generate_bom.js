var program = require('commander');
var GoogleSpreadsheet = require('google-spreadsheet');
var lo = require('lodash');
var jsonfile = require('jsonfile');
var fs = require('fs');

program
    .option('--output <filename>', 'The json file to overwrite')
    .option('--docid <docid>', 'The google sheet document id')
    .option('--sheetid <id>', 'The the id number of the sheet to use');

program.parse(process.argv);

if (program.output === undefined) {
    console.error('Output file must be specified');
    process.exit(1);
}

if (program.docid === undefined) {
    console.error('Document id must be specified');
    process.exit(1);
}

if (program.output === undefined) {
    console.error('sheet number must be specified');
    process.exit(1);
}

/**
 * Generates the parts list
 * @param {Object[]} cells The cells from the spreadsheet
 * @returns {Object} A map of row number to part
 */
function generatePartsList(cells) {
    var headers = [];
    var parts = {};

    lo.each(lo.sortBy(cells, [ 'row', 'col' ]), function (cell) {
        if (cell.row === 1) {
            var header_name = lo.toLower(cell._value).replace(/ /g, '_');
            headers.push(header_name);
        } else {
            var row_s = cell.row.toString();
            if (!lo.has(parts, row_s)) {
                parts[row_s] = {};
            }

            var value = cell._numericValue !== undefined ? cell._numericValue : cell._value;
            parts[row_s][headers[cell.col - 1]] = value;
        }
    });

    return parts;
}

/**
 * Gets the category map
 * @param {Object[]} parts The parts from the spreadsheet
 * @returns {Object} A map of category to list of parts
 */
function generateCategoryMap(parts) {
    var header_map = {
        qty: 'quantity',
        name: 'name',
        part_number: 'part_number',
        price_per_unit: 'price_per_unit',
        1: 'part_price',
        x1_total: 'total_price',
        minimum_qnty: 'minimum_quantity',
        url: 'url'
    };
    var category_map = {};

    lo.each(parts, function (part) {
        var category = part.category;
        if (
            !lo.isEmpty(category) &&
            !lo.isEmpty(part.include_in_bom)
        ) {
            if (!lo.has(category_map, category)) {
                category_map[category] = [];
            }

            var formatted_part = {};

            lo.each(header_map, function (header, name) {
                formatted_part[header] = part[name];
            });

            category_map[category].push(formatted_part);
        }
    });

    return category_map;
}

/**
 * Writes the products to the specified json file
 * @param {Object} category_map The map of categories to products
 * @return {undefined}
 */
function writeBOM(category_map) {
    var currentData = jsonfile.readFileSync(program.output, { throws: false });

    if (currentData === null) {
        currentData = { bom: {} };
    }

    lo.each(category_map, function (parts, category) {
        if (!lo.has(currentData.bom, category)) {
            currentData.bom[category] = {};
        }

        currentData.bom[category].parts = parts;
    });

    fs.writeFileSync(program.output, JSON.stringify(currentData, null, '\t'));
}

/**
 * Processes the data in the sheet
 * @param {Object} error The error
 * @param {Object[]} cells The data
 * @returns {undefined}
 */
function processSheet(error, cells) {
    if (error) {
        console.error(error);
        process.exit(1);
    }

    var parts = generatePartsList(cells);
    var category_map = generateCategoryMap(parts);
    writeBOM(category_map);
}

var doc = new GoogleSpreadsheet(program.docid);
var options = {
    'min-row': 1,
    'max-row': 200,
    'min-col': 1,
    'max-col': 10,
    'return-empty': true
};

doc.getCells(program.sheetid, options, processSheet);