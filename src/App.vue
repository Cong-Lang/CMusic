<template>
    <div class="titlebar">
        <div class="titlebar-button-left" id="titlebar-back" @click="handleback"
            v-if="globalState.isBigMusic.value === true">
            <i class="ms-icon icon-back titlebar-icon"></i>
        </div>
        <p class="titlebar-text" :class="String(globalState.isBigMusic.value)">CMusic</p>
        <div style="display: flex;position: fixed;right: 0px;">
            <div class="titlebar-button" id="titlebar-minimize" @click="handleMinimize">
                <i class="ms-icon icon-minimize titlebar-icon"></i>
            </div>
            <div class="titlebar-button" id="titlebar-maximize" @click='handleMaximize'
                v-if="globalState.isFull.value === false">
                <i class="ms-icon icon-maximize titlebar-icon" v-if="globalState.isMaximized.value === false"></i>
                <i class="ms-icon icon-restore titlebar-icon" v-if="globalState.isMaximized.value === true"></i>
            </div>
            <div class="titlebar-button" id="titlebar-maximize" @click='fullScreen()'
                v-if="globalState.isFull.value === true">
                <i class="ms-icon icon-back-to-window titlebar-icon"></i>
            </div>
            <div class="titlebar-button" id="titlebar-close" @click="handleClose">
                <i class="ms-icon icon-close titlebar-icon"></i>
            </div>
        </div>
    </div>
    <winwindow :items="[{ 'text': '确定' }, { 'text': '复制错误信息' }]" ref="globalState.windowMusicError" title="错误">
        音乐格式错误或已损坏
    </winwindow>
    <winwindow :items="[{ 'text': '确定' }, { 'text': '确定' }]" ref="window1Ref" title="设置">
        <h5 style="font-weight: normal;margin: 0 0 16px 0;">高级</h5>
        <winbutton @click="electronAPI.openConf()">打开配置文件</winbutton>
    </winwindow>
    <TransitionGroup>
        <wintopappbar style="top:36px" :items="[{ 'name': '最近' }, { 'name': '我的库' }]" :rightMenu="[{ 'name': '设置' }]"
            @update="nextPage" v-if="globalState.isBigMusic.value === false" />
        <Transition v-if="globalState.isBigMusic.value === false">
            <div class="container-1">
                <main class="container-2" v-if="globalState.page.value === 0">
                    <div class="showcase">
                        <p style="height: 32px;width: 100%;margin: 0;"></p>
                        <h1 style="margin:0 ;color: #FFF;text-align: center;">最近</h1>
                    </div>
                    <div class="cards">
                        <wincard
                            style="width: 200px;background-color: transparent !important;position:relative;overflow: hidden; "
                            v-for="(item, idx) in globalState.musicItems.value" :key="idx"
                            @click="musicManager.open(item.file)">
                            <img style="width: 200px;height: 200px;margin: 0;background-size:cover;z-index: 1;position:relative;"
                                alt="" :src="item.img" class="card-img"></img>
                            <img alt="" :src="item.img" class="card-img-gloss"></img>
                            <p style="box-sizing:border-box;padding: 12px 0 0 12px;margin: 0;">{{ item.title }}</p>
                            <p style="font-size: small;padding: 4px 0 0 12px;margin: 0;color: #646464;">{{ item.author
                            }}
                            </p>
                        </wincard>
                    </div>
                    <div style="height: 80px;"></div>
                </main>
                <main class="settings-2" v-if="globalState.page.value === 1">
                    <p>在线服务</p>
                    <wincombobox title="无" :items="[{ name: '无' }, { name: '网易云音乐' }]" />
                </main>
                <main class="container-3" v-if="globalState.page.value === 2">
                    <div class="showcase">
                        <p style="height: 32px;width: 100%;margin: 0;"></p>
                        <h1 style="margin:0 ;color: #FFF;text-align: center;">我的库</h1>
                    </div>
                    <wininputbox placeholder="从 我的库 搜索......" style="margin: auto;display: block;"
                        @change="searchMusic" />
                    <p style="text-align: center;">{{ searchError }}</p>
                    <div class="cards" v-for="(item, idx) in searchItems" :key="idx">
                        <wincard style="width: 200px;background-color: transparent !important;">
                            <img style="width: 100%;height: 200px;margin: 0;background-size:cover" alt=""
                                :src="item.img"></img>
                            <p style="box-sizing:border-box;padding: 12px 0 0 12px;margin: 0;">{{ item.title }}</p>
                            <p style="font-size: small;padding: 4px 0 0 12px;margin: 0;">{{ item.author }}</p>
                        </wincard>
                    </div>
                </main>
            </div>
        </Transition>
        <div class="playing" v-if="globalState.isBigMusic.value === false" @dragover.prevent @drop.prevent="handleDrop">
            <div class="playing-info" @click="musicManager.openAuto()">
                <img v-bind:src="globalState.picture.value">
                <div style="height: 50px;">
                    <template v-if="globalState.haveSound.value === true">
                        <p class="playing-name" v-html="globalState.musicName.value[0]"></p>
                        <p class="playing-author" v-html="globalState.musicName.value[1]"></p>
                    </template>
                    <template v-if="globalState.haveSound.value === false">
                        <p class="playing-name">暂无播放音乐</p>
                        <p class="playing-author">暂无播放音乐</p>
                    </template>
                </div>
            </div>
            <div style="margin-left: auto;height: 100%;">
                <winbutton style="height: 100%;background-color: transparent;width: 75px;" @click="playSound()">
                    <i class="ms-icon icon-play playing-start" v-if="globalState.isPlay.value === false"></i>
                    <i class="ms-icon icon-pause playing-start" v-if="globalState.isPlay.value === true"></i>
                </winbutton>
                <winbutton style="height: 100%;background-color: transparent;width: 75px;" @click="musicManager.open()">
                    <i class="ms-icon icon-upload playing-start"></i>
                </winbutton>
            </div>
            <div
                style="z-index: -1;backdrop-filter: blur(20px);background-color: #3d3d3d78;position:absolute;height: 100%;width: 100%;display: block;">
            </div>
            <img class="playing-img" v-bind:src="globalState.picture.value">
        </div>
        <div class="big-music" v-if="globalState.isBigMusic.value === true">
            `` <img
                style="opacity:0.5;position: fixed;height: 120%;width: 120%;filter:blur(30px);top:-50px;left: -10%;object-fit: cover;"
                v-bind:src="globalState.picture.value">
            <div class="big-music-title">
                <p class="playing-name-big" v-html="globalState.musicName.value[0]"></p>
                <p class="playing-author-big" v-html="globalState.musicName.value[1]"></p>
            </div>
            <div class="big-music-range">
                <winrange type="range" style="width: 100%;" color="#FFF" :max="100" :min="0"
                    v-model='globalState.CurrentTime.value' @input="updateSound($event.target.value)" step="0.01">
                </winrange>
            </div>
            <div class="big-music-control">
                <div class="big-music-control-left">
                    <winbutton style="height: 100%;background-color: transparent;width: 50px;padding: 0;"
                        @click="playSound();">
                        <i class="ms-icon icon-play playing-start-big" v-if="globalState.isPlay.value === false"></i>
                        <i class="ms-icon icon-pause playing-start-big" v-if="globalState.isPlay.value === true"></i>
                    </winbutton>
                </div>
                <div class="big-music-control-right">
                    <winbutton style="height: 100%;background-color: transparent;width: 50px;padding: 0;"
                        @click="fullScreen()">
                        <i class="ms-icon icon-full-screen playing-start-big"
                            v-if="globalState.isFull.value === false"></i>
                        <i class="ms-icon icon-back-to-window playing-start-big"
                            v-if="globalState.isFull.value === true"></i>
                    </winbutton>
                </div>
            </div>
        </div>
    </TransitionGroup>
