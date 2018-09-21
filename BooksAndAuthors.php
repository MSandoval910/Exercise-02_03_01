<!doctype html>
<!--
    Exercise 02_03_01
    Author: Mario Sandoval
    Date: 09.19.2018
    Books And Authors.php
-->
<html>

<head>
    <title>Books and Authors</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1.0">
    <script src="modernizr.custom.65897.js"></script>
</head>

<body>
    <h2>Musical Scale</h2>
    <?php
       $books = array("The Adventures or Huckleberry Finnn", "Nineteen Eighty-four", "Alice's Adventures in Wonderland", "The Cat in the Hat");
       $authors = array("Mark Twain", "Gearge Orwell", "Lewis Carrroll" , "Dr.Seuss");
       $realNames = array("Samuel Clemens", "Eric Blair", "Charles Dodson", "Theodor Geisel");
        for ($i = 0; $i < count($books); $i++) {
            echo "<p>The real name of {$authors[$i]}, " . "the author of \"{$books[$i]}\", " . "is {$realNames[$i]}.</p>";
        }
    for ($i = 0; $i < count($books); $i++) {
            echo "<p>The title \"{$books[$i]}\" contains " . strlen($books[$i]) . " characaters and " . str_word_count($books[$i]) . " words.</p>";
        }
    echo "<h2>Manipulating Strings</h2>";
    $startingText = "mAdAm, I'M aDaM";
    $uppercaseText = strtoupper($startingText);
    $lowercaseText = strtolower($startingText);
    echo "<p>$uppercaseText</p>\n";
    echo "<p>$lowercaseText</p>\n";
    echo "<p>" . ucfirst($lowercaseText) . "</p>\n";
    echo "<p>" . lcfirst($uppercaseText) . "</p>\n";
    $workingText = ucwords($lowercaseText);
    echo "<p>$workingText</p>\n";
        echo "<h2>Other Manipulating Strings</h2>";
      echo "<p>" . md5($workingText) . "</p>\n";
    echo "<p>" . substr($workingText, 0, 6) . "</p>\n";
    echo "<p>" . substr($workingText, 7) . "</p>\n";
    echo "<p>" . strrev($workingText) . "</p>\n";
    echo "<p>" . str_shuffle($workingText) . "</p>/n";
    
        ?>
</body>

</html>