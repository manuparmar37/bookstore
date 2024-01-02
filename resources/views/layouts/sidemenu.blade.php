<?php

use App\Http\Controllers\AdminController;
use App\Models\Module;
use App\Models\User;
use App\Lead;

$key = AdminController::getEncodedKey();

$role_id = \Auth::user()->role_id;
$user_detail =  User::find(\Auth::user()->id);
// if(!empty($user_detail->module_id)){
//     $acess = explode(",", $user_detail->module_id);
// }else{
    if (\Auth::user()->is_admin != 1) {
        $access_control = AdminController::check_acces_module($role_id, 'modules_id');
        //print_r($access_control); die;
        $acess = explode(",", $access_control);
    }
// }   
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
        {{-- @if($role_id != Lead::ROLE_BC_PRE_SANCTION_CHECKER && $role_id != Lead::ROLE_BC_POST_SANCTION_CHECKER) --}}
        <?php
            foreach ($module as $value) {
                if (\Auth::user()->is_admin != 1 && in_array($value->id, $acess)) { ?>
                <li id="li_{{$value->module_key}}"><a href="javascript:void(0);"><i class="{{ $value->icon }}"></i><span>{{AdminController::get_module_detail($value->id,'module_name')}}</span><i class="fa fa-angle-right pull-right"></i></a>
                    <ul class="nav nav-sub" id="ul_{{$value->module_key}}">
                        <?php
                        $submodule = Module::where('parent_id', '=', $value->id)->orderBy('module_name', 'asc')->get();

                        foreach ($submodule as $sub) {
                            if (in_array($sub->id, $acess)) {?>
                                <li id="{{$sub->module_key}}"><a href="{{ route('index', ['module' => $sub->module_key, 'action' => 'list', 'key' => $key]) }}"><span>{{AdminController::get_module_detail($sub->id,'module_name')}}</span></a></li>
                            <?php }
                        }
                        ?>
                    </ul>
                </li>
                <?php
                } else {
                    if (\Auth::user()->is_admin == 1) {?>
                        <li id="li_{{$value->module_key}}"><a href="javascript:void(0);"><i class="{{ $value->icon }}"></i><span>{{AdminController::get_module_detail($value->id,'module_name')}}</span><i class="fa fa-angle-right pull-right"></i></a>
                            <ul class="nav nav-sub" id="ul_{{$value->module_key}}">
                            <?php
                            $submodule = Module::where('parent_id', '=', $value->id)->orderBy('module_name', 'asc')->get();
                            foreach ($submodule as $sub) { 
                                if(($sub->module_key != 'bt_transfer' && $sub->module_key != 'bt_release_transfer' && $sub->module_key != 'bt_disburse_transfer') || (($sub->module_key == 'bt_transfer' || $sub->module_key == 'bt_release_transfer' || $sub->module_key == 'bt_disburse_transfer') && in_array($user_detail->email, $btMenuAllowedUsers))) { ?>
                                    <li id="{{$sub->module_key}}"><a href="{{ route('index', ['module' => $sub->module_key, 'action' => 'list', 'key' => $key]) }}"><span>{{AdminController::get_module_detail($sub->id,'module_name')}}</span></a></li>
                                <?php } ?>
                            <?php } ?>
                            </ul>
                        </li>
                    <?php
                    }
                }
            } ?>
        {{-- @endif --}}
    </ul>
</aside>
<!--side bar end-->