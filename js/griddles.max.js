/*! Griddles - Grid System Creator r007 | Copyright (c) Bryan Kizer 2012 | MIT License:
    See License.txt or http://opensource.org/licenses/mit-license for license details */
(function( Griddles, $ ) {
    /* GridSystem class */
    var GridSystem = (function () {
        /* Constructor */
        function GridSystem() {
            this.count = 12;
            this.column = 60;
            this.gutter = 20;
            this.edge = 10;
            this.total = 960;
            this.max = 960;
            this.isRwd = false;
        }
        
        /* Sets whether the grid is responsive or not */
        GridSystem.prototype.SetResponsive = function ( isResponse ) {
            this.isRwd = isResponse;
            
            this.SetMaximumWidth( this.max );
            this.SetGridGutter( this.gutter );
            this.SetGridColumn( this.column );
            this.SetPreviewLabels();
        };
        
        /* Sets the grids maximum width */
        GridSystem.prototype.SetMaximumWidth = function ( maximum ) {
            this.max = maximum;
            var m = !this.isRwd ? '100%' :
                    this.max !== -1 ? this.max + 'px' : '100%';
            
            $( '#gridExample' ).css( 'max-width', m );
            $( '#gridExample' ).css( 'width', m );
            
            this.SetTotalWidth();
            this.SetPreviewLabels();
        };
        
        /* Sets the grids total width */
        GridSystem.prototype.SetTotalWidth = function () {
            this.total = this.count * this.column + this.count * this.gutter;
            var w = this.isRwd ? this.max + 'px' : this.total + 'px';
            
            $( '#gridExample' ).css( 'width', w );
            
            this.CenterPreviewPanel();
        };
        
        /* Sets the grids number of columns */
        GridSystem.prototype.SetGridCount = function ( num ) {
            var i;
            this.count = num;
            this.SetTotalWidth();
            
            $( '#gridExample' ).empty();
            $( '#gridExample' ).append( '<div class="preview-edge"></div>' );
            for(i = 0; i < this.count - 1; i++) {
                $( '#gridExample' ).append( '<div class="preview-column"></div>' );
                $( '#gridExample' ).append( '<div class="preview-gutter"></div>' );
            }
            $( '#gridExample' ).append( '<div class="preview-column"></div>' );
            $( '#gridExample' ).append( '<div class="preview-edge"></div>' );
            
            this.SetGridGutter( this.gutter );
            this.SetGridColumn( this.column );
            this.SetPreviewLabels();
        };
        
        /* Sets the grids gutter width */
        GridSystem.prototype.SetGridGutter = function ( num ) {
            this.gutter = num;
            this.edge = num * 0.5;
            var edg = this.isRwd ? '1%' : this.edge + 'px';
            var gut = this.isRwd ? '2%' : this.gutter + 'px';
            
            this.SetTotalWidth();
            $( '.preview-edge' ).css( 'width', edg );
            $( '.preview-gutter' ).css( 'width', gut );
            this.CenterPreviewPanel();
        };
        
        /* Sets the grids column width */
        GridSystem.prototype.SetGridColumn = function ( num ) {
            this.column = num;
            var tmp = ( 100 - ( this.count * 2 )) / this.count;
            var col = this.isRwd ? tmp + '%' : this.column + 'px';

            $( '.preview-column' ).css( 'width', col );
            this.SetTotalWidth();
        };
        
        /* Sets the labels that indicate the total and content width */
        GridSystem.prototype.SetPreviewLabels = function () {
            var total = !this.isRwd ? this.total + 'px' : this.max !== -1 ? this.max + 'px' : '100%';
            var content = !this.isRwd ? ( this.total - this.gutter ).toString() + 'px' :
                          this.max !== -1 ? ( Math.round( this.max * 0.98 )).toString() + 'px' : '98%';
            
            $( '#lblTotalSize' ).html( 'Total Size : ' + total );
            $( '#lblContentSize' ).html( 'Content Size : ' + content );
        };
        
        /* Centers the preview panel in the window */
        GridSystem.prototype.CenterPreviewPanel = function () {
            var offset = !this.isRwd ? '-' + ( this.total / 2 ).toString() + 'px' :
                         this.max !== -1 ? '-' + ( this.max / 2 ).toString() + 'px' : '-50%';
            $( '#gridExample' ).css( 'margin-left', offset );
        };
        
        return GridSystem;
    })();
    
    /* GridSystem object */
    var grid = new GridSystem();
    
    /* Build the suffix styles */
    function SuffixString() {
        var i;
        var s = '\n/* Suffix Extra Space\n=====================================================*/\n';

        for( i = 0; i < grid.count - 1; i++ ) {
            s += '.container .suffix-' + (i + 1) + ' { padding-right: ';
            if( grid.isRwd ) {
                var width = (((( 100 - grid.count * 2 ) / grid.count ) * ( i + 1 )) + (( i + 1 ) * 2 ));
                width = Math.round( width * 100 ) / 100;
                s += width + '%';
            }
            else {
                s += ( grid.column * ( i + 1 ) + grid.gutter * ( i + 1 )) + 'px';
            }
            s += '; }\n';
        }
        return s;
    }
    
    /* Build the prefix styles */
    function PrefixString() {
        var i;
        var s = '\n/* Prefix Extra Space\n=====================================================*/\n';

        for( i = 0; i < grid.count - 1; i++ ) {
            s += '.container .prefix-' + ( i + 1 ) + ' { padding-left: ';
            if( grid.isRwd ) {
                var width = (((( 100 - grid.count * 2 ) / grid.count ) * ( i + 1 )) + (( i + 1 ) * 2 ));
                width = Math.round( width * 100 ) / 100;
                s += width + '%';
            }
            else {
                s += ( grid.column * ( i + 1 ) + grid.gutter * ( i + 1 )) + 'px';
            }
            s += '; }\n';
        }
        return s;
    }
    
    /* Build the column styles */
    function ColumnString() {
        var i;
        var s = '/* Grid Columns\n=====================================================*/\n';

        for( i = 0; i < grid.count; i++ ) {
            s += '.container .grid-' + ( i + 1 ) + ' { width: ';
            if( grid.isRwd ) {
                var width = (((( 100 - grid.count * 2 ) / grid.count ) * ( i + 1 )) + ( i * 2 ));
                width = Math.round( width * 100 ) / 100;
                s += width + '%';
            }
            else {
                s += (( grid.column * ( i + 1 )) + ( grid.gutter * i )) + 'px';
            }
            s += '; }\n';
        }
        return s;
    }
    
    /* Build the global grid styles */
    function GlobalString() {
        var edge = grid.isRwd ? '1%' : grid.edge + 'px';
        var s = '/* Grid Globals\n=====================================================*/\n';

        s += '[class*="grid-"] {\n\tfloat: left;\n\tmargin: 0 ' + edge + ';\n}\n\n';
        return s;
    }
    
    /* Generates the grid code for the entered values */
    function GenerateNineSixtyBased() {
        var bfs = '';
        var width = grid.isRwd ? '100%;' : ( grid.total + 'px;' );
        
        /* Set container styles */
        bfs += '/* Based on (a trimmed down version of) 960 Grid System by Nathan Smith\n(<a href="http://sonspring.com/" target="_blank">http://sonspring.com/</a>)\n=====================================================*/\n';
        bfs += '.container {\n\twidth: ' + width;
        
        if( grid.isRwd && grid.max !== -1 ) {
            bfs += '\n\tmax-width: ' + grid.max + 'px;';
        }
        
        bfs += '\n\tmargin: 0 auto;\n\t*zoom: 1;\n}\n\n';
        bfs += GlobalString() + ColumnString() + PrefixString() + SuffixString();
        
        /* Set clear float styles */
        bfs += '\n/* Clear Floated Elements\n=====================================================*/\n';
        bfs += '.clear {\n\tclear: both;\n\tdisplay: block;\n\toverflow: hidden;\n\tvisibility: hidden;\n\twidth: 0;\n\theight: 0;\n}\n\n';
        bfs += '.clearfix:before,\n.clearfix:after,\n.container:before,\n.container:after {\n\tcontent: ".";\n\tdisplay: block;\n\t' + 'overflow: hidden;\n\tvisibility: hidden;\n\tfont-size: 0;\n\tline-height: 0;\n\twidth: 0;\n\theight: 0;\n}\n\n';
        bfs += '.clearfix:after,\n.container:after {\n\tclear: both;\n}\n\n';
        bfs += '.clearfix, .container { zoom: 1; }\n';
        return bfs;
    }
    
    /* Generates the css for the specified grid */
    function GenerateSource() {
        if( $( '#cmbGridType' ).val() === 'Static Grid-960 Based' ||
            $( '#cmbGridType' ).val() === 'Fluid Grid-960 Based')
        {
            $( '#code' ).empty().html( GenerateNineSixtyBased() );
        }
        else {
            
        }
        
        prettyPrint();
    }
    
    /* Event handler for the Column Count text changed event 
       Sets grid.SetGridCount to the textbox value */
    $( function () {
        $( '#txtColCount' ).bind( 'click keyup change', function () {
            if( $.isNumeric( $( this ).val() )) {
                grid.SetGridCount( parseInt( $( this ).val(), 10 ));
            }
        });
    });
    
    /* Event handler for the Column Width text changed event 
       Sets grid.SetGridColumn to the textbox value */
    $( function () {
        $( '#txtColWidth' ).bind( 'click keyup change', function () {
            if( $.isNumeric( $( this ).val() )) {
                grid.SetGridColumn( parseInt( $( this ).val(), 10 ));
                grid.SetPreviewLabels();
            }
        });
    });
    
    /* Event handler for the Gutter Width text changed event 
       Sets grid.SetGridGutter to the textbox value */
    $( function () {
        $( '#txtGutWidth' ).bind( 'click keyup change', function () {
            if( $.isNumeric( $( this ).val() )) {
                grid.SetGridGutter( parseInt( $( this ).val(), 10 ));
                grid.SetPreviewLabels();
            }
        });
    });
    
    /* Event handler for the Total Width text changed event 
       Sets grid.SetMaximumWidth to the textbox value */
    $( function () {
        $( '#numGridSize' ).bind( 'click keyup change', function () {
            if( $.isNumeric( $( this ).val() )) {
                var m = $( this ).val() === '0' ? -1 : parseInt( $( this ).val(), 10 );
                grid.SetMaximumWidth( m );
            }
        });
    });
    
    /* Event handler for the grid type change event 
       Sets grid.SetResponsive to true or false
       Shows/Hides controls based on selected type */
    $( function () {
        $( '#cmbGridType' ).change( function () {
            grid.SetResponsive( $( this ).val() === 'Fluid Grid-960 Based' );
            if( grid.isRwd ) {
                $( '.fixed-inputs' ).css( 'display', 'none' );
                $( '.responsive-inputs' ).css( 'display', 'block' );
            }
            else {
                $( '.fixed-inputs' ).css( 'display', 'block' );
                $( '.responsive-inputs' ).css( 'display', 'none' );
            }
        });
    });
    
    /* Event handler for the Code Button click event 
       Generates the grid source
       Adds the .opening class
       Sets .source visibility and opacity */
    $( function () {
        $( '#btnCode' ).click(function () {
            GenerateSource();
            $( '.source' ).addClass( 'opening' );
            $( '.source' ).css({ 'visibility': 'visible', 'opacity': '1'});
        });
    });
    
    /* Event handler for the Close Button click event 
       Removes the .opening class
       Set .source visibility and opacity */
    $( function () {
        $( '#close-btn' ).click( function () {
            $( '.source' ).removeClass( 'opening' );
            $( '.source' ).css({ 'visibility': 'hidden', 'opacity': '0' });
        });
    });

    grid.SetGridCount( grid.count );
}( window.Griddles = window.Griddles || {}, jQuery ));