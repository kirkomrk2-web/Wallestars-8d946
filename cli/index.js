#!/usr/bin/env node

/**
 * Claude Visual CLI
 * Main entry point for the command-line interface
 *
 * Usage:
 *   claude --teleport <session_id>     Teleport to a Claude session
 *   claude --teleport <session_id> -i  Interactive mode
 *   claude --help                      Show help
 *   claude --version                   Show version
 */

import ui from './ui.js';
import { teleport, interactiveTeleport } from './commands/teleport.js';

const { colorize, createBox, divider, icons, style } = ui;

const VERSION = '1.0.0';
const PROGRAM_NAME = 'claude';

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const parsed = {
    command: null,
    sessionId: null,
    flags: {
      help: false,
      version: false,
      verbose: false,
      interactive: false,
      compact: false,
      skipAnimation: false,
    },
    raw: args,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--teleport':
      case '-t':
        parsed.command = 'teleport';
        // Next argument should be session ID
        if (args[i + 1] && !args[i + 1].startsWith('-')) {
          parsed.sessionId = args[++i];
        }
        break;

      case '--help':
      case '-h':
        parsed.flags.help = true;
        break;

      case '--version':
      case '-V':
        parsed.flags.version = true;
        break;

      case '--verbose':
      case '-v':
        parsed.flags.verbose = true;
        break;

      case '--interactive':
      case '-i':
        parsed.flags.interactive = true;
        break;

      case '--compact':
      case '-c':
        parsed.flags.compact = true;
        break;

      case '--skip-animation':
      case '-s':
        parsed.flags.skipAnimation = true;
        break;

      default:
        // If it looks like a session ID and we're in teleport mode
        if (parsed.command === 'teleport' && !parsed.sessionId && arg.startsWith('session_')) {
          parsed.sessionId = arg;
        }
    }
  }

  return parsed;
}

/**
 * Display help information
 */
function showHelp() {
  const helpContent = `
${colorize('USAGE', 'brightWhite')}
    ${colorize(PROGRAM_NAME, 'cyan')} ${colorize('<command>', 'yellow')} ${colorize('[options]', 'gray')}

${colorize('COMMANDS', 'brightWhite')}
    ${colorize('--teleport, -t', 'cyan')} ${colorize('<session_id>', 'yellow')}
        Teleport to a Claude session

${colorize('OPTIONS', 'brightWhite')}
    ${colorize('--help, -h', 'green')}          Show this help message
    ${colorize('--version, -V', 'green')}       Show version number
    ${colorize('--verbose, -v', 'green')}       Enable verbose output
    ${colorize('--interactive, -i', 'green')}   Start interactive mode
    ${colorize('--compact, -c', 'green')}       Use compact display
    ${colorize('--skip-animation, -s', 'green')} Skip teleport animation

${colorize('EXAMPLES', 'brightWhite')}
    ${colorize('$', 'gray')} ${colorize('claude --teleport session_012abrjHyMLL6m2BkMBiUCUv', 'white')}
        Connect to a Claude session

    ${colorize('$', 'gray')} ${colorize('claude --teleport session_012abrjHyMLL6m2BkMBiUCUv -i', 'white')}
        Connect in interactive mode

    ${colorize('$', 'gray')} ${colorize('claude -t session_012abrjHyMLL6m2BkMBiUCUv -v -c', 'white')}
        Verbose, compact mode teleport

${colorize('SESSION ID FORMAT', 'brightWhite')}
    Session IDs follow the pattern: ${colorize('session_', 'cyan')}${colorize('<20+ alphanumeric chars>', 'yellow')}
    Example: ${colorize('session_012abrjHyMLL6m2BkMBiUCUv', 'brightCyan')}

${colorize('MORE INFO', 'brightWhite')}
    Documentation: ${colorize('https://github.com/wallestars/claude-cli', 'blue')}
    Report issues: ${colorize('https://github.com/wallestars/claude-cli/issues', 'blue')}
`;

  const header = `
${colorize('╔══════════════════════════════════════════════════════════════╗', 'cyan')}
${colorize('║', 'cyan')}  ${colorize('⚡', 'brightYellow')} ${colorize('CLAUDE CLI', 'brightWhite')} - ${colorize('Visual Command Line Interface', 'gray')}            ${colorize('║', 'cyan')}
${colorize('║', 'cyan')}  ${colorize(`Version ${VERSION}`, 'gray')}                                                ${colorize('║', 'cyan')}
${colorize('╚══════════════════════════════════════════════════════════════╝', 'cyan')}
`;

  console.log(header);
  console.log(helpContent);
}

/**
 * Display version
 */
function showVersion() {
  console.log(`${colorize('Claude CLI', 'brightCyan')} version ${colorize(VERSION, 'brightWhite')}`);
}

/**
 * Display error and usage hint
 */
function showError(message) {
  console.log(colorize(`\n${icons.error} Error: ${message}`, 'red'));
  console.log(colorize(`\nRun '${PROGRAM_NAME} --help' for usage information.\n`, 'gray'));
}

/**
 * Display welcome banner for no command
 */
function showWelcome() {
  const welcomeContent = `
${colorize('⚡', 'brightYellow')} ${colorize('Welcome to Claude CLI!', 'brightWhite')}

${colorize('Quick Start:', 'cyan')}

  ${colorize('Teleport to a session:', 'gray')}
  ${colorize('$', 'gray')} ${colorize(`${PROGRAM_NAME} --teleport session_012abrjHyMLL6m2BkMBiUCUv`, 'white')}

  ${colorize('Interactive mode:', 'gray')}
  ${colorize('$', 'gray')} ${colorize(`${PROGRAM_NAME} --teleport <session_id> -i`, 'white')}

  ${colorize('Show help:', 'gray')}
  ${colorize('$', 'gray')} ${colorize(`${PROGRAM_NAME} --help`, 'white')}
`;

  console.log(createBox(welcomeContent, {
    title: 'Claude CLI v' + VERSION,
    borderColor: 'cyan',
    titleColor: 'brightCyan',
    padding: 1,
  }));
}

/**
 * Main CLI entry point
 */
async function main() {
  // Get command line arguments (skip node and script path)
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  // Handle flags
  if (parsed.flags.version) {
    showVersion();
    process.exit(0);
  }

  if (parsed.flags.help) {
    showHelp();
    process.exit(0);
  }

  // Handle commands
  switch (parsed.command) {
    case 'teleport':
      if (!parsed.sessionId) {
        showError('Session ID is required for teleport command');
        console.log(colorize('Usage: claude --teleport <session_id>', 'gray'));
        console.log(colorize('Example: claude --teleport session_012abrjHyMLL6m2BkMBiUCUv\n', 'gray'));
        process.exit(1);
      }

      if (parsed.flags.interactive) {
        await interactiveTeleport(parsed.sessionId);
      } else {
        const result = await teleport(parsed.sessionId, {
          verbose: parsed.flags.verbose,
          compact: parsed.flags.compact,
          skipAnimation: parsed.flags.skipAnimation,
        });

        if (!result.success) {
          process.exit(1);
        }
      }
      break;

    default:
      // No command provided - show welcome
      if (args.length === 0) {
        showWelcome();
      } else {
        showError(`Unknown command or argument: ${args[0]}`);
        process.exit(1);
      }
  }
}

// Run main function
main().catch((error) => {
  console.error(colorize(`\n${icons.error} Fatal error: ${error.message}`, 'red'));
  if (process.env.DEBUG) {
    console.error(error.stack);
  }
  process.exit(1);
});

export { parseArgs, showHelp, showVersion, showWelcome };
