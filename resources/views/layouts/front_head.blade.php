<!DOCTYPE html>
<html lang="en">

<head>
    @yield('meta')
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ACT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="{{url('assets/bootstrap/css/bootstrap.min.css')}}" rel="stylesheet">
    <link href="{{url('assets/fonts/css/fontawesome-all.min.css')}}" rel="stylesheet"> 
    <link href="{{url('assets/css/animate.css')}}" rel="stylesheet">
    <link rel="stylesheet" href="{{url('assets/css/cookieconsent.min.css')}}" />
    <link rel="stylesheet" type="text/css" media="screen" href="{{url('assets/css/main1.css')}}" />
     <!-- Bootstrap DatePicker Dependencies -->
    <!-- <link rel="stylesheet" href="{{ url('assets/vendor/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css') }}"> -->
    <!-- <link rel="stylesheet" href="{{ url('assets/css/css-demo-page.css') }}"> -->
    <!-- GRT Youtube Plugin CSS -->
    <link rel="stylesheet" href="{{ url('assets/css/lity.css') }}">
    <link rel="stylesheet" href="{{ url('assets/css/sweetalert.css') }}">
    <script type="text/javascript" src="{{ url('assets/js/sweetalert.min.js') }}"></script>
    <script src="{{url('assets/js/jquery-3.3.1.min.js')}}"></script>
    <script src="{{url('assets/js/cookieconsent.min.js')}}"></script>
    <script src="{{url('assets/js/starrr.js')}}"></script>

    <script>
        window.addEventListener("load", function(){
            window.cookieconsent.initialise({
              "palette": {
                "popup": {
                  "background": "#000"
                },
                "button": {
                  "background": "#f1d600"
                }
              },
              "showLink": false,
              "theme": "classic",
              "position": "bottom-right"
            })});
    </script>
</head>
    <body>

    @include('layouts.front_header')

    @yield('content')

    @include('layouts.front_footer')

 
    
    <script src="{{url('assets/bootstrap/js/bootstrap.min.js')}}"></script>    
    <script src="{{url('assets/js/css3-animate-it.js')}}"></script>
    <script src="{{url('assets/js/combine-js.js')}}"></script>
    <script src="{{url('assets/js/lity.js')}}"></script>
    <script src="{{url('assets/js/main1.js')}}"></script>
    <script type="text/javascript" src="{{ url('assets/js/jquery.numeric.js') }}"></script>

    <!-- <script type="text/javascript" src="{{ url('assets/vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js') }}"></script> -->
    <script type="text/javascript">

         $(function () {
            $(".numeric-text").numeric(); 
              });
        $('.starrr:eq(0)').on('starrr:change', function(e, value){
              if (value) {
                $('.your-choice-was').show();
                $('.choice').text(value);
                $('#rating_point').val(value);
              } else {
                $('.your-choice-was').hide();
                $('#rating_point').val('0');
              }
            });

        // document.getElementById("defaultOpen").click();

        
    </script>
    <script type="text/javascript">
        // $(document).ready(function() {
        //     $('.datepicker').datepicker({
        //         autoclose: true,
        //         todayHighlight: true
        //     });
        //  });
    </script>

   
    </body>
</html>

