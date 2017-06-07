<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$http_method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

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
        $lesson->name = preg_replace('#.txt$#', '', $iterator->getFilename());

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


$json = '{}';
switch ($http_method) {
    case 'GET':
        $json = get_lessons();
        break;
}

header('HTTP/1.1 200');
header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json; charset=UTF-8");
echo $json;
?>