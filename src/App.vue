<template>
    <div class="titlebar">
        <div class="titlebar-button-left" id="titlebar-back" @click="handleback" v-if="isBigMusic === true">
            <i class="ms-icon icon-back titlebar-icon"></i>
        </div>
        <p class="titlebar-text" :class="String(isBigMusic)">CMusic</p>
        <div style="display: flex;position: fixed;right: 0px;">
            <div class="titlebar-button" id="titlebar-minimize" @click="handleMinimize">
                <i class="ms-icon icon-minimize titlebar-icon"></i>
            </div>
            <div class="titlebar-button" id="titlebar-maximize" @click='handleMaximize' v-if="isFull === false">
                <i class="ms-icon icon-maximize titlebar-icon" v-if="isMaximized === false"></i>
                <i class="ms-icon icon-restore titlebar-icon" v-if="isMaximized === true"></i>
            </div>
            <div class="titlebar-button" id="titlebar-maximize" @click='FullScreen()' v-if="isFull === true">
                <i class="ms-icon icon-back-to-window titlebar-icon"></i>
            </div>
            <div class="titlebar-button" id="titlebar-close" @click="handleClose">
                <i class="ms-icon icon-close titlebar-icon"></i>
            </div>
        </div>
    </div>
    <TransitionGroup>
        <wintopappbar style="top:36px" :items="[{ 'name': '最近' }, { 'name': '我的库' }]" :rightMenu="[{ 'name': '设置' }]"
            @update="nextPage" v-if="isBigMusic === false" />
        <Transition v-if="isBigMusic === false">
            <div class="container-1">
                <main class="container-2" v-if="page === 0">
                    <div class="showcase">
                        <p style="height: 32px;width: 100%;margin: 0;"></p>
                        <h1 style="margin:0 ;color: #FFF;text-align: center;">最近</h1>
                    </div>
                    <p style="text-align: center;" v-if="items.length == 0">这里还很冷清</p>
                    <div class="cards">
                        <wincard style="width: 200px;" v-for="(item, idx) in items" :key="idx"
                            @click="openSound(item.file)">
                            <img style="width: 100%;height: 200px;margin: 0;background-size:cover" alt=""
                                :src="item.img"></img>
                            <p style="box-sizing:border-box;padding: 12px 0 0 12px;margin: 0;">{{ item.title }}</p>
                            <p style="font-size: small;padding: 4px 0 0 12px;margin: 0;">{{ item.author }}</p>
                        </wincard>
                    </div>
                    <div style="height: 80px;"></div>
                </main>
                <main class="settings-2" v-if="page === 1">
                    <p>在线服务</p>
                    <wincombobox title="无" :items="[{ name: '无' }, { name: '网易云音乐' }]" />
                </main>
                <main class="container-3" v-if="page === 2">
                    <div class="showcase">
                        <p style="height: 32px;width: 100%;margin: 0;"></p>
                        <h1 style="margin:0 ;color: #FFF;text-align: center;">我的库</h1>
                    </div>
                    <wininputbox placeholder="从 我的库 搜索......" style="margin: auto;display: block;"
                        @change="searchMusic" />
                    <p style="text-align: center;">{{ searchError }}</p>
                    <div class="cards" v-for="(item, idx) in searchItems" :key="idx">
                        <wincard style="width: 200px;">
                            <img style="width: 100%;height: 200px;margin: 0;background-size:cover" alt=""
                                :src="item.img"></img>
                            <p style="box-sizing:border-box;padding: 12px 0 0 12px;margin: 0;">{{ item.title }}</p>
                            <p style="font-size: small;padding: 4px 0 0 12px;margin: 0;">{{ item.author }}</p>
                        </wincard>
                    </div>
                </main>
            </div>
        </Transition>
        <div class="playing" v-if="isBigMusic === false" @dragover.prevent @drop.prevent="handleDrop">
            <div class="playing-info" @click="openSoundAuto()">
                <img v-bind:src="picture">
                <div style="height: 50px;">
                    <template v-if="haveSound === true">
                        <p class="playing-name" v-html="musicName[0]"></p>
                        <p class="playing-author" v-html="musicName[1]"></p>
                    </template>
                    <template v-if="haveSound === false">
                        <p class="playing-name">暂无播放音乐</p>
                        <p class="playing-author">暂无播放音乐</p>
                    </template>
                </div>
            </div>
            <div style="margin-left: auto;height: 100%;">
                <winbutton style="height: 100%;background-color: transparent;width: 75px;" @click="playSound()">
                    <i class="ms-icon icon-play playing-start" v-if="isPlay === false"></i>
                    <i class="ms-icon icon-pause playing-start" v-if="isPlay === true"></i>
                </winbutton>
                <winbutton style="height: 100%;background-color: transparent;width: 75px;" @click="openSound()">
                    <i class="ms-icon icon-upload playing-start"></i>
                </winbutton>
            </div>
            <div
                style="z-index: -1;backdrop-filter: blur(15px);background-color: transparent;position:absolute;height: 100%;width: 100%;display: block;">
            </div>
            <img class="playing-img" v-bind:src="picture">
        </div>
        <div class="big-music" v-if="isBigMusic === true">
            <img style="opacity:0.5;position: fixed;height: 120%;width: 120%;filter:blur(10px);top:-50px;left: -10px;object-fit: cover;"
                v-bind:src="picture">
            <div class="big-music-title">
                <p class="playing-name-big" v-html="musicName[0]"></p>
                <p class="playing-author-big" v-html="musicName[1]"></p>
            </div>
            <div class="big-music-range">
                <winrange type="range" style="width: 100%;" color="#FFF" :max="100" v-model='CurrentTime'
                    @input="updateSound($event.target.value)" step="0.01"></winrange>
            </div>
            <div class="big-music-control">
                <div class="big-music-control-left">
                    <winbutton style="height: 100%;background-color: transparent;width: 50px;padding: 0;"
                        @click="playSound();">
                        <i class="ms-icon icon-play playing-start-big" v-if="isPlay === false"></i>
                        <i class="ms-icon icon-pause playing-start-big" v-if="isPlay === true"></i>
                    </winbutton>
                </div>
                <div class="big-music-control-right">
                    <winbutton style="height: 100%;background-color: transparent;width: 50px;padding: 0;"
                        @click="FullScreen()">
                        <i class="ms-icon icon-full-screen playing-start-big" v-if="isFull === false"></i>
                        <i class="ms-icon icon-back-to-window playing-start-big" v-if="isFull === true"></i>
                    </winbutton>
                </div>
            </div>
        </div>
    </TransitionGroup>
