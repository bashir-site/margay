var FP = {};

FP.Login = {

};

FP.Login.Form = function(){
    $('#modalLogin').modal('show');
    $('#modalLogin').on('shown.bs.modal', function() {
        $('#name-user').focus();
    });
}

FP.Login.SignIn = function(){
    var email = $('#email-login').val();

    if(!email){    
        $('#email-login').focus();
        return false;
    }    

    var r = /^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+.)+[a-z]{2,3}$/i;
    if(!r.test(email)){
        MN.Popup('<div style="text-align:center">Неверно введен e-mail</div>', {'radius':'3px', 'padding':'20px', 'width':'250px'});     
        return false;
    }

    var password = $('#password').val();
    if(!password){
        return false;
    }

    $mn.request(
        'auth.login', 
        {
            'email': email, 
            'password': password
        },
        function(data){
            if(data.status == 'ok'){
                var token = data.token;
                $mn.token.set(token);
                window.location.href = UrlSite+'cabinet/';
            }else{
                var error = data.error;
                var message = '';
                switch(error){
                    case 1: message = 'Не указан e-mail.'; break;
                    case 2: message = 'Не указан пароль.'; break;  
                    case 3: message = 'E-mail или пароль неверен.'; break;
                    case 4: message = 'Доступ закрыт.'; break;                                      
                }                 
                MN.Popup('<div style="text-align:center"><b>Ошибка авторизации.</b> <br /> '+message+'</div>', {'radius':'3px', 'padding':'20px', 'width':'250px'});
            }
        }
    );    
}

FP.Login.Registration = function(th){
    var name = $('#name-user').val();
    if(!name){
        return false;
    } 

    var surname = $('#surname-user').val();
    if(!surname){
        return false;
    } 

    var email = $('#email-user').val();
    if(!email){    
        return false;
    }    

    var r = /^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+.)+[a-z]{2,3}$/i;
    if(!r.test(email)){
        MN.Popup('<div style="text-align:center">Неверно введен e-mail</div>', {'radius':'3px', 'padding':'20px', 'width':'250px'});     
        return false;
    }

    $(th).prop('disabled', true);

    $mn.request(
        'auth.registration', 
        {
            'name': name, 
            'surname': surname, 
            'email': email
        },
        function(data){
            $(th).prop('disabled', false);
            if(data.status == 'ok'){
                $('#modalLogin').modal('hide');
                Swal.fire("Вы зарегистрированы.", 'Пожалуйста, проверьте ваш почтовый ящик '+email+' для активации аккаунта.', "success");
            }else{
                var error = data.error;
                var message = '';
                switch(error){
                    case '1': message = 'Не верный формат e-mail.'; break;
                    case '2': message = 'Пользователь с таким логином уже зарегистрирован.'; break;                                      
                }                 
                MN.Popup('<div style="text-align:center"><b>Ошибка регистрации.</b> <br /> '+message+'</div>', {'radius':'3px', 'padding':'20px', 'width':'350px'});
            }
        }
    );
}

FP.Login.FormRecovery = function(){

}


FP.Login.Out = function(){
    $mn.token.remove();
    window.location.href = window.location.href;       
}

FP.Catalog = {
    'page': 1,
    'count': 10,
    'category': '',
    'data': [],
    'sale': {
        'id': null,
        'hash': null,
        'category': null        
    },
    'authorized': false
};

FP.Catalog.Init = function(){
    $('#nav-catalog a').on('click', function() {
        $('#nav-catalog a').removeClass('active');
        $(this).addClass('active');
    });

    $('.pagination li').on('click', function() {
        $('.pagination li').removeClass('active');
        $(this).addClass('active');
    });
}

FP.Catalog.Router = function(path){
    var _get = MN.getUrlVars(path);
    var page = _get['page'] || 1;
    FP.Catalog.page = page;

    var arr = path.split('/');

    var category = '';
    arr.forEach(function(item) {
        if(item && item != '' && item != 'catalog' && !item.includes('?')){
            category = item;
        }
    });

    console.log(category);

    FP.Catalog.category = category;

    FP.Catalog.Load(() => {
        FP.Catalog.Render();
    }); 

}

FP.Catalog.Load = function(funct){
    $.get(UrlSite+'catalog/data.php', {
        'page': FP.Catalog.page,
        'category': FP.Catalog.category
    }, function(data){

        console.log(data);

        FP.Catalog.data = data;
        if(typeof funct == 'function'){
            funct.call(this);
        }
    }, 'json');
}

