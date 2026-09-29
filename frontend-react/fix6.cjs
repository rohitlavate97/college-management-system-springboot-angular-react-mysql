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

    content = content.replace(/\(\{\s*page:\s*([^,]+?),\s*size:\s*([^\}]+?)\s*\}\s*\}/g, '({ page: $1, size: $2 })');
    content = content.replace(/\(\{\s*page,\s*size\s*\}\s*\}/g, '({ page, size })');
    content = content.replace(/\{ search: ([^,]+?), page: ([^,]+?), size: ([^\}]+?) \}\s*\}/g, '{ search: $1, page: $2, size: $3 })');
    
    // Some lines had syntax errors like: .getAll({ page: 0, size: 100 }) }) 
    content = content.replace(/\}\s*\)\s*\}/g, '})');
    
    // Just fix the { search: search, page: page, size: size } } that might have been generated
    content = content.replace(/search: search, page: page, size: size \}\s*\}/g, 'search: search, page: page, size: size })');
    content = content.replace(/\.getAll\(\{\s*page:\s*([^,]+?),\s*size:\s*([^\}]+?)\s*\)\s*\}/g, '.getAll({ page: $1, size: $2 })');
    content = content.replace(/\.search\(\{\s*search:\s*([^,]+?),\s*page:\s*([^,]+?),\s*size:\s*([^\}]+?)\s*\)\s*\}/g, '.search({ search: $1, page: $2, size: $3 })');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed final final:', file);
    }
});
