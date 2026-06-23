// ==UserScript==
// @name            从豆包下载无水印图片 Download Origin Image from Doubao without Watermark
// @name:zh         从豆包下载无水印图片 Download Origin Image from Doubao without Watermark
// @name:en         Download Origin Image from Doubao without Watermark 从豆包下载无水印图片
// @namespace       https://github.com/catscarlet/Download-Origin-Image-from-Doubao-without-Watermark
// @description     从豆包（www.doubao.com）下载无水印图片。 Download Origin Image from www.doubao.com without Watermark.
// @description:zh  从豆包（www.doubao.com）下载无水印图片。 Download Origin Image from www.doubao.com without Watermark.
// @description:en  Download Origin Image from www.doubao.com without Watermark. 从豆包（www.doubao.com）下载无水印图片。
// @version         0.9.2
// @author          catscarlet
// @license         GNU Affero General Public License v3.0
// @match           https://www.doubao.com/chat/*
// @run-at          document-end
// @grant           none
// ==/UserScript==

const customPostfixName = '';

(function() {
    'use strict';

    let throttleTimer;
    let debounceTimer;
    const thresholdValue = 750;

    const observer = new MutationObserver((mutationsList) => {
        const now = Date.now();

        if (!throttleTimer || now - throttleTimer > thresholdValue) {
            throttleTimer = now;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {

                        let itemContainer = [];
                        let itemItem = document.querySelectorAll('div.relative.flex.h-full.w-full.items-center.justify-center.overflow-hidden');

                        for (const itemValue of itemItem.values()) {
                            itemContainer.push(itemValue);
                        }

                        if (itemContainer.length == 0) {
                            return false;
                        }

                        itemContainer.forEach((itemInContainer) => {
                            if (itemInContainer.parentNode.querySelector('.doubao-nowatermark-527890')) {
                                //console.log('image.parentNode.appendChild added, skip.');
                                return;
                            }

                            if (itemInContainer.querySelector('canvas')) {
                                const link = createImageDownloadButton();
                                itemInContainer.parentNode.appendChild(link);

                                return;
                            }

                            if (itemInContainer.querySelector('video')) {
                                const link = createVideoDownloadButton();
                                itemInContainer.parentNode.appendChild(link);

                                return;
                            }
                        });
                    }
                }
            }, thresholdValue);
        }
    });

    const config = {
        childList: true,
        attributes: false,
        subtree: true,
    };

    observer.observe(document.documentElement, config);

    setCanvasDataset();
})();

function setCanvasDataset() {
    const originalCanvasRenderingContext2D = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(img, ...args) {
        const targetCanvas = this.canvas;
        const src = img && (img.currentSrc || img.src) || (img && img.toDataURL && '[canvas/image source]');

        if (src.search('data:image') === -1 && src.search('downsize') === -1) {
            targetCanvas.dataset['src-527890'] = src;
        }

        return originalCanvasRenderingContext2D.call(this, img, ...args);
    };
}

function createImageDownloadButton() {
    const link = document.createElement('a');

    link.textContent = '点击下载以「会话名-会话ID-下载时间」为文件名的预览图图片';
    link.style.whiteSpace = 'break-spaces';

    link.classList.add('doubao-nowatermark-527890');

    link.style.position = 'absolute';
    link.style.backgroundColor = '#007BFF';
    link.style.color = 'white';
    link.style.padding = '7px 14px';
    link.style.border = 'none';
    link.style.borderRadius = '5px';

    link.style.zIndex = 1;
    link.style.textDecoration = 'none';
    link.style.opacity = '0.8';

    const x = 0;
    const y = 0;

    link.style.left = x + 'px';
    link.style.top = y + 'px';

    link.addEventListener('mouseover', function() {
        if (this.style.cursor == 'wait') {
            return;
        }
        this.style.backgroundColor = '#0056b3';
        this.style.cursor = 'pointer';
    });

    link.addEventListener('mouseout', function() {
        if (this.style.cursor == 'wait') {
            return;
        }
        this.style.backgroundColor = '#007BFF';
        this.style.cursor = '';
    });

    link.addEventListener('click', async () => {
        getCrossOriginImage(link);
    });

    return link;
}

