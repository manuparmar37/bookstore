 <footer>
       <div class="container">
           <div class="row">
                <div class="col-md-3">
                    <h4>Courses</h4>
                    <ul>
                        <?php 
                        $allCms     =   \App\Cms::where('tenant_id',$globaltenent)->get();
                        $testcourse  = \App\Course::where('type','=','0')->where('is_featured','1')->where('parent_id','!=','0')->where('tenant_id','=',$globaltenent)->get(); 
                        $settings=\App\Setting::where('tenant_id',$globaltenent)->first();?>
                        @foreach($testcourse as $course)
                        <li><a href="/">{{ucfirst(strtolower($course->name))}}</a></li>
                        @endforeach
                        <!-- <li><a href="#">IIT JEE</a></li>
                        <li><a href="">NEET</a></li>
                        <li><a href="">LLB</a></li>
                        <li><a href="">CTET and State TET</a></li>
                        <li><a href="">BMS|BBA</a></li>
                        <li><a href="">Hotel Management</a></li>
                        <li><a href="">UG (Media|BCA|B EL ED)</a></li>
                        <li><a href="">SSC</a></li>
                        <li><a href="">Bank PO</a></li> -->
                    </ul> 
                </div>
                <div class="col-md-3">
                        <h4>Popular Subscriptions</h4>
                        <ul>
                            <?php
                            $testpackage    = \App\Package::where('tenant_id','=',$globaltenent)->get();
                            
                            //$testpackage    = Package::where('tenant_id','=',$request['sitetennat'])->get();
                            //if($package->package_validity == 1):
                            
                            ?>
                            
                            @foreach($testpackage as $key => $package)
                                <li><a href="{{url('package-list')}}">{{ucfirst(strtolower($package->name))}}</a></li>
                            @endforeach;
                            
                            <?php /*
                            <li><a href="{{url('package-list')}}">Test Series</a></li>
                            <li><a href="{{url('package-list')}}">Test + Video</a></li>
                            <li><a href="{{url('package-list')}}">Test + Study Material</a></li>
                            <li><a href="{{url('package-list')}}">Video</a></li>
                             */ ?>
                        </ul> 
                         
                    </div>
                    <div class="col-md-3">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="{{url('/')}}">Home</a></li>
                                 @foreach($allCms as $cms)
                        <li><a href="/cms/{{$cms->page_key}}">{{ucfirst(strtolower($cms->page_name))}}</a></li>
                        @endforeach
                        <li><a href="{{ url('contact-us') }}">Contact Us</a></li>
                                 <!-- <li><a href="{{url('cms/about-us')}}">About Us</a></li>
                                <li><a href="{{url('contact-us')}}">Contact Us</a></li>
                                <li><a href="{{url('e-store')}}">Shop</a></li> 
                                <li><a href="{{url('cms/privacy-policy')}}">Privacy Policy</a></li> 
                                <li><a hre f="{{url('cms/terms-and-conditions')}}">Terms of Services</a></li> 
                               <li><a href="{{url('contact-us')}}">Contact Us</a></li> -->
                            </ul> 
                        </div>
                        <div class="col-md-3">
                                <h4>keep updated</h4>
                                 <form action="" method="POST" enctype="multipart/form-data" name="subscriptiom-form" class="from">
                                    <div class="row">
                                        <div class="col-md-12 form-group">
                                            <input type="text" name="newsletter_email" id="newsletter_email" placeholder="Type Your Email Id" class="form-control">
                                        </div>
                                        <div class="col-md-12 form-group">
                                            <button class="download-button newbutt" type="button" onclick="submitEmail()">subscribe now</button>
                                            <span id="error-msg"></span>
                                               
                                        </div>
                                    </div>
                                </form>
                                <ul class="social-icons"> 
                                    <li><a target="_blank" href="{{$settings->facebook_link}}"><i class="fab fa-facebook-f"></i></a></li>
                                    <li><a target="_blank" href="{{$settings->google_link}}"><i class="fab fa-youtube-square"></i></a></li>
                                    <li><a target="_blank" href="{{$settings->instagram_link}}"><i class="fab fa-instagram"></i></a></li>
                                    <!-- <li><a href="{{$settings->linked_link}}"><i class="fab fa-linkedin-in"></i></a></li> -->
                                </ul>
                            </div>
           </div>
       </div>
       <div class="copyright">
           <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <!-- <img src="{{url('assets/images/easevidhya-logo-f.png')}}" alt=""/> --> &nbsp; {{date('Y')}} © {{$settings->site_title}}.
                </div>
            </div>
           </div>
       </div>
   </footer>
   <script type="text/javascript">

    function validateEmail(sEmail){
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (filter.test(sEmail)) {
            return true;
        }
        else {
            return false;
        }
    }
        function submitEmail(){
        var email_id    =   $('input[name=newsletter_email]').val();
        
        if(email_id.length === 0){
            $('#error-msg').html('Email is required field !').css('color', 'red');
            $('#error-msg').fadeIn('slow');
            return false;
        }
        
        if (validateEmail(email_id)) {
            //alert('Email is valid');
        }
        else {
            alert('Invalid Email Address');
            return false;
        }


        $('#error-msg').html('Please wait...');
        $('.newbutt').attr('disabled', true);
        
        $.ajax({
            type: "POST",
            url: '{{ route("save_newsletter") }}',
            data: {
                'email_id': email_id,
                '_token': '{{ Session::token() }}'
            },
            success: function(data){
                if(data.failure){
                    $('#error-msg').html('You have been already subscribed !').css('color', 'red');
                    $('.newbutt').removeAttr('disabled');
                }else{
                    $('#error-msg').html('Successfull !').css('color', 'green');
                    $('input[name=newsletter_email]').val('');
                    $('.newbutt').removeAttr('disabled');
                    
                    setTimeout(function(){
                        $('#error-msg').hide();
                    }, 3000);
                }
            }
        });
    }
   </script>
   <script type="text/javascript">

         jQuery(document).ready(function(){
            jQuery('#submit').click(function(e){
              jQuery('.alert-danger').empty();
               e.preventDefault();
               jQuery.ajaxSetup({
                  headers: {
                      'X-CSRF-TOKEN': $('input[name="_token"]').val()
                  }
              });
               jQuery.ajax({
                  url: "{{ url('/post_enq') }}",
                  method: 'post',
                  data: {
                     username   : jQuery('#ajexname').val(),
                     usermail   : jQuery('#ajexemail').val(),
                     userphone  : jQuery('#ajexphone').val(),
                     usermessage: jQuery('#ajexmessage').val()
                  },
                  success: function(data){
                    if(data.success)
                    {jQuery('.alert-danger').hide();
                    jQuery('.alert-success').show();
                    jQuery('.alert-success').html(data.success);
                    }else
                    {
                      jQuery.each(data.errors, function(key, value){
                        jQuery('.alert-danger').html();
                            jQuery('.alert-danger').show();
                            jQuery('.alert-danger').append('<p>'+value+'</p>');
                        });  
                    }
                        
                    }
                    
                  });
               });
            });


</script>


