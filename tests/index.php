<?php

$name = isset($_GET['name']) ? $_GET['name'] : "";

echo "hello, $name";

file_put_contents("php://stdout","hello, $name\n");
