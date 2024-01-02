<nav class="navbar navbar-default fixed-top navbar-expand-lg">
<div class="container">
<div class="navbar-brand">
    <?php $setting     =   App\Setting::where('tenant_id', '=', $globaltenent)->first(); 
     $testcourses     =   App\Course::where('tenant_id', '=', $globaltenent)->get(); 

    ?>
    <a href="{{url('/')}}">
        
        @if(!empty($setting->logo) && $setting->logo!='N/A')
        <img src='{{ url("setting/setting_tenant_".$setting->tenant_id) }}/{{ $setting->logo }}' alt="Logo" class="sticy-logo">
        <img src='{{ url("setting/setting_tenant_".$setting->tenant_id) }}/{{ $setting->logo2 }}' alt="logo" class="logo">
        @else
        <img src="{{url('assets/images/logo.png')}}" alt="Logo" class="sticy-logo">
        @endif
    </a>
</div>
    <div class="navbar-collapse collapse float-right" id="menu" data-hover="dropdown" data-animations="fadeInUp">
        <ul class="nav navbar-nav ml-auto">
            <li class="{{ Request::is('/')? 'active': '' }}"><a href="{{url('/')}}">Home</a></li>
            <li class="{{ Request::is('cms/about-us')? 'active': '' }}"><a href="{{url('cms/about-us')}}">About Us</a></li>
           <!--  <li class="dropdown mega-dropdown">
                <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Courses <span class="caret"></span></a>                
                <ul class="dropdown-menu mega-dropdown-menu main-mega-menu clearfix">
                    @foreach($testcourses as $key=>$value)
                    <li class="col-sm-3">
                        <ul class="clearfix">
                            <a href="javascript:void(0)"><li class="dropdown-header">{{$value->name}}</li></a>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li> 
                        </ul>
                    </li>
                    @endforeach
                   <li class="col-sm-3">
                        <ul class="clearfix">
                            <li class="dropdown-header">Bank PO</li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>                           
                        </ul>
                    </li>
                    <li class="col-sm-3">
                        <ul class="clearfix">
                            <li class="dropdown-header">KVS</li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>
                            <li><a href="javascript:void(0)"><i class="fa fa-arrow-circle-right"></i>abcd</a></li>                           
                        </ul>
                    </li> 
                </ul>   
            </li> -->
            <!-- <li><a href="{{url('course-list')}}">Courses</a></li> -->
            <!--<li><a href="{{url('package-list')}}">Packages</a></li>-->
            <!----<li><a href="{{url('classroompackage')}}">Classroom Coaching</a></li>------>
            <li class="dropdown mega-dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" >
                	Classroom Coaching <span class="caret"></span></a>             
                <ul class="dropdown-menu mega-dropdown-menu clearfix">
                    @foreach($testcourses as $mainCourse)
                    @if($mainCourse->status == 1 && $mainCourse->parent_id == 0 && $mainCourse->type == 1 )
                        <li class="col-sm-4">
                            <ul>
                                <li class="dropdown-header">{{$mainCourse->name}}</li>
                                @foreach($testcourses as $subCourse)
                    @if($subCourse->status == 1 && $subCourse->parent_id == $mainCourse->id && $subCourse->type == 1 )
                                <li>
                                    <a href="{{url('new-course')}}/{{base64_encode($subCourse->id)}}">{{$subCourse->name}}</a></li>
                                   @endif
                        @endforeach 
                                <!-- <li><a href="{{url('new-course')}}">DULLB</a></li> -->
                               
                            </ul>
                        </li>
                        @endif
                        @endforeach
                </ul> 
            </li>

            <li class="{{ Request::is('e-store')? 'active': '' }}"><a href="{{url('e-store')}}">E-Store</a></li>
            <li class="{{ Request::is('news-list')? 'active': '' }}"><a href="{{url('news-list')}}">News</a></li>
            <li class="{{ Request::is('Careers')? 'active': '' }}"><a href="{{url('careers')}}">Careers</a></li>
            @if(\Auth::guest())
            <li><a href="{{url('login')}}">Login</a></li>
            @else
            <li><a href="{{url('user-profile')}}">Profile</a></li>
            @endif
        </ul>
    </div>
    <div class="attr-nav ">
        <ul>
            <li class="dropdown"><a href="{{url('usercart')}}" class="cart_anchor"><i class="fal fa-shopping-cart"></i></a>
             @if(Auth::guest())
                 <span class="badge">0</span>
             @else
              <span class="badge">{{cart_item(Auth::user()->id)}}</span>
            @endif
            </li> 
        </ul>
    </div>
    <div class="navbar-toggler collapsed" data-toggle="collapse" data-target="#menu" aria-controls="menu" aria-expanded="true"
    aria-label="Toggle navigation">
    <div class="menu-icon">
        <div class="toggle-bar "></div>
    </div>
</div>
</div>
</nav>

<script>
$(document).ready(function(){
$(".dropdown").hover(            
function() {
    $('.dropdown-menu', this).not('.in .dropdown-menu').stop(true,true).slideDown("400");
    $(this).toggleClass('open');        
},
function() {
    $('.dropdown-menu', this).not('.in .dropdown-menu').stop(true,true).slideUp("400");
    $(this).toggleClass('open');       
}
);
});
</script>