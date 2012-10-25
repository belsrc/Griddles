<?php
    include "error_check.php";
    $count = null;
    $column = null;
    $gutter = null;
    $total = null;
    $max = null;
    $isRwd = null;

    if( !empty( $_GET ) ){
        if( IsErrorFree() ) {
            // Build file content
            $fileContent = GenerateIllustratorScript();

            // Build descriptive file name
            $size = $isRwd == 0 ? $total :
                    $max != -1 ? $max : 960;
            $fileName = "grid_" . $size . "_" . $count .".ai";

            // Builder header
            header("Content-type: text/plain");
            header("Content-Disposition: attachment; filename=" . $fileName);

            // Write file content
            print $fileContent;
        }
    }
?>