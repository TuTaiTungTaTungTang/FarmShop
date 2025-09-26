const fs = require('fs');
const path = require('path');

// Hàm đệ quy để tìm tất cả file .js và .jsx
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

// Thay thế import statements
function replaceImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Thay thế @material-ui/core imports
    if (content.includes('@material-ui/core')) {
      content = content.replace(/from\s+["']@material-ui\/core["']/g, 'from "@mui/material"');
      content = content.replace(/import\s+{\s*([^}]+)\s*}\s+from\s+["']@material-ui\/core["']/g, 'import { $1 } from "@mui/material"');
      hasChanges = true;
    }

    // Thay thế @material-ui/data-grid imports
    if (content.includes('@material-ui/data-grid')) {
      content = content.replace(/from\s+["']@material-ui\/data-grid["']/g, 'from "@mui/x-data-grid"');
      content = content.replace(/import\s+{\s*([^}]+)\s*}\s+from\s+["']@material-ui\/data-grid["']/g, 'import { $1 } from "@mui/x-data-grid"');
      hasChanges = true;
    }

    // Thay thế react-lottie imports
    if (content.includes('react-lottie')) {
      content = content.replace(/import\s+Lottie\s+from\s+["']react-lottie["']/g, 'import Lottie from "lottie-react"');
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Chạy script
const srcPath = path.join(__dirname, 'src');
const allFiles = getAllFiles(srcPath);

console.log(`Found ${allFiles.length} files to process...`);
allFiles.forEach(replaceImports);
console.log('Migration complete!');