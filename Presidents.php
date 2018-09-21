<!doctype html>
<!--
    Exercise 02_03_01
    Author: Mario Sandoval
    Date: 09.19.2018
    Presidents.php
-->
<html>
	<head>
		<title>Presidents</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="initial-scale=1.0">
		<script src="modernizr.custom.65897.js"></script>
	</head>

	<body>
	<h2>Presidents</h2>
<?php
        $presidents = array("George Washington", "john Adams", "thomas Jefferson", "James Madison", "James Monroe");
        $yearsInOffice = array("1789 to 1797", "1797 to 1801", "1801 to 1809", "1809 to 1817", "1817 to 1825");
        $outputTemplate = "<p>President [NAME] served from [TERM]</p>\n";
        foreach ($presidents as $sequence => $name) {
            $tempString = str_replace("[NAME]", $name, $outputTemplate);
            $outputString = str_replace("[TERM]", $yearsInOffice[$sequence], $tempString);
            echo $outputString;
        }
        ?>
	</body>
</html>