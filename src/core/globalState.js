import { ref, shallowRef } from 'vue';

export let globalState = {
    page: ref(0),
    items: ref([]),
    searchError: ref(''),
    isPlay: ref(false),
    isMaximized: ref(false),
    isBigMusic: ref(false),
    CurrentTime: ref(0),
    haveSound: ref(false),
    musicName: ref(['', '', '']),
    picture: ref(''),
    isFull: ref(false),
    version: ref('1.1.0'),
    musicItems: shallowRef(),
    windowMusicError: null,
    window1: null
}