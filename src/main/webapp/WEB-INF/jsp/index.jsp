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
<%@page import="java.io.File"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.net.URL"%>
<%@page import="java.io.FileReader"%>
<%@page import="java.io.BufferedReader"%>
<%@ page language="java" contentType="text/html; charset=US-ASCII" pageEncoding="US-ASCII"%>
<%@ taglib
    prefix="c"
    uri="http://java.sun.com/jsp/jstl/core" 
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">
<script type="text/javascript">
	var contextPath = "${pageContext.request.contextPath}/";
	var admin = ${it.isAdmin};
</script>
<title>Welcome to XBDD</title>

<!-- Bootstrap core CSS -->
<link rel="stylesheet" type="text/css" href="<%= org.webjars.AssetLocator.getWebJarPath("css/bootstrap.css") %>">
<link rel="stylesheet" type="text/css" href="./css/bootstrap-custom/sidetabs.css">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />

<!-- <link href="./css/sections.css" rel="stylesheet"> -->

<!-- Custom styles for this template -->
<!--     <link href="jumbotron-narrow.css" rel="stylesheet"> -->

<!-- Just for debugging purposes. Don't actually copy this line! -->
<!--[if lt IE 9]><script src="../../docs-assets/js/ie8-responsive-file-warning.js"></script><![endif]-->

<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
</head>

<body class="yui3-skin-sam">
	<div id = "upload-feature"></div>
	<nav class="navbar navbar-fixed-top navbar-inverse" role="navigation">
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
					<li class=""><a href="${pageContext.request.contextPath}/logout">Logout</a></li>
				</ul>
				<div class="navbar-nav navbar-right">
					<a class="btn btn-default btn-success open-upload navbar-btn" role="button" id="open-prompt-button">Upload New Product</a>
				</div>
			</div>
		</div>
		<!-- /.container -->
	</nav>
	<!-- /.navbar -->
	<div class="container" role="main">
		<div class="row row-offcanvas row-offcanvas-right">
			<div class="jumbotron">
				<h1>Welcome to XBDD</h1>
				<p class="lead">
				<%
				String jspPath = session.getServletContext().getRealPath("/WEB-INF/jsp");
	            String txtFilePath = jspPath+ "/msg.txt";
	           	BufferedReader reader = new BufferedReader(new FileReader(txtFilePath));
	            StringBuilder sb = new StringBuilder();
	            String line;

	            while((line = reader.readLine())!= null){
	                sb.append(line+"\n");
	            }
				%>
				</p>
				<p>
					<button data-toggle="modal" data-target="#help-modal" class="btn btn-lg btn-success" role="button">Help</button>
				</p>
			</div>
			<div class="row">
				<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right-md">
					<div class="page-zone">
						<h2>Favorites</h2>
						<div id="favourites-container"></div>
					</div>
				</div>
				<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
					<div class="page-zone">
						<h2>Products <input class="product-search pull-right form-control" placeholder="Type to Search"></h2>
						<div id="products-list"></div>
					</div>
				</div>
				<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
					<div class="page-zone">
						<h2>Recent Features</h2>
						<div id="recent-features-list"></div>
						<h2>Recent Builds</h2>
						<div id="recent-reports-list"></div>
					</div>
				</div>
			</div>
			<div class="footer">
				<p>&copy; William Bath 2013</p>
			</div>
		</div>
	</div>
	<!-- /container -->

	<div class="modal fade" id="help-modal">
		<div class="modal-dialog" style="width:90%; height: 90%;">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h4 class="modal-title">XBDD Help</h4>
				</div>
				<div class="modal-body" style="overflow: auto">
					<div class="help-nav">
						
					</div>
					<div class="help-content">
						<div id="help-content"></div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->


	<!-- Bootstrap core JavaScript
    ================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src ="<%= org.webjars.AssetLocator.getWebJarPath("jquery.min.js") %>"></script>
	<script src ="<%= org.webjars.AssetLocator.getWebJarPath("js/bootstrap.min.js") %>"></script>
	<script src ="<%= org.webjars.AssetLocator.getWebJarPath("yui/yui-min.js") %>"></script>
	<script src="${pageContext.request.contextPath}/modules/statusHelpers.js"></script>
	<script src="${pageContext.request.contextPath}/modules/favourites.js"></script>
	<script src="${pageContext.request.contextPath}/modules/xbdd.js"></script>
	<script src="${pageContext.request.contextPath}/modules/formInput.js"></script>
	<script src="${pageContext.request.contextPath}/modules/upload.js"></script>
	<script src="${pageContext.request.contextPath}/modules/feature-test.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/session-timeout.js"></script>
	<script src="${pageContext.request.contextPath}/modules/buildNav.js"></script>
	<script src="${pageContext.request.contextPath}/js/moment-min.js"></script>
	<script src="${pageContext.request.contextPath}/index.js"></script>
	<script src="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("marked.js") %>"></script>
	<c:if test="${it.isAdmin}">
	<script src = "${pageContext.request.contextPath}/admin-actions.js" /></script>
	</c:if>
</body>
</html>