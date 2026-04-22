# CHANGELOG

**豆包已经封杀了从网站上直接获取无水印图片的方式，此脚本已因为豆包的更新而失效。现在已无法使用直接下载预览图的方式下载无水印图片。**

(from new to old)

## 0.8.1

The web version of doubao has changed its structure and logic.

**Notice doubao.com is using *canary release* so this new release will not work for old web version. If your web version is not changed, use the old release instead.**

- Update querySelector to match doubao update.

## 0.8.0

- New Feature: **Download preview videos**.

You can download preview videos with specified file name now.

- Change class-flag to make compatible with other userscript.
- Rewrite function createImageDownloadButton.
- Add comment on Feature: centerImageEditorButtonPanel
- Increase the threshold from 300 to 750 to reduce system load.

## 0.7.0

- New Feature: centerImageEditorButtonPanel

Center the Image Editor Button Panel so when using the DefaultDownloadButton, the toast won't block buttons.
Default is ON. Set *centerImageEditorButtonPanel* to 0 to disable it.


## 0.6.8

- Update querySelector to match doubao update.
- Downscale button size for better appearance.
- Fix visual error when downloading while moving mouse out and over again.

## 0.6.7

- Add style for button when the image is downloading.

## 0.6.6

- Update querySelector to match Support both old and new UIs.

It seems Doubao has two different UIs but only some accounts can access it.

- Add customPostfixName for multi-browser-accounts.

If you are using different browser or different browser-profile to use mulitple doubao accounts, this is a way to set a difference on filename. Just edit the `customPostfixName` and the filename will be `currentTitle-chatID-timeStr-customPostfixName.png;`. Leave it to empty and the filename will still be `currentTitle-chatID-timeStr.png;`

## 0.6.5

- Update querySelector to match doubao update.

## 0.6.4

- Update querySelector to match doubao update.

## 0.6.3

- Update querySelector to match doubao update.

## 0.6.2

- Update querySelector to match doubao update.

## 0.6.1

将下载按钮由 '点击下载无水印图片' 更改为 '点击下载以「会话名-会话ID-下载时间」为文件名的预览图图片'

## 0.6.0

**豆包已经封杀了从网站上直接获取无水印图片的方式，此脚本已因为豆包的更新而失效。**

## 0.5.2

- Update querySelector to match doubao update.

## 0.5.1

- Update querySelector to match doubao update.

## 0.5.0

- Add throttle and debounce for MutationObserver
- Change MutationObserver attributes moniting to false.

Trying to reduce the cost when the page is changing.

## 0.4.1

- Update querySelector to match doubao update.

## 0.4

- **Change the way of crossdomain downloading from canvas to fetch.**
- Fix wrong image filename when it's a new session, and add chatId in it.

Due to a uncertain browser issue that may cause the download image is transparent, I'm giving up the canvas way of cross-domain downloading.

## 0.3.2

- Fix 0.3.1 wrong commit.

## 0.3.1

- Fix a bug that may cause image download src not update when switching image. Mostly this may happen when using doubao integrated editing feature, like eraser.

## 0.3

- Hide Original Download Button by default.

## 0.2

- Adjust the filename's time postfix to the actual download moment. (previously it was the button generated time)

## 0.1

- Initial commit.
