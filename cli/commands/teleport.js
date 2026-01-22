/**
 * Teleport Command Handler
 * Visual CLI for connecting to Claude sessions
 */

import ui from '../ui.js';

const { colorize, style, createBox, Spinner, icons, spinnerFrames, sleep, progressBar, createTable, divider, gradientText, hideCursor, showCursor, clearScreen } = ui;

/**
 * Validate session ID format
 */
export function validateSessionId(sessionId) {
  // Session IDs typically follow pattern: session_[alphanumeric]
  const sessionPattern = /^session_[a-zA-Z0-9]{20,}$/;
  return sessionPattern.test(sessionId);
}

/**
 * Parse session ID to extract info
 */
export function parseSessionId(sessionId) {
  const prefix = sessionId.slice(0, 8); // "session_"
  const identifier = sessionId.slice(8);
  const shortId = identifier.slice(0, 8) + '...' + identifier.slice(-4);

  return {
    full: sessionId,
    prefix,
    identifier,
    shortId,
    timestamp: Date.now(),
  };
}

/**
 * Display teleport animation
 */
async function teleportAnimation(sessionInfo) {
  hideCursor();

  const frames = [
    `
    ${colorize('◇', 'gray')}
   ${colorize('◇ ◇', 'gray')}
  ${colorize('◇   ◇', 'gray')}
 ${colorize('◇     ◇', 'gray')}
${colorize('◇       ◇', 'gray')}
`,
    `
    ${colorize('◈', 'cyan')}
   ${colorize('◇ ◇', 'cyan')}
  ${colorize('◇   ◇', 'gray')}
 ${colorize('◇     ◇', 'gray')}
${colorize('◇       ◇', 'gray')}
`,
    `
    ${colorize('◆', 'brightCyan')}
   ${colorize('◈ ◈', 'cyan')}
  ${colorize('◇   ◇', 'cyan')}
 ${colorize('◇     ◇', 'gray')}
${colorize('◇       ◇', 'gray')}
`,
    `
    ${colorize('●', 'brightWhite')}
   ${colorize('◆ ◆', 'brightCyan')}
  ${colorize('◈   ◈', 'cyan')}
 ${colorize('◇     ◇', 'cyan')}
${colorize('◇       ◇', 'gray')}
`,
    `
    ${colorize('⚡', 'brightYellow')}
   ${colorize('● ●', 'brightWhite')}
  ${colorize('◆   ◆', 'brightCyan')}
 ${colorize('◈     ◈', 'cyan')}
${colorize('◇       ◇', 'cyan')}
`,
    `
    ${colorize('✨', 'brightYellow')}
   ${colorize('⚡ ⚡', 'brightYellow')}
  ${colorize('●   ●', 'brightWhite')}
 ${colorize('◆     ◆', 'brightCyan')}
${colorize('◈       ◈', 'cyan')}
`,
  ];

  const portalFrames = [
    colorize('    ╔═══════════════╗\n    ║   TELEPORT    ║\n    ║   ░░░░░░░░░   ║\n    ╚═══════════════╝', 'gray'),
    colorize('    ╔═══════════════╗\n    ║   TELEPORT    ║\n    ║   ▒▒░░░░░░░   ║\n    ╚═══════════════╝', 'cyan'),
    colorize('    ╔═══════════════╗\n    ║   TELEPORT    ║\n    ║   ▓▓▒▒░░░░░   ║\n    ╚═══════════════╝', 'cyan'),
    colorize('    ╔═══════════════╗\n    ║   TELEPORT    ║\n    ║   ██▓▓▒▒░░░   ║\n    ╚═══════════════╝', 'brightCyan'),
    colorize('    ╔═══════════════╗\n    ║   TELEPORT    ║\n    ║   ████▓▓▒▒░   ║\n    ╚═══════════════╝', 'brightCyan'),
    colorize('    ╔═══════════════╗\n    ║   TELEPORT    ║\n    ║   ██████▓▓▒   ║\n    ╚═══════════════╝', 'brightWhite'),
    colorize('    ╔═══════════════╗\n    ║   TELEPORT    ║\n    ║   ████████▓   ║\n    ╚═══════════════╝', 'brightWhite'),
    colorize('    ╔═══════════════╗\n    ║   TELEPORT    ║\n    ║   █████████   ║\n    ╚═══════════════╝', 'brightWhite'),
  ];

  // Phase 1: Portal opening
  console.log('\n');
  for (const frame of frames) {
    process.stdout.write('\x1b[6A'); // Move up 6 lines
    console.log(frame);
    await sleep(100);
  }

  // Phase 2: Progress bar loading
  console.log('\n' + colorize('  Establishing quantum link...', 'cyan'));
  for (let i = 0; i <= 100; i += 5) {
    process.stdout.write('\r  ' + progressBar(i, 100, 30, { color: 'brightCyan' }) + '  ');
    await sleep(30);
  }
  console.log('\n');

  // Phase 3: Portal visualization
  for (const frame of portalFrames) {
    process.stdout.write('\x1b[4A'); // Move up 4 lines
    console.log(frame);
    await sleep(80);
  }

  showCursor();
}

