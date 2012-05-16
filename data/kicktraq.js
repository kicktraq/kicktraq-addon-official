function Kicktraq(pathname) {
  this.init(pathname);
};

Kicktraq.URL_PREFIX = "http://kicktraq.com/";

Kicktraq.prototype = {

  /*
   * graphs to be displayed on the backers page of the project.
   */
  graphs : {
    "funding" : {
      text : "funding",
      image : "dailychart.png"
    }/*,
    "projection" : {
      text : "projection cone",
      image : "exp-cone.png"
    },
    "trend" : {
      text : "funding trend",
      image : "exp-trend.png"
    }*/,
    "backers" : {
      text : "backers/day",
      image : "backerchart.png"
    },
    "pledges" : {
      text : "pledges/day",
      image : "dailypledges.png"
    }
  },

  /**
   * Init the kicktraq object, prepare the graphs
   * @param {string} pathname the path of the current page
   */
  init : function (pathname) {
    var currentGraph = this._findCurrentGraph(pathname);
    var kicktraqPath = this._buildKicktraqPath(pathname);
    if (currentGraph) {
      this.$kicktraq = this._buildGraph(currentGraph, kicktraqPath);
    }
  },

  /**
   * Find which graph should be displayed.
   * @param {string} pathname the path of the current page
   * @return {string} the graph to display.
   * @see this.graphs
   */
  _findCurrentGraph : function (pathname) {

    var graph = "funding";

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
    }

    return graph;
  },

  /**
   * Create the kicktraq path from the current project path.
   * @param {string} pathname the path of the current page.
   * @return {string} the kicktraq url
   */
  _buildKicktraqPath : function (pathname) {
    var myURL = pathname.split('/');
    return Kicktraq.URL_PREFIX + myURL[1] + "/" + myURL[2] + "/" + myURL[3];

  },

  /**
   * Create the DOM elements displaying the graphs.
   * @param {string} currentGraph the graph to display.
   * @param {string} kicktraqPath the path to the project on kicktraq.
   * @return {jQuery} the jQuery object containing the generated DOM fragment.
   */
  _buildGraph : function (currentGraph, kicktraqPath) {
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
    for (var name in this.graphs) {
      if( !this.graphs.hasOwnProperty(name) ) { continue; }
      var graph = this.graphs[name];
      graphImg = $("<img />", {
        'id'  : "kicktraq_graph_" + name
      })
      .bind("error", handleImageError)
      .attr("src", kicktraqPath + "/" + graph.image);

      graphBtn = $("<li>", {
        'text'  : graph.text
      }).data("for", "#kicktraq_graph_" + name);

      if (name === currentGraph) {
        // selected graph
        graphBtn.addClass("on");
      } else {
        graphImg.hide();
      }

      $kicktraq.find("#kicktraq_graph a").append(graphImg);
      $kicktraq.find("#kicktraq_tabs").append(graphBtn);
    }

    // with only one tab, don't show the bar
    if (this.graphs.length === 1) {
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
      .show();
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

