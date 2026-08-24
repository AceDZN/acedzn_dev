import deepmerge from "deepmerge";
import type { Dictionary } from "./index";

export function mergeDictionaries(
  base: Dictionary,
  override: Dictionary,
): Dictionary {
  return deepmerge(base, override);
}

/**
 * Creates a translator function that can traverse nested dictionary objects
 * @param namespace - The dictionary namespace to translate from (e.g., dict.HomePage)
 * @returns A function that takes a key (with dot notation) and returns the translated string
 *
 * @example
 * const t = createTranslator(dict.HomePage)
 * t('hero.card1') // Returns dict.HomePage.hero.card1
 * t('title') // Returns dict.HomePage.title
 */
export function createTranslator(namespace: Dictionary) {
  return (key: string): string => {
    const keys = key.split(".");
    let value: string | Dictionary = namespace;

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };
}
