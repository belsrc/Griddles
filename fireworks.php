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
            $fileContent = GenerateFireworkScript();

            // Build descriptive file name
            $size = $isRwd == 0 ? $total :
                    $max != -1 ? $max : 960;
            $fileName = "grid_" . $size . "_" . $count .".jsf";

            // Builder header
            header("Content-type: text/plain");
            header("Content-Disposition: attachment; filename=" . $fileName);

            // Write file content
            print $fileContent;
        }
    }

    function GenerateFireworkScript() {
        // Get the globals
        global $count, $column, $gutter, $total, $max, $isRwd;

        // If NOT Rwd size is equal to total
        // If IS Rwd and NOT full size is equal to max
        // Otherwise, assume 960
        $size = $isRwd == 0 ? $total :
                $max != -1 ? $max : 960;

        // If IS Rwd gutterWidth is equal to gutter
        // Otherwise, 2% of size
        $gutterWidth = $isRwd == 0 ? $gutter : round( $size * .02 );

        // If IS Rwd columnWidth is equal to column
        // Otherwise, figure the percent by taking the number of gutters (double the column count) from 100%
        //      divided by the number of columns times 100. Multiple the size by the percent
        $columnWidth = $isRwd == 0 ? $column : round( $size * ( 100 - ( $count * 2 ) ) / ( $count * 100 ) );

        // Build the script
        $s = "(function() {\n    if( fw.documents.length > 0 ) {\n";
        $s .= "        var useCurrent = fw.yesNoDialog('Overlay grid on current document? (No creates a new document)');\n";
        $s .= "        if(useCurrent) {\n            MakeGrid();\n        }\n";
        $s .= "        else {\n            MakeNewDoc();\n            MakeGrid();\n        }\n";
        $s .= "    }\n    else {\n        MakeNewDoc();\n        MakeGrid();\n    }\n})();\n";
        $s .= "function MakeNewDoc() {\n";
        $s .= "    var newDoc = fw.createFireworksDocument({x:" . $size . ",y:900},{pixelsPerUnit:72,units:'inch'}, '#ffffff');\n";
        $s .= "    newDoc = null;\n}\n";
        $s .= "function MakeGrid() {\n";
        $s .= "    var pattern = [" . ( $gutterWidth * .5 ) . ", " . $columnWidth . ", " . ( $gutterWidth * .5 ) . "];\n";
        $s .= "    var columns = " . $count . ";\n    var x = 0;\n    var guides = [x];\n";
        $s .= "    for (var c = 0; c < columns; c++) {\n";
        $s .= "        for (var i = 0; i < 3; i++) {\n";
        $s .= "            x += pattern[i];\n            guides.push(x);\n";
        $s .= "        }\n    }\n";
        $s .= "    var d = fw.getDocumentDOM();\n";
        $s .= "    d.removeAllGuides('horizontal');\n";
        $s .= "    d.removeAllGuides('vertical');\n";
        $s .= "    d.setShowGuides(true);\n";
        $s .= "    var padding = Math.round((d.width - x) / 2);\n";
        $s .= "    var g = guides.length;\n";
        $s .= "    for (var j = 0; j < g; j++) {\n";
        $s .= "        d.addGuide(padding + guides[j], 'vertical');\n";
        $s .= "    }\n}";

        return $s;
    }
?>