</template>

<script setup>
import './assets/fonts/fonts.css';
import 'web-win-vue/web-win-vue.css'

import { wintopappbar, wincard, wincombobox, wininputbox, winbutton, winrange } from 'web-win-vue'
import { ref, TransitionGroup, onMounted, onBeforeUnmount } from 'vue'
import { Howl, Howler } from 'howler';
import { parseFile } from 'music-metadata';

console.log('👋 This message is being logged by "App.vue", included via Vite');


let page = ref(0);
let items = ref([])
let itemsNotFile = ref([])
let searchError = ref('')
let isPlay = ref(false)
let isMaximized = ref(false)
let isBigMusic = ref(false)
let CurrentTime = ref(0)
let haveSound = ref(false)
let musicName = ref(['', '', ''])
let picture = ref('')
let isFull = ref(false)


function FullScreen() {
    windowControls.fullscreen()
    isFull.value = !isFull.value
}

function nextPage(date) {
    searchError.value = '';
    if (date[1] === 'right' && date[0] === 0) {
        page.value = 1
    } else if (date[1] === 'left' && date[0] === 1) {
        page.value = 2
    } else {
        page.value = 0
    };
};
function searchMusic(content) {
    searchError.value = 'Error: 请设置在线服务';
}

const handleMinimize = () => {
    window.windowControls.minimize()
}

const handleback = () => {
    isBigMusic.value = false
}

const handleMaximize = () => {
    window.windowControls.toggleMaximize()
    isMaximized.value = !isMaximized.value
}


const handleClose = () => {
    window.windowControls.close()
}

let musicFile = ''

