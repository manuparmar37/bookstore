function showLeftMenu(main_menu, module){

    $('nav li').removeClass('active');
    
    $('#li_'+main_menu).addClass('active');
    
    $('#ul_'+main_menu).show();
    
    $('#'+module).find('span').css('color', '#ffffff');
}

function filterSubCat(value){
    $.get('/bigadmin/get_subcat' + '/' + value, function(data){
        $('#sub_category').html(data);
    });
}


function getParentCat(value){
    $.get('/bigadmin/get_parentcat' + '/' + value, function(data){
        $('#category').val(data);
        $('#category').select2('val', ''+data+'');
    });
}

function getCity(value)
{
    $.get('/bigadmin/get_city' + '/' + value, function(data){
        $('#city').html(data);
    });   
}

function getDistrictListByState(state)
{
    $.get('/bigadmin/get_districtlist_bystate' + '/' + state, function(data){
        $('#district_id').html(data);
    });
}




function getBlockListByState(state)
{
    $('#block-content').show();
    $('#blk-msg').html('Please wait... Getting block list')
    $.get('/bigadmin/get_blocklist_bystate' + '/' + state, function(data){
        $('#block_id').html(data);
        $('#block-content').hide();
        $('#blk-msg').html('');
    });
}

function getBlockListByDistrict(district)
{
    $('#block-content').show();
    $('#blk-msg').html('Please wait... Getting block list')
    $.get('/bigadmin/get_blocklist_bydistrict' + '/' + district, function(data){
        $('#block_id').html(data);
        $('#block-content').hide();
        $('#blk-msg').html('');
    });
}

function getBlockDetailsByPincode(pincode)
{
    $.get('/bigadmin/get_detailby_pincode' + '/' + pincode, function(data){
        if(data === 'false'){
            swal('Error', 'No block found against this pincode', 'error');
        }
        $('#block_id').select2().val(data.id).trigger('change');
    });   
}

function getBlockDetailsByBlock(block)
{
    $.get('/bigadmin/get_detailby_block' + '/' + block, function(data){
        $('#pincode').val(data.pincode);
        //$('#state').select2().val(data.state_id).trigger('change');
    });
}

function getBlockListByDistrict1(district)
{
    $('#block-content1').show();
    $('#blk-msg1').html('Please wait... Getting block list')
    $.get('/bigadmin/get_blocklist_bydistrict' + '/' + district, function(data){
        $('#work_block').html(data);
        $('#block-content1').hide();
        $('#blk-msg1').html('');
    });
}


function getDistrictListByState1(state)
{
    $.get('/bigadmin/get_districtlist_bystate' + '/' + state, function(data){
        $('#work_district').html(data);
    });
}