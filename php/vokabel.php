<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$http_method = $_SERVER['REQUEST_METHOD'];

class lesson
{
    public $name = '';
    public $translations = array();
    public $pronunciations = array();
}

function get_lessons() {
    $lessons = array();
    $directory = __DIR__ . '/lessons';
    $iterator = new DirectoryIterator ( $directory );
    foreach ( $iterator as $fileInfo ) {
        if (!$fileInfo->getExtension() == "txt") {
            continue;
        }
        $lesson = new lesson();
        $lesson->name = preg_replace('/.txt$/', '', $iterator->getFilename());

        $file = fopen($fileInfo->getPathname(),'r');
        while (($csv_values = fgetcsv($file)) !== FALSE)
        {
            if (count($csv_values) >= 2)
            {
                ($lesson->translations)[$csv_values[0]] = $csv_values[1];
            }
            if (count($csv_values) >= 3)
            {
                ($lesson->pronunciations)[$csv_values[0]] = $csv_values[2];
            }
        }

        fclose($file);
        $lessons[$lesson->name] = $lesson;
    }
    return json_encode($lessons);
}

function post_lesson()
{
    if (!isset($_FILES['file']['error']) || $_FILES['file']['error'] != UPLOAD_ERR_OK || $_FILES['file']['size'] > 10000) {
        header('HTTP/1.1 403');
        return;
    }
    if (false === $ext = array_search(
            $_FILES['file']['type'],
            array(
                'text' => 'text/plain',
                'csv' => 'text/csv'
            ),
            true
        )
    ) {
        header('HTTP/1.1 415');
        return;
    }

    $uploaddir = "/home/rex/fi3/ia13/s70357/public_html/lessons/";
    $uploadfilename = preg_replace('/.[[:alnum:]]*$/', ".txt" , basename($_FILES['file']['name']));

    if (!move_uploaded_file($_FILES['file']['tmp_name'], $uploaddir . $uploadfilename)) {
        header('HTTP/1.1 500');
        return;
    }
    header('HTTP/1.1 200');
}


$json = '{}';
switch ($http_method) {
    case 'GET':
        $json = get_lessons();
        header('HTTP/1.1 200');
        header('Access-Control-Allow-Origin: *');
        header("Content-Type: application/json; charset=UTF-8");
        echo $json;
        break;
    case 'HEAD':
        header('HTTP/1.1 200');
        header('Access-Control-Allow-Origin: *');
        header("Content-Type: application/json; charset=UTF-8");
        break;
    case 'POST':
        header('Access-Control-Allow-Origin: *');
        post_lesson();
        break;
    case 'OPTIONS':
        header('HTTP/1.1 200');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        header('Allow: GET, HEAD, POST');
        break;
    default:
        header('HTTP/1.1 405');
        header('Allow: GET, HEAD, POST');
        break;
}


?>