FP.Catalog.Render = function(){

    $('html, body').stop().animate({
        'scrollTop': $('#catalog').offset().top + 1
    }, 800, 'swing');

    var data = FP.Catalog.data.sites;
    var total = FP.Catalog.data.total;
    var sites = '';

    data.sort(function(a, b) {
        return a.weight - b.weight;
    });

    data.forEach(function(item, i, arr) {
        var id = item.id;
        var hash = item.hash;
        var name = item.name || '';
        var info = item.info || '';
        var screen = item.screen;     
        var category = item.category;
        var url_site = UrlSite+'demo/'+item.uri;
        var url_info = UrlSite+category+'/'+item.uri+'/';

        sites += '<article class="card border-0 shadow-sm overflow-hidden mb-4">\
                <div class="row g-0">\
                  <div class="col-sm-5 position-relative bg-repeat-0 bg-size-cover site-item__img" style="background-image: url('+screen+'); min-height: 15rem;">\
                    <a href="'+url_info+'" class="position-absolute top-0 start-0 w-100 h-100" aria-label="О сайте"></a>\
                  </div>\
                  <div class="col-sm-7">\
                    <div class="card-body">\
                      <h3 class="h4">\
                        <a href="'+url_info+'">'+name+'</a>\
                      </h3>\
                      <p>'+info+'</p>\
                      <hr class="my-4">\
                      <div class="d-flex flex-lg-row flex-column align-items-center justify-content-center justify-content-lg-between btns-site">\
                        <button class="btn btn-success text-uppercase mb-3 mb-lg-0 me-0 me-lg-1" type="button" onclick="FP.Catalog.Form(\''+id+'\', \''+hash+'\', \''+category+'\');">Получить сайт бесплатно</button>\
                        <a href="'+url_site+'" target="_blank" class="btn btn-link">Демонстрация сайта <i class="bx bx-right-arrow-alt fs-xl ms-1"></i></a>\
                      </div>\
                    </div>\
                  </div>\
                </div>\
              </article>';
    });

    $('#sites-catalog').html(sites);

    var url = '';
    var category = FP.Catalog.category;
    if(category != ''){
        url = UrlSite+'catalog/'+category+'/?page={number}';
    }else{
        url = UrlSite+'catalog/?page={number}';
    }

    var page = FP.Catalog.page;
    var count = FP.Catalog.count;
    var pagination = '';
    if(total > 0){
        pagination = MN.Pagination({
            'page': page,
            'count': count,
            'total': total,
            'tpls': {
                'act': '<li class="page-item"><a href="'+url+'" class="page-link">{number}</a></li>',
                'dis': '<li class="page-item active" aria-current="page"><span class="page-link">{number}<span class="visually-hidden">(current)</span></span></li>',
                'gap': '<li class="page-item"><a class="page-link"><i class="bx bx-dots-horizontal-rounded mx-n1"></i></a></li>'
            }
        });
    }

    $('ul.pagination').html(pagination);
}

FP.Catalog.Form = function(id, hash, category){
    FP.Catalog.sale.id = id;
    FP.Catalog.sale.hash = hash;
    FP.Catalog.sale.category = category;
    $('#modalCreateSite').modal('show');
    $('#modalCreateSite').on('shown.bs.modal', function() {
        $('#email').focus();
    });    

    $.get(UrlSite+'cabinet/sites/catalog/get_email.php', {
    }, function(data){
        var email = data.email;
        if(email && email.length > 2){
            FP.Catalog.authorized = true;
            $('#email').val(email).prop('disabled', true);
            $('#form-mode-1').hide();
            $('#form-mode-2').show();
        }else{
            FP.Catalog.authorized = false;
            $('#form-mode-2').hide();
            $('#form-mode-1').show();            
        }
    }, 'json');    

}

