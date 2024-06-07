import { AsyncStorage, Platform } from 'react-native'
import { XStorage } from 'react-native-easy-app'
import { RNStorage } from './RNStorage'
import Util from './Util'
import * as Base64 from 'js-base64'
import { XHttp } from 'react-native-easy-app';

export default class HttpUtil {

    static postReq = (reqUrl, req = {}, callback = null, failCallback = null, isMute = false) => {
        let params = req;
        let tm = new Date().getTime();
        params.t = tm;
        let str = JSON.stringify(params);
        let ret = null;

        if (__DEV__) {
            console.log('-----------------------------------------------------');
            console.log('request url:', RNStorage.baseUrl + reqUrl);
            console.log('request data:', str);
            console.log('time:', tm);
            console.log('-----------------------------------------------------');
        }


        XHttp().url(reqUrl)
            .contentType('application/x-www-form-urlencoded; charset=utf-8')
            .header({ 'token': RNStorage.token || '' })
            .param(params).post((result) => {
                let { success, response, json, status, error } = result

                if (success) {
                    if (json.cipher) {
                        var ss = this.decrypt(json.cipher);
                        ret = JSON.parse(ss);
                    } else {
                        ret = json
                    }

                    if (__DEV__) {
                        console.log("=======================================================>START JSON RESP:" + tm)
                        console.log(ret);
                        console.log("=======================================================>END JSON RESP:" + tm);
                    }

                    if (ret.code == 200) {
                        if (callback) {
                            callback(ret.msg, ret.data)
                        }
                    } else {

                        if (failCallback) {
                            failCallback(ret.msg, ret.code)
                        }

                        if (!isMute) {
                            if (ret.msg.indexOf('登录') >= 0) { //全局登录弹窗
                                Util.showLoginModal();
                            } else {
                                Util.showToast(ret.msg);
                            }
                        }
                    }

                } else {
                    if (failCallback) {
                        failCallback('服务器连接失败', status)
                    }
                    if (!isMute && ret) {
                        Util.showToast(ret.msg)
                    }
                }
            })
    }

    static postFetch(fullPath, data, callback, failCallback, isMute) {
        data.t = new Date().getTime();
        let str = JSON.stringify(data)
        let params = str

        if (__DEV__) {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            console.log('request url:', fullPath);
            console.log('request data:', params);
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        }


        var fetchOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                'device': 'app',
                'token': RNStorage.token || ''
            },
            body: params
        };

        let json = null;
        return new Promise(function (resolve, reject) {
            HttpUtil.timeout_fetch(
                fetch(fullPath, fetchOptions))
                .then((response) => {
                    // console.log('response:', response);
                    if (!response.ok) {
                        // console.log('resp NOT ok!');
                        return Promise.reject({
                            status: response.status,
                            statusText: response.statusText
                        })
                    }
                    return response.text();
                })
                .then((txt) => {
                    // console.log(txt)
                    if (__DEV__) {
                        console.log('-------------------------------------------------------');
                        console.log('resp json:', txt);
                        console.log('-------------------------------------------------------');
                    }
                    if (txt) {
                        var rs = JSON.parse(txt);
                        if (rs.cipher) {
                            json = HttpUtil.decrypt(rs.cipher);
                        } else {
                            json = rs;
                        }
                    }

                    if (json.code == 200) {
                        if (callback) {
                            callback(json.msg, json.data)
                        }
                        resolve(json.data);
                    } else {
                        if (failCallback) {
                            failCallback(json.msg, json.data)
                        } else if (!isMute) {
                            Util.msg(json.msg)
                        }
                    }

                    reject("json fail")
                })
                .catch((err) => {
                    // callback('服务器连接失败', err);
                    if (failCallback) {
                        failCallback('服务器连接失败', err)
                    } else if (!isMute) {
                        Util.msg('服务器连接失败!\n' + fullPath)
                    }
                    reject(err);
                });
        });

    }



    /* 加密 */
    static encrypt(data) {
        data = Base64.encode(data)
        return data.replace(/J/g, '\\').replace(/=/g, '#')
    }
    /* 解密 */
    static decrypt(data) {
        data = data.replace(/\\/g, 'I').replace(/#/g, '=')
        return Base64.decode(data)
    }

    /**
 * 让fetch也可以timeout
 *  timeout不是请求连接超时的含义，它表示请求的response时间，包括请求的连接、服务器处理及服务器响应回来的时间
 * fetch的timeout即使超时发生了，本次请求也不会被abort丢弃掉，它在后台仍然会发送到服务器端，只是本次请求的响应内容被丢弃而已
 * @param {Promise} fetch_promise    fetch请求返回的Promise
 * @param {number} [timeout=10000]   单位：毫秒，这里设置默认超时时间为10秒
 * @return 返回Promise
 */
    static timeout_fetch(fetch_promise, timeout = 10000) {
        let timeout_fn = null;

        //这是一个可以被reject的promise
        let timeout_promise = new Promise(function (resolve, reject) {
            timeout_fn = function () {
                reject('timeout promise');
            };
        });

        //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
        let abortable_promise = Promise.race([
            fetch_promise,
            timeout_promise
        ]);

        setTimeout(function () {
            timeout_fn();
        }, timeout);

        return abortable_promise;
    }

    static isEmpty(obj) {
        if (obj === undefined || obj == null) {
            return true;
        }
        if (Array.isArray(obj) && obj.length === 0) {//array
            return true;
        } else {
            if (typeof obj === 'string' && obj.trim() === '') {
                return true;
            }
        }
        return false;
    }

    static selfOr(self, another = null) {// Returns itself or another object
        if (Array.isArray(self)) {
            return !isEmpty(self) ? self : [];
        } else {
            return !isEmpty(self) ? self : another;
        }
    }
}