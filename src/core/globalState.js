import { ref, shallowRef } from 'vue';

export let iconFontsUnicode = ref({
    'icon-back-to-window': "E73F",
    'icon-full-screen': "E740",
    'icon-pause': "EDB4",
    'icon-upload': "E898",
    'icon-open': "E8E5",
    'icon-play': "EDB5",
    'icon-back': "E830",
    'icon-minimize': "E921",
    'icon-maximize': "E922",
    'icon-close': "E8BB",
    'icon-restore': "E923",
    'icon-repeat': "E8EE",
    'icon-repeat-one': "E8ED",
    'icon-repeat-off': "F0D1"
});
export let iconFontsFamily = ref('Fluent System Icons')

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
    window1: null,
    repeatPlay: ref(false)
}