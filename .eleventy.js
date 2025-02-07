
const Parser = require('rss-parser');
const parser = new Parser();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Eleventy configuration
module.exports = function (eleventyConfig) {
    // Add favicon to site
    eleventyConfig.addPassthroughCopy("favicon.ico");
    // Add robots.txt to site
    eleventyConfig.addPassthroughCopy("robots.txt");
    // Add media folder to site
    eleventyConfig.addPassthroughCopy("media");
    // Add main JS
    eleventyConfig.addPassthroughCopy("main.js");
    // Download button shortcode
    eleventyConfig.addShortcode("downloadBtn", function (platform, url) {
        var html = '';
        if (platform === 'chrome') {
            html = `<a href="${url}" target="_blank" class="btn-container"><img src="/media/chrome-button.png" alt="Download on Chrome Web Store" /></a>`;
        } else if (platform === 'firefox') {
            html = `<a href="${url}" target="_blank" class="btn-container"><img src="/media/firefox-button.png" alt="Download for Firefox" /></a>`;
        } else if (platform === 'edge') {
            html = `<a href="${url}" target="_blank" class="btn-container"><img src="/media/microsoft-button.png" alt="Download for Microsoft Edge" /></a>`;
        }
        return html;
    });
    // Profile picture shortcode
    eleventyConfig.addShortcode("photo", function (url) {
        return `<img alt="Photo of Arol" class="profile-photo" src="https://www.gravatar.com/avatar/7e45f50667c4ed988aee238bab4fb7a03449ad993c42e230317afaa1417c6140?s=500">`
    });
    // Redirect shortcode
    eleventyConfig.addShortcode("redirect", function (url) {
        return `<p>You are being redirected...</p><meta http-equiv="refresh" content="0; url=${url}" />`
    });
    // Letterboxd shortcode
    eleventyConfig.addShortcode("letterboxd", async function (url) {
        let html = '';
        let feed = await parser.parseURL('https://letterboxd.com/corbindavenport/rss/');
        // console.log('Parsed feed:', feed);
        for (let i = 0; i < Math.min(feed.items.length, 5); i++) {
            let review = feed.items[i];
            let snippet = review.contentSnippet;
            if (snippet.length > 300) {
                snippet = snippet.substring(0, 300) + '...';
            }
            html += '<p><a href="' + review.link + '" target="_blank" rel="nofollow">' + review.title + '</a><br /><i>' + snippet + '</i></p>';
        }
        return html;
    });
    // Set nofollow, noreferrer, noopener, and target blank attributes for all external links
	eleventyConfig.addTransform("update-links", async function (content) {
        const dom = new JSDOM(content);
		dom.window.document.querySelectorAll('a').forEach(function (el) {
            if (el.href.startsWith('https://') || el.href.startsWith('http://')) {
                el.setAttribute('rel', 'nofollow noreferrer noopener');
                el.setAttribute('target', '_blank');
            }
        });
        return dom.serialize();
	});
};
