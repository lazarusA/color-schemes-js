import { loadColorScheme } from '../catalog.js';
import { Color } from '../color.js';

export const catppuccin_mocha = loadColorScheme(
  'catppuccin_mocha',
  [
    Color.fromHex('#f5e0dc'), // Rosewater
    Color.fromHex('#f2cdcd'), // Flamingo
    Color.fromHex('#f5c2e7'), // Pink
    Color.fromHex('#cba6f7'), // Mauve
    Color.fromHex('#f38ba8'), // Red
    Color.fromHex('#fab387'), // Peach
    Color.fromHex('#f9e2af'), // Yellow
    Color.fromHex('#a6e3a1'), // Green
    Color.fromHex('#94e2d5'), // Teal
    Color.fromHex('#89dceb'), // Sky
    Color.fromHex('#74c7ec'), // Sapphire
    Color.fromHex('#89b4fa'), // Blue
    Color.fromHex('#b4befe'), // Lavender
  ],
  'catppuccin',
  'Catppuccin Mocha theme palette'
);

export const catppuccin_latte = loadColorScheme(
  'catppuccin_latte',
  [
    Color.fromHex('#dc8a78'), // Rosewater
    Color.fromHex('#dd7878'), // Flamingo
    Color.fromHex('#ea76cb'), // Pink
    Color.fromHex('#8839ef'), // Mauve
    Color.fromHex('#d20f39'), // Red
    Color.fromHex('#e64553'), // Maroon
    Color.fromHex('#fe640b'), // Peach
    Color.fromHex('#df8e1d'), // Yellow
    Color.fromHex('#40a02b'), // Green
    Color.fromHex('#179299'), // Teal
    Color.fromHex('#04a5e5'), // Sky
    Color.fromHex('#209fb5'), // Sapphire
    Color.fromHex('#1e66f5'), // Blue
    Color.fromHex('#7287fd'), // Lavender
  ],
  'catppuccin',
  'Catppuccin Latte light theme palette'
);