</template>

<script setup>
import './assets/fonts/fonts.css';
import 'web-win-vue/web-win-vue.css'

import { winwindow, wintopappbar, wincard, wincombobox, wininputbox, winbutton, winrange } from 'web-win-vue'
import { ref, TransitionGroup, onMounted, onBeforeUnmount, toRaw, watch } from 'vue'

import { globalState } from './core/globalState.js'
import { musicManager } from './models/fileManager.js'
import { electronAPI } from './models/electron.js'

console.log('👋 This message is being logged by "App.vue", included via Vite');

const window1Ref = ref(null);

watch(window1Ref, (newValue) => {
    globalState.window1.value = newValue;
    console.log('窗口引用已更新:', !!newValue);
});

function fullScreen() {
    window.windowControls.fullscreen()
    globalState.isFull.value = !globalState.isFull.value
}

function nextPage(date) {
    globalState.searchError.value = '';
    if (date[1] === 'right' && date[0] === 0) {
        globalState.window1.value.showDialog();
    } else if (date[1] === 'left' && date[0] === 1) {
        globalState.page.value = 2
    } else {
        globalState.page.value = 0
    };
};
function searchMusic(content) {
    globalState.searchError.value = 'Error: 请设置库文件夹';
}

const handleMinimize = () => {
    window.windowControls.minimize()
}