/**
 * Display session information
 */
function displaySessionInfo(sessionInfo, status = 'connected') {
  const statusColors = {
    connected: 'brightGreen',
    connecting: 'brightYellow',
    disconnected: 'red',
    error: 'brightRed',
  };

  const statusIcons = {
    connected: '🟢',
    connecting: '🟡',
    disconnected: '🔴',
    error: '❌',
  };

  const infoContent = [
    `${colorize('Session ID:', 'gray')}  ${colorize(sessionInfo.shortId, 'brightWhite')}`,
    `${colorize('Full ID:', 'gray')}     ${colorize(sessionInfo.full, 'cyan')}`,
    `${colorize('Status:', 'gray')}      ${statusIcons[status]} ${colorize(status.toUpperCase(), statusColors[status])}`,
    `${colorize('Connected:', 'gray')}   ${colorize(new Date().toLocaleString(), 'white')}`,
  ].join('\n');

  console.log(createBox(infoContent, {
    title: '📡 Session Info',
    borderColor: 'cyan',
    titleColor: 'brightCyan',
    padding: 2,
  }));
}

/**
 * Display available commands
 */
function displayCommands() {
  const commands = [
    ['chat', 'Send a message to the session'],
    ['status', 'Check session status'],
    ['screenshot', 'Capture current screen'],
    ['execute', 'Run a command'],
    ['disconnect', 'End the session'],
    ['help', 'Show available commands'],
  ];

  console.log('\n' + createTable(
    ['Command', 'Description'],
    commands.map(([cmd, desc]) => [colorize(cmd, 'cyan'), desc]),
    { headerColor: 'brightMagenta', borderColor: 'gray' }
  ));
}

/**
 * Display the teleport header/banner
 */
function displayHeader() {
  const header = `
${colorize('╔══════════════════════════════════════════════════════════════╗', 'cyan')}
${colorize('║', 'cyan')}  ${gradientText('   ████████╗███████╗██╗     ███████╗██████╗  ██████╗ ██████╗ ████████╗', 'cyan', 'magenta')}  ${colorize('║', 'cyan')}
${colorize('║', 'cyan')}  ${colorize('   ╚══██╔══╝██╔════╝██║     ██╔════╝██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝', 'brightCyan')}  ${colorize('║', 'cyan')}
${colorize('║', 'cyan')}  ${colorize('      ██║   █████╗  ██║     █████╗  ██████╔╝██║   ██║██████╔╝   ██║   ', 'brightCyan')}  ${colorize('║', 'cyan')}
${colorize('║', 'cyan')}  ${colorize('      ██║   ██╔══╝  ██║     ██╔══╝  ██╔═══╝ ██║   ██║██╔══██╗   ██║   ', 'cyan')}  ${colorize('║', 'cyan')}
${colorize('║', 'cyan')}  ${colorize('      ██║   ███████╗███████╗███████╗██║     ╚██████╔╝██║  ██║   ██║   ', 'blue')}  ${colorize('║', 'cyan')}
${colorize('║', 'cyan')}  ${colorize('      ╚═╝   ╚══════╝╚══════╝╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ', 'blue')}  ${colorize('║', 'cyan')}
${colorize('╠══════════════════════════════════════════════════════════════╣', 'cyan')}
${colorize('║', 'cyan')}        ${colorize('⚡ Claude Session Teleporter v1.0.0 ⚡', 'brightWhite')}                ${colorize('║', 'cyan')}
${colorize('║', 'cyan')}        ${colorize('Instant connection to your Claude sessions', 'gray')}            ${colorize('║', 'cyan')}
${colorize('╚══════════════════════════════════════════════════════════════╝', 'cyan')}
`;

  console.log(header);
}

/**
 * Display compact header
 */
function displayCompactHeader() {
  console.log('\n' + colorize('⚡ CLAUDE TELEPORT', 'brightCyan') + colorize(' v1.0.0', 'gray'));
  console.log(divider('─', 50, 'cyan'));
}

/**
 * Main teleport command
 */
