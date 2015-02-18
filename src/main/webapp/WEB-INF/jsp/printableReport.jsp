<%--

    Copyright (C) 2015 Orion Health (Orchestral Development Ltd)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

--%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<script src="${pageContext.request.contextPath}/js/moment-min.js"></script>
<script src="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("marked.js") %>"></script>
<script type="text/javascript">
    var product = "${it.product}", version = "${it.version}", build = "${it.build}";
    var contextPath = "${pageContext.request.contextPath}/";
</script>
<!-- <link rel="stylesheet" type="text/css" href="/xbdd/css/sections.css" /> -->
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("css/bootstrap.css") %>">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/bootstrap-custom/sidetabs.css" >
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/xbdd.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/print.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("morris.css") %>" />

<title>Features for report</title>
</head>
<body data-spy="scroll" data-target="#navbar">
<div class="hidden-print">
	<div class="navbar navbar-fixed-top navbar-inverse" role="navigation">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#xbdd-menu">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a href="${pageContext.request.contextPath}/" class="navbar-brand">XBDD</a>
			</div>
			<div class="collapse navbar-collapse" id="xbdd-menu">
				<ul class="nav navbar-nav">
					<li></li>
					<li><a id="return">Return to Features</a></li>
					<li class="dropdown"><a href="#" class="dropdown-toggle"
						data-toggle="dropdown">Printing Options <b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a href="#" class="print-drop-down" id = "view-PDF">View a PDF report</a></li>
							<li><a href="#" class="print-drop-down" id = "download-PDF">Download a PDF report</a></li>
						</ul></li>
						<li class=""><a class="glyphicon glyphicon-info-sign info-icon"></a>
				<div class="profile-hover"><label class="glyphicon glyphicon-warning-sign"><a></a></label>
				Warning: Will not print to PDF if PhantomJS is not installed</div>
				</li>
				</ul>
			</div>
			<!-- /.nav-collapse -->
		</div>
		<!-- /.container -->
	</div>
	<div id = "phantom-missing"></div>
	<!-- /.navbar -->
</div>
<!-- 	<div id="titlebar"></div> -->
	<div class="container">
		<div class="row">
			<div class="col-sm-12" >
				<div class="row">
					<div class="col-xs-12 hidden-print" id="controls">
						<div class="btn-group btn-group-justified">
							<a class="btn btn-success" data-status="passed"><span class="glyphicon glyphicon-ok-sign"></span> Passed</a>
							<a class="btn btn-danger" data-status="failed"><span class="glyphicon glyphicon-remove-sign"></span> Failed</a>
							<a class="btn btn-warning" data-status="undefined"><span class="glyphicon glyphicon-question-sign"></span> Undefiend</a>
							<a class="btn btn-info" data-status="skipped"><span class="glyphicon glyphicon-minus-sign"></span> Skipped</a>
						</div>
						<div class="btn-group btn-group-justified voffset1">
							<a class="btn btn-primary">Hide Attachments</a>
							<a class="btn btn-primary" data-toggle="modal" data-target="#featureSelect">Choose Features</a>
						</div>
					</div>
					<div class="col-xs-12" id="buildStats"></div>
					<div class="col-xs-12" id="featureTest"></div>
				</div>
			</div>
		</div>
	</div>
<!-- 	</div> -->
	<div class="modal fade" id="featureSelect">
		<div class="modal-dialog" style="width: 80%">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">Feature Select</h4>
				</div>
				<div class="modal-body transition-buttons">
					<div class="row">
						<div class="col-xs-10 col-xs-offset-1">
							<div class="row btn-group select-all" style="margin: 0">
								<a class="btn btn-success col-xs-5 btn-faded xbdd-offset-833" id="selectAllFeatures">Select All</a>
								<a class="btn btn-danger col-xs-5" id="selectNoFeatures">Select None</a>
							</div>
						</div>
						<div class="col-xs-6">
							<h4>Feature List</h4>
							<div id="featureSelectList"></div>
						</div>
						<div class="col-xs-6">
							<h4>Tags</h4>
							<div id="featureSelectTags"></div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
					<button type="button" class="btn btn-primary" id="makeFeatureSelection">Make Selection</button>
				</div>
			</div>
		</div>
	</div>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("jquery.min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("js/bootstrap.min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("yui/yui-min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("raphael.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("morris.min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/modules/xbdd.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/statusHelpers.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/pdf-print.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/feature-test.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/feature-index.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/rollupFeature.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/searchFeatures.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/session-timeout.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/buildStats.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/print-feature-select.js"></script>
	<script src = "${pageContext.request.contextPath}/printableReport.js"></script>
</body>
</html>