async function openFile(params) {
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
let sound;
function openSoundAuto() {
    if (haveSound.value) {
        openSoundUI()
    } else {
        openSound()
    }
}
function openSoundUI() {
    isBigMusic.value = true;
    setInterval(() => {
        updateWidth();
    }, 300);

    function updateWidth() {
        if (sound.playing()) {
            CurrentTime.value = (sound.seek() / sound.duration()) * 100
            let width = (sound.seek() / sound.duration()) * 100;
        }
    }
}
async function openSound(File1 = null) {
    let File;
    if (File1 == null) {
        File = (await openFile())[0]
        console.log(File)
        if (File == null) {
            return;
        }
        if (haveSound.value) {
            sound.unload();
            haveSound.value = false;
            isPlay.value = false
        }
    } else {
        File = File1
        if (haveSound.value) {
            sound.unload();
            haveSound.value = false;
            isPlay.value = false
        }
    }
    isBigMusic.value = true;
    console.log(File)
    if (!haveSound.value) {
        sound = new Howl({
            src: ['file://' + File],
            onloaderror: (id, err) => {
                console.error('音频加载失败：', err);
                // 常见错误："Failed to load media" 通常是路径无效或权限问题
            },
            // 播放错误回调
            onplayerror: (id, err) => {
                console.error('播放失败：', err);
            },
        });
        haveSound.value = true;
        let musicMetadata = (await metadata.parseFile(File))["common"]
        console.log(musicMetadata)
        if (musicMetadata.hasOwnProperty('album')) {
            musicName.value[0] = musicMetadata['album'];
        } else {
            musicName.value[0] = File.split('/')[File.split('/').length - 1];
        }
        if (musicMetadata.hasOwnProperty('albumartist')) {
            musicName.value[1] = musicMetadata['albumartist'];
        } else {
            musicName.value[1] = '未知';
        }
        if (musicMetadata.hasOwnProperty('picture')) {
            let picblob = new Blob([musicMetadata['picture'][0]['data']], { type: musicMetadata['picture'][0]['format'] })
            picture.value = URL.createObjectURL(picblob);
        } else {
            picture.value = "https://ts1.tc.mm.bing.net/th/id/OIP-C.-fHsAekl5M3EtL1t4RZV1AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3";
            //author.value = '未知';
        }
        let tempItemsNotFile = { 'title': musicName.value[0], 'author': musicName.value[1] }
        let tempItems = { 'img': picture.value, 'title': musicName.value[0], 'author': musicName.value[1], 'file': File }

        if (itemsNotFile.value.includes(JSON.stringify(tempItemsNotFile))) {
            items.value.splice(itemsNotFile.value.indexOf(JSON.stringify(tempItemsNotFile)), 1)
            itemsNotFile.value.splice(itemsNotFile.value.indexOf(JSON.stringify(tempItemsNotFile)), 1)
            console.log("没意思1")
        }
        items.value.unshift(tempItems)
        itemsNotFile.value.unshift(JSON.stringify(tempItemsNotFile))
        console.log('有意思')
        console.log(itemsNotFile.value)
        console.log(!itemsNotFile.value.includes(tempItemsNotFile))
    }
}
setInterval(() => {
    tabPlayIcon();
}, 300);


function tabPlayIcon() {
    if (haveSound.value) {
        sound.on('end', () => {
            isPlay.value = false
        });
    }
}

function updateSound(time) {
    console.log(time)
    if (time >= 100) {
        isPlay.value = false
    }
    sound.seek(time / 100 * sound.duration())
}

function playSound() {
    if (!sound.playing()) {
        document.title = '播放本地音乐中🎵';
        sound.play();
        isPlay.value = true
    } else {
        document.title = '未播放音乐';
        sound.pause();
        isPlay.value = false
    }
}

console.log(CurrentTime.value)

const handleKeydown = (e) => {
    if (e.keyCode === 32 || e.key === ' ') {
        if (haveSound) {
            playSound()
        }
    } else if (e.keyCode === 39 || e.key === 'ArrowRight') {
        if ((sound.seek() + 2.5) <= sound.duration()) {
            sound.seek(sound.seek() + 2.5);
            CurrentTime.value = (sound.seek() / sound.duration()) * 100;
        } else {
            sound.seek(sound.duration());
            CurrentTime.value = 100;
        }
    } else if (e.keyCode === 37 || e.key === 'ArrowLeft') {
        if ((sound.seek() - 2.5) >= 0) {
            sound.seek(sound.seek() - 2.5);
            CurrentTime.value = (sound.seek() / sound.duration()) * 100;
        } else {
            sound.seek(0);
            CurrentTime.value = 0;
        }
    }
};

async function readFile() {
    console.log(await electronAPI.readFile('/home/hhcl233/下载/1111.txt'))
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown);
});

</script>

<style lang="css" scoped>
.big-music-control-left {
    display: flex;
    flex: 2;
}

.big-music-control-right {
    display: flex;
    flex: 1;
    justify-content: flex-end;
}