FP.Catalog.Create = function(){
    var authorized = FP.Catalog.authorized;

    if(authorized){
        var place = 'panel';
        var name = $('#name-new-site').val();
        if(!name){
            MN.Popup('<div style="text-align:center">Введите название сайта</div>', {'radius':'3px', 'padding':'20px', 'width':'250px'});
            return false;
        }

        var phone = $('#phone-new-site').val();
        if(!phone){
            MN.Popup('<div style="text-align:center">Введите телефон администратора сайта</div>', {'radius':'3px', 'padding':'20px', 'width':'250px'});
            return false;
        }

        var email = null;
    }else{
        var place = 'site';
        var email = $('#email').val();

        if(!email){    
            $('#email').focus();
            return false;
        }    

        var r = /^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+.)+[a-z]{2,3}$/i;
        if(!r.test(email)){
            MN.Popup('<div style="text-align:center">Неверно введен e-mail</div>', {'radius':'3px', 'padding':'20px', 'width':'250px'});     
            return false;
        }  

        var name = null;
        var phone = null; 
    }

    var id = FP.Catalog.sale.id;
    var hash = FP.Catalog.sale.hash;
    var category = FP.Catalog.sale.category;

    $('#email').val('');
    $('#modalCreateSite').modal('hide');

    $.post(UrlSite+'cabinet/sites/catalog/create.php', {
        'name': name,
        'phone': phone,        
        'email': email,
        'type': 'catalog',
        'id': id,
        'hash': hash,
        'place': place
    }, function(data){

        var id_site = data.id;
        var hash_site = data.hash;

        if(!FP.Catalog.authorized){
            Swal.fire({
                title: "Ваш сайт создан!",
                html: 'На Вашу электронную почту <b>'+email+'</b> мы отправили письмо для активации сайта.',
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Закрыть",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            });
        }else{
            Swal.fire({
                title: "Ваш сайт создан!",
                text: "Теперь вы можете наполнить его информацией",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Закрыть",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            });            
            var id_site = data.id;
            var hash_site = data.hash;
            document.location.href = UrlSite+'cabinet/?route=sites:site:editor&id_site='+id_site+'&hash_site='+hash_site;
        }

        ym(40872654,'reachGoal','create_site_'+category);

        //yaCounter40872654.reachGoal('create_site_'+category);

    }, 'json'); 

}

FP.Catalog.Activation = function(th){
    var org = $('#org').val();
    var name = $('#name').val();
    var phone = $('#phone').val();
    var key = $('#key').val();

    if(!org){
        return false;
    } 

    if(!name){
        return false;
    }

    if(phone){
        var phone_r = phone.replace(/\s+/g,'');
        var phone_l = phone_r.length;
    }else{
        var phone_l = 0;
    } 

    if(!phone){
        return false;
    }

    if(phone_l < 9){
        MN.Popup('<center><b>Введите Ваш мобильный телефон</b></center>', {'radius':'3px', 'padding':'20px', 'width':'300px'});
        return false;
    }

    $(th).prop('disabled', true);
    $('#message-act').removeClass('d-none');

    $.post(UrlSite+'cabinet/sites/catalog/activation.php', {
        'phone': phone, 
        'key': key, 
        'name': name, 
        'org': org
    }, function(data){
        if(data.status == 'ok'){
            var id_site = data.id_site;
            var hash_site = data.hash_site;
            var token = data.token;
            $mn.token.set(token);
            window.location.href = UrlSite+'cabinet/cabinet/?route=sites:site:editor&id_site='+id_site+'&hash_site='+hash_site;
        }else{
            var error = data.error;
            var message = '';
            switch(error){
                case 1: message = 'Сайт был активирован ранее.'; break;                                   
            }                 
            MN.Popup('<div style="text-align:center"><b>Ошибка активации.</b> <br /> '+message+'</div>', {'radius':'3px', 'padding':'20px', 'width':'250px'});
        }
    }, 'json');    
}

FP.Mail = {};

FP.Mail.Send = function(th, id){
    var name = $('#name-f-'+id).val();
    var phone = $('#phone-f-'+id).val();
    var email = $('#email-f-'+id).val();
    var message = $('#message-f-'+id).val();

    if(!name){    
        return false;
    }  

    if(!phone){   
        return false;
    }

    if(!message){       
        return false;
    } 

    $(th).text('Отправка...').prop('disabled', true);

    $.post(UrlSite+'front/action/message.php', {
        'name': name, 
        'phone': phone, 
        'email': email,
        'message': message
    }, function(data){
        $('#message-sent-'+id).removeClass('d-none');
        $(th).text('Отправлено').prop('disabled', true);
    }, 'json');
}

FP.ImageUpload = function(){
    $('.img_upload').each(function( index ) {
        var src = $(this).data('src');
        if(src){
            $(this).css({'background-image': 'url('+src+')'});
        }
    });
}

$( document ).ready(function() {
    //
    var type_page = $('body').data('type');
    if(type_page == 'catalog'){
        FP.Catalog.Init();
        page('/catalog/*', function(context){
            var path = context.path;
            FP.Catalog.Router(path);
        });        
    }
    //
    FP.ImageUpload();
});
