<!DOCTYPE html>
<html>
<style>
    .image-box {
        background: #4aa9e9;
        width: fit-content;
        border-radius: 10px;
    }
</style>
<head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" type="image/png" href="{{ url('assets/images/favicon.png') }}" />
        <title>Login</title>

        <!-- inject:css -->
        <link rel="stylesheet" href="{{ url('assets/vendor/bootstrap/dist/css/bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ url('assets/vendor/font-awesome/css/font-awesome.min.css') }}">
        <link rel="stylesheet" href="{{ url('assets/vendor/simple-line-icons/css/simple-line-icons.css') }}">
        <link rel="stylesheet" href="{{ url('assets/vendor/weather-icons/css/weather-icons.min.css') }}">
        <link rel="stylesheet" href="{{ url('assets/vendor/themify-icons/css/themify-icons.css') }}">
        <!-- end inject -->

        <!-- Main Style  -->
        <link rel="stylesheet" href="{{ url('assets/css/main.css') }}">
        
        <!-- Sweet alert   -->
        <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
        
        <script src="{{ url('assets/js/modernizr-custom.js') }}"></script>
        <script src="/js/common.js"></script>
    </head>
    <body>
        <div class="sign-in-wrapper">
             
            <div class="sign-container">
               
            @if(Session::has('message'))
            <script>swal('Success', '{{ Session::get("message") }}', 'success')</script>
            @endif
            <?php
                $datasession    =   Session::all();
                $session_token  =   $datasession['_token'];
            ?>
                <div class="text-center">
                    <h2 class="logo"><img src="{{ url('assets/images/logo.png') }}" width="100px" alt=""/></h2>
                    <h4>Login to Admin</h4>
                </div>
            <?php //echo Hash::make(bcrypt('1234551')) ?>
                <form class="sign-in-form" id="sign-in-form" method="POST" action="{{ route('login') }}" autocomplete="off">
                    {{ csrf_field() }}
                    <input type="hidden" name="adminkey" value="{{ base64_encode('<key>admin<key>'.$session_token) }}">
                    <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                        <input type="email" name=email class="form-control" placeholder="Email id" required>
                        @if ($errors->has('email'))
                            <span class="help-block">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                        @endif
                    </div>
                    <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                        <input type="password" id="password" class="form-control" name="password" placeholder="Password" required>
                        @if ($errors->has('password'))
                            <span class="help-block">
                                <strong>{{ $errors->first('password') }}</strong>
                            </span>
                        @endif
                    </div>
                    <div class="form-group text-center">
                        <button type="submit" class="btn btn-info">Login</button>
                    </div>                 
                    
                </form>
                <div class="text-center copyright-txt">
                    <small> Manu Parmar Copyright © <?php echo date('Y');?></small>
                </div>
            </div>
        </div>

        <!-- inject:js -->
        <script src="{{ url('assets/vendor/jquery/dist/jquery.min.js') }}"></script>
        <script src="{{ url('assets/vendor/bootstrap/dist/js/bootstrap.min.js') }}"></script>
        <script src="{{ url('assets/vendor/jquery.nicescroll/dist/jquery.nicescroll.min.js') }}"></script>
        <script src="{{ url('assets/vendor/autosize/dist/autosize.min.js') }}"></script>
        <!-- end inject -->
        <!-- Common Script   -->
        <script src="{{ url('assets/js/main.js') }}"></script>
         <script type="text/javascript" src="{{ url('front/js/aes.js') }}"></script>
        @if(env('APP_ENV') == 'Prod')
            <script>
                $( document ).ready(function() {
                    $('input').attr('autocomplete','off');
                    $('body').bind('cut copy paste', function(event) {
                        event.preventDefault();
                    });
                });
            </script>
        @endif
        <script>
            $('div.alert').not('.alert-important').delay(3000).fadeOut(350);

    $('#sign-in-form').keypress(function (e) {
        if (e.which == 13) {
            $('button[type = button]').click();
            return false;  
        }
    });
        </script>
    </body>
</html>