.playing-name-big {
    font-size: 32px;
    color: #ffffff;
    margin: 0;
}

.big-music-title {
    position: fixed;
    bottom: 150px;
    width: calc(100% - 50px);
    padding: 32px;
}

.playing-author-big {
    font-size: 16px;
    margin: 8px 0 0 0;
    color: #ffffffb5;
}

.big-music-range {
    position: fixed;
    bottom: 100px;
    width: calc(100% - 50px);
    padding: 25px;
}

.playing-start-big {
    color: white;
    font-size: 24px !important;
}

.big-music-control {
    height: 50px;
    display: flex;
    gap: 8px;
    position: fixed;
    bottom: 50px;
    padding: 20px 20px 20px 20px;
    width: calc(100% - 40px);
}

#titlebar-back {
    background-color: #0377d7;
    color: #ffffff;
}

#titlebar-back:hover {
    background-color: #0269bd;
    color: #ffffff;
}

.big-music {
    height: 100%;
    width: 100%;
    background-color: #000000;
    backdrop-filter: blur(10px);
    height: 100%;
    position: fixed;
    top: 0
}

.icon-back-to-window::before {
    content: "\E73F";
}


.icon-full-screen::before {
    content: "\E740";
}

.icon-pause::before {
    content: "\EDB4";
}

.icon-upload::before {
    content: "\E898";
}

.icon-play::before {
    content: "\EDB5";
}

.icon-minimize::before {
    content: "\E921";
}

.icon-back::before {
    content: "\E830";
}

.icon-maximize::before {
    content: "\E922";
}

.icon-close::before {
    content: "\E8BB";
}

.icon-restore::before {
    content: "\E923";
}

.ms-icon {
    font-family: 'SegMDL2' !important;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.titlebar-icon {
    font-size: x-small;
}

.playing-img {
    object-fit: cover;
    opacity: 0.75;
    background-color: #0378d7;
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: -2;
    border: none;
}

.playing {
    height: 75px;
    position: fixed;
    z-index: 999;
    bottom: 0;
    background-color: transparent;
    width: calc(100% - 24px);
    /*padding: 12px 12px 12px 12px;*/
    display: flex;
    gap: 8px;
    width: 100%;
    align-items: center;
    border: none;
}

.playing-info img {
    background-color: rgb(235, 235, 235);
    height: 75px;
    width: 75px;
    background-size: cover;
    border: none;
}

.playing-info:hover {
    background-color: rgba(0, 0, 0, 0.15);
}

.playing-info {
    padding: 0 16px 0 0px;
    display: flex;
    border: none;
    align-items: center
}

.playing-name {
    font-size: large;
    margin: 0;
}

.playing-info {
    display: flex;
    gap: 8px;
}

.playing-start {
    font-size: 28px;
}

.playing-author {
    margin: 2px 0 0 0;
    font-size: small;
}

.showcase {
    height: 125px;
    width: 100%;
    background-color: #0377d7;
}

.cards {
    margin-top: 24px;
    justify-content: center;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 2fr));
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 24px;
    margin-left: 4px;
    place-items: center;
    margin-right: 4px;
}

.container-2 {
    background-color: white;
    height: 100%;
}

.container-3 {
    background-color: white;
    height: 100%;
}

.settings-2 {
    background-color: white;
    height: 100%;
    margin-left: 8px;
    margin-right: 8px;
}

.container-1 {
    background-color: white;
    overflow-y: auto;
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    height: calc(100% - 80px);
}

.titlebar {
    height: 36px;
    background-color: #ebebeb00;
    user-select: none;
    display: flex;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    -webkit-app-region: drag;
}

.titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 36px;
    user-select: none;
    -webkit-user-select: none;
    -webkit-app-region: no-drag;
    float: right;
}

.titlebar-button-left {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 36px;
    user-select: none;
    -webkit-user-select: none;
    -webkit-app-region: no-drag;
    float: left;
}

.titlebar-button:hover {
    background: #cecece;
}

.titlebar-button#titlebar-close:hover {
    background: #cf0000;
}

.titlebar-text {
    font-weight: normal;
    line-height: 100%;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 12px;
    font-size: small;
}

.titlebar-text.true {
    opacity: 0 !important;
}

#titlebar-minimize {
    margin-left: auto
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
    font-family: 'SourceHanSansSC';
}

#app::before {
    filter: blur(15px);
}

* {
    user-select: none;
}
</style>