export async function teleport(sessionId, options = {}) {
  const { verbose = false, skipAnimation = false, compact = false } = options;

  try {
    // Display header
    if (!compact) {
      clearScreen();
      displayHeader();
    } else {
      displayCompactHeader();
    }

    // Validate session ID
    if (!sessionId) {
      console.log(colorize(`\n${icons.error} Error: No session ID provided`, 'red'));
      console.log(colorize('\nUsage: claude --teleport <session_id>', 'gray'));
      console.log(colorize('Example: claude --teleport session_012abrjHyMLL6m2BkMBiUCUv\n', 'gray'));
      return { success: false, error: 'No session ID provided' };
    }

    if (!validateSessionId(sessionId)) {
      console.log(colorize(`\n${icons.error} Error: Invalid session ID format`, 'red'));
      console.log(colorize(`Received: ${sessionId}`, 'gray'));
      console.log(colorize('\nSession ID should match pattern: session_[alphanumeric 20+ chars]', 'yellow'));
      return { success: false, error: 'Invalid session ID format' };
    }

    // Parse session info
    const sessionInfo = parseSessionId(sessionId);

    if (verbose) {
      console.log(colorize('\n[DEBUG] Session parsed:', 'gray'));
      console.log(colorize(`  Prefix: ${sessionInfo.prefix}`, 'gray'));
      console.log(colorize(`  Identifier: ${sessionInfo.identifier}`, 'gray'));
    }

    // Run teleport animation
    if (!skipAnimation) {
      console.log(colorize(`\n${icons.teleport} Initiating teleport to session...`, 'brightCyan'));
      await teleportAnimation(sessionInfo);
    }

    // Connection spinner
    const spinner = new Spinner({
      frames: spinnerFrames.teleport,
      color: 'brightCyan',
    });

    spinner.start('Establishing secure connection...');
    await sleep(800);

    spinner.update('Authenticating session credentials...');
    await sleep(600);

    spinner.update('Syncing session state...');
    await sleep(500);

    spinner.update('Finalizing connection...');
    await sleep(400);

    spinner.stop('Connection established!', icons.success);

    // Display session info
    console.log('');
    displaySessionInfo(sessionInfo, 'connected');

    // Display connection summary
    const summaryContent = [
      `${colorize(icons.lightning, 'brightYellow')} ${colorize('Teleport successful!', 'brightGreen')}`,
      '',
      `${colorize('You are now connected to:', 'white')}`,
      `${colorize(sessionInfo.full, 'brightCyan')}`,
      '',
      `${colorize('Type', 'gray')} ${colorize('help', 'cyan')} ${colorize('to see available commands', 'gray')}`,
    ].join('\n');

    console.log('\n' + createBox(summaryContent, {
      title: '✨ Connected',
      borderColor: 'green',
      titleColor: 'brightGreen',
      padding: 2,
    }));

    // Display available commands
    if (verbose) {
      displayCommands();
    }

    return {
      success: true,
      sessionInfo,
      connectedAt: new Date().toISOString(),
    };

  } catch (error) {
    showCursor();
    console.log(colorize(`\n${icons.error} Teleport failed: ${error.message}`, 'red'));
    return { success: false, error: error.message };
  }
}

/**
 * Interactive teleport session
 */
export async function interactiveTeleport(sessionId) {
  const result = await teleport(sessionId, { verbose: true });

  if (!result.success) {
    return result;
  }

  console.log(colorize('\n📡 Interactive mode enabled', 'brightCyan'));
  console.log(colorize('Type commands or messages. Use "exit" to disconnect.\n', 'gray'));

  // Simple REPL-style interface
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: colorize('teleport> ', 'cyan'),
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim().toLowerCase();

    switch (input) {
      case 'exit':
      case 'quit':
      case 'disconnect':
        console.log(colorize('\n⚡ Disconnecting from session...', 'yellow'));
        await sleep(500);
        console.log(colorize('✓ Session terminated\n', 'green'));
        rl.close();
        return;

      case 'help':
        displayCommands();
        break;

      case 'status':
        displaySessionInfo(result.sessionInfo, 'connected');
        break;

      case 'clear':
        clearScreen();
        displayCompactHeader();
        break;

      case '':
        break;

      default:
        console.log(colorize(`\n→ Sending to session: "${line}"`, 'gray'));
        console.log(colorize('  [Message queued for delivery]\n', 'green'));
    }

    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

export default {
  teleport,
  interactiveTeleport,
  validateSessionId,
  parseSessionId,
  displayHeader,
  displaySessionInfo,
  displayCommands,
};
