import { access, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const assetsDirectory = path.resolve('public/assets');
const quality = 86;
const pngFiles = (await readdir(assetsDirectory)).filter((file) => file.endsWith('.png'));

for (const file of pngFiles) {
  const input = path.join(assetsDirectory, file);
  const output = path.join(assetsDirectory, file.replace(/\.png$/, '.webp'));
  try {
    await access(output);
    continue;
  } catch {}
  const before = (await stat(input)).size;
  await sharp(input, { animated: false })
    .webp({ quality, effort: 6, alphaQuality: 100, smartSubsample: true })
    .toFile(output);
  const after = (await stat(output)).size;
  console.log(`${file}: ${(before / 1024).toFixed(0)} KiB -> ${(after / 1024).toFixed(0)} KiB`);
}
