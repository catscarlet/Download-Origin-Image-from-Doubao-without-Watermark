// ==UserScript==
// @name            从豆包下载无水印图片 Download Origin Image from Doubao without Watermark
// @name:en         Download Origin Image from Doubao without Watermark 从豆包下载无水印图片
// @namespace       https://github.com/catscarlet/Download-Origin-Image-from-Doubao-without-Watermark
// @description     从豆包（www.doubao.com）下载无水印图片 Download Origin Image from www.doubao.com without Watermark.
// @description:en  Download Origin Image from www.doubao.com without Watermark. 从豆包（www.doubao.com）下载无水印图片
// @version         0.6.5
// @author          catscarlet
// @license         GNU Affero General Public License v3.0
// @match           https://www.doubao.com/chat/*
// @run-at          document-end
// @grant           none
// ==/UserScript==

const removeDefaultDownloadButton = 0; //Set 1 to hide Original Download Button.

(function() {
    'use strict';

    let throttleTimer;
    let debounceTimer;
    const observer = new MutationObserver((mutationsList) => {
        const now = Date.now();

        if (!throttleTimer || now - throttleTimer > 300) {
            throttleTimer = now;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {

                        if (removeDefaultDownloadButton) {
                            const EditImageDownloadButtons = document.querySelectorAll('div[data-testid="edit_image_download_button"]');

                            EditImageDownloadButtons.forEach((EditImageDownloadButton) => {
                                if (EditImageDownloadButton && EditImageDownloadButton.style.display != 'none') {
                                    EditImageDownloadButton.style.display = 'none';
                                }
                            });

                        }

                        const images = document.querySelectorAll('img.preview-img-IlQuCi.img-bg-fz6Iim');

                        if (images.length == 0) {
                            return false;
                        }

                        images.forEach((image) => {

                            if (!image.parentNode.querySelector('.imagelink-nowatermark')) {

                                const link = document.createElement('a');

                                link.textContent = '点击下载以「会话名-会话ID-下载时间」为文件名的预览图图片';
                                link.style.whiteSpace = 'break-spaces';

                                link.classList.add('imagelink-nowatermark');

                                link.style.position = 'absolute';
                                link.style.backgroundColor = '#007BFF';
                                link.style.color = 'white';
                                link.style.padding = '10px 20px';
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
                                    this.style.backgroundColor = '#0056b3';
                                    this.style.cursor = 'pointer';
                                });

                                link.addEventListener('mouseout', function() {
                                    this.style.backgroundColor = '#007BFF';
                                    this.style.cursor = '';
                                });

                                link.addEventListener('click', async () => {
                                    getCrossOriginImage(link);
                                });

                                image.parentNode.appendChild(link);
                            } else {
                                //console.log('added, skip.');
                            }
                        });
                    }
                }
            }, 300);
        }
    });

    const config = {
        childList: true,
        attributes: false,
        subtree: true,
    };

    observer.observe(document.documentElement, config);

})();

async function getCrossOriginImage(link) {
    const currentTitle = document.title.replace('- 豆包', '').trim();
    const chatID = document.location.pathname.replace('/chat/', '').trim();
    const timeStr = getYmdHMS();
    const imageUrl = link.parentNode.querySelector('img').src;
    const imageName = currentTitle + '-' + chatID + '-' + timeStr + '.png';

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
        }, 1000);

    } catch (error) {
        console.error('图片加载失败，请确保图片服务器开启了 CORS 支持。');
        alert('图片加载失败，请确保图片服务器开启了 CORS 支持。');
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
