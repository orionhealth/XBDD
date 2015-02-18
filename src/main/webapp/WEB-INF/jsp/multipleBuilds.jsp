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
<%@ taglib
    prefix="c"
    uri="http://java.sun.com/jsp/jstl/core" 
%>
<%
	request.setAttribute("isAdmin", request.isUserInRole("admin"));
%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<script src="${pageContext.request.contextPath}/js/moment-min.js"></script>
		<script src="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("marked.js") %>"></script>
		<script type="text/javascript">
			var product = "${it.product}",
				version = "${it.version}",
				builds = ${it.builds};
            var contextPath = "${pageContext.request.contextPath}/";
            var admin = ${requestScope['isAdmin']};
		</script>
		<!-- <link rel="stylesheet" type="text/css" href="/xbdd/css/sections.css" /> -->
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("css/bootstrap.css") %>">
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/bootstrap-custom/sidetabs.css" >
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/xbdd.css" />
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />
		<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/print.css" />
		
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
							<li><a href="javascript:void(0)" id="build-menu-trig" data-product="${it.product}">Build Select</a></li>
						</ul>
						<div class="btn-group visibility-toggle" role="group">
							<button type="button" class="btn btn-info btn-show">Show All</button>
							<button type="button" class="btn btn-warning btn-hide">Hide All</button>
						</div>
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
						<div class="loading-container">
							<h2>Loading, Please Wait</h2>
							
						</div>
						<div class="col-xs-12 hidden" id="multipleBuilds">
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 	</div> -->
		
		<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("jquery.min.js") %>"></script>
		<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("js/bootstrap.min.js") %>"></script>
		<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("yui/yui-min.js") %>"></script>
		<script src = "${pageContext.request.contextPath}/modules/xbdd.js"></script>
		<script src = "${pageContext.request.contextPath}/modules/statusHelpers.js"></script>
		<script src = "${pageContext.request.contextPath}/modules/session-timeout.js"></script>
		<script src = "${pageContext.request.contextPath}/modules/buildNav.js" /></script>
		<script src = "${pageContext.request.contextPath}/modules/multiple-builds.js" /></script>
		<script src = "${pageContext.request.contextPath}/modules/favourites.js"></script>
		<script src = "${pageContext.request.contextPath}/multipleBuilds.js" /></script>
		<c:if test="${requestScope['isAdmin']}">
			<script src = "${pageContext.request.contextPath}/admin-actions.js" /></script>
		</c:if>
	</body>
</html>