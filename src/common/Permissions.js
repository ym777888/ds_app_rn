import { every, stubFalse, stubTrue } from 'lodash';
import {
    check,
    checkNotifications,
    PERMISSIONS,
    request,
} from 'react-native-permissions';
import { NativeModules, Platform } from 'react-native';

const checkRequestTable = (...permissions) => {
    console.log(permissions);
    return Promise.all(permissions.map(permission => check(permission)))
        .then(results => {
            console.log(results);
            return every(results, result => {
                switch (result) {
                    case 'granted':
                        return true;
                    case 'denied':
                        return false;
                    default:
                        return false;
                }
            });
        })
        .catch(stubFalse);
};

// 检查照相机
const checkCamera = Platform.select({
    ios: () => checkRequestTable(PERMISSIONS.IOS.CAMERA),
    android: () =>
        checkRequestTable(
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ),
});

// 请求照相机
const requestCamera = Platform.select({
    ios: () => request(PERMISSIONS.IOS.CAMERA),
    android: async () => {
        const status1 = await request(PERMISSIONS.ANDROID.CAMERA);
        const status2 = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        return { status1, status2 };
    },
});

// 检查存储
const checkLibrary = Platform.select({
    ios: () =>
        checkRequestTable(
            PERMISSIONS.IOS.PHOTO_LIBRARY,
            PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
        ),
    android: () => checkRequestTable(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
});

// 请求存储
const requestLibrary = Platform.select({
    ios: async () => {
        const status1 = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        const status2 = await request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
        return { status1, status2 };
    },
    android: () => request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
});


// 检查扫码
const checkCameraScan = Platform.select({
    ios: () =>
        checkRequestTable(PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE),
    android: () =>
        checkRequestTable(
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.RECORD_AUDIO,
        ),
});

// 检查定位
const checkLocation = Platform.select({
    ios: () =>
        checkRequestTable(
            PERMISSIONS.IOS.LOCATION_ALWAYS,
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ),
    android: () =>
        checkRequestTable(
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ),
});

// 检查网络
const checkNetwork = () => {
    const { PermissionsModule } = NativeModules;
    PermissionsModule.networkPermission().then(stubTrue).catch(stubFalse);
};

// 检查通知
const checkNotification = () => {
    checkNotifications()
        .then(({ status }) => status === 'granted')
        .catch(stubFalse);
};

export { checkCamera, requestCamera, checkLibrary, requestLibrary };