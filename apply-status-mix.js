const fs = require('fs');

console.log('🔄 APPLYING REALISTIC STATUS MIX TO PROPERTIES...\n');

// Read mockData file
let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');

// Define status changes - creating a realistic mix like Maingard properties had
const statusUpdates = [
  { id: '2746474', status: 'under-offer' }, // Already done
  { id: '2404200', status: 'sold' },
  { id: '2390974', status: 'under-offer' },
  { id: '2382248', status: 'under-offer' },
  { id: '2366805', status: 'under-offer' },
  { id: '2339889', status: 'under-offer' },
  { id: '2332226', status: 'under-offer' },
  { id: '2276694', status: 'under-offer' },
  { id: '2248683', status: 'under-offer' },
  { id: '2248308', status: 'under-offer' },
  { id: '2205883', status: 'under-offer' },
  { id: '2191459', status: 'under-offer' },
  { id: '2188669', status: 'under-offer' },
  { id: '2188664', status: 'under-offer' },
  { id: '2188654', status: 'under-offer' },
  { id: '2187925', status: 'under-offer' }
  // Remaining properties stay as 'available'
];

let availableCount = 0;
let underOfferCount = 0;
let soldCount = 0;

// Apply status updates
for (const update of statusUpdates) {
  // Create regex to find and replace the specific property's status
  const regex = new RegExp(`("id": "${update.id}"[\\s\\S]*?"status": ")(available|under-offer|sold)(")`, 'g');
  
  const matches = mockDataContent.match(regex);
  if (matches) {
    mockDataContent = mockDataContent.replace(regex, `$1${update.status}$3`);
    console.log(`✅ Updated property ${update.id} to: ${update.status.toUpperCase()}`);
    
    if (update.status === 'available') availableCount++;
    else if (update.status === 'under-offer') underOfferCount++;
    else if (update.status === 'sold') soldCount++;
  } else {
    console.log(`⚠️  Could not find property ${update.id}`);
  }
}

// Count remaining available properties
const remainingAvailableMatches = mockDataContent.match(/"status": "available"/g);
availableCount += remainingAvailableMatches ? remainingAvailableMatches.length : 0;

// Write updated file
fs.writeFileSync('src/lib/mockData.ts', mockDataContent);

console.log('\n🎉 STATUS UPDATE COMPLETE!');
console.log(`\n📊 Final Status Breakdown:`);
console.log(`   ✅ Available: ${availableCount} properties`);
console.log(`   ⏳ Under Offer: ${underOfferCount} properties`);
console.log(`   🔴 Sold: ${soldCount} properties`);
console.log(`   📝 Total Properties: ${availableCount + underOfferCount + soldCount}`);
console.log('\n📁 Updated: src/lib/mockData.ts');