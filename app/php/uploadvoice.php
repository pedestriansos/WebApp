<?php
    define("upload", "../uploads/");
    define("uploadfiles", upload . "files/");
    define("uploadstrings", upload . "strings/");
    define("voices", uploadfiles . "voices/");
    define("voicetimes", uploadstrings . "voicetimes/");
    define("protectedPrivateKeysPath", dirname($_SERVER["DOCUMENT_ROOT"]) . "/protected/private/keys/");
    if(!empty($_FILES["file"]["tmp_name"]) && isset($_POST["n"]) && isset($_POST["key"]) && ctype_digit($_POST["n"]) && ctype_digit($_POST["key"]))    {
        $keyPath = protectedPrivateKeysPath . $_POST["n"];
        if(!file_exists($keyPath))    {
            exit("-1");
        }
        if(!password_verify($_POST["key"], file_get_contents($keyPath)))    {
            exit("-2");
        }
        $allowedExtensions = array("avi", "mpeg", "ogv", "ts", "webm", "3gp", "3g2", "aac", "mp3", "oga", "opus", "wav", "weba", "mp4");
        //$extension = pathinfo($_FILES["voice"]["name"], PATHINFO_EXTENSION);
        $mimeContentType = mime_content_type($_FILES["file"]["tmp_name"]);
        if(!$mimeContentType || (strpos($mimeContentType, '/') === FALSE))exit("-4");
        $file_info_array = explode("/", $mimeContentType);
        $type = $file_info_array[0];
        $extension = $file_info_array[1];
        if($extension === "x-msvideo")	{
            $extension = "avi";
        }
        else if($extension === "ogg")	{
            $extension = "ogv";
        }
        else if($extension === "mp2t")	{
            $extension = "ts";
        }
        else if($extension === "3gpp")	{
            $extension = "3gp";
        }
        else if($extension === "3gpp2")	{
            $extension = "3g2";
        }
        else if($extension === "mpeg")	{
            $extension = "mp3";
        }
        else if($extension === "ogg")	{
            $extension = "oga";
        }
        else if($extension === "webm")	{
            $extension = "weba";
        }
        if(($type !== "audio") && ($type !== "video"))    {
            exit("only audio files are allowed.");
        }
        if(!in_array($extension, $allowedExtensions))    {
            exit("allowed extensions are: " . implode(", ", $allowedExtensions) . '.');
        }
        $voicepath = voices . $_POST["n"] . '.' . $extension;
        if(file_exists($voicepath))    {
            exit("-3");
        }
        if(move_uploaded_file($_FILES["file"]["tmp_name"], $voicepath))  {
            $t = time();
            file_put_contents(voicetimes . $_POST["n"] . ".txt", $t);
            if(isset($_POST["submit"]))    {
                header("Location: view.php?n=" . $_POST["n"]);
            }
            else    {
                echo("1");
            }
        }
    }
    else    {
        echo("0");
    }
?>