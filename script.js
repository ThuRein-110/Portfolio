const filterButtons = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
const themeToggle = document.querySelector('.theme-toggle');
const terminalForm = document.querySelector('#terminal-form');
const terminalInput = document.querySelector('#terminal-input');
const terminalOutput = document.querySelector('#terminal-output');
const terminalPrompt = document.querySelector('#terminal-prompt');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    projects.forEach((project) => {
      const categories = project.dataset.category.split(' ');
      project.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

themeToggle.addEventListener('click', () => {
  const isActive = document.body.classList.toggle('high-contrast');
  themeToggle.setAttribute('aria-pressed', String(isActive));
});

document.querySelector('#year').textContent = new Date().getFullYear();

const terminalState = {
  cwd: '~',
  folders: {
    '~': {
      entries: ['about.txt', 'projects/', 'certifications/', 'skills/', 'writing/', 'contact/', 'resume.pdf'],
      text: 'Portfolio home. Use cd <folder> to explore or open resume.'
    },
    '~/projects': {
      entries: ['ai-medical-coding-assistant', 'mfu-election-system', 'suspicious-behavior-detection', 'immigration-management-system', 'cat-dog-ml-classifier'],
      section: '#work',
      text: 'Featured builds: AI workflow tooling, election systems, security analytics, immigration management, and ML classification.'
    },
    '~/certifications': {
      entries: ['CRTOM', 'CRTA', 'C3SA', 'ICTTF', 'L4DC-L5DC', 'CS50x'],
      section: '#proof',
      text: 'Job-relevant credentials. Exact links are attached where public certificate URLs are available.'
    },
    '~/skills': {
      entries: ['cybersecurity', 'development', 'knowledge-sharing', 'python', 'javascript', 'linux', 'networking'],
      section: '#skills',
      text: 'Core stack: cybersecurity, digital forensics, Python, JavaScript, Linux, networking, Git, and web apps.'
    },
    '~/writing': {
      entries: ['2fa-research', 'forensic-document-examination', 'flare-dns-chess', 'tryhackme-walkthroughs'],
      section: '#writing',
      text: 'Security writing, research notes, and practical walkthroughs.'
    },
    '~/contact': {
      entries: ['email', 'linkedin', 'github', 'medium', 'facebook'],
      section: '#contact',
      text: 'Contact: thureinstudent18@gmail.com. Use open contact to jump to the contact section.'
    },
    '~/case-study': {
      entries: ['problem', 'build', 'security-thinking', 'result'],
      section: '#case-study',
      text: 'Case study: AI Medical Coding Assistant, a full-stack AI workflow for reviewable medical coding suggestions.'
    }
  }
};

const folderAliases = {
  home: '~',
  root: '~',
  project: '~/projects',
  projects: '~/projects',
  work: '~/projects',
  certification: '~/certifications',
  certifications: '~/certifications',
  cert: '~/certifications',
  certs: '~/certifications',
  proof: '~/certifications',
  skill: '~/skills',
  skills: '~/skills',
  writing: '~/writing',
  research: '~/writing',
  contact: '~/contact',
  case: '~/case-study',
  'case-study': '~/case-study'
};

const disabledCommands = new Set([
  'mkdir',
  'mmkdir',
  'rmdir',
  'rm',
  'touch',
  'mv',
  'cp',
  'nano',
  'vim',
  'vi',
  'sudo',
  'su',
  'chmod',
  'chown',
  'curl',
  'wget',
  'ssh',
  'scp',
  'git',
  'npm',
  'node',
  'python',
  'python3',
  'brew',
  'kill',
  'ps'
]);

const terminalFiles = {
  'about.txt': 'Thu Rein Oo: cybersecurity student, builder, researcher, and founder of Ech Tit.',
  'readme.md': 'README: ls, cd projects, cd certifications, cd skills, cd writing, cd contact, pwd, cat about.txt, open resume, clear.',
  'resume.pdf': 'Resume path: resume/thu-rein-oo-resume.pdf. Use open resume to download it.'
};

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const terminalPathLabel = () => terminalState.cwd;

const updateTerminalPrompt = () => {
  if (!terminalPrompt) return;
  terminalPrompt.textContent = `thu@portfolio:${terminalPathLabel()}$`;
};

const writeTerminalLine = (html, className = '') => {
  if (!terminalOutput) return;
  const line = document.createElement('p');
  if (className) line.className = className;
  line.innerHTML = html;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const resolveFolder = (target) => {
  const normalized = target.trim().replace(/\/+$/, '').toLowerCase();

  if (!normalized || normalized === '~' || normalized === '/') return '~';
  if (normalized === '.') return terminalState.cwd;
  if (normalized === '..') return '~';
  if (folderAliases[normalized]) return folderAliases[normalized];
  if (folderAliases[normalized.replace(/^\.\//, '')]) return folderAliases[normalized.replace(/^\.\//, '')];

  const absolute = normalized.startsWith('~/') ? normalized : `${terminalState.cwd}/${normalized}`.replace('~/', '~/');
  return terminalState.folders[absolute] ? absolute : null;
};

const scrollToSection = (section) => {
  const target = document.querySelector(section);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const openPortfolioTarget = (target) => {
  const normalized = target.trim().toLowerCase();
  const targets = {
    resume: 'resume/thu-rein-oo-resume.pdf',
    cv: 'resume/thu-rein-oo-resume.pdf',
    github: 'https://github.com/ThuRein-110',
    linkedin: 'https://www.linkedin.com/in/thureinoo2003/',
    medium: 'https://medium.com/@echtit',
    email: 'mailto:thureinstudent18@gmail.com'
  };

  if (targets[normalized]) {
    window.open(targets[normalized], '_blank', 'noopener,noreferrer');
    return `opening ${escapeHtml(normalized)}...`;
  }

  const folder = resolveFolder(normalized);
  if (folder && terminalState.folders[folder].section) {
    scrollToSection(terminalState.folders[folder].section);
    return `jumping to ${escapeHtml(folder)}...`;
  }

  return `open target not found: ${escapeHtml(target || '(empty)')}`;
};

const runTerminalCommand = (rawCommand) => {
  const raw = rawCommand.trim();
  if (!raw) return;

  const [command = '', ...args] = raw.split(/\s+/);
  const lowerCommand = command.toLowerCase();
  const argText = args.join(' ');

  writeTerminalLine(`<span class="prompt">thu@portfolio:${escapeHtml(terminalPathLabel())}$</span> ${escapeHtml(raw)}`);

  if (disabledCommands.has(lowerCommand)) {
    writeTerminalLine(`command disabled: ${escapeHtml(lowerCommand)} is not allowed in this portfolio shell.`, 'terminal-error');
    return;
  }

  if (lowerCommand === 'help') {
    writeTerminalLine('commands: <code>ls</code>, <code>pwd</code>, <code>cd &lt;folder&gt;</code>, <code>cat &lt;file&gt;</code>, <code>open &lt;target&gt;</code>, <code>whoami</code>, <code>clear</code>');
    writeTerminalLine('folders: projects, certifications, skills, writing, contact, case-study');
    writeTerminalLine('disabled: mkdir, rm, sudo, git, npm, ssh, curl, and other real system commands', 'terminal-muted');
    return;
  }

  if (lowerCommand === 'clear') {
    terminalOutput.innerHTML = '';
    return;
  }

  if (lowerCommand === 'pwd') {
    writeTerminalLine(escapeHtml(terminalState.cwd));
    return;
  }

  if (lowerCommand === 'ls') {
    const folder = terminalState.folders[terminalState.cwd];
    writeTerminalLine(folder.entries.map((entry) => `<code>${escapeHtml(entry)}</code>`).join('  '));
    return;
  }

  if (lowerCommand === 'cd') {
    const folder = resolveFolder(argText || '~');
    if (!folder) {
      writeTerminalLine(`no such folder: ${escapeHtml(argText || '(empty)')}`, 'terminal-error');
      return;
    }

    terminalState.cwd = folder;
    updateTerminalPrompt();
    const current = terminalState.folders[folder];
    writeTerminalLine(current.text, 'terminal-success');
    if (current.section) scrollToSection(current.section);
    return;
  }

  if (lowerCommand === 'cat') {
    const fileName = (argText || '').toLowerCase();
    if (terminalFiles[fileName]) {
      writeTerminalLine(escapeHtml(terminalFiles[fileName]));
      return;
    }

    writeTerminalLine(`cannot read ${escapeHtml(argText || '(empty)')}. Try cat about.txt or cat readme.md.`, 'terminal-error');
    return;
  }

  if (lowerCommand === 'open') {
    writeTerminalLine(escapeHtml(openPortfolioTarget(argText)));
    return;
  }

  if (lowerCommand === 'whoami') {
    writeTerminalLine('Thu Rein Oo — cybersecurity student / builder / researcher');
    return;
  }

  if (lowerCommand === 'date') {
    writeTerminalLine(new Date().toLocaleString());
    return;
  }

  writeTerminalLine(`command not found: ${escapeHtml(lowerCommand)}. Type help for available commands.`, 'terminal-error');
};

if (terminalForm && terminalInput && terminalOutput) {
  updateTerminalPrompt();

  terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    runTerminalCommand(terminalInput.value);
    terminalInput.value = '';
  });

  terminalOutput.addEventListener('click', () => terminalInput.focus());
}
