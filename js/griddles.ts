
/* GridSystem object variable */
var grid;

/* GridSystem class */
class GridSystem {
    count: number;
    column: number;
    gutter: number;
    edge: number;
    total: number;
    max: number;
    isRwd: bool;
    constructor () {
        this.count = 12;
        this.column = 60;
        this.gutter = 20;
        this.edge = 10;
        this.total = 960;
        this.max = 960;
        this.isRwd = false;
    }
}

/* Faster parseInt */
function parseNumber(source) {
	return source * 1 || 0;
}

/* Sets the grids maximum width */
function SetMaximumWidth() {
    var m = !grid.isRwd ? '100%' :
            grid.max !== -1 ? grid.max + 'px' : '100%';
    var example = document.getElementById('gridExample');
    example.style.maxWidth = m;
    example.style.width = m;
}

/* Sets the grids total width */
function SetTotalWidth() {
    var w = grid.isRwd ? grid.max + 'px' : grid.total + 'px';
    document.getElementById('gridExample').style.width = w;
}

/* Sets the grids number of columns */
function SetGridCount() {
    var i,
        inner = '',
        w = grid.isRwd ? grid.max + 'px' : grid.total + 'px',
        tmp = ( 100 - ( grid.count * 2 ) ) / grid.count,
        example = document.getElementById('gridExample'),
        c = '<div class="preview-column"style="width: ' +
            ( grid.isRwd ? tmp + '%' : grid.column + 'px' ) +';"></div>',
        g = '<div class="preview-gutter" style="width: ' +
            ( grid.isRwd ? '2%' : grid.gutter + 'px' )+';"></div>',
        e = '<div class="preview-edge" style="width: ' +
            ( grid.isRwd ? '1%' : grid.edge + 'px' ) +';"></div>';
        
        example.style.width = w;
        
        inner += e;
        for ( i = 0; i < grid.count - 1; i++ ) {
            inner += c;
            inner += g;
        }
        inner += c;
        inner += e;
        
        example.innerHTML = inner;

        CenterPreviewPanel();
        SetPreviewLabels();
}

/* Sets the grids gutter width */
function SetGridGutter() {
    var i,
        edg = grid.isRwd ? '1%' : grid.edge + 'px',
        gut = grid.isRwd ? '2%' : grid.gutter + 'px';
    
    var edgeList = document.getElementsByClassName('preview-edge');
    var gutterList = document.getElementsByClassName('preview-gutter');
    
    for( i = 0; i < edgeList.length; i++ ) {
        edgeList[i].style.width = edg;
    }
    for( i = 0; i < gutterList.length; i++ ) {
        gutterList[i].style.width = gut;
    }
}

/* Sets the grids column width */
function SetGridColumn() {
    var i,
        tmp = ( 100 - ( grid.count * 2 ) ) / grid.count,
        col = grid.isRwd ? tmp + '%' : grid.column + 'px',
        columnList = document.getElementsByClassName('preview-column');
    
    for( i = 0; i < columnList.length; i++ ) {
        columnList[i].style.width = col;
    }
}

/* Sets the labels that indicate the total and content width */
function SetPreviewLabels() {
    var total = !grid.isRwd ? grid.total + 'px' :
                grid.max !== -1 ? grid.max + 'px' : '100%';
    var content = !grid.isRwd ? ( grid.total - grid.gutter ).toString() + 'px' :
                  grid.max !== -1 ? ( Math.round( grid.max * .98 ) ).toString() + 'px' : '98%';

    document.getElementById('lblTotalSize').innerHTML = 'Total Size : ' + total
    document.getElementById('lblContentSize').innerHTML = 'Content Size : ' + content
}

/* Centers the preview panel in the window */
function CenterPreviewPanel() {
    var offset = !grid.isRwd ?  '-' + ( grid.total / 2 ).toString() + 'px' :
                 grid.max !== -1 ? '-' + ( grid.max / 2 ).toString() + 'px' : '-50%';

    document.getElementById('gridExample').style.marginLeft = offset;
}

/* Draw the live layout */
function DrawLayout() {
    var first, next, i, tw,
        s = '',
        edg = grid.isRwd ? '1%' : grid.edge + 'px',
        col = grid.isRwd ? ( 100 - ( grid.count * 2 ) ) / grid.count + '%' : grid.column + 'px';
        
    s += '<div id="layout-contain" style="margin: 0 auto; width:' + 
         (grid.isRwd ? grid.max + 'px' : grid.total + 'px') + '">';
    
    for( i = 0; i < grid.count - 1; i++ ) {
        if( grid.isRwd ) {
            tw = Math.round((( 100 - grid.count * 2 ) / grid.count * ( i + 1 ) + ( i * 2 )) * 100 ) / 100;
            first = tw + '%';
            next = ( 96 - tw ) + '%';
        }
        else {
            first = ( grid.column * ( i + 1 ) + grid.gutter * i ) + 'px';
            next = ( grid.total - grid.gutter * 2 - parseInt( first, 10 ) ) + 'px';
        }
        
        s += '<div class="layout-row">';
            s += '<div class="layout" style="width:' + first + ';margin:0 ' + edg + ';">' + ( i + 1 ) + '</div>';
            s += '<div class="layout" style="width:' + next + ';margin:0 ' + edg + ';">' + ( grid.count - ( i + 1 ) ) + '</div>';
        s += '</div>';
    }
    
    s += '</div>'
    document.getElementById('layoutExample').innerHTML = s;

    SetLinks();
}

