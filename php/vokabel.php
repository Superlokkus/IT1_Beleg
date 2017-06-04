<?php
$http_method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

class lesson
{
    public $name = '';
    public $language1 = array('');
    public $language2 = array('');
    public $pronunciation = array('');

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
        $lessons[] = $lesson;

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
header("Content-Type: application/json; charset=UTF-8");
echo $json;
?>