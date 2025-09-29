const fs = require('fs');

console.log('🔍 FINAL COMPREHENSIVE VERIFICATION OF ALL PROPERTY DATA');
console.log('=' .repeat(60));

// Read current mockData.ts
const mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');

// Extract all properties from mockData.ts
const propertyPattern = /{[\s\S]*?"id": "([\d]+)"[\s\S]*?"title": "([^"]*)"[\s\S]*?"price": "([^"]*)"[\s\S]*?"images": \[([\s\S]*?)\][\s\S]*?"sourceUrl": "([^"]*)"[\s\S]*?}/g;
const properties = [];
let match;

while ((match = propertyPattern.exec(mockDataContent)) !== null) {
  const imageMatches = match[4].match(/"([^"]*)"/g);
  const images = imageMatches ? imageMatches.map(img => img.replace(/"/g, '')) : [];

  properties.push({
    id: match[1],
    title: match[2],
    price: match[3],
    images: images,
    sourceUrl: match[5]
  });
}

console.log(`📊 Found ${properties.length} properties in mockData.ts\n`);

// Known correct prices from La'eeq's Property24 listing page
const VERIFIED_CORRECT_PRICES = {
  "116463618": "R 2 750 000",
  "116455279": "R 12 995 000",
  "116455489": "R 12 995 000",
  "116455093": "R 4 500 000",
  "116439140": "R 6 250 000",
  "116441627": "R 3 300 000",
  "116441202": "R 2 375 000",
  "116441599": "R 3 300 000",
  "116280718": "R 2 995 000",
  "116282958": "R 2 695 000",
  "116281167": "R 3 995 000",
  "116281209": "R 3 995 000",
  "116296190": "R 2 199 999",
  "116226593": "R 4 195 000",
  "116280871": "R 6 950 000",
  "116283204": "R 1 950 000",
  "116220646": "R 1 699 999",
  "116200162": "R 1 799 999",
  "116216202": "R 1 850 000"
};

// Verification checks
let allChecks = {
  priceCorrect: 0,
  priceIncorrect: 0,
  hasImages: 0,
  noImages: 0,
  hasSourceUrl: 0,
  noSourceUrl: 0,
  property24Images: 0,
  nonProperty24Images: 0
};

console.log('🔍 DETAILED PROPERTY VERIFICATION:\n');

properties.forEach((prop, index) => {
  console.log(`${index + 1}. Property ID: ${prop.id}`);
  console.log(`   Title: ${prop.title}`);

  // Price verification
  const expectedPrice = VERIFIED_CORRECT_PRICES[prop.id];
  if (expectedPrice) {
    if (prop.price === expectedPrice) {
      console.log(`   ✅ Price: ${prop.price} (CORRECT)`);
      allChecks.priceCorrect++;
    } else {
      console.log(`   ❌ Price: ${prop.price} (Should be: ${expectedPrice})`);
      allChecks.priceIncorrect++;
    }
  } else {
    console.log(`   ⚠️  Price: ${prop.price} (No verification data)`);
  }

  // Image verification
  if (prop.images.length > 0) {
    console.log(`   ✅ Images: ${prop.images.length} image(s)`);
    allChecks.hasImages++;

    // Check if images are from Property24
    const property24Images = prop.images.filter(img => img.includes('images.prop24.com'));
    if (property24Images.length === prop.images.length) {
      console.log(`   ✅ All images from Property24`);
      allChecks.property24Images++;
    } else {
      console.log(`   ⚠️  Some images not from Property24`);
      allChecks.nonProperty24Images++;
    }
  } else {
    console.log(`   ❌ Images: No images found`);
    allChecks.noImages++;
  }

  // Source URL verification
  if (prop.sourceUrl && prop.sourceUrl.includes('property24.com')) {
    console.log(`   ✅ Source URL: Valid Property24 link`);
    allChecks.hasSourceUrl++;
  } else {
    console.log(`   ❌ Source URL: Invalid or missing`);
    allChecks.noSourceUrl++;
  }

  console.log('');
});

// Summary report
console.log('=' .repeat(60));
console.log('📊 VERIFICATION SUMMARY:');
console.log('=' .repeat(60));
console.log(`✅ Prices correct: ${allChecks.priceCorrect}/${properties.length}`);
console.log(`❌ Prices incorrect: ${allChecks.priceIncorrect}/${properties.length}`);
console.log(`✅ Properties with images: ${allChecks.hasImages}/${properties.length}`);
console.log(`❌ Properties without images: ${allChecks.noImages}/${properties.length}`);
console.log(`✅ Valid Property24 source URLs: ${allChecks.hasSourceUrl}/${properties.length}`);
console.log(`❌ Invalid source URLs: ${allChecks.noSourceUrl}/${properties.length}`);
console.log(`✅ Properties with Property24 images: ${allChecks.property24Images}/${properties.length}`);
console.log(`❌ Properties with non-Property24 images: ${allChecks.nonProperty24Images}/${properties.length}`);

// Overall status
const overallScore = ((allChecks.priceCorrect + allChecks.hasImages + allChecks.hasSourceUrl + allChecks.property24Images) / (properties.length * 4)) * 100;

console.log('\n' + '=' .repeat(60));
if (allChecks.priceIncorrect === 0 && allChecks.noImages === 0 && allChecks.noSourceUrl === 0 && allChecks.nonProperty24Images === 0) {
  console.log('🎉 ALL VERIFICATIONS PASSED! Data is 100% correct.');
} else {
  console.log(`⚠️  Overall data quality: ${Math.round(overallScore)}%`);
  console.log('Some issues found that need to be addressed.');
}

console.log('\n🚀 READY FOR DEPLOYMENT VERIFICATION');
console.log('Next step: Check live site at allierealty.com');