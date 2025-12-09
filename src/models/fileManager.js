import { Howl } from 'howler';
import { objectUtils } from '../utils/object.js';
import { globalState } from '../core/globalState.js';
import { base64Utils } from '../utils/base64.js'

export class musicManager {
    static async open(File1 = null) {
        let File;
        if (File1 == null) {
            // 有确定文件
            File = (await fileControl.openFile())[0]
            console.log(File)
            if (File == null) {
                return;
            }
        } else {
            // 没有确定文件
            File = File1
        }

        globalState.isBigMusic.value = true;
        console.log(File)
        try {
            // 尝试加载音乐
            if (globalState.haveSound.value === true) {
                musicManager.unload()
            }
            globalState.sound = new Howl({
                src: ['file://' + File],
                onloaderror: (id, err) => {
                    console.error('音频加载失败：', err);
                },
                // 播放错误回调
                onplayerror: (id, err) => {
                    console.error('播放失败：', err);
                },
            });
            console.log('尝试加载音乐中');
            globalState.haveSound.value = true;
            // 获取元数据
            let musicMetadata = (await window.metadata.parseFile(File))["common"]
            console.log(musicMetadata)
            globalState.musicName.value[0] = musicMetadata['title'] ?? File.split('/')[File.split('/').length - 1];
            globalState.musicName.value[1] = musicMetadata['artist'] ?? '未知';
            globalState.picture.value = 'data:' + musicMetadata['picture'][0]['format'] + ';base64,' + base64Utils.toBase64(musicMetadata['picture'][0]['data']) ?? "";
            let tempItems = { 'img': globalState.picture.value, 'title': globalState.musicName.value[0], 'author': globalState.musicName.value[1], 'file': File }
            console.error(await globalState.items.value)
            if (objectUtils.isObjectInArray(globalState.items.value[0], tempItems)) {
                globalState.items.value[0].splice(objectUtils.findObjectIndex(globalState.items.value[0], tempItems, 'title'), 1)
            }
            globalState.items.value[0].unshift(tempItems)
            globalState.items.value[1]['version'] = globalState.version.value
            fileControl.writeConfi(JSON.stringify(globalState.items.value, null, 4))
        } catch (err) {
            console.error(err)
            globalState.windowMusicError.value.showDialog();
            globalState.sound.unload();
            globalState.haveSound.value = false;
            globalState.isPlay.value = false;
            globalState.CurrentTime.value = 0;
            globalState.isBigMusic.value = false;
        }
    }

    static play() {
        if (!globalState.sound.playing()) {
            document.title = '播放本地音乐中🎵';
            globalState.sound.play();
            console.log(globalState.isPlay.value)
            globalState.isPlay.value = true
        } else {
            document.title = '未播放音乐';
            globalState.sound.pause();
            console.log(globalState.isPlay.value)
            globalState.isPlay.value = false
        }
    }

    static openUI() {
        globalState.isBigMusic.value = true;
    }

    static openAuto() {
        if (globalState.haveSound.value) {
            musicManager.openUI()
        } else {
            musicManager.open()
        }
    }

    static unload() {
        console.warn('已删除播放歌曲')
        globalState.sound.unload();
        globalState.haveSound.value = false;
        globalState.isPlay.value = false;
        globalState.CurrentTime.value = 0;
    }
};

export class fileControl {
    static async writeConfi(fileText) {
        return await window.electronAPI.writeFile('.cmusic', fileText)
    }

    static openConfi() {
        window.electronAPI.openFile('.cmusic')
    }

    static async openFile() {
        const result = await window.electronAPI.showOpenDialog({
            title: '选择文件',
            properties: ['openFile'], // 允许选择文件
            filters: [
                { name: 'Music', extensions: ['mp3'] },
                { name: 'All Files', extensions: ['*'] }]
        });
        if (result.filePaths.length > 0) {
            console.log('选中的文件:', result.filePaths);
            return result.filePaths
        } else {
            return [null]
        }
    }

    async readDirFiles(path) {
        return (await window.electronAPI.readDirFiles(path))
    }
};