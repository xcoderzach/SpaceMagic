#!/bin/bash
echo '
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Spacemagic Init Successful</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <link href="assets/css/bootstrap-responsive.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="toc span3">
          <!--Sidebar content-->
        </div>
        <div class="span8">'>index.html
curl https://raw.github.com/xcoderzach/SpaceMagic/master/docs/index.markdown > allthedocs.md
curl https://raw.github.com/xcoderzach/LiveView/develop/docs/api.md >> allthedocs.md
curl https://raw.github.com/xcoderzach/LiveDocument/master/docs/associations.md >> allthedocs.md
curl https://raw.github.com/xcoderzach/LiveDocument/master/docs/api.md >> allthedocs.md
curl https://raw.github.com/xcoderzach/LiveController/develop/docs/api.md >> allthedocs.md
marked --gfm allthedocs.md >> index.html
echo '        </div>
      </div>
    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/bootstrap-transition.js"></script>
    <script src="assets/js/bootstrap-alert.js"></script>
    <script src="assets/js/bootstrap-modal.js"></script>
    <script src="assets/js/bootstrap-dropdown.js"></script>
    <script src="assets/js/bootstrap-scrollspy.js"></script>
    <script src="assets/js/bootstrap-tab.js"></script>
    <script src="assets/js/bootstrap-tooltip.js"></script>
    <script src="assets/js/bootstrap-popover.js"></script>
    <script src="assets/js/bootstrap-button.js"></script>
    <script src="assets/js/bootstrap-collapse.js"></script>
    <script src="assets/js/bootstrap-carousel.js"></script>
    <script src="assets/js/bootstrap-typeahead.js"></script>
    <script>
    window.onload = function () {
    $(".toc").prepend("<h2>SpaceMagic</h2><br ><i class='icon-download'></i><a href='https://github.com/xcoderzach/SpaceMagic'>Git Repository</a>")}
    $(".toc").append("<ul id='toc'></ul>")
    var TOC = $("ul#toc");
    $.each($("h2:contains(Table of Contents)"), function(i,e){
      $(e).next.remove
      $(e).remove
    })
    $.each($("h1, h2, h3"), function(i, e) {
    var heading = $(e);
    var headingText = $(e).text();
    var headingNumber = e.tagName.substring(1)
    var headingID = headingText.replace(/[^a-z0-9]/gi, "_").toLowerCase() + i;
    $(e).attr("id", headingID);
    TOC.append("<li class=\"H" + headingNumber + "\"><a href=\"#" + headingID +"\">"  + headingText + "</a></li>" )
  });
  // Put a title on the table of contents
    </script>
  <link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Josefin+Sans:400,700' rel='stylesheet' type='text/css'>

  </body>
</html>' >> index.html
