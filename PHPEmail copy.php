<!doctype html>
<!--
    Exercise 02_03_01
    Author: Mario Sandoval
    Date: 09.19.2018
    PHPEmail.php
-->
<html>
	<head>
		<title>Page Title</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="initial-scale=1.0">
		<script src="modernizr.custom.65897.js"></script>
	</head>

	<body>
<h2>PHP Email</h2>
<?php
        $emailAddresses = array("John.smith@php.test", "mary.smith.mail@php.example", "john.jones@php.invalid", "alan.smithee@test", "jsmith456@example.com", "jsmith456@test", "mjones@example", "mjones@example.net", "jane.a.doe@example.org");
        function validateAddress($address){
            if(strpos($address, "@") !== false && strpos($address, ".")){
                return true;
            } else{
                return false;
            }
        }
        foreach($emailAddresses as $thisAddress) {
            if(validateAddress($thisAddress) === false){
                echo "<p>the e-mail address <em>$thisAddress</em> does not appear to be valid.</p>";
            }
        }
        
        ?>
	</body>
</html>