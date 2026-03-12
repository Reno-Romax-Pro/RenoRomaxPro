const fs = require('fs');
const path = require('path');

const directoryPath = process.cwd();

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    
    const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.html');

    // Aggressive pattern for any logo text wrapped in <a> tag with class="logo", possibly over multiple lines.
    const aggressiveLogoRegex = /<a[^>]*class=(["'])logo\1[^>]*>[\s\S]*?(?:<span[^>]*class=(["'])logo-text\2[^>]*>[\s\S]*?<\/span>[\s\S]*?)<\/a>/gi;
    const genericReplacement = `<a href="index.html" class="logo">
        <img src="logo.jpg" alt="Reno-Romax-Pro Logo" class="logo-img" style="width: 48px; height: 48px; border-radius: 0.5rem; object-fit: cover;" />
      </a>`;

    htmlFiles.forEach(file => {
        const filePath = path.join(directoryPath, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Initial match
        const matches = content.match(aggressiveLogoRegex);
        if (matches) {
           console.log(`Found matching text logos in: ${file}`);
        }

        content = content.replace(aggressiveLogoRegex, genericReplacement);
        
        fs.writeFileSync(filePath, content, 'utf8');
    });
    
    console.log("Aggressive replacement pass completed.");
});
