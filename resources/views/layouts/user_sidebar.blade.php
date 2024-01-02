    <!-- Navigation -->
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
             <?php
             $setting = App\Setting::where('tenant_id', '=', $globaltenent)->first(); ?>
             <a href="javascript:void(0)" class="btn btn-info hide-text-btn"><i class="fa fa-bars" aria-hidden="true"></i></a>
            <a class="navbar-brand" href="{{ url('/') }}" style="padding: 5px; padding-left: 25px;">
                 @if(!empty($setting->logo) && $setting->logo!='N/A')
                 <img src='{{ url("setting/setting_tenant_".$setting->tenant_id) }}/{{ $setting->logo }}' width="56px">
                 @else
                <img src="{{url('assets/images/easevidhya-logo-sticky.png')}}" alt="LOGO" width="185px">
                @endif
            </a>
            
        </div>
        <!-- Top Menu Items -->
        <ul class="nav navbar-right top-nav">
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{\Auth::user()->name}} <b class="fa fa-angle-down"></b></a>
                <ul class="dropdown-menu">
                    <li><a href="{{url('user-profile-edit')}}"><i class="fa fa-fw fa-user"></i> Edit Profile</a></li>
                    <!-- <li><a href="#"><i class="fa fa-fw fa-cog"></i> Change Password</a></li> -->
                    <li class="divider"></li>
                    <li><a href="{{url('frontlogout')}}"><i class="fa fa-fw fa-power-off"></i> Logout</a></li>
                </ul>
            </li>
        </ul>
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav side-nav tab">
                <li>
                    <a href="{{url('user-dashboard')}}"><i class="fa fa-fw fa-search"></i> <span>My Dashboard</span></a>
                </li>
                <li>
                    <a href="{{url('user-profile')}}"><i class="fa fa-fw fa-user-plus"></i> <span>Profile</span></a>
                </li>
                
                
                <!-- <li >
                    <a href="{{url('user-exams')}}"><i class="fa fa-file-alt"></i> <span>My Tests</span></a>
                </li> -->
                 <li >
                    <a href="{{url('user-demoexams')}}"><i class="fa fa-file-alt"></i> <span>Practice Tests</span></a>
                </li>
                 <li >
                    <a href="{{url('user-videos')}}"><i class="fa fa-folder" aria-hidden="true"></i> <span>Study material</span></a>
                </li>
                
                <li>
                    <a href="{{url('user-results')}}"><i class="fa fa-list"></i> <span>Results</span></a>
                </li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </nav>