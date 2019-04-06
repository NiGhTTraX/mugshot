const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const coverageDir = path.join(rootDir, '.nyc_output');
const files = fs.readdirSync(coverageDir);

// Coverage reports from inside the container will have a base path from the
// container so we need to replace it with the correct path from the host.
files.forEach((file: string) => {
  const filePath = path.join(coverageDir, file);
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });

  fs.writeFileSync(
    filePath,
    // Make sure to preserve the trailing separator.
    content.replace(/\/usr\/src\/app/g, rootDir)
  );
});
