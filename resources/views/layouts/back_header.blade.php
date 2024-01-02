<?php
    use App\Http\Controllers\AdminController;
    $key            =   AdminController::getEncodedKey();
    $user_id        =   Auth::user()->id;
    $allRoles       =   App\Models\UserRole::where('user_id', '=', $user_id)->get();
    $userDetail     =   App\Models\User::select('is_admin','role_id')->where('id', '=', $user_id)->first(); 

    $datasession    =   Session::all();
    $session_token  =   $datasession['_token'];
    $keyTmp         =   base64_encode($user_id.'<user>'.$user_id.'<user>'.$session_token);
    // $setting     =   App\Setting::where('tenant_id', '=',$globaltenent)->first();

    // notification section shri-29-04-19
    $notification  =  []; 
    $nfy  =  []; 
    $multipleRoleIds = $userDetail->userRoleIds? explode(',', $userDetail->userRoleIds): "";
    

   //end
?>
<!--header start-->
<header id="header" class="ui-header">

    <div class="navbar-header">
        <!--logo start-->
         <!--toggle buttons start-->
        <ul class="nav navbar-nav">
            <li>
                <a class="toggle-btn" data-toggle="ui-nav" href="#">
                    <i class="fa fa-bars"></i>
                </a>
            </li>
        </ul>
        <!-- toggle buttons end -->
        <a href="{{ route('dashboard', ['key' =>  $key]) }}" class="navbar-brand">
            <span class="logo" style="">
               
                <img src="{{ url('assets/images/logo.png') }}" alt="ECBF" class="sticy-logo" >
               
                <!-- <img src="{{ url('assets/images/logo1.jpg') }}" alt=""/> -->
            </span>
            <span class="logo-compact">
                <!-- <img src="{{ url('assets/images/logo2.jpg') }}" alt=""/> -->
            </span>
        </a>
        <!--logo end-->
    </div>

    <div class="search-dropdown dropdown pull-right visible-xs">

        <button type="button" class="btn dropdown-toggle" data-toggle="dropdown"><i class="fa fa-search"></i></button>
        <div class="dropdown-menu">
            <form >
                <input class="form-control" placeholder="Search here..." type="text">
            </form>
        </div>
    </div>

    <div class="navbar-collapse nav-responsive-disabled">

       

        <!--search start-->
        
        <!--search end-->

        <!--notification start-->
        <ul class="nav navbar-nav navbar-right">
            
            <li class="dropdown">
                <!-- <a href="javascript:void(0)" onclick="getAlertRead()" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <i class="fa fa-bell-o"></i>
                    <span class="@if(count($nfy) > 0)badge @endif"><?php if(count($nfy) > 0){ echo $nfy; }?></span>
                </a> -->
                <!--dropdown -->
                <ul class="dropdown-menu dropdown-menu--responsive">
                    <div class="dropdown-header">Notification ({{count($notification)}})</div>
                    <ul class="Message-list niceScroll list-group">
                        @foreach($notification as $key=> $notify)
                        <li class="Message list-group-item @if($notify->read == 0) bg-light @endif" id="Msg-{{$notify->id}}">
                            <!-- <button class="Message__status Message__status--read" type="button" name="button"></button> -->
                            <a href="javascript:void(0)" onclick="getAlertReadOne('{{$notify->id}}')">
                                <!-- <div class="Message__avatar Message__avatar--danger pull-left" href="#">
                                    <img src="{{ url('assets/images/a2.jpg') }}" alt="...">
                                </div> -->
                                <div class="Message__highlight">
                                    <!-- <span class="Message__highlight-name">Lubida Teresa</span> -->
                                    <p class="Message__highlight-excerpt text-primary">{{$notify->description }}</p>
                                    <p class="Message__highlight-time">{{time_elapsed_string($notify->created_at)}}</p>
                                </div>
                            </a>
                        </li>
                        @endforeach
                    </ul>
                    <div class="dropdown-footer"><a href="{{ route('index', ['module' => 'contribute_list', 'action' => 'list', 'key' => $keyTmp]) }}">View more</a></div>
                </ul>
                <!--/ dropdown -->
           
            
            @if($userDetail->is_admin != 1)
            <li class="dropdown dropdown-usermenu">
                <a href="#" class=" dropdown-toggle" data-toggle="dropdown" aria-expanded="true">                  
                    <span class="hidden-sm hidden-xs">Role ( {{ getLoginUserRole($user_id) }} )</span>
                </a>
            </li>
            @endif
            


           
            <li class="dropdown dropdown-usermenu">
                <a href="#" class=" dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                    <div class="user-avatar"><img src='' alt="..."></div>
                    <span class="hidden-sm hidden-xs">{{\Auth::user()->name}} </span>
                    <span class="pull-right"><i class="glyphicon glyphicon-option-vertical"></i></span>
                </a>
                <ul class="dropdown-menu dropdown-menu-usermenu pull-right">
                    <?php
                    $datasession    =   Session::all();
                    $session_token  =   $datasession['_token'];
                    $key            =   base64_encode($user_id.'<user>'.$user_id.'<user>'.$session_token);
                    ?>
                    <li><a href="{{ route('user', ['action' => 'edit', 'key' => $key]) }}"><i class="fa fa-user"></i>Profile</a></li>
                    
                    <li class="divider"></li>
                    <li><a href="{{URL::to('/logout')}}"><i class="fa fa-sign-out"></i>Log Out</a></li>
                </ul>
            </li>
        </ul>
        <!--notification end-->
    </div>
</header>
<!--header end-->


   


    <!-- shri notification -->
<script type="text/javascript">

   
    
    
    
    
    
      
</script>





