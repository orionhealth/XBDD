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
	var product = "${it.product}", version = "${it.version}", contextPath = "${pageContext.request.contextPath}/";
</script>
<!-- <link rel="stylesheet" type="text/css" href="/xbdd/css/sections.css" /> -->
<link rel='stylesheet' type="text/css" href="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("css/bootstrap.css") %>">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/bootstrap-custom/sidetabs.css" >
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/xbdd.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/lightbox.css" />
<title>Features for report</title>
</head>
<body data-spy="scroll" data-target="#navbar" class="yui3-skin-sam">
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
					<li><a href="${pageContext.request.contextPath}/">Return to Products</a></li>
				</ul>
			</div>
			<!-- /.nav-collapse -->
		</div>
		<!-- /.container -->
	</div>
	<div class="container">
		<noscript>
			<div class="alert alert-danger" role="alert">
				<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
				<span class="sr-only">Error:</span>
				Enable JavaScript to use XBDD
			</div>
		</noscript>
		<div class="list-container">
			<div class="row order-controls">
				<div class="col-xs-12">
					<button class="btn btn-info" id="do-order" data-toggle="tooltip" data-placement="left" title="Attempts to automatically sort the builds">Auto Sort</button>
				</div>
				<div class="col-xs-12 voffset1">
					<div class="row">
						<div class="col-xs-6"><button class="btn btn-warning col-xs-6 voffset1" id="revert-order" disabled="disabled">Revert</button></div>
						<div class="col-xs-6"><button class="btn btn-success col-xs-6 voffset1" id="save-order" disabled="disabled">Save</button></div>
					</div>
				</div>
			</div>
			<div id="build-list">
				
			</div>
		</div>
	</div>
	
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("jquery.min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("js/bootstrap.min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("yui/yui-min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/modules/xbdd.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/statusHelpers.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/buildNav.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/session-timeout.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/build-reordering.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/session-timeout.js"></script>
	<script src = "${pageContext.request.contextPath}/js/sortable.js"></script>
	<script src = "${pageContext.request.contextPath}/buildReOrdering.js"></script>
</body>
</html>