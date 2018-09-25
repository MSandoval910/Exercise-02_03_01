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
       //global varible array
       $emailAddresses = array("john.smith@php.test", "mary.smith.mail@php.example", "john.jones@oho.invalid", "alan.smith@test", "jsmith456@example.com", "jsmith456@test", "mjones@example", "mjones@example.net", "jane.a.adoe@example.org");
       function validateAddress($address) {
           if (strpos($address, '@') !== false && strpos($address, '.') !== false){
               return true;
           }
           else {
               return false;
           }
       }
       // function to sort the address
       function sortAddresses($addresses){
           $sortedAddresses = array();
           $iLimit = count($addresses) - 1;
           $jLimit = count($addresses);
           for ($i = 0; $i < $iLimit; $i++) {
               $currentAddress = $addresses[$i];
               //sort rutine
               for ($j = $i + 1; $j < $jLimit; $j++) {
                   if($currentAddress > $addresses[$j]){
                       $tempVal = $addresses[$j];
                       $addresses[$j] = $currentAddress;
                       $currentAddress = $tempVal;
                   }
               }
               $sortedAddresses[] = $currentAddress;
           }
           return($sortedAddresses);
       }
       //arranges the sting into a readable format
       $sortedAddresses = sortAddresses($emailAddresses);
       $sortedAddressesList = implode(", ", $sortedAddresses);
       echo "<p>Sorted addresses: $sortedAddressesList</p>\n";

       //
       foreach ($sortedAddresses as $thisAddress) {
           if (validateAddress($thisAddress) === false) {
               echo "<p>the e-mail address <em>$thisAddress</em> does not appear to be vaild.</p>";
           }
       }

       ?>
	</body>
</html>