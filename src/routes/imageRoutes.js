"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageController_1 = require("../controllers/imageController");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = (0, express_1.Router)();
router.post('/upload', upload_1.default.single('image'), imageController_1.uploadImage);
router.post('/resize', imageController_1.resizeImage);
router.post('/crop', imageController_1.cropImage);
router.post('/grayscale', imageController_1.applyGrayscale);
router.post('/blur', imageController_1.applyBlur);
router.post('/watermark', imageController_1.addWatermark);
router.get('/download/:filename', imageController_1.downloadImage);
exports.default = router;
