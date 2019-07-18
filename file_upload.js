const path = require('path');
const fs = require('fs');

/**
 * Basic Configuration for file uploading
 */
var config = {
    public : path.join(path.dirname(__dirname), 'public'),
    folder : path.join('uploads'),
    path : function () {
        return path.join(this.public, this.folder);
    }
};

/**
 * Initializes Config
 * Used for changing folder or public path etc.
 * @param {Object} options 
 */
function initConfig(options = {}) {
    Object.assign(config,options);
}

/**
 * Upload Handler
 * @param {Array|Object} files 
 */
async function handleUpload(files) {
    const uploaded = [];

    /**
     * Empty files
     */
    if (! files) {
        throw new Error('No files were uploaded!');
    }

    checkDirectory(config.path());

    if (Array.isArray(files)) {
        for (const file of files) {
            uploaded.push(await processFile(file));
        }
    } else {
        uploaded.push(await processFile(files));
    }
    return uploaded;
}



/**
 * Handle the file and move to the desired location
 * @param {Object} file File Object
 */
async function processFile(file) {
    const location = path.join(config.path(), file.name);
    await file.mv(location);
    return {
        name: file.name,
        http_path: path.join(config.folder, file.name),
        file: location
    };
}

/**
 * Checks whether directory exists or not
 * If path does not exists creates path recursively
 * @param {String} path 
 */
function checkDirectory(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {
            recursive: true
        })
    }
    return true;
}


/**
 * Exports
 */
module.exports = handleUpload;
module.exports.init = initConfig;
