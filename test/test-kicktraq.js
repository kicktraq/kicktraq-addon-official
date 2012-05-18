Kicktraq.URL_PREFIX = window.location.href.replace(/[^/]*$/, "");

var TABS_COUNT = 4;
var IMAGES_COUNT = 3;

module("pages");

function testAllGraphsAreLoaded(kicktraq, currentTab) {

  equal($("#kicktraq_graph img").length, IMAGES_COUNT, "all images loaded");
  equal($("#kicktraq_tabs li").length, TABS_COUNT, "all tabs loaded");

  for (var i = 0;i < IMAGES_COUNT; ++i) {
    if (i === currentTab) {
      ok($("#kicktraq_graph img:eq(" + i + ")").is(":visible"),
        "graph " + i + " is visible");
    } else {
      ok($("#kicktraq_graph img:eq(" + i + ")").is(":not(:visible)"),
        "graph " + i + " is not visible");
    }
  }
}

test("home page", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/");
  kicktraq.onDOMReady();
  testAllGraphsAreLoaded(kicktraq, 0);
});

test("updates page", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/posts");
  kicktraq.onDOMReady();
  testAllGraphsAreLoaded(kicktraq, 0);
});

test("packers page", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/backers");
  kicktraq.onDOMReady();
  testAllGraphsAreLoaded(kicktraq, 1);
});

test("comments page", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/comments");
  kicktraq.onDOMReady();
  testAllGraphsAreLoaded(kicktraq, 0);
});

module("load images");

test("images are loaded", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/");
  kicktraq.onDOMReady();
  stop();
  setTimeout(function () {
    start();
    equal($("#kicktraq_graph img").length, IMAGES_COUNT, "the images are loaded");
    equal($("#kicktraq_graph .kicktraq_error").length, 0, "display no error");
    equal($("#kicktraq_tabs li").length, TABS_COUNT, "the tabs are loaded");
  }, 200);
});

test("images in error", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickprojectinerror/");
  kicktraq.onDOMReady();
  stop();
  setTimeout(function () {
    start();
    equal($("#kicktraq_graph img").length, 0, "one image in error");
    equal($("#kicktraq_graph .kicktraq_error").length, IMAGES_COUNT, "display 1 error");
    equal($("#kicktraq_tabs li").length, TABS_COUNT, "all tabs are loaded");
  }, 200);
});


module("handle tabs");

test("tabs are working", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/");
  kicktraq.onDOMReady();
  ok($("#kicktraq_graph img:eq(0)").is(":visible"), "before : the first image is shown");
  ok($("#kicktraq_graph img:eq(1)").is(":not(:visible)"), "before : the second image is not shown");
  ok($("#kicktraq_tabs li:eq(0)").hasClass("on"), "before : the first tab is selected");
  ok(!$("#kicktraq_tabs li:eq(1)").hasClass("on"), "before : the second tab is not selected");

  $("#kicktraq_tabs li:eq(1)").click();

  ok($("#kicktraq_graph img:eq(0)").is(":not(:visible)"), "after : the first image is not shown");
  ok($("#kicktraq_graph img:eq(1)").is(":visible"), "after : the second image is shown");
  ok(!$("#kicktraq_tabs li:eq(0)").hasClass("on"), "after : the first tab is not selected");
  ok($("#kicktraq_tabs li:eq(1)").hasClass("on"), "after : the second tab is selected");

});
