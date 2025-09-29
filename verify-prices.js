// Actual prices from La'eeq's Property24 listing page
const ACTUAL_PRICES = {
  "116463618": "R 2 750 000",
  "116455279": "R 12 995 000",
  "116455489": "R 12 995 000",
  "116455093": "R 4 500 000",
  "116439140": "R 6 250 000",
  "116441627": "R 3 300 000",
  "116441202": "R 2 375 000",
  "116441599": "R 3 300 000",
  "116338371": "R 2 399 999",  // This property might not be in our list
  "116280718": "R 2 995 000",
  "116282958": "R 2 695 000",
  "116281167": "R 3 995 000",
  "116281209": "R 3 995 000",
  "116296190": "R 2 199 999",
  "116226593": "R 4 195 000",
  "116479358": "R 1 950 000",  // This property might not be in our list
  "116280871": "R 6 950 000",
  "116220646": "R 1 699 999",
  "116283204": "R 1 950 000",
  "116200162": "R 1 799 999",
  "116216202": "R 1 850 000"
};

const fs = require('fs');
const mockData = fs.readFileSync('src/lib/mockData.ts', 'utf8');

console.log('VERIFYING PRICES FROM LA\'EEQ\'S PROPERTY24 PAGE:\n');
console.log('=' .repeat(50));

let correctCount = 0;
let incorrectCount = 0;

Object.entries(ACTUAL_PRICES).forEach(([id, actualPrice]) => {
  const regex = new RegExp(`"id": "${id}"[\\s\\S]*?"price": "([^"]+)"`);
  const match = mockData.match(regex);

  if (!match) {
    console.log(`❓ Property ${id}: Not found in mockData.ts`);
    return;
  }

  const currentPrice = match[1];
  if (currentPrice === actualPrice) {
    console.log(`✅ Property ${id}: ${actualPrice} (CORRECT)`);
    correctCount++;
  } else {
    console.log(`❌ Property ${id}: Should be ${actualPrice}, but is ${currentPrice}`);
    incorrectCount++;
  }
});

console.log('\n' + '=' .repeat(50));
console.log(`SUMMARY: ${correctCount} correct, ${incorrectCount} incorrect`);

if (incorrectCount === 0) {
  console.log('✅ ALL PRICES ARE CORRECT!');
} else {
  console.log('⚠️  Some prices need to be updated');
}