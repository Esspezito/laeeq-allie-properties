const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log('📥 Downloading REAL Property24 images to local storage...');

// Read the gallery data
const galleryData = JSON.parse(fs.readFileSync('property24-advanced-galleries.json', 'utf8'));

// Create directory for images
const imagesDir = path.join(__dirname, 'public', 'property24-images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const file = fs.createWriteStream(filepath);

    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.property24.com/',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin'
      }
    }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(`Failed to download: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function downloadAllImages() {
  const updatedProperties = [];
  let totalDownloaded = 0;
  let totalFailed = 0;

  for (const property of galleryData.properties) {
    console.log(`\n📦 Processing property ${property.id}...`);

    const localImages = [];

    for (let i = 0; i < property.images.length; i++) {
      const imageUrl = property.images[i];

      if (!imageUrl || imageUrl.length === 0) continue;

      // Extract image ID from URL
      const imageMatch = imageUrl.match(/(\d{9,})/);
      const imageId = imageMatch ? imageMatch[1] : `${property.id}_${i}`;

      const filename = `property_${property.id}_image_${imageId}.jpg`;
      const localPath = `/property24-images/${filename}`;
      const fullPath = path.join(imagesDir, filename);

      try {
        // Check if already downloaded
        if (!fs.existsSync(fullPath)) {
          console.log(`  ⬇️  Downloading image ${i + 1}/${property.images.length}...`);
          await downloadImage(imageUrl, fullPath);
          console.log(`  ✅ Saved: ${filename}`);
          totalDownloaded++;
        } else {
          console.log(`  ⏭️  Already exists: ${filename}`);
        }
        localImages.push(localPath);
      } catch (error) {
        console.log(`  ❌ Failed to download image ${i + 1}: ${error.message || error}`);
        totalFailed++;
      }

      // Add delay to avoid rate limiting
      if (i < property.images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Update property with local image paths
    updatedProperties.push({
      ...property,
      images: localImages
    });

    console.log(`  📊 Property ${property.id}: ${localImages.length} images ready`);
  }

  // Save updated data with local paths
  const outputData = {
    ...galleryData,
    properties: updatedProperties,
    downloadedAt: new Date().toISOString(),
    totalDownloaded,
    totalFailed
  };

  fs.writeFileSync('property24-local-images.json', JSON.stringify(outputData, null, 2));

  console.log('\n✅ Download complete!');
  console.log(`📊 Total images downloaded: ${totalDownloaded}`);
  console.log(`❌ Failed downloads: ${totalFailed}`);
  console.log(`📁 Images saved to: ${imagesDir}`);
  console.log('📄 Updated data saved to: property24-local-images.json');
}

// Run the download
downloadAllImages()
  .then(() => {
    console.log('\n🎉 All Property24 images downloaded successfully!');
    console.log('🚀 Ready to update mockData.ts with local image paths');
  })
  .catch(error => {
    console.error('\n❌ Error downloading images:', error);
  });