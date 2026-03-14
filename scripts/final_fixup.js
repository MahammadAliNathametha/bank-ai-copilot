const fs = require('fs');
const path = require('path');

const replacements = [
  // 1. Fix hardcoded blue bg-slate-950 in other files
  [/bg-slate-950/g, "bg-primary"],
  
  // 2. Fix stray bg-[#0a0a0a]/5 which might be too dark or looking blue-ish
  [/bg-\[#0a0a0a\]\/5/g, "bg-white/5"],
  [/bg-\[#0a0a0a\]\/10/g, "bg-white/10"],
  
  // 3. Ensure all inputs are dark with orange focus
  [/className="w-full rounded-2xl border border-white\/10 px-4 py-3 text-sm"/g, 'className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"'],
  
  // 4. Fix primary text which should be #FF9900
  [/text-primary/g, "text-primary"], // Just to be sure no regex weirdness
];

function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        processDirectory(fullPath);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let original = content;
        
        for (const [regex, replacement] of replacements) {
          content = content.replace(regex, replacement);
        }
        
        if (content !== original) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Polished ${fullPath}`);
        }
      }
    }
  } catch (e) {}
}

processDirectory(path.join(__dirname, '../components'));
console.log("Final polish complete!");
