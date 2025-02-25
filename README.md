# 适配说明

1. **运行构建命令**：

```bash
npm run build
```

2. **部署文件**：
   将 `dist/main.js` 复制到应用目录，并在 `index.html` 中进行引用。

3. **监听环境变化**：

```javascript
// 监听加载情况，切换环境
// 建议变更全局状态
if (window.UniBridgeReady) {
  appInfo.switchClient("UniApp");
} else {
  document.addEventListener("UniBridgeReady", function () {
    appInfo.switchClient("UniApp");
  });
}
```

4. **环境变量适配**：
   具体适配参考 `example` 文件夹下的 Vue3 示例。

![H5适配效果](/H5适配效果.png)
![UniApp适配效果](/UniApp适配效果.png)

---

## 应用导航

- **标题适配**：默认情况下，应用需要自行设置网页 `document.title` 以适配导航显示标题。
- **导航栏限制**：目前 App 不支持自定义导航栏，应用内导航需要通过环境判断隐藏。
- **返回控制**：应用内的返回操作由 App 控制。
- **安全区适配**：
  ```css
  @supports (bottom: constant(safe-area-inset-bottom)) or
    (bottom: env(safe-area-inset-bottom)) {
    .safe-area {
      height: constant(safe-area-inset-bottom);
      height: env(safe-area-inset-bottom);
    }
  }
  ```

---

## 目前提供的 APIs

### UniBridge.getLocation(Object): Promise

**功能**：获取当前的地理位置、速度。

#### 参数说明

| 参数名                 | 类型    | 必填 | 说明                                                                           |
| :--------------------- | :------ | :--- | :----------------------------------------------------------------------------- |
| type                   | String  | 否   | 坐标类型：<br> - `wgs84`：GPS 坐标<br> - `gcj02`：国测局坐标<br>默认为 `wgs84` |
| altitude               | Boolean | 否   | 是否返回高度信息。开启后会减慢接口返回速度。                                   |
| geocode                | Boolean | 否   | 是否解析地址信息。安卓需指定 `type` 为 `gcj02`，默认为 `false`。               |
| highAccuracyExpireTime | Number  | 否   | 高精度定位超时时间（ms）。3000ms 以上高精度定位才有效果。                      |
| isHighAccuracy         | Boolean | 否   | 是否开启高精度定位。                                                           |

#### 返回参数说明

| 参数    | 类型   | 说明                                                 |
| :------ | :----- | :--------------------------------------------------- |
| code    | Number | 返回状态码：<br> - `0`：调用失败<br> - `1`：调用成功 |
| message | String | 根据 `code` 返回具体信息。                           |
| payload | Object | 位置数据，详见下方。                                 |

**payload 参数说明**

| 参数               | 说明                                             |
| :----------------- | :----------------------------------------------- |
| latitude           | 纬度，浮点数，范围为 -90~90，负数表示南纬。      |
| longitude          | 经度，浮点数，范围为 -180~180，负数表示西经。    |
| speed              | 速度，浮点数，单位为 m/s。                       |
| accuracy           | 位置的精确度。                                   |
| altitude           | 高度，单位为 m。                                 |
| verticalAccuracy   | 垂直精度，单位为 m（Android 无法获取，返回 0）。 |
| horizontalAccuracy | 水平精度，单位为 m。                             |
| address            | 地址信息（需配置 `geocode` 为 `true`）。         |

**address 地址信息说明**

| 属性       | 类型   | 描述           | 说明                                                           |
| :--------- | :----- | :------------- | :------------------------------------------------------------- |
| country    | String | 国家           | 如“中国”，如果无法获取此信息则返回 `undefined`。               |
| province   | String | 省份名称       | 如“北京市”，如果无法获取此信息则返回 `undefined`。             |
| city       | String | 城市名称       | 如“北京市”，如果无法获取此信息则返回 `undefined`。             |
| district   | String | 区（县）名称   | 如“朝阳区”，如果无法获取此信息则返回 `undefined`。             |
| street     | String | 街道信息       | 如“酒仙桥路”，如果无法获取此信息则返回 `undefined`。           |
| streetNum  | String | 街道门牌号信息 | 如“3 号”，如果无法获取此信息则返回 `undefined`。               |
| poiName    | String | POI 信息       | 如“电子城国际电子总部”，如果无法获取此信息则返回 `undefined`。 |
| postalCode | String | 邮政编码       | 如“100016”，如果无法获取此信息则返回 `undefined`。             |
| cityCode   | String | 城市代码       | 如“010”，如果无法获取此信息则返回 `undefined`。                |

#### 示例代码

