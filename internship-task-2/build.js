import fs from "fs";
import path from "path";
import nunjucks from "nunjucks";

const root = process.cwd();
const srcTemplates = path.join(root, "src", "templates");
const srcAssets = path.join(root, "src", "assets");
const distDir = path.join(root, "dist");
const distAssets = path.join(distDir, "assets");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

fs.mkdirSync(distDir, { recursive: true });

nunjucks.configure(srcTemplates, { autoescape: false });

const html = nunjucks.render("index.njk");
fs.writeFileSync(path.join(distDir, "index.html"), html);

if (fs.existsSync(srcAssets)) {
  fs.rmSync(distAssets, { recursive: true, force: true });
  copyDir(srcAssets, distAssets);
}

console.log("✅ Build completed: dist/index.html");