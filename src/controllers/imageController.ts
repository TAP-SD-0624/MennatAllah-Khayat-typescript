import { Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, '../../uploads');

const saveImage = async (imageBuffer: Buffer, filename: string) => {
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, imageBuffer);
  return filepath;
};

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  const filename = `${Date.now()}-${req.file.originalname}`;
  const filepath = await saveImage(req.file.buffer, filename);
  res.status(200).send({ message: 'Image uploaded', filename });
};

export const resizeImage = async (req: Request, res: Response) => {
  const { filename, width, height } = req.body;
  if (!filename || !width || !height) return res.status(400).send('Missing required parameters.');

  const filepath = path.join(uploadDir, filename);
  const outputBuffer = await sharp(filepath).resize(width, height).toBuffer();
  const resizedFilename = `resized-${filename}`;
  const resizedFilepath = await saveImage(outputBuffer, resizedFilename);
  res.status(200).send({ message: 'Image resized', resizedFilename });
};

export const cropImage = async (req: Request, res: Response) => {
  const { filename, width, height, left, top } = req.body;
  if (!filename || !width || !height || left === undefined || top === undefined) return res.status(400).send('Missing required parameters.');
  
  const filepath = path.join(uploadDir, filename);
  const outputBuffer = await sharp(filepath).extract({ width, height, left, top }).toBuffer();
  const croppedFilename = `cropped-${filename}`;
  const croppedFilepath = await saveImage(outputBuffer, croppedFilename);
  res.status(200).send({ message: 'Image cropped', croppedFilename });
};

export const downloadImage = (req: Request, res: Response) => {
  const { filename } = req.params;
  const filepath = path.join(uploadDir, filename);
  if (!fs.existsSync(filepath)) return res.status(404).send('File not found.');

  res.download(filepath);
};


export const applyGrayscale = async (req: Request, res: Response) => {
    const { filename } = req.body;
    if (!filename) return res.status(400).send('Missing required parameters.');
  
    const filepath = path.join(uploadDir, filename);
    const outputBuffer = await sharp(filepath).grayscale().toBuffer();
    const grayscaleFilename = `grayscale-${filename}`;
    const grayscaleFilepath = await saveImage(outputBuffer, grayscaleFilename);
    res.status(200).send({ message: 'Image converted to grayscale', grayscaleFilename });
};

export const applyBlur = async (req: Request, res: Response) => {
    const { filename, blurRadius } = req.body;
    if (!filename || !blurRadius) return res.status(400).send('Missing required parameters.');
  
    const filepath = path.join(uploadDir, filename);
    const outputBuffer = await sharp(filepath).blur(blurRadius).toBuffer();
    const blurFilename = `blur-${filename}`;
    const blurFilepath = await saveImage(outputBuffer, blurFilename);
    res.status(200).send({ message: 'Image blurred', blurFilename });
};

export const addWatermark = async (req: Request, res: Response) => {
    const { filename, watermarkText } = req.body;
    if (!filename || !watermarkText) return res.status(400).send('Missing required parameters.');
  
    const filepath = path.join(uploadDir, filename);
    const image = sharp(filepath);
    const { width, height } = await image.metadata();
    const svgBuffer = Buffer.from(
      `<svg width="${width}" height="${height}">
         <text x="10" y="${height}-10" font-size="48" fill="white">${watermarkText}</text>
       </svg>`
    );
  
    const outputBuffer = await image
      .composite([{ input: svgBuffer, gravity: 'southeast' }])
      .toBuffer();
  
    const watermarkedFilename = `watermarked-${filename}`;
    const watermarkedFilepath = await saveImage(outputBuffer, watermarkedFilename);
    res.status(200).send({ message: 'Watermark added', watermarkedFilename });
};