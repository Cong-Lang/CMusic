import { ref } from 'vue';

export class UI {
    static nextPage([gestureId, gestureType] = []) {
        if (typeof gestureId === 'undefined' || typeof gestureType === 'undefined') {
            console.warn('Invalid gesture parameters');
            return;
        }
        searchError.value = '';
        if (pageType === 'right' && pageId === 0) {
            // 打开设置
            window1.value.showDialog();
        } else if (pageType === 'left' && pageId === 1) {
            // 切换库页面
            page.value = 2
        } else {
            // 切换主页
            page.value = 0
        };
    };
}