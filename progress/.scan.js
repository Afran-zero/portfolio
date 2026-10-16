const y = require('yaml');
const fs = require('fs');

const files = [
  'content/shared/education.yaml',
  'content/shared/skills.yaml',
  'content/shared/certifications.yaml',
  'content/shared/contact.yaml',
  'content/shared/hobbies.yaml',
  'content/shared/languages.yaml',
  'content/industry/experience.yaml',
  'content/industry/projects.yaml',
  'content/industry/client-work.yaml',
  'content/industry/github.yaml',
  'content/academic/research.yaml',
  'content/academic/publications.yaml',
  'content/academic/research-projects.yaml',
  'content/academic/thesis.yaml',
  'content/academic/conferences.yaml',
];

function checkHighlights(node, file) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => {
      if (item && typeof item === 'object') {
        for (const k of Object.keys(item)) {
          if (Array.isArray(item[k])) {
            item[k].forEach((h, j) => {
              if (h && typeof h === 'object') {
                console.log(file + ' > [' + i + '].' + k + '[' + j + '] = object:', JSON.stringify(h));
              }
            });
          }
        }
      }
    });
  }
  if (node && node.groups && Array.isArray(node.groups)) {
    node.groups.forEach((g, gi) => {
      if (g.items) {
        g.items.forEach((it, ii) => {
          if (it && typeof it === 'object') {
            console.log(file + ' > groups[' + gi + '].items[' + ii + '] = object:', JSON.stringify(it));
          }
        });
      }
    });
  }
}

for (const f of files) {
  try {
    const data = y.parse(fs.readFileSync(f, 'utf8'));
    checkHighlights(data, f);
  } catch (e) {
    console.log('PARSE ERROR ' + f + ': ' + e.message);
  }
}
console.log('scan done');