const handleback = () => {
    globalState.isBigMusic.value = false
    nextPage([0, 'left'])
}

const handleMaximize = () => {
    window.windowControls.toggleMaximize()
    isMaximized.value = !isMaximized.value
}


const handleClose = () => {
    window.windowControls.close()
}

setInterval(() => {
    tabPlayIcon();
}, 100);


function tabPlayIcon() {
    if (globalState.haveSound.value) {
        globalState.sound.on('end', () => {
            globalState.isPlay.value = false;
        });
        if (globalState.sound.playing()) {
            globalState.CurrentTime.value = (globalState.sound.seek() / globalState.sound.duration()) * 100
        }
    }
}

function updateSound(time) {
    console.log(time)
    if (time >= 100) {
        globalState.isPlay.value = false
    }
    globalState.sound.seek(time / 100 * globalState.sound.duration())
}

function playSound() {
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

const handleKeydown = (e) => {
    if (e.keyCode === 32 || e.key === ' ') {
        if (globalState.haveSound) {
            playSound()
        }
    } else if (e.keyCode === 39 || e.key === 'ArrowRight') {
        if ((globalState.sound.seek() + 2.5) <= globalState.sound.duration()) {
            globalState.sound.seek(globalState.sound.seek() + 2.5);
            CurrentTime.value = (globalState.sound.seek() / globalState.sound.duration()) * 100;
        } else {
            globalState.sound.seek(globalState.sound.duration());
            CurrentTime.value = 100;
        }
    } else if (e.keyCode === 37 || e.key === 'ArrowLeft') {
        if ((globalState.sound.seek() - 2.5) >= 0) {
            globalState.sound.seek(globalState.sound.seek() - 2.5);
            CurrentTime.value = (globalState.sound.seek() / globalState.sound.duration()) * 100;
        } else {
            globalState.sound.seek(0);
            CurrentTime.value = 0;
        }
    }
};

async function readDirFiles(path) {
    console.error(await window.electronAPI.readDirFiles(path))
}

async function writeFile(fileText) {
    return await window.electronAPI.writeFile('.cmusic', fileText)
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown);
});

async function start() {
    try {
        globalState.items.value = JSON.parse((await window.electronAPI.readFile('.cmusic'))['data'])
    } catch {
        globalState.items.value = [[], {}]
    }
    globalState.musicItems.value = toRaw(globalState.items.value[0])
    console.log(globalState.musicItems.value)
}

start()
readDirFiles('/home/hhcl233/音乐/MC/')
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
    opacity: 0.65;
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
    z-index: 100;
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

.card-img-gloss {
    width: 200px;
    height: 200px;
    margin: 0;
    background-size: 128px;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 0;
    filter: blur(16px);
    pointer-events: none;
    opacity: 0;
    transition: all 0.5s;
}

.card-img:hover~.card-img-gloss {
    opacity: 0.75 !important;
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
    width: 47px;
    height: 32px;
    user-select: none;
    -webkit-user-select: none;
    -webkit-app-region: no-drag;
    float: right;
}

.titlebar-button-left {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 47px;
    height: 32px;
    user-select: none;
    -webkit-user-select: none;
    -webkit-app-region: no-drag;
    float: left;
}

.titlebar-button:hover {
    background: #cecece;
}

.titlebar-button#titlebar-close:hover {
    background: #ce2e2e;
    color: #ffffff;
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

@media (prefers-color-scheme: dark) {

    .container-1,
    .container-2,
    .container-3 {
        background-color: rgb(0, 0, 0);
    }

    .titlebar {
        color: #ffffff;
    }
}

h1,
h2,
h3,
h4,
h5,
h6,
h5,
p {
    font-family: 'SourceHanSansSC';
}

#app::before {
    filter: blur(15px);
}

* {
    user-select: none;
    -webkit-user-drag: none;
}
</style>