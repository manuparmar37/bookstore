<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- <link rel="shortcut icon" type="image/png" href="{{ url('assets/images/favicon.png') }}" /> -->
        <title>Bookstore </title>

        <!-- inject:css -->
        <link rel="stylesheet" href="{{ url('assets/vendor/bootstrap/dist/css/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ url('assets/vendor/font-awesome/css/font-awesome.min.css') }}">
        <link rel="stylesheet" href="{{ url('assets/vendor/simple-line-icons/css/simple-line-icons.css') }}">
        <link rel="stylesheet" href="{{ url('assets/vendor/weather-icons/css/weather-icons.min.css') }}">
        <link rel="stylesheet" href="{{ url('assets/vendor/themify-icons/css/themify-icons.css') }}">
        <!-- end inject -->
        
        <!--Data Table-->
        <link href="{{ url('assets/vendor/datatables/media/css/jquery.dataTables.css') }}" rel="stylesheet">
        <link href="{{ url('assets/vendor/datatables-tabletools/css/dataTables.tableTools.css') }}" rel="stylesheet">
        <link href="{{ url('assets/vendor/datatables-colvis/css/dataTables.colVis.css') }}" rel="stylesheet">
        <!-- <link href="{{ url('assets/vendor/datatables-responsive/css/responsive.dataTables.scss') }}" rel="stylesheet"> -->
        <!-- <link href="{{ url('assets/vendor/datatables-scroller/css/scroller.dataTables.scss') }}" rel="stylesheet"> -->


        <!-- Rickshaw Chart Depencencies -->
        <link rel="stylesheet" href="{{ url('assets/vendor/rickshaw/rickshaw.min.css') }}">

                <!--Morris Chart Depencencies -->
        <link rel="stylesheet" href="{{ url('assets/vendor/morris.js/morris.css') }}">

        <!--horizontal-time line-->
        <link rel="stylesheet" href="{{ url('assets/js/horizontal-timeline/css/style.css') }}">
        <link rel="stylesheet" href="{{ url('assets/vendor/select2/dist/css/select2.min.css') }}">
        
        <link rel="stylesheet" href="{{ url('assets/css/bootstrap-fileinput.css') }}">
        <!-- Bootstrap DatePicker Dependencies -->
        <link rel="stylesheet" href="{{ url('assets/vendor/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css') }}">

        <!--summer note-->
        <link rel="stylesheet" href="{{ url('assets/vendor/summernote/dist/summernote.css') }}">

        <!-- <link rel="stylesheet" type="text/css" href="{{ url('front/css/preloader.css') }}"> -->

        <!-- Main Style  -->
        <link rel="stylesheet" href="{{ url('assets/css/flipclock.css') }}">
        <link rel="stylesheet" href="{{ url('assets/css/custom-map.css') }}">
        <link rel="stylesheet" href="{{ url('assets/css/sweetalert.css') }}">
        <!-- Main Style  -->
        <link rel="stylesheet" href="{{ url('assets/css/main.css') }}">
        
        <script type="text/javascript" src="{{ url('assets/vendor/jquery/dist/jquery.min.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/js/custom.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/js/modernizr-custom.js') }}"></script>
        
        <!-- Sweet alert   -->
        <script type="text/javascript" src="{{ url('assets/js/sweetalert.min.js') }}"></script>
        <!-- <script type="text/javascript" src="{{ url('front/js/jquery.preloader.min.js') }}"></script> -->
       <!--  <script src="{{url('ckeditor/plugins/ckeditor_wiris')}}/integration/WIRISplugins.js?viewer=image"></script>
        <script src="{{url('ckeditor/ckeditor.js')}}"></script> -->
        <!-- <script type="text/javascript" src="{{url('nicedit/nicEdit.js')}}"></script> -->
        <script type="text/javascript">var nicedit_wiris_path = "nicedit/nicedit_wiris";</script>
        <!-- <script type="text/javascript" src="{{url('nicedit/nicedit_wiris/core/core.js')}}"></script> -->
        <!-- <script type="text/javascript" src="{{url('nicedit/nicedit_wiris/nicedit_wiris.js')}}"></script> -->
        <style>
            .nav {
                float: left;
            }
            .nav>li {
                float:left;
            }
            .ui-aside .nav > li > a > span {
                width: 178px;
            }
        </style>
    </head>
    <body>
        <div class="preloader-custom"></div>
        <div id="ui" class="ui">
            @include('layouts.back_footer')

            @include('layouts.back_header')
            
            @include('layouts.sidemenu')

            <div id="content" class="ui-content ui-content-aside-overlay">
                @yield('content')
            </div>
        </div>

        <!-- inject:js -->
        <script type="text/javascript" src="{{ url('assets/vendor/bootstrap/dist/js/bootstrap.min.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/vendor/jquery.nicescroll/dist/jquery.nicescroll.min.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/vendor/autosize/dist/autosize.min.js') }}"></script>
        <!-- end inject -->       
        
        <!--Data Table-->
        <script type="text/javascript" src="{{ url('assets/vendor/datatables.net/js/jquery.dataTables.min.js') }}"></script>
        <!-- Select2 Dependencies -->
        <script type="text/javascript" src="{{ url('assets/vendor/select2/dist/js/select2.min.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/vendor/datatables-tabletools/js/dataTables.tableTools.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/vendor/datatables.net-bs/js/dataTables.bootstrap.min.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/vendor/datatables-colvis/js/dataTables.colVis.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/vendor/datatables-responsive/js/dataTables.responsive.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/vendor/datatables-scroller/js/dataTables.scroller.js') }}"></script>

        <script type="text/javascript" src="https://cdn.datatables.net/buttons/1.6.2/js/dataTables.buttons.min.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
        <script type="text/javascript" src="https://cdn.datatables.net/buttons/1.6.2/js/buttons.html5.min.js"></script>

        <!--init data tables-->
        <script type="text/javascript" src="{{ url('assets/js/init-datatables.js') }}"></script>
        
        <!-- Common Script   -->
        <script type="text/javascript" src="{{ url('assets/js/main.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/js/jquery.numeric.js') }}"></script>
        <!--e charts-->
        
        <script type="text/javascript" src="{{ url('assets/js/bootstrap-fileinput.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js') }}"></script>
         <!--Morris Chart Depencencies -->
        <script type="text/javascript" src="{{ url('assets/vendor/raphael/raphael.min.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/vendor/morris.js/morris.min.js') }}"></script>
        <!--summer note-->
        <script type="text/javascript" src="{{ url('assets/vendor/summernote/dist/summernote.js') }}"></script>

        <!--basic line e charts init-->
        <script type="text/javascript">
            $(document).ready(function() {

                $('.preloader').fadeOut('slow');
                
                $(".numeric-text").numeric();                
                
                $(".custom-select2").select2({
                    //customization goes here...
                });
                
                $('.input-group.date').datepicker({
                    autoclose: true,
                    todayHighlight: true
                });

                $(document).keydown(function(e){
                        if(e.which === 123){
                     
                           return false;
                     
                        }
                     
                    });

                $(document).bind("contextmenu",function(e) { 
                    e.preventDefault();
                 
                });

             });
             
           // Morris.Bar({
           //      element: 'graph-bar',
           //      data: [
           //          {x: 'Yesterday', y: 3, z: 2, a: 3},
           //          {x: 'Month', y: 2, z: null, a: 1},
           //          {x: 'Year', y: 5, z: 2, a: 4},
                   
           //      ],
           //      xkey: 'x',
           //      ykeys: ['y', 'z', 'a'],
           //      labels: ['Y', 'Z', 'A'],
           //      barColors:['#62549a','#4aa9e9','#eac459']
           //  });

            $(".short-states").click(function(){
                $("#divshow").slideToggle(500);
            });
            
        </script>
        <script type="text/javascript">
            $('#flash-overlay-modal').modal();

            $('.user-list').DataTable({
                "PaginationType": "bootstrap",
                "paging": false,
                bLengthChange: true, 
                searching: true,
                responsive: false,
                bAutoWidth: false,
                bSort: false,
                bInfo: false,
                dom: '<"tbl-top clearfix"lfr>,t,<"tbl-footer clearfix"<"tbl-info pull-left"i><"tbl-pagin pull-right"p>>'
            });         

            $(document).ready(function() {

                $('.summernote').summernote({
                      height: 300,                 // set editor height
                    minHeight: null,             // set minimum height of editor
                    maxHeight: null,             // set maximum height of editor
                    focus: true  ,
                  toolbar: [
                    // [groupName, [list of button]]
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['font', ['strikethrough', 'superscript', 'subscript']],
                    ['fontsize', ['fontsize']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    
                    ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                   ['float', ['floatLeft', 'floatRight', 'floatNone']],
                  
                    ['codeview', ['codeview']]

  
                  ],
                 
                });

                
               

            });
            function loader() {
                $('.preloader').fadeIn('slow');
            }
        </script>
        
        
    </body>
    <div class="preloader"></div>
</html>