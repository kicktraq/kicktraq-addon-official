jQuery(function($){
var $pathname = window.location.pathname;

// default to not showing
var myGraph = "";
var myExtras = false;


// aquire URL tokens
myURL = $pathname.split('/');

// check for 4th token in path
if(myURL[4]) {

    // rebuild path
    $pathname = "/" + myURL[1] + "/" + myURL[2] + "/" + myURL[3];

    if(myURL[4].substr(0,1) == '?') {
        // it's a query string, we're good
        myGraph = "dailychart.png"
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
                myGraph = "backerchart.png"
                myExtras = true;
                break;
            default:
                // don't show anything else with a 6th token
                break;
        }
    }
} else {
    myGraph = "dailychart.png"
}



if(myGraph) {

    myGraphCode =
    '<div id="kicktraq">' +
    '  <div id="kicktraq_placeholder">(loading your very own snazzy kicktraq chart)</div>' +
    '  <div id="kicktraq_graph"><a href="http://kicktraq.com' + $pathname + '/" target="_blank"><img src="http://kicktraq.com/' + $pathname + '/' + myGraph + '"></a></div>' +
    '</div>';

    $("#content").prepend(myGraphCode);
}



// alert(myExtras);

if(myExtras == true) {
    // coming soon
}
});
