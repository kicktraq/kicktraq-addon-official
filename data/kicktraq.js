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
   * @return {string} the graph to display, null if none should be displayed.
   * @see this.graphs
   */
  _findCurrentGraph : function (pathname) {

    var graph = null;

    // aquire URL tokens
    var myURL = pathname.split('/');

    // check for 4th token in path
    if(myURL[4]) {

      // test for valid URL
      switch (myURL[4]) {
        case 'comments':
        case 'posts':
          graph = "funding";
          break;
        case 'backers':
          graph = "backers";
          break;
        default:
          break;
      }
    } else { // main page
      graph = "funding";
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
    // the object containing the parts of the Kicktraq graphs.
    // Put only empty tags in $, see
    // https://developer.mozilla.org/en/XUL_School/DOM_Building_and_HTML_Insertion
    var k = {
      // the main div
      main : $("<div>", {
        id : "kicktraq"
      }),
      // placeholder, while the image is loading
      placeholder : $("<div>", {
        id : "kicktraq_placeholder",
        text : "(loading your very own snazzy kicktraq chart)"
      }),
      // contains the graphs
      graph : $("<a>", {
        id : "kicktraq_graph",
        href : kicktraqPath,
        target:"_blank"
      }),
      // contains the tabs
      tabs : $("<ul>", {
        id : "kicktraq_tabs"
      }),
      // empty div, used by the css rules
      rst : $("<div>", {
        'class' : "kicktraq_rst"
      })
    }, graphImg, graphBtn;

    // callback used if the image can't load properly.
    var handleImageError = function (event) {
      var $img = $(this);
      $img.after($("<p>", {
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
      graphImg = $("<img>", {
        'id'  : "kicktraq_graph_" + name
      })
      // don't set the src attr yet
      .data("src", kicktraqPath + "/" + graph.image)
      .bind("error", handleImageError);

      graphBtn = $("<li>", {
        'text'  : graph.text
      }).data("for", "#kicktraq_graph_" + name);

      if (name === currentGraph) {
        // selected graph
        graphBtn
        .addClass("on")
        .data("loaded", true);

        graphImg.attr("src", graphImg.data("src"));
      } else {
        graphImg.hide();
      }

      k.graph.append(graphImg);
      k.tabs.append(graphBtn);
    }

    // with only one tab, don't show the bar
    if (this.graphs.length === 1) {
      k.tabs.hide();
    }

    // handle tabs
    k.tabs.find("li").on("click", function () {
      var $tab = $(this), $img = $($tab.data("for"));

      // handle the tab bar
      k.tabs.find("li").removeClass("on");
      $tab.addClass("on");

      // handle the images
      k.graph.find("> *").hide();
      $img.show();

      // async load
      if (!$tab.data("loaded")) {
        $tab.data("loaded", true);
        $img.attr("src", $img.data("src"));
      }
    });

    k.tabs.append(
      $("<li>").append(
        $("<a>", {
          text : "more info",
          href : kicktraqPath
        })
      )
    );

    return k.main
    .append(k.placeholder)
    .append(k.graph)
    .append(k.tabs)
    .append(k.rst);
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

