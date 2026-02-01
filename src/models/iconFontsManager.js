import { globalState, iconFontsUnicode, iconFontsFamily } from '../core/globalState.js'

export class iconFontsManager {
    static async writeIconFontsUnicode() {
        globalState.items.value[1].iconFontsUnicode = iconFontsUnicode.value;
        globalState.items.value[1].iconFontsFamily = iconFontsFamily.value;
        await fileControl.writeConfi(JSON.stringify(globalState.items.value, null, 4));
        return { success: true }
    }

    static async changeIconFontsUnicode(id, unicode) {
        const unicodeDecimal = parseInt(unicode.toUpperCase(), 16);
        iconFontsUnicode.value[id] = String.fromCodePoint(unicodeDecimal);
    }
}