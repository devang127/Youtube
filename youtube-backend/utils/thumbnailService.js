const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;
const cloudinary = require('cloudinary').v2;
ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');

class ThumbnailService {
    static async generateAndUpload(videoPath, timestamp = 2) {
        const tempDir = path.join(__dirname, '../temp');
        const thumbnailName = `thumb_${Date.now()}.jpg`;
        const thumbnailPath = path.join(tempDir, thumbnailName);

        try {
            // create temp folder
            await fs.mkdir(tempDir, { recursive: true });

            // gen thumbnail from a video and upload to cloudinary
            await this.generateFromVideo(videoPath, thumbnailPath, timestamp);
            const uploadResult = await cloudinary.uploader.upload(thumbnailPath, {
                resource_type: 'image',
                folder: 'youtube-clone/thumbnails',
                transformation: [
                    { width: 1280, height: 720, crop: 'fill' },
                    { quality: 'auto:good' }
                ]
            });
            // rclean temp file
            await fs.unlink(thumbnailPath).catch(() => { });

            return {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id
            };

        } catch (error) {
            await fs.unlink(thumbnailPath).catch(() => { });
            throw new Error(`Thumbnail generation failed: ${error.message}`);
        }
    }

    static generateFromVideo(videoPath, outputPath, timestamp = 2) {
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .screenshots({
                    timestamps: [timestamp],
                    filename: path.basename(outputPath),
                    folder: path.dirname(outputPath),
                    size: '1280x720'
                })
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err));
        });
    }
}

module.exports = ThumbnailService;