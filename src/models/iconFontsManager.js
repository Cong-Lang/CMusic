import { globalState, iconFontsUnicode, iconFontsFamily } from '../core/globalState.js'
import { fileControl } from './fileManager.js';

export class iconFontsManager {
    static async writeIconFontsUnicode(alertTip) {
        globalState.items.value[1].iconFontsUnicode = iconFontsUnicode.value;
        globalState.items.value[1].iconFontsFamily = iconFontsFamily.value;
        console.log(await fileControl.writeConfi(JSON.stringify(globalState.items.value, null, 4)));
        console.log("iconFontsUnicode 已写入到配置文件")
        if (alertTip == true) {
            alert("需要重启才能生效");
        }
        return { success: true }
    }

    static async changeIconFontsUnicode(id, unicode) {
        iconFontsUnicode.value[id] = unicode;
        console.log(id + '已修改为' + unicode);
    }

    static async readIconFontsUnicode() {
        const Conf = await window.electronAPI.readFile('.cmusic')
        if (Conf.success == true) {
            const data = JSON.parse(Conf.data)
            console.warn(data)
            iconFontsUnicode.value = data[1].iconFontsUnicode
            iconFontsFamily.value = data[1].iconFontsFamily
        } else {
            console.error('readIconFontsUnicode 错误')
            console.error(Conf)
        }
    }
}