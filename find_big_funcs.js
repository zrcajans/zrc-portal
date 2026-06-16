const fs = require('fs');
const lines = fs.readFileSync('src/app/ZRCAppShell.jsx', 'utf8').split('\n');

let currentFunc = null;
let startLine = 0;
let braceCount = 0;
const funcs = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!currentFunc) {
    const match = line.match(/^  const (handle[A-Za-z0-9_]+|render[A-Za-z0-9_]+|save[A-Za-z0-9_]+|delete[A-Za-z0-9_]+|create[A-Za-z0-9_]+|load[A-Za-z0-9_]+) =/);
    if (match) {
      currentFunc = match[1];
      startLine = i;
      braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    }
  } else {
    braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    if (braceCount === 0) {
      funcs.push({ name: currentFunc, lines: i - startLine + 1 });
      currentFunc = null;
    }
  }
}

funcs.sort((a, b) => b.lines - a.lines);
console.log(funcs.slice(0, 30));
