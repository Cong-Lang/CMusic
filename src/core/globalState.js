import { ref, shallowRef } from 'vue';

export let iconFontsUnicode = ref({
    'icon-back-to-window': "\uE73F",
    'icon-full-screen': "\uE740",
    'icon-pause': "\uEDB4",
    'icon-upload': "\uE898",
    'icon-open': "\uE8E5",
    'icon-play': "\uEDB5",
    'icon-minimize': "\uE921",
    'icon-maximize': "\uE922",
    'icon-close': "\uE8BB",
    'icon-restore': "\uE923",
    'icon-repeat': "\uE8EE",
    'icon-repeat-one': "\uE8ED",
    'icon-repeat-off': "\uF0D1"
});
export let iconFontsFamily = ref('SegMDL2_unOfficial')

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