const fs = require('fs');
const content = fs.readFileSync('/Users/rishibhardwaj/L-ATELIER/index.html', 'utf8');
const scriptMatch = content.match(/<script type="text\/babel" data-type="module">([\s\S]*?)<\/script>/);
if (scriptMatch) {
    fs.writeFileSync('script.js', scriptMatch[1]);
    console.log('Extracted script to script.js');
} else {
    console.log('Could not find script tag');
}
