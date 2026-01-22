/**
 * Visual CLI UI Utilities
 * Terminal styling, animations, and visual effects
 */

// ANSI Color Codes
export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Bright foreground colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

// Box drawing characters
export const box = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  cross: '┼',
  teeRight: '├',
  teeLeft: '┤',
  teeDown: '┬',
  teeUp: '┴',

  // Double line variants
  doubleTopLeft: '╔',
  doubleTopRight: '╗',
  doubleBottomLeft: '╚',
  doubleBottomRight: '╝',
  doubleHorizontal: '═',
  doubleVertical: '║',
};

// Spinner frames
export const spinnerFrames = {
  dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  line: ['-', '\\', '|', '/'],
  circle: ['◐', '◓', '◑', '◒'],
  bounce: ['⠁', '⠂', '⠄', '⠂'],
  arc: ['◜', '◠', '◝', '◞', '◡', '◟'],
  star: ['✶', '✸', '✹', '✺', '✹', '✷'],
  pulse: ['█', '▓', '▒', '░', '▒', '▓'],
  teleport: ['◈', '◇', '◈', '◆', '●', '◆', '◈', '◇'],
};

// Icons and symbols
export const icons = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
  arrow: '→',
  arrowLeft: '←',
  arrowUp: '↑',
  arrowDown: '↓',
  bullet: '•',
  star: '★',
  lightning: '⚡',
  rocket: '🚀',
  sparkles: '✨',
  link: '🔗',
  lock: '🔒',
  unlock: '🔓',
  key: '🔑',
  globe: '🌐',
  computer: '💻',
  terminal: '🖥️',
  session: '📡',
  connected: '🟢',
  disconnected: '🔴',
  pending: '🟡',
  teleport: '⚡',
};

/**
 * Apply color to text
 */
export function colorize(text, color) {
  return `${colors[color] || ''}${text}${colors.reset}`;
}

/**
 * Apply multiple styles to text
 */
export function style(text, ...styles) {
  const prefix = styles.map(s => colors[s] || '').join('');
  return `${prefix}${text}${colors.reset}`;
}

/**
 * Create a styled box around text
 */
export function createBox(content, options = {}) {
  const {
    title = '',
    padding = 1,
    borderColor = 'cyan',
    titleColor = 'brightCyan',
    width = null,
    style: boxStyle = 'rounded', // 'rounded', 'double', 'single'
  } = options;

  const lines = content.split('\n');
  const contentWidth = width || Math.max(...lines.map(l => stripAnsi(l).length), stripAnsi(title).length) + padding * 2;

  const chars = boxStyle === 'double'
    ? { tl: box.doubleTopLeft, tr: box.doubleTopRight, bl: box.doubleBottomLeft, br: box.doubleBottomRight, h: box.doubleHorizontal, v: box.doubleVertical }
    : { tl: box.topLeft, tr: box.topRight, bl: box.bottomLeft, br: box.bottomRight, h: box.horizontal, v: box.vertical };

  const borderStart = colors[borderColor] || '';
  const borderEnd = colors.reset;

  let result = [];

  // Top border with optional title
  if (title) {
    const titleText = ` ${colorize(title, titleColor)} `;
    const titleLen = stripAnsi(titleText).length;
    const leftPad = Math.floor((contentWidth - titleLen) / 2);
    const rightPad = contentWidth - titleLen - leftPad;
    result.push(`${borderStart}${chars.tl}${chars.h.repeat(leftPad)}${titleText}${borderStart}${chars.h.repeat(rightPad)}${chars.tr}${borderEnd}`);
  } else {
    result.push(`${borderStart}${chars.tl}${chars.h.repeat(contentWidth)}${chars.tr}${borderEnd}`);
  }

  // Content lines
  for (const line of lines) {
    const lineLen = stripAnsi(line).length;
    const rightPad = contentWidth - lineLen - padding;
    result.push(`${borderStart}${chars.v}${borderEnd}${' '.repeat(padding)}${line}${' '.repeat(Math.max(0, rightPad))}${borderStart}${chars.v}${borderEnd}`);
  }

  // Bottom border
  result.push(`${borderStart}${chars.bl}${chars.h.repeat(contentWidth)}${chars.br}${borderEnd}`);

  return result.join('\n');
}

/**
 * Strip ANSI codes from string for length calculation
 */
export function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Spinner class for animated loading indicators
 */
export class Spinner {
  constructor(options = {}) {
    this.frames = options.frames || spinnerFrames.dots;
    this.color = options.color || 'cyan';
    this.text = options.text || 'Loading...';
    this.interval = options.interval || 80;
    this.frameIndex = 0;
    this.timer = null;
    this.stream = process.stderr;
  }

  start(text) {
    if (text) this.text = text;
    this.frameIndex = 0;
    this.render();
    this.timer = setInterval(() => this.render(), this.interval);
    return this;
  }

  render() {
    const frame = this.frames[this.frameIndex];
    this.stream.write(`\r${colorize(frame, this.color)} ${this.text}`);
    this.frameIndex = (this.frameIndex + 1) % this.frames.length;
  }

  update(text) {
    this.text = text;
  }

  stop(finalText, icon = icons.success) {
    clearInterval(this.timer);
    this.stream.write(`\r${colorize(icon, 'green')} ${finalText || this.text}\n`);
  }

  fail(text, icon = icons.error) {
    clearInterval(this.timer);
    this.stream.write(`\r${colorize(icon, 'red')} ${text || this.text}\n`);
  }
}

/**
 * Progress bar
 */
