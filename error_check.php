<?php
    function IsErrorFree() {
        $specs = array(
            'count',
            'column',
            'gutter',
            'total',
            'max',
            'isRwd',
        );

        $errors = array();

        foreach( $_GET as $key => $value ) {
            if( in_array( $key, $specs ) ) {
                if( $value == '' ) {
                    $errors[] = $value;
                }
                else {
                    $GLOBALS[$key] = $value;
                }
            }
            else {
                $errors[] = $key;
            }
        }

        return count( $errors ) == 0;
    }
?>