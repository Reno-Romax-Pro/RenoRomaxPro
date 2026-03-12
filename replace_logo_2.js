const fs = require('fs');
const path = require('path');

const directoryPath = process.cwd();

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    
    const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.html');
    
    // Pattern to catch <a href="index.html" class="logo">
    // Some headers use this instead of an image.
    const logoTextPattern1 = /<a href="index\.html" class="logo">\s*<span class="logo-text">Reno-Romax-Pro<\/span>\s*<\/a>/g;
    const logoImgReplacement1 = `<a href="index.html" class="logo">
        <img src="logo.jpg" alt="Reno-Romax-Pro Logo" class="logo-img" />
      </a>`;

    // Another variant specifically in catalog.html
    const catalogLogoText = `<a href="index.html" class="logo">
          <span class="logo-text">Reno-Romax-Pro</span>
        </a>`;
    const catalogLogoReplacement = `<a href="index.html" class="logo">
          <img src="logo.jpg" alt="Reno-Romax-Pro Logo" class="logo-img" style="width: 48px; height: 48px; border-radius: 0.5rem; object-fit: cover;" />
        </a>`;

    // And another variant possibly found here:
    // <a href="index.html" class="logo">
    //    <span class="logo-text">Reno-Romax-Pro</span>
    // </a>
    const genericTextRegex = /<a href="index\.html" class="logo">\s*<span class="logo-text">Reno-Romax-Pro<\/span>\s*<\/a>/g;
    
    // Generic replacement
    const genericReplacement = `<a href="index.html" class="logo">
        <img src="logo.jpg" alt="Reno-Romax-Pro Logo" class="logo-img" style="width: 48px; height: 48px; border-radius: 0.5rem; object-fit: cover;" />
      </a>`;

    htmlFiles.forEach(file => {
        const filePath = path.join(directoryPath, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace text logo with img tag logo where applicable
        content = content.replace(genericTextRegex, genericReplacement);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    });
    
    console.log("Completed second pass replacement of text logs to image logos in all HTML files.");
});
