const fs = require('fs');
const path = require('path');

// Advanced CSV parser that handles multi-line fields and quotes
function parseCSVAdvanced(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i += 2;
      } else if (char === '"') {
        // End of quoted field
        inQuotes = false;
        i++;
      } else {
        currentField += char;
        i++;
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true;
        i++;
      } else if (char === ',') {
        // End of field
        currentRow.push(currentField.trim());
        currentField = '';
        i++;
      } else if (char === '\n' || char === '\r') {
        // End of line
        if (currentField.length > 0 || currentRow.length > 0) {
          currentRow.push(currentField.trim());
          if (currentRow.some(f => f.length > 0)) {
            rows.push(currentRow);
          }
          currentRow = [];
          currentField = '';
        }
        i++;
        if (char === '\r' && nextChar === '\n') i++;
      } else {
        currentField += char;
        i++;
      }
    }
  }

  // Don't forget last field and row
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(f => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Strip HTML tags from description
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Main function
function parseProductsCSV() {
  console.log('Reading products.csv...');
  const csvPath = path.join(__dirname, 'products.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  
  console.log('Parsing CSV...');
  const rows = parseCSVAdvanced(content);
  
  if (rows.length < 2) {
    console.error('CSV file is empty or has no data rows');
    return;
  }

  // Get headers (first row)
  const headers = rows[0].map(h => h.toLowerCase().trim());
  
  // Find column indices
  const colIndex = {
    handle: headers.findIndex(h => h === 'handle'),
    title: headers.findIndex(h => h === 'title'),
    body: headers.findIndex(h => h.includes('body') || h.includes('description')),
    price: headers.findIndex(h => h.includes('variant price') || h === 'price'),
    image: headers.findIndex(h => h.includes('image src') || h === 'image'),
    category: headers.findIndex(h => h.includes('product category') || h.includes('category') || h.includes('type')),
    status: headers.findIndex(h => h === 'status')
  };

  console.log('Detected columns:', {
    handle: colIndex.handle,
    title: colIndex.title,
    body: colIndex.body,
    price: colIndex.price,
    image: colIndex.image,
    category: colIndex.category,
    status: colIndex.status
  });

  const products = [];
  let skipped = 0;
  
  // Process each data row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    if (row.length < 3) {
      skipped++;
      continue;
    }

    const handle = colIndex.handle >= 0 ? row[colIndex.handle] : '';
    const title = colIndex.title >= 0 ? row[colIndex.title] : '';
    const body = colIndex.body >= 0 ? row[colIndex.body] : '';
    const priceStr = colIndex.price >= 0 ? row[colIndex.price] : '0';
    const image = colIndex.image >= 0 ? row[colIndex.image] : '';
    const category = colIndex.category >= 0 ? row[colIndex.category] : '';
    const status = colIndex.status >= 0 ? row[colIndex.status] : 'active';

    if (!handle || !title) {
      skipped++;
      continue;
    }

    // Skip draft products
    if (status.toLowerCase() === 'draft') {
      skipped++;
      continue;
    }

    const price = parseFloat(priceStr) || 0;

    products.push({
      handle,
      title,
      description: stripHtml(body),
      price,
      image,
      category,
      created_at: new Date().toISOString()
    });
  }

  console.log(`\nTotal rows parsed: ${rows.length - 1}`);
  console.log(`Products extracted: ${products.length}`);
  console.log(`Skipped (draft/empty): ${skipped}`);
  
  // Count products with images
  const withImages = products.filter(p => p.image && p.image.trim() !== '');
  console.log(`Products with images: ${withImages.length}`);

  // Extract unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  console.log(`\nUnique categories: ${categories.length}`);
  categories.slice(0, 10).forEach(cat => console.log(`  - ${cat}`));
  if (categories.length > 10) console.log(`  ... and ${categories.length - 10} more`);

  // Create output data structure
  const outputData = {
    categories,
    products
  };

  // Save to JSON file
  const outputPath = path.join(__dirname, 'products-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
  console.log(`\nSaved to: ${outputPath}`);
  
  // Also create a localStorage-compatible version
  const localStorageData = {
    categories,
    products
  };
  
  const localStoragePath = path.join(__dirname, 'localstorage-data.json');
  fs.writeFileSync(localStoragePath, JSON.stringify(localStorageData));
  console.log(`Saved localStorage format to: ${localStoragePath}`);
  
  return { products, categories };
}

// Run the parser
parseProductsCSV();
