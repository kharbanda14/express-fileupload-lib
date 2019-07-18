const sharp = require('sharp');
const _path = require('path');

const sizes = [
    { w : 64, h : 64 },
    { w : 128, h : 128 },
    { w : 300, h : 300 },
    { w : 960, h : 480 },
];

async function resizeUploadedImage (path, w, h) {
    const {name, ext, dir} = _path.parse(path);

    const saveName = `${name}_${w}x${h}${ext}`; 
    const saveDest = _path.join(dir, saveName);

    await resizeImage(path, w, h, saveDest);

    return saveDest;
}

async function resizeImage(path, w, h, dest) {
    try {
        await sharp(path).resize(w, h, {
            fit: "cover"
        }).toFile(dest);
        return true;
    } catch (error) {
        return false;
    }
}

async function multiResizeUpload(path) {
    for (const size of sizes) {
        await resizeUploadedImage(path, size.w, size.h);
    }
}


module.exports.resize_uploaded_image = resizeUploadedImage;
module.exports.multi_resize = multiResizeUpload;