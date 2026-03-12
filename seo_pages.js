const fs = require('fs');

// ===================== CATALOG.HTML =====================
let catalog = fs.readFileSync('./catalog.html', 'utf8');

catalog = catalog.replace(
  /<title>.*?<\/title>/s,
  '<title>Renovation Products Catalog Toronto | Reno-Romax-Pro</title>'
);

catalog = catalog.replace(
  /<meta name="description"[\s\S]*?\/>/,
  '<meta name="description"\n    content="Browse 200+ renovation products for kitchen, bathroom &amp; basement renovations in Toronto. Faucets, fixtures, tiles, cabinets &amp; more — shop the Reno-Romax-Pro catalog." />'
);

// Add keywords meta if missing
if (!catalog.includes('meta name="keywords"')) {
  catalog = catalog.replace(
    /(<meta name="description"[\s\S]*?\/>)/,
    '$1\n  <meta name="keywords" content="renovation products Toronto, kitchen renovation supplies, bathroom fixtures Toronto, basement renovation materials, home renovation catalog Toronto" />'
  );
}

// Add canonical
if (!catalog.includes('rel="canonical"')) {
  catalog = catalog.replace(
    /(<link rel="manifest"[^>]*\/>)/,
    '$1\n  <link rel="canonical" href="https://reno-romax-pro.com/catalog.html" />'
  );
}

// Add BreadcrumbList schema for catalog
const catalogSchema = `
  <!-- Schema.org: BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://reno-romax-pro.com/"},
      {"@type": "ListItem", "position": 2, "name": "Renovation Catalog", "item": "https://reno-romax-pro.com/catalog.html"}
    ]
  }
  </script>
`;

if (!catalog.includes('BreadcrumbList')) {
  catalog = catalog.replace('</head>', catalogSchema + '</head>');
}

fs.writeFileSync('./catalog.html', catalog, 'utf8');
console.log('catalog.html updated!');

// ===================== PRIVACY.HTML =====================
let privacy = fs.readFileSync('./privacy.html', 'utf8');

privacy = privacy.replace(
  /<title>.*?<\/title>/s,
  '<title>Privacy Policy | Reno-Romax-Pro Toronto Renovation Company</title>'
);

privacy = privacy.replace(
  /<meta name="description"[\s\S]*?\/>/,
  '<meta name="description"\n    content="Privacy Policy for Reno-Romax-Pro — Toronto\'s best home renovation company. Learn how we protect your personal information." />'
);

if (!privacy.includes('rel="canonical"')) {
  privacy = privacy.replace(
    /(<link rel="manifest"[^>]*\/>)/,
    '$1\n  <link rel="canonical" href="https://reno-romax-pro.com/privacy.html" />'
  );
}

fs.writeFileSync('./privacy.html', privacy, 'utf8');
console.log('privacy.html updated!');

console.log('All secondary pages updated!');
