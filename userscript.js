// ==UserScript==
// @name            从豆包下载无水印图片 Download Origin Image from Doubao without Watermark
// @name:en         Download Origin Image from Doubao without Watermark 从豆包下载无水印图片
// @namespace       https://github.com/catscarlet/Download-Origin-Image-from-Doubao-without-Watermark
// @description     从豆包（www.doubao.com）下载无水印图片 Download Origin Image from www.doubao.com without Watermark.
// @description:en  Download Origin Image from www.doubao.com without Watermark. 从豆包（www.doubao.com）下载无水印图片
// @version         0.3.2
// @author          catscarlet
// @license         GNU Affero General Public License v3.0
// @match           https://www.doubao.com/chat/*
// @run-at          document-end
// @grant           none
// ==/UserScript==

const removeDefaultDownloadButton = 1; //Hide Original Download Button by default. If you want the default Download Button appear as usual, set this value to 0.

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {

                if (removeDefaultDownloadButton) {
                    const EditImageDownloadButtons = document.querySelectorAll('div[data-testid="edit_image_download_button"]');

                    EditImageDownloadButtons.forEach((EditImageDownloadButton) => {
                        if (EditImageDownloadButton && EditImageDownloadButton.style.display != 'none') {

                            EditImageDownloadButton.style.display = 'none';
                        }
                    });

                }

                const images = document.querySelectorAll('img.preview-img-dplion');
                images.forEach((image) => {

                    if (!image.parentNode.querySelector('.imagelink-nowatermark')) {

                        const link = document.createElement('a');

                        link.textContent = '点击下载无水印图片';
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

                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            getCrossOriginImage(link);
                        });

                        image.parentNode.appendChild(link);
                    } else {
                        //console.log('added, skip.');
                    }
                });
            }
        }
    });

    const config = {
        childList: true,
        attributes: true,
        subtree: true,
    };

    observer.observe(document.documentElement, config);

})();

function getCrossOriginImage(link) {
    const currentTitle = document.title.replace('- 豆包', '').trim();
    const chatID = document.location.pathname.replace('/chat/', '').trim();
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const timeStr = getYmdHMS();
        const imageName = currentTitle + '-' + chatID + '-' + timeStr;

        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = imageName + '.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    img.onerror = function() {
        console.error('图片加载失败，请确保图片服务器开启了 CORS 支持。');
        alert('图片加载失败，请确保图片服务器开启了 CORS 支持。');
    };

    const imageUrl = link.parentNode.querySelector('img').src;
    img.src = imageUrl;

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
