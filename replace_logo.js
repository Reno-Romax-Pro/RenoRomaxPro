const fs = require('fs');
const path = require('path');

const directoryPath = process.cwd();

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    
    // Filter out only HTML files
    const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.html');
    
    // Define patterns to replace
    const oldLogoPattern = /https:\/\/res\.cloudinary\.com\/dg27n9d1b\/image\/upload\/v1771568816\/2_jrvdpm\.png/g;
    const oldLogoPostimgPattern = /https:\/\/i\.postimg\.cc\/jjm6Z2RL\/logo\.png/g;
    
    // Pattern to catch the specific <span class="logo-text">Reno-Romax-Pro</span> inside <a href="index.html" class="logo">
    // Some headers use this instead of an image.
    const logoTextPattern = /<a href="index\.html" class="logo">\s*<span class="logo-text">Reno-Romax-Pro<\/span>\s*<\/a>/g;
    const logoImgReplacement = `<a href="index.html" class="logo">
        <img src="logo.jpg" alt="Reno-Romax-Pro Logo" class="logo-img" />
      </a>`;

    htmlFiles.forEach(file => {
        const filePath = path.join(directoryPath, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace Cloudinary logo URL
        content = content.replace(oldLogoPattern, 'logo.jpg');
        
        // Replace Postimg logo URL
        content = content.replace(oldLogoPostimgPattern, 'logo.jpg');

        // Replace text logo with img tag logo where applicable
        content = content.replace(logoTextPattern, logoImgReplacement);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    });
    
    console.log("Completed replacing logo in all HTML files.");
});
