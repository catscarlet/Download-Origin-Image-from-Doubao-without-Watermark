# CHANGELOG

(from new to old)

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