/* Set the query strings in the links */
function SetLinks() {
    var flag = grid.isRwd ? 1 : 0;
    var qString = '?count=' + grid.count + '&column=' + grid.column + '&gutter=' + grid.gutter +
                    '&total=' + grid.total + '&max=' + grid.max + '&isRwd=' + flag;
    document.getElementById('btnPs').setAttribute( 'href', 'photoshop.php' + qString );
    document.getElementById('btnFw').setAttribute( 'href', 'fireworks.php' + qString );
    document.getElementById('btnCss').setAttribute( 'href', 'css.php' + qString );
}

/* Generates the css for the specified grid */
function GenerateSource() {
    var gridType = document.getElementById('cmbGridType').value;
    if( gridType === 'Static Grid-960 Based' ||
        gridType === 'Fluid Grid-960 Based')
    {
        document.getElementById('code').innerHTML = GenerateNineSixtyBased();
    }
    else {
        // Put other grid types here
    }

    prettyPrint();
}

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
    bfs += '/* Based on (a trimmed down version of) 960 Grid System by Nathan Smith (<a href="http://sonspring.com/" target="_blank">http://sonspring.com/</a>)\n=====================================================*/\n';
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

/* Event handler for the Column Count text changed event
   Sets grid.Count to the textbox value */
function columnCount() {
    var num = parseNumber( this.value );
    grid.count =  num;
    grid.total = grid.count * grid.column + grid.count * grid.gutter;
    SetGridCount();
    DrawLayout();
}

/* Event handler for the Column Width text changed event
   Sets grid.Column to the textbox value */
function columnWidth() {
    var num = parseNumber( this.value );
    grid.column = num;
    grid.total = grid.count * grid.column + grid.count * grid.gutter;
    SetTotalWidth();
    SetGridColumn();
    CenterPreviewPanel();
    SetPreviewLabels();
    DrawLayout();
}

/* Event handler for the Gutter Width text changed event
   Sets grid.Gutter to the textbox value */ 
function gutterWidth() {
    var num = parseNumber( this.value );
    grid.gutter = num;
    grid.edge = grid.gutter * .5;
    grid.total = grid.count * grid.column + grid.count * grid.gutter;
    SetTotalWidth();
    SetGridGutter();
    CenterPreviewPanel();
    SetPreviewLabels();
    DrawLayout();
}

/* Event handler for the Total Width text changed event
   Sets grid.Max to the textbox value */  
function gridSize() {
    var num = parseNumber( this.value );
    var maximum = num === 0 ? -1 : num;
    grid.max = maximum;
    SetMaximumWidth();
    SetTotalWidth();
    CenterPreviewPanel();
    SetPreviewLabels();
    DrawLayout();
}

/* Event handler for the grid type change event
   Sets grid.isRwd to true or false */
function gridType() {
    grid.isRwd = this.value === 'Fluid Grid-960 Based';
    
    var fixedList = document.getElementsByClassName('fixed-inputs');
    var fluidList = document.getElementsByClassName('responsive-inputs');
    var i;
    
    if( grid.isRwd ) {
        for( i = 0; i < fixedList.length; i++ ) {
            fixedList[i].style.display = 'none';
        }
        for( i = 0; i < fluidList.length; i++ ) {
            fluidList[i].style.display = 'block';
        }
    }
    else {
        for( i = 0; i < fixedList.length; i++ ) {
            fixedList[i].style.display = 'block';
        }
        for( i = 0; i < fluidList.length; i++ ) {
            fluidList[i].style.display = 'none';
        }
    }
    
    SetMaximumWidth();
    SetGridGutter();
    SetGridColumn();
    CenterPreviewPanel();
    SetPreviewLabels();
    DrawLayout();
}

/* Event handler for the Code Button click event
   Generates the grid source
   Adds the .opening class
   Sets .source visibility and opacity */
function btnCodeClick() {
    GenerateSource();
    var src = document.getElementsByClassName('source')[0];
    src.className += ' opening';
    src.style.visibility = 'visible';
    src.style.opacity = '1';
}

/* Event handler for the Close Button click event
   Removes the .opening class
   Set .source visibility and opacity */
function btnCloseClick() {
    var src = document.getElementsByClassName('source')[0];
    src.className = src.className.replace(/(?:^|\s)opening(?!\S)/g , '');
    src.style.visibility = 'hidden';
    src.style.opacity = '0';
}

/* Set Mouse event listeners */
document.getElementById( 'txtColCount' ).addEventListener( 'change', columnCount, false );
document.getElementById( 'txtColWidth' ).addEventListener( 'change', columnWidth, false );
document.getElementById( 'txtGutWidth' ).addEventListener( 'change', gutterWidth, false );
document.getElementById( 'numGridSize' ).addEventListener( 'change', gridSize, false );
document.getElementById( 'cmbGridType' ).addEventListener( 'change', gridType, false );
document.getElementById( 'btnCode' ).addEventListener( 'click', btnCodeClick, false );
document.getElementById( 'close-btn' ).addEventListener( 'click', btnCloseClick, false );

/* Create the grid object and draw the previews */
(function () {
    grid = new GridSystem();
    SetGridCount();
    DrawLayout();
})();