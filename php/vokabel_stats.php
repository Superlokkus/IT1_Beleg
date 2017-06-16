<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$http_method = $_SERVER['REQUEST_METHOD'];
$body = file_get_contents('php://input');

class stat
{
    public $lesson_name = '';
    public $correct_count = 0;
    public $answered_count = 0;
}

function put_stats($stat)
{
    $stat = json_decode($stat);
    $stats = json_decode(file_get_contents("stats.json"),true);
    $name = $stat->lesson_name;
    $stats[$name] = $stat;
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
        put_stats($body);
        break;
    case 'OPTIONS':
        header('HTTP/1.1 200');
        header('Access-Control-Allow-Methods: PUT, GET, OPTIONS');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        header('Allow: GET, HEAD, PUT');
        break;
    default:
        header('HTTP/1.1 405');
        header('Allow: GET, HEAD, PUT');
        break;
}
