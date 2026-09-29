const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Data\\Projects\\college-management-system-springboot-angular-react-mysql\\frontend-react\\src\\features';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix double sizes
    content = content.replace(/size:\s*size:\s*([^\}]+)/g, 'size: $1');
    content = content.replace(/size:\s*size/g, 'size: size');
    content = content.replace(/page:\s*page:\s*([^\}]+)/g, 'page: $1');
    content = content.replace(/search:\s*search:\s*([^\}]+)/g, 'search: $1');
    
    // Fix { search: search, page: page, size: size } generated improperly
    content = content.replace(/\.getAll\(\{\s*page:\s*\{\s*page/g, '.getAll({ page');
    content = content.replace(/\.search\(\{\s*search:\s*\{\s*search/g, '.search({ search');

    // Fix missing closing brackets for search and getAll
    content = content.replace(/\.getAll\(\{\s*page:\s*([^,]+?),\s*size:\s*([^\}]+?)\s*\)(?!\})/g, '.getAll({ page: $1, size: $2 })');
    content = content.replace(/\.search\(\{\s*search:\s*([^,]+?),\s*page:\s*([^,]+?),\s*size:\s*([^\}]+?)\s*\)(?!\})/g, '.search({ search: $1, page: $2, size: $3 })');
    content = content.replace(/\.getAll\(\{\s*page\s*,\s*size\s*\)(?!\})/g, '.getAll({ page, size })');
    content = content.replace(/\.search\(\{\s*search\s*,\s*page\s*,\s*size\s*\)(?!\})/g, '.search({ search, page, size })');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed syntax again:', file);
    }
});
