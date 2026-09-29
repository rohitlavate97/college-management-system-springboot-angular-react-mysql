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

    // Fix user.studentId
    content = content.replace(/user\?\.studentId/g, 'user?.userId');
    content = content.replace(/\(user as any\)\?\.studentId/g, 'user?.userId');

    // Fix isLoading -> loading in DataTable ONLY
    // Since we already did this in fix.cjs, wait, I used <DataTable(.*?)isLoading={
    content = content.replace(/<DataTable([^>]*?)isLoading=\{/g, '<DataTable$1loading={');
    
    // Fix notification missing map
    if (file.includes('NotificationList.tsx')) {
        content = content.replace(/notifications\?\.map/g, 'notifications?.content?.map');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed final:', file);
    }
});
