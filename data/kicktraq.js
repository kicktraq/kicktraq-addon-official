jQuery(function($){
var $pathname = window.location.pathname;

/*
 * graphs to be displayed on the homepage of the project.
 */
var homeGraphs = [
  {
    name : "funding",
    graph : "dailychart.png"
  }/*,
  {
    name : "projection cone",
    graph : "exp-cone.png"
  },
  {
    name : "funding trend",
    graph : "exp-trend.png"
  }
  */
];

/*
 * graphs to be displayed on the backers page of the project.
 */
var backersGraphs = [
  {
    name : "backers/day",
    graph : "backerchart.png"
  },
  {
    name : "pledges/day",
    graph : "dailypledges.png"
  }
];

// default to not showing
var myGraph = null;
var myExtras = false;


// aquire URL tokens
myURL = $pathname.split('/');

// check for 4th token in path
if(myURL[4]) {

    // rebuild path
    $pathname = "/" + myURL[1] + "/" + myURL[2] + "/" + myURL[3];

    if(myURL[4].substr(0,1) == '?') {
        // it's a query string, we're good
        myGraph = homeGraphs;
        myExtras = true;
    } else {
        myExtras = false;

        // test for valid URL
        switch (myURL[4]) {
            case 'comments':
            case 'posts':
                myExtras = true;
                break;
            case 'backers':
                myGraph = backersGraphs;
                myExtras = true;
                break;
            default:
                // don't show anything else with a 6th token
                break;
        }
    }
} else {
    myGraph = homeGraphs;
}

if(myGraph) {

    // the main template for the graphs.
    var $kicktraq = $(
    '<div id="kicktraq">' +
    '  <div id="kicktraq_placeholder">(loading your very own snazzy kicktraq chart)</div>' +
    '  <div id="kicktraq_graph">' +
    '    <a href="http://kicktraq.com' + $pathname + '/" target="_blank"></a>' +
    '  </div>' +
    '  <ul id="kicktraq_tabs"></ul>' +
    '  <div class="kicktraq_rst"></div>' +
    '</div>'
    ), graphImg, graphBtn;

    // callback used if the image can't load properly.
    var handleImageError = function (event) {
      var $img = $(this);
      $img.after($("<p></p>", {
        // same id, hide/show as the images
        'id'    : $img.attr("id"),
        // same style, hidden as the image
        'style' : $img.attr("style"),
        'text'  : "Kicktraq : error loading image !",
        'class' : "kicktraq_error"
      })).remove();
    };

    // for each graph, create the DOM elements
    for (var i = 0; i < myGraph.length; ++i) {
      graphImg = $("<img />", {
        'id'  : "kicktraq_graph_" + i
      })
      .bind("error", handleImageError)
      .attr("src", "http://kicktraq.com/" + $pathname + "/" + myGraph[i].graph);

      graphBtn = $("<li>", {
        'text'  : myGraph[i].name
      }).data("for", "#kicktraq_graph_" + i);

      if (i === 0) {
        // first graph, default
        graphBtn.addClass("on");
      } else {
        graphImg.hide();
      }

      $kicktraq.find("#kicktraq_graph a").append(graphImg);
      $kicktraq.find("#kicktraq_tabs").append(graphBtn);
    }

    // with only one tab, don't show the bar
    if (myGraph.length === 1) {
      $kicktraq.find("#kicktraq_tabs").hide();
    }

    // handle tabs
    $kicktraq.on("click", "#kicktraq_tabs li", function () {
      // handle the tab bar
      $("#kicktraq_tabs li").removeClass("on");
      $(this).addClass("on");

      // handle the images
      $("#kicktraq_graph a > *").hide();
      $($(this).data("for"))
      .show()
      // scroll to show the whole graph
      .get(0).scrollIntoView();
    });

    $("#content").prepend($kicktraq);
}



// alert(myExtras);

if(myExtras == true) {
    // coming soon
}
});
