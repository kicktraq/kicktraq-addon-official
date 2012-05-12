var data = require("self").data;

// This is an active module of the pyrowolf (2) Add-on
exports.main = function() {
    var pageMod = require("page-mod");
    pageMod.PageMod({
        include: "http://www.kickstarter.com/projects/*",
        contentScriptWhen: 'start',
        contentScriptFile: [
          data.url("jquery-1.7.2.min.js"),
          data.url("kicktraq.js"),

          // TODO : remove this fix when the addon-sdk v1.7 is out
          data.url("kicktraq_css_firefox.js")
        ],
        // TODO : remove this fix when the addon-sdk v1.7 is out
        contentScript: "kicktraq.loadCss('" + data.url("css/kicktraq.css") + "')"
        // not before the addon-sdk v1.7
        // contentStyleFile : [data.url("css/kicktraq.css")]
    });
};

require("widget").Widget({
    id: "kicktraq",
    label: "KickTraq",
    contentURL: "http://kicktraq.com/favicon.ico",
    onClick: function(event) {
        require("tabs").open("http://www.kicktraq.com");
    }
});
