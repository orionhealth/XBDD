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
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>User Login</title>
<!-- Bootstrap core CSS -->
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/loginStyle.css" />
</head>
<body>
	<div class="navbar navbar-fixed-top navbar-inverse" >
		<div class="container">
			<div class="navbar-header">
				<a class="navbar-brand">XBDD</a>
			</div>
		</div>
		<!-- /.container -->
	</div>
	<!-- /.navbar -->	
	<div class="container">
		<div class="row">		
			<div class="login-badge badge">
			<h1>User Login </h1>
			<div class="text-plain">Please enter log-in details</div>
			<p></p>
				<form method="POST"  
					action='<%=response.encodeURL("j_security_check")%>' id="loginform">			
					<fieldset>
						<div class="form-group"><label for = "j_username">Username: </label>
							<input type="text" name="j_username" id="j_username" class="form-control" autofocus="autofocus">
						</div>
						<div class="form-group"><label for = "j_password">Password: </label>
							<input type="password" name="j_password" id="j_password"class="form-control">
						</div>
						<div class="form-group">
							<input type="reset"
								class="btn btn-default btn-success btn-reset" class="form-control">
							<input type="submit" value="Log In"
								class="btn btn-default btn-success btn-login" class="form-control">
						</div>
					</fieldset>			
				</form>		
			</div>			
			<div class="footer">
			</div>
		</div>
	</div>
	<!-- /container -->
</body>
</html>

<%
	response.setStatus(response.SC_FORBIDDEN);
%>
