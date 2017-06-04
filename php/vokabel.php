<?php
$http_method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

if (file_put_contents("/home/rex/fi3/ia13/s70357/public_html/woot.txt", $http_method . "\n===\n" . $request . "\n=====\n" . $input) == FALSE)
{
    header('HTTP/1.1 500');
}
else
{
    header('HTTP/1.1 200');
}
?>