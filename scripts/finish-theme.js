const fs = require('fs');
const path = require('path');

const replacements = [
  [/bg-slate-950/g, "bg-primary"],
  [/text-slate-900/g, "text-white"],
  [/text-slate-800/g, "text-slate-200"],
  [/text-slate-700/g, "text-slate-300"],
  [/text-slate-600/g, "text-slate-400"],
  [/text-slate-500/g, "text-slate-500"],
  [/border-slate-200/g, "border-white/10"],
  [/bg-slate-100/g, "bg-white/5"],
  [/bg-secondary/g, "bg-white/5"],
  [/text-sky-100\/70/g, "text-slate-500"],
  [/text-sky-50\/85/g, "text-slate-300"],
  [/bg-white\b(?!\/)/g, "bg-[#0a0a0a]"],
  [/border-white\/5(?!\/)/g, "border-white/10"],
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
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  } catch (e) {}
}

processDirectory(path.join(__dirname, '../components'));
processDirectory(path.join(__dirname, '../app/(dashboard)'));
console.log("Final touch replacement complete!");
