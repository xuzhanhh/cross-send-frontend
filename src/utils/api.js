/*
 * @Author: tiansheng
 * @Date:   2017-02-13 18:06:16
 * @Last Modified by:   tiansheng
 * @Last Modified time: 2017-02-13 18:25:28
 */

// import ErrorType from 'constants/ErrorType';
// import BabelError from 'utils/BabelError';
// import 'whatwg-fetch';
// import { serialize } from 'utils/common';

/**
 * 检查接口响应的status
 *
 * @param {Object} response
 * @returns {Object|throw Error}
 */
// function checkStatus(response) {
//     if (response.status >= 200 && response.status < 300) {
//         return response;
//     } else {
//         let error = new BabelError(
//             response.statusText,
//             ErrorType.NETWORK_ERROR, {
//                 url: response._url,
//                 requestOptions: response._requestOptions,
//                 response
//             }
//         );
//         throw error;
//     }
// }

/**
 * 将response中的body以json格式返回
 *
 * @param {any} response
 * @returns ｛Promise｝
 */
function parseJSON(response) {
    return response
        .json()
        .then((jsonData) => Object.assign(jsonData, {
            _url: response._url,
            _requestOptions: response._requestOptions
        }));
}

/**
 * 封装基本的api调用
 *
 * @exports
 * @param {any} url
 * @param {any} options
 * @returns {Promise}
 */
export function baseAPI(url, options = {}) {
    let originalOptions = {
        mode: 'cors',
        credentials: 'include',
        redirect: 'follow'
    };

    let timeout = 20 * 1000;

    if (options.timeout) {
        if (options.timout === 'none') {
            timout = null;
        } else {
            timeout = options.timeout
        }

        try {
            delete options.timeout;
        } catch (e) {
            options.timeout = null; 
        }
    }

    let fetchPromise, timeoutPromise, requestOptions;

    requestOptions = Object.assign({}, originalOptions, options);

    fetchPromise = fetch(url, requestOptions).then(
        response => {
            response._url = url;
            response._requestOptions = requestOptions;
            return response;
        },
        error => {
            throw new BabelError(
                `接口调用失败:${url}`,
                ErrorType.NETWORK_ERROR, {
                    url,
                    requestOptions
                }
            )
        }
    );

    timeoutPromise = new Promise((resolve, reject) => {
        if (timeout) {
            setTimeout(() => {
                reject(new BabelError(
                    `接口超时:${url}`,
                    ErrorType.TIMEOUT, {
                        url,
                        requestOptions
                    }
                ));
            }, timeout);
        }
    });

    return Promise.race([fetchPromise, timeoutPromise]);
}

/**
 *  post实现
 *
 * @exports
 * @param {String} url
 * @param {Object} options - https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
 * @returns {Promise}
 */
export function post(url, options = {}) {
    if (options.data) {
        options.body = options.data;
        try {
            delete options.data;
        } catch (e) {
            options.data = null;
        }
    }

    let requestOptions = Object.assign({}, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }, options);
    return baseAPI(url, requestOptions)
        .then(checkStatus)
        .then(parseJSON);
}

/**
 * get实现
 *
 * @exports
 * @param {String} url
 * @param {Object} options
 * @returns {Promise}
 */
export function get(url, options = {}) {
    if (options.data) {
        var urlSearchParamsStr = serialize(options.data);
        if (urlSearchParamsStr !== '') {
            url += (~url.indexOf('?') ? '&' : '?') + urlSearchParamsStr;
        }
        try {
            delete options.data;
        } catch (e) {
            options.data = null;
        }
    }

    let requestOptions = Object.assign({}, {
        method: 'GET'
    }, options);
    return baseAPI(url, requestOptions)
        .then(checkStatus)
        .then(parseJSON);
}


let count = 0;
/**
 * jsonp实现
 *
 * @exports
 * @param {String} url
 * @param {Object} options
 * @returns {Promise}
 */
export function jsonp(url, options = {}) {
    let prefix = options.prefix || 'jsonp';
    let id = options.name || (prefix + (count++));
    let jsonpCallback = options.jsonpCallback || 'callback';
    let timeout = options.timeout || 60000;
    let target = document.getElementsByTagName('script')[0] || document.head;
    let script, timer;

    if (options.params) {
        url += (~url.indexOf('?') ? '&' : '?') + serialize(params);
    }

    function cleanup() {
        if (script.parentNode) script.parentNode.removeChild(script);

        try {
            delete window[id]
        } catch (e) {
            window[id] = null;
        }
        if (timer) clearTimeout(timer);
    }

    function cancel() {
        if (window[id]) cleanup();
    }

    return new Promise((resolve, reject) => {
        window[id] = (data) => {
            cleanup();
            resolve(data);
        };

        if (timeout) {
            timer = setTimeout(() => {
                cleanup();
                reject(new BabelError(
                    `脚本读取超时:${url}`,
                    ErrorType.TIMEOUT, {
                        url
                    }
                ));
            }, timeout);
        }

        url += (~url.indexOf('?') ? '&' : '?') + jsonpCallback + '=' + encodeURIComponent(id);
        url = url.replace('?&', '?');

        script = document.createElement('script');
        script.src = url;
        script.onerror = () => reject(new BabelError(
            `脚本读取失败:${url}`,
            ErrorType.SCRIPT_LOAD_ERROR, {
                url
            }
        ));
        target.parentNode.insertBefore(script, target);
    });
}
