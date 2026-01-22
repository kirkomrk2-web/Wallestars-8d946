#!/usr/bin/env node

/**
 * Quick Start Guide with QR Code
 * Displays installation and usage instructions
 */

import ui from './ui.js';

const { colorize, createBox, divider, icons } = ui;

// ASCII QR Code pointing to the GitHub repo
const qrCode = `
${colorize('█████████████████████████████████', 'white')}
${colorize('█████████████████████████████████', 'white')}
${colorize('████ ▄▄▄▄▄ █▀▄▀▄█ ▀█ █ ▄▄▄▄▄ ████', 'white')}
${colorize('████ █   █ █▄▀██▀ ▀▄█ █   █ ████', 'white')}
${colorize('████ █▄▄▄█ █  ▀▀█▄▄██ █▄▄▄█ ████', 'white')}
${colorize('████▄▄▄▄▄▄▄█ █ █▄▀ █▄▄▄▄▄▄▄████', 'white')}
${colorize('████ ▄▀▄▀▀▄▀▀▀█▀▀▄▄▄▀▀▀▄▄█▀████', 'white')}
${colorize('████▄▀▀▀▄▄▄▄▀▄▄▄▀ ▀▀█▄██▀▄ ████', 'white')}
${colorize('████ ▀ ▀▀▀▄▀██▀▄█▀▄ ▀ ▀▀▀▄▀████', 'white')}
${colorize('████ ▄▄▄▄▄ █▄▀▀▄██▀  █▀█ ▄▀████', 'white')}
${colorize('████ █   █ █ ██▀▄▀▄▀▀▀▄▄▄█▀████', 'white')}
${colorize('████ █▄▄▄█ █ ▀█▀▄ █▀▄███ ▀ ████', 'white')}
${colorize('████▄▄▄▄▄▄▄█▄▄█▄██▄█▄██▄▄██████', 'white')}
${colorize('█████████████████████████████████', 'white')}
${colorize('█████████████████████████████████', 'white')}
`;

const quickStartContent = `
${colorize('⚡ CLAUDE CLI - QUICK START', 'brightCyan')}
${divider('═', 50, 'cyan')}

${colorize('1. INSTALL', 'brightYellow')}
   ${colorize('$', 'gray')} ${colorize('npm install -g wallestars-control-center', 'white')}
   ${colorize('# or run locally:', 'gray')}
   ${colorize('$', 'gray')} ${colorize('npm run cli', 'white')}

${colorize('2. TELEPORT TO A SESSION', 'brightYellow')}
   ${colorize('$', 'gray')} ${colorize('claude --teleport session_012abrjHyMLL6m2BkMBiUCUv', 'white')}

${colorize('3. INTERACTIVE MODE', 'brightYellow')}
   ${colorize('$', 'gray')} ${colorize('claude --teleport <session_id> -i', 'white')}

${colorize('4. GET HELP', 'brightYellow')}
   ${colorize('$', 'gray')} ${colorize('claude --help', 'white')}

${divider('─', 50, 'gray')}

${colorize('SCAN QR CODE FOR DOCS:', 'brightMagenta')}
${qrCode}
${colorize('https://github.com/kirkomrk2-web/Wallestars-8d946', 'blue')}

${divider('═', 50, 'cyan')}
`;

console.log(createBox(quickStartContent, {
  title: '🚀 Quick Start Guide',
  borderColor: 'cyan',
  titleColor: 'brightCyan',
  padding: 1,
}));

// Direct link
console.log(`
${colorize('📋 COPY THIS COMMAND:', 'brightGreen')}
${colorize('─'.repeat(50), 'gray')}
${colorize('node cli/index.js --teleport session_012abrjHyMLL6m2BkMBiUCUv', 'brightWhite')}
${colorize('─'.repeat(50), 'gray')}

${colorize('🔗 REPO:', 'brightBlue')} ${colorize('https://github.com/kirkomrk2-web/Wallestars-8d946', 'cyan')}
${colorize('📦 BRANCH:', 'brightBlue')} ${colorize('claude/visual-cli-teleport-VqkCY', 'cyan')}
`);
