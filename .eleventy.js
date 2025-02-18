
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
    // Profile picture shortcode
    eleventyConfig.addShortcode("photo", function (url) {
        return `<img alt="Photo of Arol" class="profile-photo" src="https://www.gravatar.com/avatar/7e45f50667c4ed988aee238bab4fb7a03449ad993c42e230317afaa1417c6140?s=500">`
    });
    // Redirect shortcode
    eleventyConfig.addShortcode("redirect", function (url) {
        return `<p>You are being redirected...</p><meta http-equiv="refresh" content="0; url=${url}" />`
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
