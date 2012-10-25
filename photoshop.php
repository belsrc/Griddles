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
            $fileContent = GeneratePhotoshopScript();

            // Build descriptive file name
            $size = $isRwd == 0 ? $total :
                    $max != -1 ? $max : 960;
            $fileName = "grid_" . $size . "_" . $count .".jsx";

            // Builder header
            header("Content-type: text/plain");
            header("Content-Disposition: attachment; filename=" . $fileName);

            // Write file content
            print $fileContent;
        }
    }

    function GeneratePhotoshopScript() {
        // Get the globals
        global $count, $column, $gutter, $total, $max, $isRwd;

        // If NOT Rwd size is equal to total
        // If IS Rwd and NOT full, size is equal to max
        // Otherwise, assume 960
        $size = $isRwd == 0 ? $total :
                $max != -1 ? $max : 960;

        // If NOT Rwd gutterWidth is equal to gutter
        // Otherwise, 2% of size
        $gutterWidth = $isRwd == 0 ? $gutter : round( $size * .02 );

        // If NOT Rwd columnWidth is equal to column
        // Otherwise, figure the percent by taking the number of gutters (double the column count) from 100%
        //      divided by the number of columns times 100. Multiple the size by the percent
        $columnWidth = $isRwd == 0 ? $column : round( $size * ( 100 - ( $count * 2 ) ) / ( $count * 100 ) );

        // Build the script
        $s = "#target photoshop\napp.bringToFront();\n";
        $s .= "(function() {\n    if( app.documents.length > 0 ) {\n";
        $s .= "        var dlg = new Window( 'dialog', 'Overlay the grid?', [500,500,840,620] );\n";
        $s .= "        dlg.lblText = dlg.add( 'statictext', [60,30,310,94], 'Add the grid to the current document?' );\n";
        $s .= "        dlg.btnYes = dlg.add( 'button', [10,80,110,110], 'Yes' );\n";
        $s .= "        dlg.btnNo = dlg.add( 'button', [120,80,220,110], 'Create new' );\n";
        $s .= "        dlg.btnCancel = dlg.add( 'button', [230,80,330,110], 'Cancel' );\n";
        $s .= "        dlg.btnYes.onClick = function yesClick() {\n            MakeGrid();\n            dlg.close();\n        }\n";
        $s .= "        dlg.btnNo.onClick = function noClick() {\n            MakeNewDoc();\n            MakeGrid();\n            dlg.close();\n        }\n";
        $s .= "        dlg.btnCancel.onClick = function cancelClick() {\n            dlg.close();\n        }\n";
        $s .= "        dlg.show();\n";
        $s .= "    }\n    else {\n        MakeNewDoc();\n        MakeGrid();\n    }\n";
        $s .= "})();\n\n";
        $s .= "function MakeNewDoc() {\n";
        $s .= "    app.preferences.rulerUnits = Units.PIXELS;\n";
        $s .= "    var newDoc = app.documents.add(" . $size . ", 900, 72.0000, 'Grid_Layout');\n";
        $s .= "    newDoc = null;\n";
        $s .= "}\n\n";
        $s .= "function MakeGrid() {\n";
        $s .= "    var pattern = [" . ( $gutterWidth * .5 ) . ", " . $columnWidth . ", " . ( $gutterWidth * .5 ) . "];\n";
        $s .= "    var columns = " . $count . ";\n";
        $s .= "    var x = 0;\n    var guides = [x];\n";
        $s .= "    for (var c = 0; c < columns; c++) {\n";
        $s .= "        for (var i = 0; i < 3; i++) {\n";
        $s .= "            x += pattern[i];\n            guides.push(x);\n";
        $s .= "        }\n    }\n";
        $s .= "    var d = app.activeDocument;\n";
        $s .= "    d.guides.removeAll( Direction.VERTICAL );\n";
        $s .= "    d.guides.removeAll( Direction.VERTICAL );\n";
        $s .= "    var padding = Math.round((d.width - x) / 2);\n";
        $s .= "    var g = guides.length;\n";
        $s .= "    for (var j = 0; j < g; j++) {\n";
        $s .= "        d.guides.add( Direction.VERTICAL, padding + guides[j] );\n";
        $s .= "    }\n}";

        return $s;
    }
?>