export function progressBar(current, total, width = 40, options = {}) {
  const { filled = '█', empty = '░', color = 'cyan', showPercent = true } = options;
  const percent = Math.round((current / total) * 100);
  const filledWidth = Math.round((current / total) * width);
  const emptyWidth = width - filledWidth;

  let bar = colorize(filled.repeat(filledWidth), color) + colorize(empty.repeat(emptyWidth), 'gray');

  if (showPercent) {
    bar += ` ${colorize(`${percent}%`, 'white')}`;
  }

  return bar;
}

/**
 * Create a table
 */
export function createTable(headers, rows, options = {}) {
  const { headerColor = 'brightCyan', borderColor = 'gray', cellPadding = 1 } = options;

  // Calculate column widths
  const columnWidths = headers.map((h, i) => {
    const headerLen = stripAnsi(String(h)).length;
    const maxRowLen = Math.max(...rows.map(r => stripAnsi(String(r[i] || '')).length));
    return Math.max(headerLen, maxRowLen) + cellPadding * 2;
  });

  const totalWidth = columnWidths.reduce((a, b) => a + b, 0) + columnWidths.length + 1;

  let result = [];

  // Top border
  result.push(colorize(box.topLeft + columnWidths.map(w => box.horizontal.repeat(w)).join(box.teeDown) + box.topRight, borderColor));

  // Header row
  const headerRow = headers.map((h, i) => {
    const text = String(h);
    const padding = columnWidths[i] - stripAnsi(text).length;
    return ' '.repeat(Math.floor(padding / 2)) + colorize(text, headerColor) + ' '.repeat(Math.ceil(padding / 2));
  });
  result.push(colorize(box.vertical, borderColor) + headerRow.join(colorize(box.vertical, borderColor)) + colorize(box.vertical, borderColor));

  // Header separator
  result.push(colorize(box.teeRight + columnWidths.map(w => box.horizontal.repeat(w)).join(box.cross) + box.teeLeft, borderColor));

  // Data rows
  for (const row of rows) {
    const dataRow = row.map((cell, i) => {
      const text = String(cell || '');
      const padding = columnWidths[i] - stripAnsi(text).length;
      return ' '.repeat(cellPadding) + text + ' '.repeat(padding - cellPadding);
    });
    result.push(colorize(box.vertical, borderColor) + dataRow.join(colorize(box.vertical, borderColor)) + colorize(box.vertical, borderColor));
  }

  // Bottom border
  result.push(colorize(box.bottomLeft + columnWidths.map(w => box.horizontal.repeat(w)).join(box.teeUp) + box.bottomRight, borderColor));

  return result.join('\n');
}

/**
 * Center text within a given width
 */
export function centerText(text, width) {
  const textLen = stripAnsi(text).length;
  const padding = Math.max(0, Math.floor((width - textLen) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * Print a divider line
 */
export function divider(char = '─', width = 60, color = 'gray') {
  return colorize(char.repeat(width), color);
}

/**
 * Create ASCII art text
 */
export function banner(text, options = {}) {
  const { color = 'cyan', style: textStyle = 'standard' } = options;

  // Simple ASCII art style
  const chars = {
    'C': ['╔═══╗', '║    ', '║    ', '║    ', '╚═══╝'],
    'L': ['║    ', '║    ', '║    ', '║    ', '╚════'],
    'A': ['╔═══╗', '║   ║', '╠═══╣', '║   ║', '║   ║'],
    'U': ['║   ║', '║   ║', '║   ║', '║   ║', '╚═══╝'],
    'D': ['╔═══╗', '║   ║', '║   ║', '║   ║', '╚═══╝'],
    'E': ['╔════', '║    ', '╠═══ ', '║    ', '╚════'],
    'T': ['═════', '  ║  ', '  ║  ', '  ║  ', '  ║  '],
    'P': ['╔═══╗', '║   ║', '╠═══╝', '║    ', '║    '],
    'O': ['╔═══╗', '║   ║', '║   ║', '║   ║', '╚═══╝'],
    'R': ['╔═══╗', '║   ║', '╠═══╝', '║ ╲  ', '║  ╲ '],
    ' ': ['     ', '     ', '     ', '     ', '     '],
  };

  const lines = ['', '', '', '', ''];
  for (const char of text.toUpperCase()) {
    const charLines = chars[char] || chars[' '];
    for (let i = 0; i < 5; i++) {
      lines[i] += (charLines[i] || '     ') + ' ';
    }
  }

  return lines.map(line => colorize(line, color)).join('\n');
}

/**
 * Sleep utility for animations
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clear the terminal screen
 */
export function clearScreen() {
  process.stdout.write('\x1b[2J\x1b[H');
}

/**
 * Move cursor to position
 */
export function moveCursor(x, y) {
  process.stdout.write(`\x1b[${y};${x}H`);
}

/**
 * Hide cursor
 */
export function hideCursor() {
  process.stdout.write('\x1b[?25l');
}

/**
 * Show cursor
 */
export function showCursor() {
  process.stdout.write('\x1b[?25h');
}

/**
 * Gradient text effect
 */
export function gradientText(text, startColor, endColor) {
  const gradientColors = ['cyan', 'brightCyan', 'brightBlue', 'blue', 'magenta', 'brightMagenta'];
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const colorIndex = Math.floor((i / text.length) * gradientColors.length);
    result += colorize(text[i], gradientColors[colorIndex]);
  }
  return result;
}

export default {
  colors,
  box,
  spinnerFrames,
  icons,
  colorize,
  style,
  createBox,
  stripAnsi,
  Spinner,
  progressBar,
  createTable,
  centerText,
  divider,
  banner,
  sleep,
  clearScreen,
  moveCursor,
  hideCursor,
  showCursor,
  gradientText,
};
