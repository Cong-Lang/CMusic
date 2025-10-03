<template>
    <div class="titlebar">
        <div class="titlebar-button" id="titlebar-back" @click="handleback" v-if="isBigMusic === true">
            <i class="ms-icon icon-back titlebar-icon"></i>
        </div>
        <p class="titlebar-text" :class="String(isBigMusic)">CMusic</p>
        <div class="titlebar-button" id="titlebar-minimize" @click="handleMinimize">
            <i class="ms-icon icon-minimize titlebar-icon"></i>
        </div>
        <div class="titlebar-button" id="titlebar-maximize" @click='handleMaximize'>
            <i class="ms-icon icon-maximize titlebar-icon" v-if="isMaximized === false"></i>
            <i class="ms-icon icon-restore titlebar-icon" v-if="isMaximized === true"></i>
        </div>
        <div class="titlebar-button" id="titlebar-close" @click="handleClose">
            <i class="ms-icon icon-close titlebar-icon"></i>
        </div>
    </div>
    <TransitionGroup>
        <wintopappbar style="top:36px" :items="[{ 'name': '最近' }, { 'name': '库' }]" :rightMenu="[{ 'name': '设置' }]"
            @update="nextPage" v-if="isBigMusic === false" />
        <Transition v-if="isBigMusic === false">
            <div class="container-1">
                <main class="container-2" v-if="page === 0">
                    <div class="showcase">
                        <p style="height: 24px;width: 100%;margin: 0;"></p>
                        <h1 style="margin:0 ;color: #FFF;text-align: center;">今日推荐</h1>
                        <p style="margin-top:12px;color: #FFF;text-align: center;">乐队!乐队!</p>
                    </div>
                    <div class="cards" v-for="(item, idx) in items" :key="idx">
                        <wincard style="width: 200px;">
                            <img style="width: 100%;height: 200px;margin: 0;background-size:cover" alt=""
                                src="https://ts1.tc.mm.bing.net/th/id/OIP-C.-fHsAekl5M3EtL1t4RZV1AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"></img>
                            <p style="box-sizing:border-box;padding: 12px 0 0 12px;margin: 0;">影色舞</p>
                            <p style="font-size: small;padding: 4px 0 0 12px;margin: 0;">Mygo!!!!!</p>
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
                        <h1 style="margin:0 ;color: #FFF;text-align: center;">搜索</h1>
                    </div>
                    <wininputbox placeholder="搜索......" style="margin: auto;display: block;" @change="searchMusic" />
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
            <div class="playing-info" @click="isBigMusic = true; openSound()">
                <img>
                <div style="height: 50px;">
                    <template v-if="haveSound === true">
                        <p class="playing-name" v-html="musicName"></p>
                        <p class="playing-author">未知</p>
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
            </div>
        </div>
        <div class="big-music" v-if="isBigMusic === true">
            <div class="big-music-range">
                <winrange type="range" style="width: 100%;" color="#FFF" :max="100" v-model='CurrentTime'
                    @input="updateSound($event.target.value)"></winrange>
            </div>
            <div class="big-music-control">
                <winbutton style="height: 100%;background-color: transparent;width: 50px;padding: 0;"
                    @click="playSound();">
                    <i class="ms-icon icon-play playing-start-big" v-if="isPlay === false"></i>
                    <i class="ms-icon icon-pause playing-start-big" v-if="isPlay === true"></i>
                </winbutton>
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

console.log('👋 This message is being logged by "App.vue", included via Vite');


let page = ref(0);
let items = ref([{}])
let searchError = ref('')
let isPlay = ref(false)
let isMaximized = ref(false)
let isBigMusic = ref(false)
let CurrentTime = ref(0)
let haveSound = ref(false)
let musicName = ref('')


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
        properties: ['openFile'] // 允许选择文件
    });
    console.log('选中的文件:', result.filePaths);
    return result.filePaths
}
let sound;
async function openSound() {
    if (!haveSound.value) {
        let File = await openFile()
        sound = new Howl({
            src: ['file://' + File[0]],
            onloaderror: (id, err) => {
                console.error('音频加载失败：', err);
                // 常见错误："Failed to load media" 通常是路径无效或权限问题
            },
            // 播放错误回调
            onplayerror: (id, err) => {
                console.error('播放失败：', err);
            }
        });
        musicName.value = File[0].split('/')[File[0].split('/').length-1]
        console.log(File[0].split('/')[File[0].split('/').length-1])
        haveSound.value = true
    }
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
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<style lang="css" scoped>
.big-music-range {
    position: fixed;
    bottom: 125px;
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
    bottom: 75px;
    padding: 20px 20px 20px 20px;
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
    background-color: white;
}

.big-music::before {
    background-size: cover;
    filter: blur(15px);
    height: calc(100% + 100px);
    width: calc(100% + 100px);
    content: '';
    position: absolute;
    margin: -50px;
    background-image: url('https://ts1.tc.mm.bing.net/th/id/OIP-C.-fHsAekl5M3EtL1t4RZV1AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3');
}

.icon-pause::before {
    content: "\EDB4";
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

.playing {
    height: 75px;
    position: fixed;
    z-index: 999;
    bottom: 0;
    background-color: #0378d773;
    width: calc(100% - 24px);
    backdrop-filter: blur(5px);
    /*padding: 12px 12px 12px 12px;*/
    display: flex;
    gap: 8px;
    width: 100%;
    align-items: center;
}

.playing-info img {
    background-color: rgb(235, 235, 235);
    height: 75px;
    width: 75px;
    background-size: cover;
}

.playing-info:hover {
    background-color: rgba(0, 0, 0, 0.15);
}

.playing-info {
    padding: 0 16px 0 0px;
    display: flex;
    align-items: center
}

.playing-name {
    font-size: large;
    margin: 0;
}

.playing-set-name.playing-name {
    content: v-bind(musicName);
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
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 24px;
    margin-left: 4px;
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
</style>