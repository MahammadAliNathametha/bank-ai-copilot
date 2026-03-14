const fs = require('fs');
const path = require('path');

const replacements = [
  // 1. Force all form inputs to dark theme
  [/className=(?:"|`|')w-full rounded-2xl border border-white\/10 px-4 py-3 text-sm(?:"|`|')/g, 'className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"'],
  [/className=(?:"|`|')w-full rounded-2xl border border-white\/10 bg-\[#0a0a0a\] px-4 py-3 text-sm(?:"|`|')/g, 'className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"'],
  
  // 2. Fix the blue-to-orange gradient logic in button.tsx (handled manually earlier but let's be sure about global usage)
  
  // 3. Ensure any stray bg-white is #0a0a0a
  [/bg-white\b(?!\/|\]|(?:\s*\{))/g, "bg-[#0a0a0a]"],
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
          console.log(`Deep cleaned ${fullPath}`);
        }
      }
    }
  } catch (e) {}
}

processDirectory(path.join(__dirname, '../components'));
console.log("Deep cleaning complete!");
