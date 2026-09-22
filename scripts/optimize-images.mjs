import { access, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceDirectory = path.resolve('.asset-staging/noira_assets_renamed_for_codex');
const outputDirectory = path.resolve('public/assets/hero');
const quality = 83;
const frames = [
  ['01_pack/01_pack_closed.png', 'pack/01-pack-closed.webp', 1100],
  ['01_pack/02_pack_open.png', 'pack/02-pack-open.webp', 1100],
  ['01_pack/03_pack_pour.png', 'pack/03-pack-pour.webp', 1100],
  ['02_bowl/01_bowl_empty.png', 'bowl/01-bowl-empty.webp', 850],
  ['02_bowl/01_bowl_full.png', 'bowl/02-bowl-full.webp', 850],
  ['03_cat_sequence/01_cat_walk_side.png', 'cat/01-cat-walk.webp', 1100],
  ['03_cat_sequence/02_cat_walk_side.png', 'cat/02-cat-walk.webp', 1100],
  ['03_cat_sequence/03_cat_walk_side.png', 'cat/03-cat-walk.webp', 1100],
  ['03_cat_sequence/04_cat_walk_side.png', 'cat/04-cat-walk.webp', 1100],
  ['03_cat_sequence/05_cat_approach_side.png', 'cat/05-cat-approach.webp', 1100],
  ['03_cat_sequence/06_cat_sniff_side.png', 'cat/06-cat-sniff.webp', 1100],
  ['03_cat_sequence/07_cat_eating_bowl.png', 'cat/07-cat-eating.webp', 1100],
];

for (const [source, destination, maxSize] of frames) {
  const input = path.join(sourceDirectory, source);
  const output = path.join(outputDirectory, destination);
  await mkdir(path.dirname(output), { recursive: true });
  try {
    await access(output);
    continue;
  } catch {}
  const before = (await stat(input)).size;
  await sharp(input, { animated: false })
    .resize({ width: maxSize, height: maxSize, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, effort: 6, alphaQuality: 100, smartSubsample: true })
    .toFile(output);
  const after = (await stat(output)).size;
  console.log(`${destination}: ${(before / 1024).toFixed(0)} KiB -> ${(after / 1024).toFixed(0)} KiB`);
}
