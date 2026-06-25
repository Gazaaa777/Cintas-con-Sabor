import fs from 'fs';
import path from 'path';

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) {
    console.log(`Source folder does not exist: ${from}`);
    return;
  }
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

console.log("Copying src/assets to dist/src/assets for production build compatibility...");
try {
  copyFolderSync('src/assets', 'dist/src/assets');
  console.log("Assets copied successfully!");
} catch (err) {
  console.error("Error copying assets:", err);
}
