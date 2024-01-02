
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ACT</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="{{ url('assets/bootstrap/css/bootstrap.min.css') }}">
    <link href="{{ url('assets/fonts/css/fontawesome-all.min.css') }}" rel="stylesheet"> 
    <link href="{{ url('assets/css/dashboard.css') }}" rel="stylesheet">
   
     <link rel="stylesheet" href="{{ url('assets/vendor/bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css') }}">
      <link rel="stylesheet" href="{{ url('assets/css/sweetalert.css') }}">
        <script type="text/javascript" src="{{ url('assets/js/sweetalert.min.js') }}"></script>
         <script src="{{ url('assets/js/jquery.min.js') }}"></script>
       <script src="{{ url('assets/bootstrap/js/bootstrap.min.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/js/jquery.numeric.js') }}"></script>

         <script type="text/javascript" src="{{ url('assets/vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js') }}">
           
         </script>
         <style>
         ul:not(.browser-default) {
    padding-left: 0;
    list-style-type: none;
    margin-bottom: 0;
    margin-right: 0;
}
.nav>li>a {
    position: relative;
    display: block;
    padding: 7px 15px;
    color: #ffffff;
}
.nav .open>a, .nav .open>a:focus, .nav .open>a:hover {
    background-color: #eeeeee26;
    border-color: #fbfbfb;
}
.nav>li>a:focus, .nav>li>a:hover {
    text-decoration: none;
    background-color: #eeeeee2e;
}

.top-nav {margin-top: 1%;}
 </style>

</head>
    <body>

        <div id="throbber" style="display:none; min-height:120px;"></div>
        <div id="noty-holder"></div>
        <div id="wrapper" class="wrapper-box">
           @include('layouts.user_sidebar')

           @yield('content')
       </div>
       <!-- /#wrapper -->
      <!--  <script src="{{ url('assets/js/jquery.min.js') }}"></script>
       <script src="{{ url('assets/bootstrap/js/bootstrap.min.js') }}"></script>
        <script type="text/javascript" src="{{ url('assets/js/jquery.numeric.js') }}"></script>

         <script type="text/javascript" src="{{ url('assets/vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js') }}"></script> -->


       <script>
        $(function(){
            $('[data-toggle="tooltip"]').tooltip();
            $(".side-nav .collapse").on("hide.bs.collapse", function() {                   
                $(this).prev().find(".fa").eq(1).removeClass("fa-angle-right").addClass("fa-angle-down");
            });
            $('.side-nav .collapse').on("show.bs.collapse", function() {                        
                $(this).prev().find(".fa").eq(1).removeClass("fa-angle-down").addClass("fa-angle-right");        
            });
        })    
        
    </script> 
   
  <script type="text/javascript">
    $(function () {     
        $(".numeric-text").numeric();          
           $('.date').datepicker({
            autoclose: true,
            todayHighlight: true,
            format: 'd-M-yyyy'
        });
    });

    // window resize add and remove class
    $(window).resize(function(){
        if($(this).width() > 767){
            $("#wrapper").addClass("wrapper-box wrapper-box2")
        }else{
            $("#wrapper").removeClass("wrapper-box wrapper-box2")
        }
    });

    // menu click
    $(function(){
        $(".hide-text-btn").on('click', function(){
            $(".wrapper-box").toggleClass('wrapper-box2');
        });
    });

</script>
</body>

</html>