// One-off image pipeline for the public portfolio.
// Usage: npm i --no-save sharp && node scripts/optimize-images.mjs <source-dir>
// <source-dir> holds the original covers named by project id suffix (e.g. 12.jpg)
// plus a gallery/ folder. Output goes to public/img/ as 16:10 WebP in 3 widths.
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import { join, parse } from 'node:path';

const src = process.argv[2];
if (!src) throw new Error('Pass the source directory');

const SLUGS = {
  '02': 'pastelery-app', '06': 'blast-knights', '07': 'strikesoft-hub', '08': 'nexo',
  '10': 'seiryuko-dojo', '11': 'pastry-api', '12': 'inventory-ocr', '13': 'reimage',
  '14': 'echoarts', '15': 'purrapp-api', '16': 'purrapp-frontend', '17': 'purrapp-docker',
  '18': 'devchronicle-app', '19': 'devchronicle-api', '20': 'devchronicle-docker',
  '21': 'epoca-studio', '22': 'swarmart', '23': 'verbanode-docker', '24': 'verbanode-n8n',
  '25': 'verbanode-app', '26': 'pylens',
};
const WIDTHS = [480, 800, 1200];
const out = 'public/img/projects';
mkdirSync(out, { recursive: true });

async function emit(input, name, { position = 'top' } = {}) {
  for (const w of WIDTHS) {
    await sharp(input)
      .resize(w, Math.round((w * 10) / 16), { fit: 'cover', position })
      .webp({ quality: w > 800 ? 70 : 74, effort: 6 })
      .toFile(join(out, `${name}-${w}.webp`));
  }
}

for (const file of readdirSync(src)) {
  const { name } = parse(file);
  if (SLUGS[name]) await emit(join(src, file), SLUGS[name]);
}
const gallery = join(src, 'gallery');
for (const file of readdirSync(gallery)) {
  await emit(join(gallery, file), `gallery-${parse(file).name}`);
}
console.log('done');
