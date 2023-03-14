## 调试版 App 下载和说明

- debug 0.0.1
  - [Android（apk，暂不支持x86，有需要请提出）](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-61376cc6-14e5-4d81-94cb-263e0d64a661/a5fd5011-312b-4e8d-9076-8ac5f2316edf.apk)
  - [iOS（ipa 文件，暂未上TestFlight，有需要请提出）](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-61376cc6-14e5-4d81-94cb-263e0d64a661/74676efe-1ebb-4a5a-bc40-6e89b33bacfb.ipa)
    - feature: 支持 getAppInfo 获取 appInfo，支援根据版本号进行不同 App 版本的适配
    - fix: 修复权限提示和优化代码结构
- 0.0.1
  - [Android（apk，暂不支持x86，有需要请提出）](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-61376cc6-14e5-4d81-94cb-263e0d64a661/9060d114-d49a-4355-9837-553d71241017.apk)
  - [iOS（ipa 文件，暂未上TestFlight，有需要请提出）](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-61376cc6-14e5-4d81-94cb-263e0d64a661/e39faa74-ad93-4811-9d3c-cb926333fdd8.ipa)

![IMG_0432.PNG](https://licos.obs.cn-south-1.myhuaweicloud.com/licos-web/document/20220921/1663728407-2993A1.jpg)

- 打开 `LicOS` App 后，可在远程应用处输入地址进行调试
- 如有错误请在群里或直接在 `错误反馈` 中提出

## 适配说明
![webview.jpg](https://licos.obs.cn-south-1.myhuaweicloud.com/licos-web/document/20220921/1663728288-881BE9.jpg)

- H5 应用需要设置网页 `title` 以适配导航显示

### 安全区适配

```css
@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {
    .safe-area {
        height: constant(safe-area-inset-bottom);
        height: env(safe-area-inset-bottom);
    }
}
```

### js 注入验证
```javascript
// app.vue 或其它应用初始化入口加入
if(window.hasOwnProperty('LicOSApp')){
    // 此时已经注入成功，获取 appInfo 可根据版本号进行不同 App 版本的适配
    LicOSApp.getAppInfo().then(res=>{console.log}) // debug 0.0.1 以上支持
}else{
    document.addEventListener("LicOSAppJSBridgeReady", function() { 
        // 等待注入成功后执行
        LicOSApp.getAppInfo().then(res=>{console.log}) // debug 0.0.1 以上支持
    });
}
```

## 目前提供的 APIs

<!-- ### 生命周期

#### 应用显示
```javascript
    LicOSApp.onShow(()=>{
        console.log("App is show;");
    });
```
#### 应用隐藏
```javascript
    LicOSApp.onHide(()=>{
        console.log("App is show;");
    });
``` -->

### LicOSApp.getLocation(Object): Promise

获取当前的地理位置、速度。

#### Object 参数说明

| 参数名                 | 类型    | 必填 |                                        说明                                        |
| :--------------------- | :------ | :--- | :--------------------------------------------------------------------------------: | 
| type                   | String  | 否   |  默认为 wgs84 返回 gps 坐标，gcj02 返回国测局坐标，可用于 `LicOSApp.openLocation`  |
| altitude               | Boolean | 否   |      传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度      |
| geocode                | Boolean | 否   |               是否解析地址信息，安卓需指定 type 为 gcj02，默认 false               |
| highAccuracyExpireTime | Number  | 否   | 高精度定位超时时间(ms)，指定时间内返回最高精度，该值 3000ms 以上高精度定位才有效果 | 
| isHighAccuracy         | Boolean | 否   |                                   开启高精度定位                                   | 

#### 返回参数说明
|参数 |类型|说明|
|:-|:-|:-|
|code|Number|<ul><li>0：调用接口失败（可能是权限、参数等错误，具体看 message）；</li><li>1：调用成功；</li></ul>|
|message|String|根据 code 进行返回|
|payload|Object| 详见下方 |

**payload 参数说明**
|参数|说明|
|:-|:-|
|latitude|纬度，浮点数，范围为-90~90，负数表示南纬|
|longitude|经度，浮点数，范围为-180~180，负数表示西经|
|speed|速度，浮点数，单位 m/s|
|accuracy|位置的精确度|
|altitude|高度，单位 m|
|verticalAccuracy|垂直精度，单位 m（Android 无法获取，返回 0）|
|horizontalAccuracy|水平精度，单位 m|
|address|地址信息（需配置 geocode 为 true）|

**address 地址信息说明**

| 属性       | 类型   | 描述               | 说明                                                         |
| :--------- | :----- | :----------------- | :----------------------------------------------------------- |
| country    | String | 国家               | 如“中国”，如果无法获取此信息则返回 undefined                 |
| province   | String | 省份名称           | 如“北京市”，如果无法获取此信息则返回 undefined               |
| city       | String | 城市名称           | 如“北京市”，如果无法获取此信息则返回 undefined               |
| district   | String | 区（县）名称       | 如“朝阳区”，如果无法获取此信息则返回 undefined               |
| street     | String | 街道信息           | 如“酒仙桥路”，如果无法获取此信息则返回 undefined             |
| streetNum  | String | 获取街道门牌号信息 | 如“3 号”，如果无法获取此信息则返回 undefined                 |
| poiName    | String | POI 信息           | 如“电子城．国际电子总部”，如果无法获取此信息则返回 undefined |
| postalCode | String | 邮政编码           | 如“100016”，如果无法获取此信息则返回 undefined               |
| cityCode   | String | 城市代码           | 如“010”，如果无法获取此信息则返回 undefined                  |

#### 示例
```javascript
async function() {
    try {
        const { code, message, payload } = await LicOSApp.getLocation({ type: 'wgs84' })
        console.log('当前位置的经度：' + payload.longitude);
		console.log('当前位置的纬度：' + payload.latitude);
    } catch (e) {
       // 有可能LicOSApp对象注入失败或者不在应用内打开
       console.error('请在LicOSApp中运行应用！');
       // 或者有可能是接口不支持
       console.error('当前LicOsApp不支持该接口，请尝试更新到最新版再试！');
    } finally {

    }
}
```

### LicOSApp.chooseLocation(Object): Promise

打开地图选择位置。

#### Object 参数说明

| 参数名    | 类型   | 必填 | 说明       |
| :-------- | :----- | :--- | :--------- |
| latitude  | Number | 否   | 目标地纬度 |
| longitude | Number | 否   | 目标地经度 |
| keyword   | String | 否   | 搜索关键字 |

#### 返回参数说明
|参数 |类型|说明|
|:-|:-|:-|
|code|Number|<ul><li>0：调用接口失败（可能是权限、参数等错误，具体看 message）；</li><li>1：调用成功；</li></ul>|
|message|String|根据 code 进行返回|
|payload|Object| 详见下方 |

**payload 参数说明**

| 参数      | 说明                                                                  |
| :-------- | :-------------------------------------------------------------------- |
| name      | 位置名称                                                              |
| address   | 详细地址                                                              |
| latitude  | 纬度，浮点数，范围为-90~90，负数表示南纬，使用 gcj02 国测局坐标系。   |
| longitude | 经度，浮点数，范围为-180~180，负数表示西经，使用 gcj02 国测局坐标系。 |

#### 示例
```javascript
async function() {
    try {
        const { code, message, payload } = await LicOSApp.chooseLocation()
        console.log('位置名称：' + payload.name);
		console.log('详细地址：' + payload.address);
		console.log('纬度：' + payload.latitude);
		console.log('经度：' + payload.longitude);
    } catch (e) {
       // 有可能LicOSApp对象注入失败或者不在应用内打开
       console.error('请在LicOSApp中运行应用！');
       // 或者有可能是接口不支持
       console.error('当前LicOsApp不支持该接口，请尝试更新到最新版再试！');
    } finally {

    }
}
```

### LicOSApp.scanCode(Object): Promise
调起客户端扫码界面，扫码成功后返回对应的结果。

#### Object 参数说明
|参数名|类型|必填|说明|
|:-|:-|:-|:-:|
|onlyFromCamera|Boolean|否|是否只能从相机扫码，不允许从相册选择图片|字节跳动小程序、百度小程序、支付宝小程序不支持此参数|
|scanType|Array|否|扫码类型，参考下方`scanType的合法值`|字节跳动小程序不支持此参数|
|autoDecodeCharset|Boolean|否|是否启用自动识别字符编码功能，默认为否|App|
|autoZoom|Boolean|否|是否启用自动放大，默认启用|仅 App-Android (3.5.4+) 支持|

**scanType的合法值**

|值|说明|
|:-|:-|
|barCode|一维码|
|qrCode|二维码|
|datamatrix|Data Matrix 码|
|pdf417|PDF417 条码|


#### 返回参数说明
|参数 |类型|说明|
|:-|:-|:-|
|code|Number|<ul><li>0：调用接口失败（可能是权限、参数等错误，具体看 message）；</li><li>1：调用成功；</li></ul>|
|message|String|根据 code 进行返回|
|payload|Object| 详见下方 |

**payload参数说明**
|参数|说明|
|:-|:-|
|result|所扫码的内容||
|scanType|所扫码的类型|App、微信小程序、百度小程序、QQ小程序、京东小程序、支付宝小程序|
|charSet|所扫码的字符集|App、微信小程序、百度小程序(所扫码的字符集，仅支持 Android 系统)、QQ小程序、京东小程序|


#### 示例
```javascript
// 只允许通过相机扫码
async function() {
    try {
      const { code, message, payload } = await LicOSApp.scanCode({ onlyFromCamera: true })
    	console.log('条码类型：' + payload.scanType);
	  	console.log('条码内容：' + payload.result);
    } catch (e) {
       // 有可能LicOSApp对象注入失败或者不在应用内打开
       console.error('请在LicOSApp中运行应用！');
       // 或者有可能是接口不支持
       console.error('当前LicOsApp不支持该接口，请尝试更新到最新版再试！');
    } finally {
        
    }
}
```
