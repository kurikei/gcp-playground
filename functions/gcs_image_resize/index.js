// https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/functions/imagemagick/index.js
const gm = require('gm').subClass({ imageMagick: true });
const fs = require('fs');
const path = require('path');
const storage = require('@google-cloud/storage')();

function resizeImage(file) {
  const tempLocalPath = `/tmp/${path.parse(file.name).base}`;

  return file
    .download({ destination: tempLocalPath })
    .catch(err => {
      console.error('Failed to download file.', err);
      return Promise.reject(err);
    })
    .then(() => {
      console.log(
        `Image ${file.name} has been downloaded to ${tempLocalPath}.`
      );

      // Blur the image using ImageMagick.
      return new Promise((resolve, reject) => {
        gm(tempLocalPath)
          .resize(20)
          .write(tempLocalPath, (err, stdout) => {
            if (err) {
              console.error('Failed to resize image.', err);
              reject(err);
            } else {
              resolve(stdout);
            }
          });
      });
    })
    .then(() => {
      console.log(`Image ${file.name} has been resized.`);

      // Mark result as resized, to avoid re-triggering this function.
      const newName = `${file.name}-small`;

      // Upload the Resized image back into the bucket.
      return file.bucket
        .upload(tempLocalPath, { destination: newName })
        .catch(err => {
          console.error('Failed to upload resized image.', err);
          return Promise.reject(err);
        });
    })
    .then(() => {
      console.log(`Resized image has been uploaded to ${file.name}.`);

      // Delete the temporary file.
      return new Promise((resolve, reject) => {
        fs.unlink(tempLocalPath, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
}

exports.resizeImages = event => {
  const object = event.data || event;

  // Exit if this is a deletion or a deploy event.
  if (object.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }
  if (!object.name) {
    console.log('This is a deploy event.');
    return;
  }
  console.log(`bucket:${object.bucket}`);
  console.log(`name:${object.name}`);

  const file = storage.bucket(object.bucket).file(object.name);

  // Ignore already-resized files (to prevent re-invoking this function)
  if (file.name.endsWith('-small')) {
    console.log(`The image ${file.name} is already resized.`);
    return;
  }

  resizeImage(file);
};
