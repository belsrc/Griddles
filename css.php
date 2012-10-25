<?php
    $count = null;
    $column = null;
    $gutter = null;
    $total = null;
    $max = null;
    $isRwd = null;
    include "error_check.php";

    if( !empty( $_GET ) ){
        if( IsErrorFree() ) {
            // Build file content
            $fileContent = GenerateNineSixtyBased();

            // Build descriptive file name
            $size = $isRwd == 0 ? $total :
                    $max != -1 ? $max : 'full';
            $type = $isRwd == 1 ? 'fluid' : 'static';
            $fileName = "grid_" . $size . "_" . $count . "_" . $type .".css";

            // Builder header
            header("Content-type: text/plain");
            header("Content-Disposition: attachment; filename=" . $fileName);

            // Write file content
            print $fileContent;
        }
    }

    // Build Suffix strings
    function SuffixString() {
        global $count, $column, $gutter, $isRwd;
        $s = "\n/* Suffix Extra Space\n=====================================================*/\n";

        for( $i = 0; $i < $count - 1; $i++ ) {
            $s .= '.container .suffix-' . ( $i + 1 ) . ' { padding-right: ';
            if( $isRwd == 1 ) {
                $width = ((( 100 - $count * 2 ) / $count * ( $i + 1 )) + (( $i + 1 ) * 2 ));
                $width = round( $width * 100 ) / 100;
                $s .= $width . '%';
            }
            else {
                $s .= ( $column * ( $i + 1 ) + $gutter * ( $i + 1 )) . 'px';
            }

            $s .= "; }\n";
        }

        return $s;
    }

    // Build Prefix strings
    function PrefixString() {
        global $count, $column, $gutter, $isRwd;
        $s = "\n/* Prefix Extra Space\n=====================================================*/\n";
        for( $i = 0; $i < $count - 1; $i++ ) {
            $s .= '.container .prefix-' . ( $i + 1 ) . ' { padding-left: ';
            if( $isRwd == 1 ) {
                $width = ((( 100 - $count * 2 ) / $count * ( $i + 1 )) + (( $i + 1 ) * 2 ));
                $width = round( $width * 100 ) / 100;
                $s .= $width . '%';
            }
            else {
                $s .= ( $column * ( $i + 1 ) + $gutter * ( $i + 1 )) . 'px';
            }

            $s .= "; }\n";
        }
        return $s;
    }

    // Build Column strings
    function ColumnString() {
        global $count, $column, $gutter, $isRwd;
        $s = "/* Grid Columns\n=====================================================*/\n";
        for( $i = 0; $i < $count; $i++ ) {
            $s .= '.container .grid-' . ( $i + 1 ) . ' { width: ';
            if( $isRwd == 1 ) {
                $width = ((( 100 - $count * 2 ) / $count * ( $i + 1 )) + ( $i * 2 ));
                $width = round( $width * 100 ) / 100;
                $s .= $width . '%';
            }
            else {
                $s .= (( $column * ( $i + 1 )) + ( $gutter * $i )) . 'px';
            }

            $s .= "; }\n";
        }
        return $s;
    }

    // Build Global string
    function GlobalString() {
        global $gutter, $isRwd;
        $edge = $isRwd == 1 ? '1%' : ( $gutter * .5 ) . 'px';

        $s = "/* Grid Globals\n=====================================================*/\n";
        $s .= "[class*='grid-'] {\n    float: left;\n    margin: 0 " . $edge . ";\n}\n\n";

        return $s;
    }

    // Generate CSS source
    function GenerateNineSixtyBased() {
        global $total, $max, $isRwd;
        $bfs = '';
        $width = $isRwd == 1 ? '100%;' : $total . 'px;';
        $bfs .= "/* Based on (a trimmed down version of) 960 Grid System by Nathan Smith (sonspring.com)\n=====================================================*/\n";
        $bfs .= ".container {\n    width: " . $width;
        if( $isRwd == 1 && $max != -1) {
            $bfs .= "\n    max-width: " . $max . 'px;';
        }
        $bfs .= "\n    margin: 0 auto;\n    *zoom: 1;\n}\n\n";
        $bfs .= GlobalString() . ColumnString() . PrefixString() . SuffixString();
        $bfs .= "\n/* Clear Floated Elements\n=====================================================*/\n";
        $bfs .= ".clear {\n    clear: both;\n    display: block;\n    overflow: hidden;\n    visibility: hidden;\n    width: 0;\n    height: 0;\n}\n\n";
        $bfs .= ".clearfix:before,\n.clearfix:after,\n.container:before,\n.container:after {\n    content: ".";\n    display: block;\n    " .
                "overflow: hidden;\n    visibility: hidden;\n    font-size: 0;\n    line-height: 0;\n    width: 0;\n    height: 0;\n}\n\n";
        $bfs .= ".clearfix:after,\n.container:after {\n    clear: both;\n}\n\n";
        $bfs .= ".clearfix, .container { zoom: 1; }\n";
        return $bfs;
    }
?>