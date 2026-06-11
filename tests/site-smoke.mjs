import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');
const jsPath = path.join(root, 'script.js');
const portraitPath = path.join(root, 'assets', 'portrait.jpeg');
const resumePath = path.join(root, 'assets', 'resume.docx');

for (const requiredPath of [indexPath, cssPath, jsPath, portraitPath, resumePath]) {
  assert.equal(existsSync(requiredPath), true, `${requiredPath} should exist`);
}

const html = readFileSync(indexPath, 'utf8');
const css = readFileSync(cssPath, 'utf8');
const js = readFileSync(jsPath, 'utf8');

for (const text of [
  '尚常艳',
  '拉晶工艺工程师',
  '天合光能青海晶硅有限公司',
  '青海大学',
  '自动浸泡机',
  '15809782161',
  '1251546884@qq.com',
]) {
  assert.match(html, new RegExp(text), `index.html should contain ${text}`);
}

for (const forbidden of ['前端开发', '前端岗位', '作品集']) {
  assert.equal(html.includes(forbidden), false, `index.html should not contain ${forbidden}`);
}

assert.match(html, /href="assets\/resume\.docx"/, 'resume download link should point to assets/resume.docx');
assert.match(html, /src="assets\/portrait\.jpeg"/, 'portrait should use extracted resume photo');
assert.match(html, /data-copy="(15809782161|1251546884@qq\.com)"/, 'copy buttons should carry copy data');
assert.match(css, /@media\s*\(max-width:\s*720px\)/, 'CSS should include mobile layout rules');
assert.match(js, /IntersectionObserver/, 'JS should reveal sections on scroll');
assert.match(js, /navigator\.clipboard/, 'JS should implement clipboard copy');

assert.ok(statSync(portraitPath).size > 40_000, 'portrait should be the original extracted photo-sized file');
assert.ok(statSync(resumePath).size > 100_000, 'downloadable resume should be the original docx-sized file');
