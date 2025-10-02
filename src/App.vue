<template>
    <div class="titlebar">
        <p class="titlebar-text">CMusic</p>
        <div class="titlebar-button" id="titlebar-minimize" @click="handleMinimize">
            <i class="ms-icon icon-minimize titlebar-icon"></i>
        </div>
        <div class="titlebar-button" id="titlebar-maximize" @click='handleMaximize'>
            <i class="ms-icon icon-maximize titlebar-icon"></i>
        </div>
        <div class="titlebar-button" id="titlebar-close" @click="handleClose">
            <i class="ms-icon icon-close titlebar-icon"></i>
        </div>
    </div>
    <wintopappbar style="top:36px" :items="[{ 'name': '推荐' }, { 'name': '搜索' }]" :rightMenu="[{ 'name': '设置' }]"
        @update="nextPage" />
    <Transition>
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
    <div style="height: 128px;width:100% ;"></div>
    <div class="playing">
        <div class="playing-info">
            <img alt="音乐封面" src="https://ts1.tc.mm.bing.net/th/id/OIP-C.-fHsAekl5M3EtL1t4RZV1AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3">
            <div style="height: 50px;position: absolute;top: 50%;transform: translate(0, -50%);margin-left: 100px;">
                <p class="playing-name">暂无播放音乐</p>
                <p class="playing-author">暂无播放音乐</p>
            </div>
        </div>
        <div style="margin-left: auto;">
            <winbutton style="height: 100%;background-color: transparent;width: 75px;">
                <i class="ms-icon icon-play playing-start" v-if="isPlay === false"></i>
            </winbutton>
        </div>
    </div>
</template>

<script setup>
import './assets/fonts/fonts.css';
import 'web-win-vue/web-win-vue.css'
import { wintopappbar, wincard, wincombobox, wininputbox, winbutton, winprogressbar } from 'web-win-vue'
import { ref } from 'vue'

console.log('👋 This message is being logged by "App.vue", included via Vite');

let page = ref(0);
let items = ref([{}])
let searchError = ref('')
let isPlay = ref(false)
let isMaximized = ref(false)

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


const handleMaximize = () => {
  window.windowControls.toggleMaximize()
}


const handleClose = () => {
  window.windowControls.close()
}
</script>

<style lang="css" scoped>
.icon-play::before {
    content: "\EDB5";
}

.icon-minimize::before {
    content: "\E921";
}

.icon-maximize::before {
    content: "\E922";
}

.icon-close::before {
    content: "\E8BB";
}

.ms-icon {
    font-family: 'SegMDL2' !important;
    font-size: 16px;
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
}

.playing-info img {
    background-color: red;
    height: 75px;
    width: 75px;
    flex: 1;
    background-size:cover;
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
    background-color: #ebebebf3;
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
    width: 36px;
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
</style>