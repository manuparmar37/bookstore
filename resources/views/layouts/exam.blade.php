<!DOCTYPE html>
<html lang="en">

<head>
    <title>ACT</title>
    <!-- META TAGS -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="keyword" content="">
    <!-- FAV ICON(BROWSER TAB ICON) -->
    <link rel="shortcut icon" href="{{ url('front/images/fav.ico') }}" type="image/x-icon">
    <!-- GOOGLE FONT -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700%7CJosefin+Sans:600,700" rel="stylesheet">

    <!-- Custom -->
    <link rel="stylesheet" href="{{ url('front/forum/css/custom.css') }}" >
    <!-- CSS STYLE-->
    <link rel="stylesheet" type="text/css" href="{{ url('front/forum/css/style.css') }}" media="screen" />

    <!-- FONTAWESOME ICONS -->
    <link rel="stylesheet" href="{{ url('front/css/font-awesome.min.css') }}">
    <!-- ALL CSS FILES -->
    <link rel="stylesheet" href="{{ url('front/css/materialize.css') }}">
    <link rel="stylesheet" href="{{ url('front/css/bootstrap.css') }}" />
        <!-- Owl Caousel CSS -->
    <link rel="stylesheet" href="{{ url('front/OwlCarousel/owl.carousel.min.css') }}">
    <link rel="stylesheet" href="{{ url('front/OwlCarousel/owl.theme.default.min.css') }}">
    <!-- ReImageGrid CSS -->
    <link rel="stylesheet" href="{{ url('front/css/reImageGrid.css') }}">
    <link rel="stylesheet" href="{{ url('front/css/style.css') }}" />
    <!-- RESPONSIVE.CSS ONLY FOR MOBILE AND TABLET VIEWS -->
    <link rel="stylesheet" href="{{ url('front/css/style-mob.css') }}" />
<link rel="stylesheet" href="{{ url('assets/css/sweetalert.css') }}">
        <script type="text/javascript" src="{{ url('assets/js/sweetalert.min.js') }}"></script>
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="js/html5shiv.js"></script>
    <script src="js/respond.min.js"></script>
    <![endif]-->
    <!-- Modernizr Js -->
    <script type="text/javascript" src="{{ url('front/js/modernizr-2.8.3.min.js') }}"></script>

       <!--Import jQuery before materialize.js-->
    <script type="text/javascript" src="{{ url('front/js/main.min.js') }}"></script>
    <script type="text/javascript" src="{{ url('front/js/bootstrap.min.js') }}"></script>
    <script type="text/javascript" src="{{ url('front/js/materialize.min.js') }}"></script>
    <style>
      .top-logo {
   -webkit-animation-name: animationFade;
    -o-animation-name: animationFade;
    animation-name: animationFade;
    -webkit-animation-duration: 1s;
    -o-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    -o-animation-fill-mode: both;
    animation-fill-mode: both;
    background-image: -webkit-linear-gradient(330deg,#0369d1 0%,#134377 100%);
    background-image: -o-linear-gradient(330deg,#0369d1 0%,#134377 100%);
    background-image: linear-gradient(-240deg,#0369d1 0%,#134377 100%);
   color:white;
}
ul:not(.browser-default) {
    padding-left: 0;
    list-style-type: none;
    margin-bottom: 0;
    margin-right: 0;
}
    </style>
    </head>
    <body>
  
   <!-- MOBILE MENU -->
    <section>
        <div class="ed-mob-menu">
            <div class="ed-mob-menu-con">
                <div class="ed-mm-left">
                    <div class="wed-logo">
                          <?php $setting     =   App\Setting::where('tenant_id', '=',$globaltenent)->first(); 
?>
<a href="{{ url('/') }}">
              @if(empty($setting->logo))
                <img src="{{url('assets/images/easevidhya-logo-sticky.png')}}" alt="Ease Vidya" class="sticy-logo">
                @else
                <img src='{{ url("setting/setting_tenant_".$setting->tenant_id) }}/{{ $setting->logo }}' alt="Ease Vidya" class="sticy-logo">
                @endif
                 </a>
                     
                    </div>
                </div>
                <div class="exam-title">
                    <h3>{{getTestDetailById($test_id,'testname')}}</h3>
                </div>
            </div>
        </div>
    </section>
    <!--HEADER SECTION-->
    <section>
        <!-- LOGO AND MENU SECTION -->
        <div class="top-logo" data-spy="affix" data-offset-top="250">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="col-lg-4" style="padding:0">
                            <a href="{{ url('home') }}"><img src="{{ url('assets/images/easevidhya-logo-sticky.png') }}" alt="" />
                        </a>
                        </div>
                        <div class="exam-title col-lg-4" style="text-align: center;">
                            <h3>{{getTestDetailById($test_id,'testname')}}</h3>
                        </div>
                        <div class="user-com-t1-right col-lg-4" style="text-align: center;">
                            <ul class="user-details">
                               
                                <li>
                                 @if(!empty(getUserDetailById(\Auth::user()->id,'profile_pic')) && getUserDetailById(\Auth::user()->id,'profile_pic')!='N/A')
                                <img src="{{ url('user/user_tenant_'.getUserDetailById(\Auth::user()->id,'unique_code')) }}{{'/'.getUserDetailById(\Auth::user()->id,'profile_pic')}}" alt="user">
                                @else
                                <img src="" alt="user">
                                @endif
                                    
                                    <span class="user-name">{{getUserDetailById(\Auth::user()->id,'name')}}</span> </li>
                            </ul>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>        
    </section>
    <!--END HEADER SECTION-->


    @yield('content')

     <!-- COPY RIGHTS -->
    <section class="wed-rights">
        <div class="container">
            <div class="row">
                <div class="copy-right">
                    <p>Copyrights © 2018 EaseVidya. All rights reserved.</p>
                </div>
            </div>
        </div>
    </section>
 
    <!-- WOW JS -->
    <script type="text/javascript" src="{{ url('front/js/wow.min.js') }}"></script>  
      <!-- Owl Cauosel JS -->
    <script type="text/javascript" src="{{ url('front/OwlCarousel/owl.carousel.min.js') }}"></script>
        <!-- Gridrotator js -->
    <script type="text/javascript" src="{{ url('front/js/jquery.gridrotator.js') }}"></script> 
    <script type="text/javascript" src="{{ url('front/js/custom.js') }}"></script>

    </body>
</html>

