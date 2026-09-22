const heroRoot = '/assets/hero';

export const packFrames = [
  `${heroRoot}/pack/01-pack-closed.webp`,
  `${heroRoot}/pack/02-pack-open.webp`,
  `${heroRoot}/pack/03-pack-pour.webp`,
];

export const bowlFrames = [
  `${heroRoot}/bowl/01-bowl-empty.webp`,
  `${heroRoot}/bowl/02-bowl-full.webp`,
];

export const catFrames = [
  `${heroRoot}/cat/01-cat-walk.webp`,
  `${heroRoot}/cat/02-cat-walk.webp`,
  `${heroRoot}/cat/03-cat-walk.webp`,
  `${heroRoot}/cat/04-cat-walk.webp`,
  `${heroRoot}/cat/05-cat-approach.webp`,
  `${heroRoot}/cat/06-cat-sniff.webp`,
  `${heroRoot}/cat/07-cat-eating.webp`,
];

export const heroFrames = [...packFrames, ...bowlFrames, ...catFrames];
