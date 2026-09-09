// 图库批量压缩：最长边限 1600px、mozjpeg q82（tmp+rename，规避 Windows 写盘拦截）
// 用法：npm run optimize:images
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', 'gallery');
const MAX_EDGE = 1600;
const QUALITY = 82;

const files = fs
  .readdirSync(dir)
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort();

if (files.length === 0) {
  console.log('没有可压缩的 JPG 文件。');
  process.exit(0);
}

let savedBytes = 0;
for (const file of files) {
  const src = path.join(dir, file);
  const before = fs.statSync(src).size;
  const tmp = path.join(dir, `.tmp-${file}`);
  await sharp(src)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toFile(tmp);
  const after = fs.statSync(tmp).size;
  fs.renameSync(tmp, src);
  savedBytes += before - after;
  console.log(
    `${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB` +
      (before > after ? ` (-${Math.round(((before - after) / before) * 100)}%)` : ''),
  );
}

console.log(
  `\n完成：${files.length} 张，共节省 ${(savedBytes / 1048576).toFixed(2)} MB，目录总量 ${(
    files.reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0) / 1048576
  ).toFixed(2)} MB。`,
);
