Kicktraq.URL_PREFIX = window.location.href.replace(/[^/]*$/, "");

module("pages");

test("home page", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/");
  kicktraq.onDOMReady();
  equal($("#kicktraq_graph img").length, 1, "only one image loaded");
  equal($("#kicktraq_tabs li").length, 1, "only one tab loaded");
  ok(!$("#kicktraq_tabs li").is(":visible"), "one tab : don't show it.");
});

test("updates page", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/posts");
  kicktraq.onDOMReady();
  equal($("#kicktraq_graph img").length, 0, "no image loaded");
  equal($("#kicktraq_tabs li").length, 0, "no tab loaded");
});

test("packers page", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/backers");
  kicktraq.onDOMReady();
  equal($("#kicktraq_graph img").length, 2, "two images loaded");
  equal($("#kicktraq_tabs li").length, 2, "two tabs loaded");
  ok($("#kicktraq_tabs li").is(":visible"), "two tabs : the bar is visible.");
});

test("comments page", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/comments");
  kicktraq.onDOMReady();
  equal($("#kicktraq_graph img").length, 0, "no image loaded");
  equal($("#kicktraq_tabs li").length, 0, "no tab loaded");
});

module("load images");

test("images are loaded", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/");
  kicktraq.onDOMReady();
  stop();
  setTimeout(function () {
    start();
    equal($("#kicktraq_graph img").length, 1, "the image is loaded");
    equal($("#kicktraq_graph .kicktraq_error").length, 0, "display no error");
    equal($("#kicktraq_tabs li").length, 1, "1 tab loaded");
  }, 200);
});

test("images in error", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickprojectinerror/");
  kicktraq.onDOMReady();
  stop();
  setTimeout(function () {
    start();
    equal($("#kicktraq_graph img").length, 0, "no image loaded");
    equal($("#kicktraq_graph .kicktraq_error").length, 1, "display 1 error");
    equal($("#kicktraq_tabs li").length, 1, "1 tab loaded");
  }, 200);
});


module("handle tabs");

test("tabs are working", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/backers");
  kicktraq.onDOMReady();
  ok( $("#kicktraq_graph img:eq(0)").is(":visible"), "before : the first image is shown");
  ok(!$("#kicktraq_graph img:eq(1)").is(":visible"), "before : the second image is not shown");
  ok( $("#kicktraq_tabs li:eq(0)").hasClass("on"),   "before : the first tab is selected");
  ok(!$("#kicktraq_tabs li:eq(1)").hasClass("on"),   "before : the second tab is not selected");

  $("#kicktraq_tabs li:eq(1)").click();

  ok(!$("#kicktraq_graph img:eq(0)").is(":visible"), "after : the first image is not shown");
  ok( $("#kicktraq_graph img:eq(1)").is(":visible"), "after : the second image is shown");
  ok(!$("#kicktraq_tabs li:eq(0)").hasClass("on"),   "after : the first tab is not selected");
  ok( $("#kicktraq_tabs li:eq(1)").hasClass("on"),   "after : the second tab is selected");

});
