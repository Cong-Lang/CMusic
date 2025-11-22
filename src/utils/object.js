export class objectUtils {
    static isObjectInArray(array, target) {
        return array.some(item =>
            Object.keys(target).every(key => item[key] === target[key])
        );
    }

    static findObjectIndex(array, target, key = 'id') {
        return array.findIndex(item => item[key] === target[key]);
    }
}