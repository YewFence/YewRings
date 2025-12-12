/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../content/posts');
const testsDir = path.join(__dirname, '../content/tests');

const action = process.argv[2]; // 'hide' or 'show'

if (!['hide', 'show'].includes(action)) {
  console.log('Usage: node scripts/manage-tests.js [hide|show]');
  console.log('  hide: Move test*.mdx files from content/posts to content/tests');
  console.log('  show: Move test*.mdx files from content/tests to content/posts');
  process.exit(1);
}

// Ensure tests directory exists
if (!fs.existsSync(testsDir)) {
  fs.mkdirSync(testsDir, { recursive: true });
}

if (action === 'hide') {
  // Move test*.mdx from posts to tests
  if (!fs.existsSync(postsDir)) {
    console.error('Error: content/posts directory not found.');
    process.exit(1);
  }

  const files = fs.readdirSync(postsDir);
  let count = 0;
  files.forEach(file => {
    if (file.startsWith('test') && file.endsWith('.mdx')) {
      const srcPath = path.join(postsDir, file);
      const destPath = path.join(testsDir, file);
      try {
        fs.renameSync(srcPath, destPath);
        console.log(`Moved ${file} to content/tests/`);
        count++;
      } catch (err) {
        console.error(`Failed to move ${file}:`, err.message);
      }
    }
  });
  console.log(`Completed: Moved ${count} test files to storage.`);

} else if (action === 'show') {
  // Move test*.mdx from tests to posts
  if (!fs.existsSync(testsDir)) {
    console.log('No tests storage directory found (content/tests). Nothing to restore.');
    process.exit(0);
  }

  const files = fs.readdirSync(testsDir);
  let count = 0;
  files.forEach(file => {
    if (file.startsWith('test') && file.endsWith('.mdx')) {
      const srcPath = path.join(testsDir, file);
      const destPath = path.join(postsDir, file);
      try {
        fs.renameSync(srcPath, destPath);
        console.log(`Restored ${file} to content/posts/`);
        count++;
      } catch (err) {
        console.error(`Failed to move ${file}:`, err.message);
      }
    }
  });
  console.log(`Completed: Restored ${count} test files to posts.`);
}