function createVideoDownloadButton() {
    const link = document.createElement('a');

    link.textContent = '点击下载以「会话名-会话ID-下载时间」为文件名的预览视频文件';
    link.style.whiteSpace = 'break-spaces';

    link.classList.add('doubao-nowatermark-527890');

    link.style.position = 'absolute';
    link.style.backgroundColor = '#007BFF';
    link.style.color = 'white';
    link.style.padding = '7px 14px';
    link.style.border = 'none';
    link.style.borderRadius = '5px';

    link.style.zIndex = 1;
    link.style.textDecoration = 'none';
    link.style.opacity = '0.8';

    const x = 0;
    const y = 0;

    link.style.left = x + 'px';
    link.style.top = y + 'px';

    link.addEventListener('mouseover', function() {
        if (this.style.cursor == 'wait') {
            return;
        }
        this.style.backgroundColor = '#0056b3';
        this.style.cursor = 'pointer';
    });

    link.addEventListener('mouseout', function() {
        if (this.style.cursor == 'wait') {
            return;
        }
        this.style.backgroundColor = '#007BFF';
        this.style.cursor = '';
    });

    link.addEventListener('click', async () => {
        getCrossVideo(link);
    });

    return link;
}

async function getCrossOriginImage(link) {
    const btnOriginStyle = {};
    btnOriginStyle.cursor = link.style.cursor;
    btnOriginStyle.backgroundColor = link.style.backgroundColor;
    link.style.cursor = 'wait';
    link.style.backgroundColor = 'grey';

    const currentTitle = document.title.replace('- 豆包', '').trim();
    const chatID = document.location.pathname.replace('/chat/', '').trim();
    const timeStr = getYmdHMS();

    const imageNode = link.parentNode.querySelector('canvas');
    const imageUrl = imageNode.dataset['src-527890'];

    let imageName = currentTitle + '-' + chatID + '-' + timeStr;
    if (customPostfixName) {
        imageName = imageName + '-' + customPostfixName;
    }
    imageName = imageName + '.png';

    try {
        const response = await fetch(imageUrl, {mode: 'cors'});
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = imageName;
        a.style.display = 'none';
        document.body.appendChild(a);
        setTimeout(() => {
            a.click();
        }, 10);
        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            link.style.cursor = btnOriginStyle.cursor;
            link.style.backgroundColor = btnOriginStyle.backgroundColor;
        }, 1000);

    } catch (error) {
        console.error('图片加载失败，请确保图片服务器开启了 CORS 支持。');
        alert('图片加载失败，请确保图片服务器开启了 CORS 支持。');
        link.style.cursor = btnOriginStyle.cursor;
        link.style.backgroundColor = btnOriginStyle.backgroundColor;
    }

}

async function getCrossVideo(link) {
    const btnOriginStyle = {};
    btnOriginStyle.cursor = link.style.cursor;
    btnOriginStyle.backgroundColor = link.style.backgroundColor;
    link.style.cursor = 'wait';
    link.style.backgroundColor = 'grey';

    const currentTitle = document.title.replace('- 豆包', '').trim();
    const chatID = document.location.pathname.replace('/chat/', '').trim();
    const timeStr = getYmdHMS();

    const videoNodelist = link.parentNode.querySelectorAll('video');
    const videoUrl = Array.from(videoNodelist).find((element) => element.tagName.toLowerCase() == 'video').src;

    let videoName = currentTitle + '-' + chatID + '-' + timeStr;
    if (customPostfixName) {
        videoName = videoName + '-' + customPostfixName;
    }
    videoName = videoName + '.mp4';

    try {
        const response = await fetch(videoUrl, {mode: 'cors'});
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = videoName;
        a.style.display = 'none';
        document.body.appendChild(a);
        setTimeout(() => {
            a.click();
        }, 10);
        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            link.style.cursor = btnOriginStyle.cursor;
            link.style.backgroundColor = btnOriginStyle.backgroundColor;
        }, 1000);

    } catch (error) {
        console.error('视频加载失败，请确保图片服务器开启了 CORS 支持。');
        alert('视频加载失败，请确保视频服务器开启了 CORS 支持。');
        link.style.cursor = btnOriginStyle.cursor;
        link.style.backgroundColor = btnOriginStyle.backgroundColor;
    }

}

function getYmdHMS() {
    const date = new Date();
    const Y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const H = String(date.getHours()).padStart(2, '0');
    const M = String(date.getMinutes()).padStart(2, '0');
    const S = String(date.getSeconds()).padStart(2, '0');

    const result = `${Y}${m}${d}${H}${M}${S}`;

    return result;
}
