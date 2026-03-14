const fs = require('fs');
const path = require('path');

const replacements = [
  [/bg-slate-200\/70/g, "border-white/5"],
  [/bg-white\/70/g, "bg-white/5"],
  [/bg-slate-50\/80/g, "bg-white/5"],
  [/bg-slate-100/g, "bg-white/5 border border-white/5"],
  [/bg-slate-200/g, "bg-white/10"],
  [/bg-white\b/g, "bg-[#0a0a0a]"],
  [/text-slate-500/g, "text-slate-400"],
  [/text-slate-600/g, "text-slate-400"],
  [/text-slate-700/g, "text-slate-300"],
  [/text-slate-800/g, "text-slate-200"],
  [/text-slate-900/g, "text-white"],
  [/text-slate-950/g, "text-white"],
  [/border-slate-[0-9]+\/[0-9]+/g, "border-white/5"],
  [/border-slate-[0-9]+/g, "border-white/10"],
  [/bg-slate-[0-9]+/g, "bg-white/10"],
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
  } catch (e) {
    // Ignore errors for non-existent dirs
  }
}

processDirectory(path.join(__dirname, '../components'));
processDirectory(path.join(__dirname, '../app/(dashboard)'));
console.log("Theme update complete!");
