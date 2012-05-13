var kicktraqObj = {

  /*
   * graphs to be displayed on the backers page of the project.
   */
  graphs : {
    "home" : [
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
    ],
    "backers" : [
      {
        name : "backers/day",
        graph : "backerchart.png"
      },
      {
        name : "pledges/day",
        graph : "dailypledges.png"
      }
    ]
  },

  /**
   * Init the kicktraq object, prepare the graphs
   * @param {string} pathname the path of the current page
   */
  init : function (pathname) {
    var currentGraphs = this._findCurrentGraphs(pathname);
    var kicktraqPath = this._buildKicktraqPath(pathname);
    if (currentGraphs) {
      this.$kicktraq = this._buildGraph(currentGraphs, kicktraqPath);
    }
  },

  /**
   * Find which graphs should be displayed.
   * @param {string} pathname the path of the current page
   * @return {array} the graphs.
   * @see this.graphs
   */
  _findCurrentGraphs : function (pathname) {

    var graph = null;

    // aquire URL tokens
    var myURL = pathname.split('/');

    // check for 4th token in path
    if(myURL[4]) {

      // test for valid URL
      switch (myURL[4]) {
        case 'comments':
        case 'posts':
          break;
        case 'backers':
          graph = "backers";
          break;
        default:
          break;
      }
    } else {
      graph = "home";
    }

    return this.graphs[graph];
  },

  /**
   * Create the kicktraq path from the current project path.
   * @param {string} pathname the path of the current page.
   * @return {string} the kicktraq url
   */
  _buildKicktraqPath : function (pathname) {
    var myURL = pathname.split('/');
    return "http://kicktraq.com/" + myURL[1] + "/" + myURL[2] + "/" + myURL[3];

  },

  /**
   * Create the DOM elements displaying the graphs.
   * @param {string} currentGraphs the graphs to display.
   * @param {string} kicktraqPath the path to the project on kicktraq.
   * @return {jQuery} the jQuery object containing the generated DOM fragment.
   */
  _buildGraph : function (currentGraphs, kicktraqPath) {
    // the main template for the graphs.
    var $kicktraq = $(
      '<div id="kicktraq">' +
      '  <div id="kicktraq_placeholder">(loading your very own snazzy kicktraq chart)</div>' +
      '  <div id="kicktraq_graph">' +
      '    <a href="' + kicktraqPath + '/" target="_blank"></a>' +
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
    for (var i = 0; i < currentGraphs.length; ++i) {
      graphImg = $("<img />", {
        'id'  : "kicktraq_graph_" + i
      })
      .bind("error", handleImageError)
      .attr("src", kicktraqPath + "/" + currentGraphs[i].graph);

      graphBtn = $("<li>", {
        'text'  : currentGraphs[i].name
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
    if (currentGraphs.length === 1) {
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

    return $kicktraq;
  },

  /**
   * Add the graphs to the page.
   * This should be called when the DOM is ready.
   */
  onDOMReady : function () {
    if (this.$kicktraq) {
      $("#content").prepend(this.$kicktraq);
    }
  }
};



kicktraqObj.init(window.location.pathname);

jQuery(function($){
  kicktraqObj.onDOMReady();
});

