<!doctype html>
<!--
    Exercise 02_03_01
    Author: Mario Sandoval
    Date: 09.19.2018
    validatelocaladdress.php
-->
<html>
	<head>
		<title>Validate Local Address</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="initial-scale=1.0">
	</head>

	<body>
<h2>Validate Local Address</h2>
<?php
        $email = array("jsmith123@example.org", "john.smith.mail@example.org", "john.smith@example.org", "john.smith@example", "jsmith123@mail.example.org");
        foreach($email as $emailAddress){
            echo "the email address &idquo;" . $emailAddress . "&rdquo; ";
            if(preg_match("/^(([A-Za-a] + \d+)|" . "([A-Za-z]+\.[A-Za-z]+))" . "@((mail\.)?)example\.org$/i",$emailAddress) == 1){
                echo " is a valid e-mail address.<br>";
            }
            else{
                echo " is not a valid e-mail address.<br>";
            }
        }
        ?>
	</body>
</html>