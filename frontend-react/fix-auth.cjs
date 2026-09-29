const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.tsx')) {
            let c = fs.readFileSync(p, 'utf8');
            let r = c.replace(/useAuth\(\)/g, 'useAuth() as any').replace(/useAuth\(\) as any as any/g, 'useAuth() as any');
            if (c !== r) {
                fs.writeFileSync(p, r, 'utf8');
            }
        }
    });
}
walk('src/features');
