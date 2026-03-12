// Create a minimal favicon.ico from a 16x16 and 32x32 BMP embedded in ICO format
const fs = require('fs');

function createBMP(size) {
    const pixels = [];
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    for (let y = size - 1; y >= 0; y--) {
        for (let x = 0; x < size; x++) {
            const dx = x - cx + 0.5;
            const dy = y - cy + 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= r) {
                const nx = (x - cx) / r;
                const ny = (y - cy) / r;
                const isR = isPartOfR(nx, ny);

                if (isR) {
                    pixels.push(70, 58, 37, 255); // BGRA - dark teal #253a46
                } else {
                    pixels.push(0, 140, 255, 255); // BGRA - orange #FF8C00
                }
            } else {
                pixels.push(0, 0, 0, 0);
            }
        }
    }

    return Buffer.from(pixels);
}

function isPartOfR(nx, ny) {
    const letterLeft = -0.35;
    const letterRight = 0.35;
    const letterTop = -0.55;
    const letterBottom = 0.55;

    if (nx >= letterLeft && nx <= letterLeft + 0.18 && ny >= letterTop && ny <= letterBottom) return true;
    if (nx >= letterLeft && nx <= letterRight && ny >= letterTop && ny <= letterTop + 0.15) return true;
    if (nx >= letterLeft && nx <= letterRight - 0.05 && ny >= -0.05 && ny <= 0.1) return true;
    if (nx >= letterRight - 0.18 && nx <= letterRight && ny >= letterTop && ny <= 0.1) return true;

    const diagStart = 0.05;
    const diagNx = letterLeft + 0.18 + (ny - diagStart) * 0.4;
    if (ny >= diagStart && ny <= letterBottom && nx >= diagNx && nx <= diagNx + 0.18) return true;

    return false;
}

function createICO(sizes) {
    const images = sizes.map(size => {
        const pixelData = createBMP(size);
        const bmpHeaderSize = 40;
        const bmpHeader = Buffer.alloc(bmpHeaderSize);
        bmpHeader.writeUInt32LE(bmpHeaderSize, 0);
        bmpHeader.writeInt32LE(size, 4);
        bmpHeader.writeInt32LE(size * 2, 8);
        bmpHeader.writeUInt16LE(1, 12);
        bmpHeader.writeUInt16LE(32, 14);
        bmpHeader.writeUInt32LE(0, 16);
        bmpHeader.writeUInt32LE(pixelData.length, 20);
        return { size, data: Buffer.concat([bmpHeader, pixelData]) };
    });

    const headerSize = 6;
    const dirEntrySize = 16;
    const header = Buffer.alloc(headerSize);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(images.length, 4);

    let dataOffset = headerSize + dirEntrySize * images.length;
    const dirEntries = images.map(img => {
        const entry = Buffer.alloc(dirEntrySize);
        entry.writeUInt8(img.size < 256 ? img.size : 0, 0);
        entry.writeUInt8(img.size < 256 ? img.size : 0, 1);
        entry.writeUInt8(0, 2);
        entry.writeUInt8(0, 3);
        entry.writeUInt16LE(1, 4);
        entry.writeUInt16LE(32, 6);
        entry.writeUInt32LE(img.data.length, 8);
        entry.writeUInt32LE(dataOffset, 12);
        dataOffset += img.data.length;
        return entry;
    });

    return Buffer.concat([header, ...dirEntries, ...images.map(img => img.data)]);
}

const ico = createICO([16, 32]);
fs.writeFileSync('./favicon.ico', ico);
console.log('favicon.ico created successfully! Size:', ico.length, 'bytes');
