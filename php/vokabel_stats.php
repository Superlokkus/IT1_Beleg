<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$http_method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'));

class stat
{
    public $lesson_name = '';
    public $correct_count = 0;
    public $answered_count = 0;
}

function put_stats($stat)
{
    $stats = json_decode(file_get_contents("stats.json"),true);
    $stats[$stat->lesson_name] = $stat;
    file_put_contents("stats.json",json_encode($stats));
}

switch ($http_method) {
    case 'GET':
        header('HTTP/1.1 200');
        header('Access-Control-Allow-Origin: *');
        header("Content-Type: application/json; charset=UTF-8");
        readfile("./stats.json");
        break;
    case 'HEAD':
        header('HTTP/1.1 200');
        header('Access-Control-Allow-Origin: *');
        header("Content-Type: application/json; charset=UTF-8");
        break;
    case 'PUT':
        header('HTTP/1.1 200');
        header('Access-Control-Allow-Origin: *');
        header("Content-Type: application/json; charset=UTF-8");
        put_stats($body);
        break;
    default:
        header('HTTP/1.1 405');
        header('Allow: GET, HEAD, PUT');
        break;
}
