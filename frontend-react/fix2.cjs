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

    // fix the messed up getAll
    content = content.replace(/\.getAll\(\{\s*page:\s*\{\s*page:\s*([^,]+?),\s*size:\s*([^}]+?)\s*\}\s*\}\)/g, '.getAll({ page: $1, size: $2 })');
    
    // fix the messed up search
    content = content.replace(/\.search\(\{\s*search:\s*\{\s*search:\s*([^,]+?),\s*page:\s*([^,]+?),\s*size:\s*([^}]+?)\s*\}\s*\}\)/g, '.search({ search: $1, page: $2, size: $3 })');

    // Also let's fix the original things that I actually wanted to fix but without regex errors.
    // I need to find .getAll(page, size) exactly
    content = content.replace(/\.getAll\(\s*page\s*,\s*size\s*\)/g, '.getAll({ page, size })');
    content = content.replace(/\.getAll\(\s*0\s*,\s*100\s*\)/g, '.getAll({ page: 0, size: 100 })');
    content = content.replace(/\.search\(\s*search\s*,\s*page\s*,\s*size\s*\)/g, '.search({ search, page, size })');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed syntax:', file);
    }
});
