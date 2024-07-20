"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWatermark = exports.applyBlur = exports.applyGrayscale = exports.downloadImage = exports.cropImage = exports.resizeImage = exports.uploadImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadDir = path_1.default.join(__dirname, '../../uploads');
const saveImage = (imageBuffer, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const filepath = path_1.default.join(uploadDir, filename);
    yield fs_1.default.promises.writeFile(filepath, imageBuffer);
    return filepath;
});
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).send('No file uploaded.');
    const filename = `${Date.now()}-${req.file.originalname}`;
    const filepath = yield saveImage(req.file.buffer, filename);
    res.status(200).send({ message: 'Image uploaded', filename });
});
exports.uploadImage = uploadImage;
const resizeImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, width, height } = req.body;
    if (!filename || !width || !height)
        return res.status(400).send('Missing required parameters.');
    const filepath = path_1.default.join(uploadDir, filename);
    const outputBuffer = yield (0, sharp_1.default)(filepath).resize(width, height).toBuffer();
    const resizedFilename = `resized-${filename}`;
    const resizedFilepath = yield saveImage(outputBuffer, resizedFilename);
    res.status(200).send({ message: 'Image resized', resizedFilename });
});
exports.resizeImage = resizeImage;
const cropImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, width, height, left, top } = req.body;
    if (!filename || !width || !height || left === undefined || top === undefined)
        return res.status(400).send('Missing required parameters.');
    const filepath = path_1.default.join(uploadDir, filename);
    const outputBuffer = yield (0, sharp_1.default)(filepath).extract({ width, height, left, top }).toBuffer();
    const croppedFilename = `cropped-${filename}`;
    const croppedFilepath = yield saveImage(outputBuffer, croppedFilename);
    res.status(200).send({ message: 'Image cropped', croppedFilename });
});
exports.cropImage = cropImage;
const downloadImage = (req, res) => {
    const { filename } = req.params;
    const filepath = path_1.default.join(uploadDir, filename);
    if (!fs_1.default.existsSync(filepath))
        return res.status(404).send('File not found.');
    res.download(filepath);
};
exports.downloadImage = downloadImage;
const applyGrayscale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.body;
    if (!filename)
        return res.status(400).send('Missing required parameters.');
    const filepath = path_1.default.join(uploadDir, filename);
    const outputBuffer = yield (0, sharp_1.default)(filepath).grayscale().toBuffer();
    const grayscaleFilename = `grayscale-${filename}`;
    const grayscaleFilepath = yield saveImage(outputBuffer, grayscaleFilename);
    res.status(200).send({ message: 'Image converted to grayscale', grayscaleFilename });
});
exports.applyGrayscale = applyGrayscale;
const applyBlur = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, blurRadius } = req.body;
    if (!filename || !blurRadius)
        return res.status(400).send('Missing required parameters.');
    const filepath = path_1.default.join(uploadDir, filename);
    const outputBuffer = yield (0, sharp_1.default)(filepath).blur(blurRadius).toBuffer();
    const blurFilename = `blur-${filename}`;
    const blurFilepath = yield saveImage(outputBuffer, blurFilename);
    res.status(200).send({ message: 'Image blurred', blurFilename });
});
exports.applyBlur = applyBlur;
const addWatermark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename, watermarkText } = req.body;
    if (!filename || !watermarkText)
        return res.status(400).send('Missing required parameters.');
    const filepath = path_1.default.join(uploadDir, filename);
    const image = (0, sharp_1.default)(filepath);
    const { width, height } = yield image.metadata();
    const svgBuffer = Buffer.from(`<svg width="${width}" height="${height}">
         <text x="10" y="${height}-10" font-size="48" fill="white">${watermarkText}</text>
       </svg>`);
    const outputBuffer = yield image
        .composite([{ input: svgBuffer, gravity: 'southeast' }])
        .toBuffer();
    const watermarkedFilename = `watermarked-${filename}`;
    const watermarkedFilepath = yield saveImage(outputBuffer, watermarkedFilename);
    res.status(200).send({ message: 'Watermark added', watermarkedFilename });
});
exports.addWatermark = addWatermark;
