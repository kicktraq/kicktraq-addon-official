/*
 * This object is only used to inject css into a page.
 * The PageMod object from mozilla addon-sdk doesn't have (yet) the option.
 * As soon as the sdk 1.7 is out and used on this project, we should use the
 * contentStyleFile option and remove this file.
 */
window.kicktraq = {
  loadCss : function (url) {
    var head = document.getElementsByTagName('head')[0];
    if (!head) { return; } // defective HTML document
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = "stylesheet";
    link.href = url;
    head.appendChild(link);
  }
};
