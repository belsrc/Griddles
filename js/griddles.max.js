(function( Griddles, $ ) {
    var grid;
    var GridSystem = (function () {
        function GridSystem() {
            this.count = 12;
            this.column = 60;
            this.gutter = 20;
            this.edge = 10;
            this.total = 960;
            this.max = 960;
            this.isRwd = false;
        }
        return GridSystem;
    })();
    $(document).ready(function () {
        grid = new GridSystem();
        $(function () {
            $('#txtColCount').bind('click keyup change', function () {
                if($.isNumeric($(this).val())) {
                    grid.count = parseInt($(this).val(), 10);
                    grid.total = grid.count * grid.column + grid.count * grid.gutter;
                    SetGridCount();
                    DrawLayout();
                }
            });
        });
        $(function () {
            $('#txtColWidth').bind('click keyup change', function () {
                if($.isNumeric($(this).val())) {
                    grid.column = parseInt($(this).val(), 10);
                    grid.total = grid.count * grid.column + grid.count * grid.gutter;
                    SetTotalWidth();
                    SetGridColumn();
                    CenterPreviewPanel();
                    SetPreviewLabels();
                    DrawLayout();
                }
            });
        });
        $(function () {
            $('#txtGutWidth').bind('click keyup change', function () {
                if($.isNumeric($(this).val())) {
                    grid.gutter = parseInt($(this).val(), 10);
                    grid.edge = grid.gutter * 0.5;
                    grid.total = grid.count * grid.column + grid.count * grid.gutter;
                    SetTotalWidth();
                    SetGridGutter();
                    CenterPreviewPanel();
                    SetPreviewLabels();
                    DrawLayout();
                }
            });
        });
        $(function () {
            $('#numGridSize').bind('click keyup change', function () {
                if($.isNumeric($(this).val())) {
                    var maximum = $(this).val() === '0' ? -1 : parseInt($(this).val(), 10);
                    grid.max = maximum;
                    SetMaximumWidth();
                    SetTotalWidth();
                    CenterPreviewPanel();
                    SetPreviewLabels();
                    DrawLayout();
                }
            });
        });
        $(function () {
            $('#cmbGridType').change(function () {
                grid.isRwd = $(this).val() === 'Fluid Grid-960 Based';
                if(grid.isRwd) {
                    $('.fixed-inputs').css('display', 'none');
                    $('.responsive-inputs').css('display', 'block');
                } else {
                    $('.fixed-inputs').css('display', 'block');
                    $('.responsive-inputs').css('display', 'none');
                }
                SetMaximumWidth();
                SetGridGutter();
                SetGridColumn();
                CenterPreviewPanel();
                SetPreviewLabels();
                DrawLayout();
            });
        });
        $(function () {
            $('#btnCode').click(function () {
                GenerateSource();
                $('.source').addClass('opening');
                $('.source').css({'visibility': 'visible','opacity': '1'});
            });
        });
        $(function () {
            $('#close-btn').click(function () {
                $('.source').removeClass('opening');
                $('.source').css({'visibility': 'hidden','opacity': '0'});
            });
        });
        SetGridCount();
        DrawLayout();
    });
    function SetMaximumWidth() {
        var m = !grid.isRwd ? '100%' : grid.max !== -1 ? grid.max + 'px' : '100%';
        $('#gridExample').css('max-width', m);
        $('#gridExample').css('width', m);
    }
    function SetTotalWidth() {
        var w = grid.isRwd ? grid.max + 'px' : grid.total + 'px';
        $('#gridExample').css('width', w);
    }
    function SetGridCount() {
        var i;
        SetTotalWidth();
        $('#gridExample').empty();
        $('#gridExample').append('<div class="preview-edge"></div>');
        for(i = 0; i < grid.count - 1; i++) {
            $('#gridExample').append('<div class="preview-column"></div>');
            $('#gridExample').append('<div class="preview-gutter"></div>');
        }
        $('#gridExample').append('<div class="preview-column"></div>');
        $('#gridExample').append('<div class="preview-edge"></div>');
        SetGridGutter();
        SetGridColumn();
        CenterPreviewPanel();
        SetPreviewLabels();
    }
    function SetGridGutter() {
        var edg = grid.isRwd ? '1%' : grid.edge + 'px';
        var gut = grid.isRwd ? '2%' : grid.gutter + 'px';

        $('.preview-edge').css('width', edg);
        $('.preview-gutter').css('width', gut);
    }
    function SetGridColumn() {
        var tmp = (100 - (grid.count * 2)) / grid.count;
        var col = grid.isRwd ? tmp + '%' : grid.column + 'px';

        $('.preview-column').css('width', col);
    }
    function SetPreviewLabels() {
        var total = !grid.isRwd ? grid.total + 'px' : grid.max !== -1 ? grid.max + 'px' : '100%';
        var content = !grid.isRwd ? (grid.total - grid.gutter).toString() + 'px' : grid.max !== -1 ? (Math.round(grid.max * 0.98)).toString() + 'px' : '98%';
        $('#lblTotalSize').html('Total Size : ' + total);
        $('#lblContentSize').html('Content Size : ' + content);
    }
    function CenterPreviewPanel() {
        var offset = !grid.isRwd ? '-' + (grid.total / 2).toString() + 'px' : grid.max !== -1 ? '-' + (grid.max / 2).toString() + 'px' : '-50%';
        $('#gridExample').css('margin-left', offset);
    }
    function DrawLayout() {
        var edg = grid.isRwd ? '1%' : grid.edge + 'px';
        var gut = grid.isRwd ? '2%' : grid.gutter + 'px';
        var wid = grid.isRwd ? grid.max + 'px' : grid.total + 'px';
        var tmp = (100 - (grid.count * 2)) / grid.count;
        var col = grid.isRwd ? tmp + '%' : grid.column + 'px';

        $('#layoutExample').empty();
        $('#layoutExample').append('<div id="layout-contain"></div>');
        $('#layout-contain').css({
            'width': wid,
            'margin': '0 auto'
        });
        for(var i = 0; i < grid.count - 1; i++) {
            var first;
            var next;

            if(grid.isRwd) {
                var tw = Math.round(((100 - grid.count * 2) / grid.count * (i + 1) + (i * 2)) * 100) / 100;
                first = tw + '%';
                next = (96 - tw) + '%';
            } else {
                first = (grid.column * (i + 1) + grid.gutter * i) + 'px';
                next = (grid.total - grid.gutter * 2 - parseInt(first)) + 'px';
            }
            var newRow = $('<div>').addClass('layout-row').append($('<div>').addClass('layout').css({
                'margin-right': gut,
                'width': first
            }).text(i + 1), $('<div>').addClass('layout').css({
                'margin-right': gut,
                'width': next
            }).text(grid.count - (i + 1)));
            $('#layout-contain').append(newRow);
        }
        $('.layout').css('margin', '0 ' + edg);
        SetLinks();
    }
    function SetLinks() {
        var flag = grid.isRwd ? 1 : 0;
        var qString = '?count=' + grid.count + '&column=' + grid.column + '&gutter=' + grid.gutter + '&total=' + grid.total + '&max=' + grid.max + '&isRwd=' + flag;
        $('#btnPs').prop("href", "photoshop.php" + qString);
        $('#btnFw').prop("href", "fireworks.php" + qString);
        $('#btnCss').prop("href", "css.php" + qString);
    }
    function GenerateSource() {
        if($('#cmbGridType').val() === 'Static Grid-960 Based' || $('#cmbGridType').val() === 'Fluid Grid-960 Based') {
            $('#code').empty().html(GenerateNineSixtyBased());
        } else {
        }
        prettyPrint();
    }
    function SuffixString() {
        var i;
        var s = '\n/* Suffix Extra Space\n=====================================================*/\n';
        for(i = 0; i < grid.count - 1; i++) {
            s += '.container .suffix-' + (i + 1) + ' { padding-right: ';
            if(grid.isRwd) {
                var width = ((((100 - grid.count * 2) / grid.count) * (i + 1)) + ((i + 1) * 2));
                width = Math.round(width * 100) / 100;
                s += width + '%';
            } else {
                s += (grid.column * (i + 1) + grid.gutter * (i + 1)) + 'px';
            }
            s += '; }\n';
        }
        return s;
    }
    function PrefixString() {
        var i;
        var s = '\n/* Prefix Extra Space\n=====================================================*/\n';
        for(i = 0; i < grid.count - 1; i++) {
            s += '.container .prefix-' + (i + 1) + ' { padding-left: ';
            if(grid.isRwd) {
                var width = ((((100 - grid.count * 2) / grid.count) * (i + 1)) + ((i + 1) * 2));
                width = Math.round(width * 100) / 100;
                s += width + '%';
            } else {
                s += (grid.column * (i + 1) + grid.gutter * (i + 1)) + 'px';
            }
            s += '; }\n';
        }
        return s;
    }
    function ColumnString() {
        var i;
        var s = '/* Grid Columns\n=====================================================*/\n';
        for(i = 0; i < grid.count; i++) {
            s += '.container .grid-' + (i + 1) + ' { width: ';
            if(grid.isRwd) {
                var width = ((((100 - grid.count * 2) / grid.count) * (i + 1)) + (i * 2));
                width = Math.round(width * 100) / 100;
                s += width + '%';
            } else {
                s += ((grid.column * (i + 1)) + (grid.gutter * i)) + 'px';
            }
            s += '; }\n';
        }
        return s;
    }
    function GlobalString() {
        var edge = grid.isRwd ? '1%' : grid.edge + 'px';
        var s = '/* Grid Globals\n=====================================================*/\n';
        s += '[class*="grid-"] {\n\tfloat: left;\n\tmargin: 0 ' + edge + ';\n}\n\n';
        return s;
    }
    function GenerateNineSixtyBased() {
        var bfs = '';
        var width = grid.isRwd ? '100%;' : (grid.total + 'px;');
        bfs += '/* Based on (a trimmed down version of) 960 Grid System by Nathan Smith (<a href="http://sonspring.com/" target="_blank">http://sonspring.com/</a>)\n=====================================================*/\n';
        bfs += '.container {\n\twidth: ' + width;
        if(grid.isRwd && grid.max !== -1) {
            bfs += '\n\tmax-width: ' + grid.max + 'px;';
        }
        bfs += '\n\tmargin: 0 auto;\n\t*zoom: 1;\n}\n\n';
        bfs += GlobalString() + ColumnString() + PrefixString() + SuffixString();
        bfs += '\n/* Clear Floated Elements\n=====================================================*/\n';
        bfs += '.clear {\n\tclear: both;\n\tdisplay: block;\n\toverflow: hidden;\n\tvisibility: hidden;\n\twidth: 0;\n\theight: 0;\n}\n\n';
        bfs += '.clearfix:before,\n.clearfix:after,\n.container:before,\n.container:after {\n\tcontent: ".";\n\tdisplay: block;\n\t' + 'overflow: hidden;\n\tvisibility: hidden;\n\tfont-size: 0;\n\tline-height: 0;\n\twidth: 0;\n\theight: 0;\n}\n\n';
        bfs += '.clearfix:after,\n.container:after {\n\tclear: both;\n}\n\n';
        bfs += '.clearfix, .container { zoom: 1; }\n';
        return bfs;
    }
}( window.Griddles = window.Griddles || {}, jQuery ));
(function ($) {
    $.fn.styleddropdown = function () {
        return this.each(function () {
            var obj = $(this);
            obj.find('.cmb-body').click(function () {
                obj.find('.cmb-items').fadeIn(400);
                $(document).keyup(function (event) {
                    if(event.keyCode === 27) {
                        obj.find('.cmb-items').fadeOut(400);
                    }
                });
                obj.find('.cmb-items').hover(function () {
                }, function () {
                    $(this).fadeOut(400);
                });
            });
            obj.find('.cmb-items li').click(function () {
                obj.find('.cmb-body').val($(this).html()).change();
                obj.find('.cmb-items').fadeOut(400);
            });
        });
    };
})(jQuery);
$(function () {
    $('.combobox').styleddropdown();
});