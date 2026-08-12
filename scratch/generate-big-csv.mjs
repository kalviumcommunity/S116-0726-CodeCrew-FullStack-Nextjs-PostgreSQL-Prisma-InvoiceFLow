import fs from 'fs';
import path from 'path';

const NUM_ROWS = 100000;
const filePath = path.resolve('test_data/big_file_100k.csv');

console.log(`Generating ${NUM_ROWS} rows to ${filePath}...`);

const stream = fs.createWriteStream(filePath);
stream.write('Invoice Number,Customer Name,Invoice Date,Total Amount\n');

for (let i = 1; i <= NUM_ROWS; i++) {
  const invoiceNumber = `BIG-INV-${i.toString().padStart(6, '0')}`;
  const customerName = `Customer ${Math.floor(Math.random() * 1000)}`;
  const date = '2025-01-15';
  const amount = (Math.random() * 1000 + 10).toFixed(2);
  
  stream.write(`${invoiceNumber},${customerName},${date},${amount}\n`);
}

stream.end(() => {
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`Done! Created ${sizeMB} MB file.`);
});
