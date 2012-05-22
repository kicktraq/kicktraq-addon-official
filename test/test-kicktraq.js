Kicktraq.URL_PREFIX = window.location.href.replace(/[^/]*$/, "");

// number of tabs shown
var TABS_COUNT = 4;
// number of images in the tabs
var IMAGES_COUNT = 3;

module("pages");

/**
 * Test the space given via css for a given id.
 * @param {string} bodyId the id of the body
 * @param {boolean} hasExtraBorder true if the css should add extra space, false otherwise.
 */
function checkExtraSpaceForGraph(bodyId, hasExtraBorder) {
  $(".test_body").attr("id", bodyId);
  var divHeight = Number($("#content").css("height").replace(/[^-\d\.]/g, ''));
  var threshold = 100;
  if (hasExtraBorder) {
    ok(divHeight > threshold, "the div has extra place");
  } else {
    ok(divHeight < threshold, "the div has no extra place");
  }
}

/**
 * Test that all the graphs are loaded.
 * @param {Kicktraq} kicktraq the kicktraq object.
 * @param {number} currentTab the current tab.
 */
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

/**
 * Test that no graph loaded.
 */
function testNoGraph() {
  equal($("#kicktraq").length, 0, "nothing happened");
}



/*
 * do want the graphs
 */

test("home page", function () {
  checkExtraSpaceForGraph("projects_show", true);
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/");
  kicktraq.onDOMReady();
  testAllGraphsAreLoaded(kicktraq, 0);
});

test("updates page", function () {
  checkExtraSpaceForGraph("posts_index", true);
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/posts");
  kicktraq.onDOMReady();
  testAllGraphsAreLoaded(kicktraq, 0);
});

test("backers page", function () {
  checkExtraSpaceForGraph("backers_index", true);
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/backers");
  kicktraq.onDOMReady();
  testAllGraphsAreLoaded(kicktraq, 1);
});

test("comments page", function () {
  checkExtraSpaceForGraph("projects_comments", true);
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/comments");
  kicktraq.onDOMReady();
  testAllGraphsAreLoaded(kicktraq, 0);
});

/*
 * don't want the graphs
 */

test("manage pledge page", function () {
  checkExtraSpaceForGraph("pledges_edit", false);
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/pledge/edit");
  kicktraq.onDOMReady();
  testNoGraph();
});

test("manage pledge page, updating the amount", function () {
  checkExtraSpaceForGraph("pledges_interstitial_for_update", false);
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/pledge");
  kicktraq.onDOMReady();
  testNoGraph();
});

test("new pledge, thanks page", function () {
  checkExtraSpaceForGraph("pledges_thanks", false);
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/pledge/thanks");
  kicktraq.onDOMReady();
  testNoGraph();
});

test("send message in a new page", function () {
  checkExtraSpaceForGraph("messages_new", false);
  var kicktraq = new Kicktraq("/projects/kickuser/kickproject/messages/new?message[to]=123456789");
  kicktraq.onDOMReady();
  testNoGraph();
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
    equal($("#kicktraq_graph img").length, IMAGES_COUNT - 1, "one image in error, the other are not loaded");
    equal($("#kicktraq_graph .kicktraq_error").length, 1, "display 1 error");
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

test("errors in tab are lazy", function () {
  var kicktraq = new Kicktraq("/projects/kickuser/kickprojectinerror/");
  kicktraq.onDOMReady();
  stop();
  setTimeout(function () {
    start();
    equal($("#kicktraq_graph img").length, IMAGES_COUNT - 1, "one image in error, the other are not loaded");
    equal($("#kicktraq_graph .kicktraq_error").length, 1, "display 1 error");

    $("#kicktraq_tabs li:eq(1)").click();

    stop();
    setTimeout(function () {
      start();
      equal($("#kicktraq_graph img").length, IMAGES_COUNT - 2, "2 images in error, the other are not loaded");
      equal($("#kicktraq_graph .kicktraq_error").length, 2, "display 2 errors");
    }, 200);
  }, 200);
});
