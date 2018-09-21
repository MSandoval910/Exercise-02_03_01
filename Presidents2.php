<!doctype html>
<!--
    Exercise 02_03_01
    Author: Mario Sandoval
    Date: 09.19.2018
   Presidents2.php
-->
<html>
	<head>
		<title>Presidents</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="initial-scale=1.0">
		<script src="modernizr.custom.65897.js"></script>
	</head>

	<body>
	<h2>Presidents 2</h2>
<?php
        $presidents = "George Washington; john Adams; thomas Jefferson; James Madison; James Monroe";
        $thisPresident = strtok($presidents, ";");
        while($thisPresident != NULL) {
            echo "$thisPresident<br>";
            $thisPresident = strtok(";");
        }
        ?>
	</body>
</html>