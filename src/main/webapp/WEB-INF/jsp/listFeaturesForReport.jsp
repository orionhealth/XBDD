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
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<script src="${pageContext.request.contextPath}/js/moment-min.js"></script>
<script src="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("marked.js") %>"></script>
<script type="text/javascript">
	var product = "${it.product}", version = "${it.version}", build = "${it.build}", featureFocus = "${it.featureid}",
        contextPath = "${pageContext.request.contextPath}/",
        admin = ${it.isAdmin};
</script>
<!-- <link rel="stylesheet" type="text/css" href="/xbdd/css/sections.css" /> -->
<link rel='stylesheet' type="text/css" href="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("css/bootstrap.css") %>">
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/bootstrap-custom/sidetabs.css" >
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/xbdd.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/lightbox.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("morris.css") %>" />
<title>Features for report</title>
</head>
<body data-spy="scroll" data-target="#navbar" class="yui3-skin-sam">
	<div id="titlebar"></div>
	<div id="search-results-con">
		<div id="search-results"></div>
	</div>
	<div class="container">
		<div class="left-column-container">
			<div class="row left-column-header">
			</div>
			<div class="row">
				<div id="featureIndex"></div>
			</div>
		</div>
		<div class="right-column-container">
			<div class="row" id="contentContainer">
				<div class="col-sm-12" id="buildStats"></div>
				<div class="col-sm-12" id="featureTest"></div>
			</div>
		</div>
	</div>
	<div id="phantom-missing"></div>
	<div id="panel-content" style="overflow:hidden">
	<div id="data_div" style="max-height: 650px; overflow-y: auto"></div>
	</div>
<!-- 	</div> -->
	
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("jquery.min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("js/bootstrap.min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("yui/yui-min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("raphael.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/<%= org.webjars.AssetLocator.getWebJarPath("morris.min.js") %>"></script>
	<script src = "${pageContext.request.contextPath}/modules/xbdd.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/statusHelpers.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/favourites.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/pdf-print.js" /></script>
	<script src = "${pageContext.request.contextPath}/modules/feature-test.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/feature-index.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/rollupFeature.js" /></script>
	<script src = "${pageContext.request.contextPath}/modules/searchFeatures.js" /></script>
	<script src = "${pageContext.request.contextPath}/modules/buildNav.js" /></script>
	<script src = "${pageContext.request.contextPath}/modules/gallery-lightbox.js" /></script>
	<script src = "${pageContext.request.contextPath}/modules/buildStats.js" /></script>
	<script src = "${pageContext.request.contextPath}/modules/session-timeout.js"></script>
	<script src = "${pageContext.request.contextPath}/modules/featureNavigationHelper.js" /></script>
	<script src = "${pageContext.request.contextPath}/listFeaturesForReport.js" /></script>
	<c:if test="${requestScope['isAdmin']}">
	<script src = "${pageContext.request.contextPath}/admin-actions.js" /></script>
	</c:if>

</body>
</html>