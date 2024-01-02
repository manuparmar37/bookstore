<?php

use App\Http\Controllers\AdminController;
use App\Models\Module;
use App\Models\User;
use App\Lead;

$key = AdminController::getEncodedKey();

$role_id = \Auth::user()->role_id;
$user_detail =  User::find(\Auth::user()->id);
$module = Module::where('parent_id', '=', 0)->get();

$btMenuAllowedUsers = [];
$dashboardMenuNotAllowedRoles = [];
?>
<!--side bar start-->
<aside id="aside" class="ui-aside">
    <ul class="nav" ui-nav>
        <li class="nav-head">
            <h5 class="nav-title text-uppercase light-txt">Navigation</h5>
        </li>
        @if(!in_array($role_id, $dashboardMenuNotAllowedRoles))
            <li class="active"><a href="{{ route('dashboard', ['key'    =>  $key]) }}"><i class="ti-home"></i><span>Dashboard</span></a></li>
        @endif
        <?php
        $datasession    =   Session::all();
        $session_token  =   $datasession['_token'];
        $key            =   base64_encode($user_detail->id.'<user>'.$user_detail->id.'<user>'.$session_token);
        ?>
        
        <?php
            foreach ($module as $value) {
                if(($value->module_key != 'admin_profile' || $user_detail->is_admin == 1)) { ?>
                    <li id="li_{{$value->module_key}}"><a href="javascript:void(0);"><i class="{{ $value->icon }}"></i><span>{{AdminController::get_module_detail($value->id,'module_name')}}</span><i class="fa fa-angle-right pull-right"></i></a>
                        <ul class="nav nav-sub" id="ul_{{$value->module_key}}">
                        <?php
                        $submodule = Module::where('parent_id', '=', $value->id)->orderBy('module_name', 'asc')->get();
                        foreach ($submodule as $sub) { ?>
                                <li id="{{$sub->module_key}}"><a href="{{ route('index', ['module' => $sub->module_key, 'action' => 'list', 'key' => $key]) }}"><span>{{AdminController::get_module_detail($sub->id,'module_name')}}</span></a></li>
                            <?php } ?>
                        </ul>
                    </li>
            <?php
            }} ?>
    </ul>
</aside>
<!--side bar end-->