```javascript
async function getLocation() {
  try {
    const { code, message, payload } = await UniBridge.getLocation({
      type: "wgs84",
    });
    console.log("当前位置的经度：" + payload.longitude);
    console.log("当前位置的纬度：" + payload.latitude);
  } catch (e) {
    console.error("请在 UniBridge 中运行应用！");
    console.error("当前 UniBridge 不支持该接口，请尝试更新到最新版再试！");
  }
}
```

---

### UniBridge.chooseLocation(Object): Promise

**功能**：打开地图选择位置。

#### 参数说明

| 参数名    | 类型   | 必填 | 说明       |
| :-------- | :----- | :--- | :--------- |
| latitude  | Number | 否   | 目标地纬度 |
| longitude | Number | 否   | 目标地经度 |
| keyword   | String | 否   | 搜索关键字 |

#### 返回参数说明

| 参数    | 类型   | 说明                                                 |
| :------ | :----- | :--------------------------------------------------- |
| code    | Number | 返回状态码：<br> - `0`：调用失败<br> - `1`：调用成功 |
| message | String | 根据 `code` 返回具体信息。                           |
| payload | Object | 位置数据，详见下方。                                 |

**payload 参数说明**

| 参数      | 说明                                                                     |
| :-------- | :----------------------------------------------------------------------- |
| name      | 位置名称                                                                 |
| address   | 详细地址                                                                 |
| latitude  | 纬度，浮点数，范围为 -90~90，负数表示南纬，使用 `gcj02` 国测局坐标系。   |
| longitude | 经度，浮点数，范围为 -180~180，负数表示西经，使用 `gcj02` 国测局坐标系。 |

#### 示例代码

```javascript
async function chooseLocation() {
  try {
    const { code, message, payload } = await UniBridge.chooseLocation();
    console.log("位置名称：" + payload.name);
    console.log("详细地址：" + payload.address);
    console.log("纬度：" + payload.latitude);
    console.log("经度：" + payload.longitude);
  } catch (e) {
    console.error("请在 UniBridge 中运行应用！");
    console.error("当前 UniBridge 不支持该接口，请尝试更新到最新版再试！");
  }
}
```

---

### UniBridge.scanCode(Object): Promise

**功能**：调起客户端扫码界面，扫码成功后返回对应的结果。

#### 参数说明

| 参数名            | 类型    | 必填 | 说明                                                                                             |
| :---------------- | :------ | :--- | :----------------------------------------------------------------------------------------------- |
| onlyFromCamera    | Boolean | 否   | 是否只能从相机扫码，不允许从相册选择图片。字节跳动小程序、百度小程序、支付宝小程序不支持此参数。 |
| scanType          | Array   | 否   | 扫码类型，参考下方 `scanType` 的合法值。字节跳动小程序不支持此参数。                             |
| autoDecodeCharset | Boolean | 否   | 是否启用自动识别字符编码功能，默认为 `false`。仅 App 支持此参数。                                |
| autoZoom          | Boolean | 否   | 是否启用自动放大，默认启用。仅 App-Android (3.5.4+) 支持此参数。                                 |

**scanType 的合法值**

---

| 值         | 说明           |
| :--------- | :------------- |
| barCode    | 一维码         |
| qrCode     | 二维码         |
| datamatrix | Data Matrix 码 |
| pdf417     | PDF417 条码    |

#### 返回参数说明

| 参数    | 类型   | 说明                                                                                             |
| :------ | :----- | :----------------------------------------------------------------------------------------------- |
| code    | Number | 返回状态码：<br> - `0`：调用失败（可能是权限、参数等错误，具体看 `message`）<br> - `1`：调用成功 |
| message | String | 根据 `code` 返回具体信息。                                                                       |
| payload | Object | 扫码结果，详见下方。                                                                             |

**payload 参数说明**

| 参数     | 说明                                                                 |
| :------- | :------------------------------------------------------------------- |
| result   | 所扫码的内容                                                         |
| scanType | 所扫码的类型（如 `qrCode`、`barCode` 等）                            |
| charSet  | 所扫码的字符集（仅支持 Android 系统，App、微信小程序、百度小程序等） |

#### 示例代码

```javascript
// 只允许通过相机扫码
async function scanCode() {
  try {
    const { code, message, payload } = await UniBridge.scanCode({
      onlyFromCamera: true,
    });
    console.log("条码类型：" + payload.scanType);
    console.log("条码内容：" + payload.result);
  } catch (e) {
    console.error("请在 UniBridge 中运行应用！");
    console.error("当前 UniBridge 不支持该接口，请尝试更新到最新版再试！");
  }
}
```
