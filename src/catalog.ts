import { ColorLike } from './color.js';
import { ColorScheme } from './colorscheme.js';

/**
 * `colorschemes`
 *
 * An exported dictionary/record of pre-defined colorschemes:
 *
 * ```typescript
 * colorschemes['summer']
 * ```
 */
export const colorschemes: Record<string, ColorScheme> = {};

/**
 * `loadcolorscheme(vname, colors, cat = "", notes = "")`
 *
 * Define a ColorScheme from a symbol/name and an array of colors,
 * and add it to the `colorschemes` dictionary. Optionally
 * specify a category and some notes.
 *
 * ### Example
 * ```typescript
 * loadcolorscheme('flag_nu', [
 *   Color.rgb(0.784, 0.062, 0.18),
 *   Color.rgb(0.003, 0.129, 0.411),
 *   Color.rgb(1.0, 1.0, 1.0),
 *   Color.rgb(0.996, 0.866, 0.0),
 * ], 'flags', 'The flag of Niue');
 * ```
 */
export function loadColorScheme(
  name: string,
  colors: ColorLike[],
  category: string = '',
  notes: string = ''
): ColorScheme {
  if (colorschemes[name]) {
    console.warn(`ColorScheme "${name}" is being overwritten.`);
  }
  const scheme = new ColorScheme(colors, category, notes);
  colorschemes[name] = scheme;
  return scheme;
}

export interface SearchResult {
  name: string;
  scheme: ColorScheme;
  matchedField: 'name' | 'category' | 'notes';
}

/**
 * `findcolorscheme(str, searchNotes = true)`
 *
 * Find all colorschemes matching `query`. `query` is interpreted
 * as a regular expression (case-insensitive).
 *
 * This returns an array of matching search result objects.
 *
 * ### Example
 * ```typescript
 * findcolorscheme('ice');
 * ```
 */
export function findColorScheme(
  query: string | RegExp,
  searchNotes: boolean = true
): SearchResult[] {
  let regex: RegExp;
  if (typeof query === 'string') {
    try {
      regex = new RegExp(query, 'i');
    } catch {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(escaped, 'i');
    }
  } else {
    regex = query;
  }
  const results: SearchResult[] = [];
  const foundNames = new Set<string>();

  for (const [name, scheme] of Object.entries(colorschemes)) {
    if (regex.test(name)) {
      foundNames.add(name);
      results.push({ name, scheme, matchedField: 'name' });
      continue;
    }
    if (scheme.category && regex.test(scheme.category)) {
      foundNames.add(name);
      results.push({ name, scheme, matchedField: 'category' });
      continue;
    }
    if (searchNotes && scheme.notes && regex.test(scheme.notes)) {
      if (!foundNames.has(name)) {
        foundNames.add(name);
        results.push({ name, scheme, matchedField: 'notes' });
      }
    }
  }

  return results;
}

// Oxford Spelling Aliases matching ColorSchemes.jl
export const colourschemes = colorschemes;
export const loadcolourscheme = loadColorScheme;
export const findcolourscheme = findColorScheme;
