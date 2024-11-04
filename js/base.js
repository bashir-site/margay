var MN = {};

MN.Pagination = function(options){
    var pnumber = options.count;
    var page_link = 2;
    var total_elements = options.total; 
    var tpls = options.tpls;
    var item_act = tpls.act;
    var item_dis = tpls.dis;
    var hr = tpls.gap;
    var page = options.page || 1;
    page = parseInt(page);
    var return_page = '';
    // Вычисляем число страниц в системе
    var number = parseInt(total_elements / pnumber);
    if(parseFloat(total_elements / pnumber) - number != 0){
        number++;
    }
    // Проверяем есть ли ссылки слева
    if(page - page_link > 1){
        return_page += item_act.replaceAll("{number}", '1') + hr;
        // Есть
        for(i = page - page_link; i < page; i++){   
            return_page += item_act.replaceAll("{number}", i);
        }
    }else{
        // Нет
        for(i = 1; i < page; i++){
            return_page += item_act.replaceAll("{number}", i);
        }
    }
    // Проверяем есть ли ссылки справа
    if(page + page_link < number){
        // Есть
        for(i = page; i <= page + page_link; i++){
            if(page == i){
                return_page += item_dis.replaceAll("{number}", i);
            }else{
                return_page += item_act.replaceAll("{number}", i);
            }
        }
        return_page += hr + item_act.replaceAll("{number}", number);
    }else{
        // Нет
        for(i = page; i <= number; i++){
            if(number == i){
                if(page == i){
                    return_page += item_dis.replaceAll("{number}", i);
                }else{
                    return_page += item_act.replaceAll("{number}", i);
                }
            }else{
                if(page == i){
                    return_page += item_dis.replaceAll("{number}", i);
                }else{
                    return_page += item_act.replaceAll("{number}", i);
                }
            }
        }
    }
    return return_page;
}

MN.Login = {Data: {}};

MN.Login.TypeAccaunt = function(type, th){
    $('#accaunt-user').val(type);
    $('.btn-select-a').show();
    var text = $(th).text();
    $(th).hide();
    $('#btn-select-accaunt').text(text);
}

MN.Login.Registration = function(id_category){
    $('#modal-registration').remove();
    var modal = '<div class="modal fade" id="modal-registration" tabindex="-1" role="dialog" aria-hidden="true">\
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">\
                        <div class="modal-content" id="form-registration"></div>\
                    </div>\
                </div>';
    $('body').append(modal);
    $('#modal-registration').modal('show');
    $.get(UrlSite+'cabinet/login/form_registration.php', {}, function(html){
        $('#form-registration').html(html);
        $('.btn-reg-user').click(function() {
            MN.Login.Reg(this);
        });  
    }, 'html');    
}

MN.Login.Reg = function(th){
    var name = $('#name-user-registration').val();
    if(!name){
        MN.Popup('<center>Введите ваше имя</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
        return false;
    } 

    var surname = $('#surname-user-registration').val();
    if(!surname){
        MN.Popup('<center>Введите вашу фамилию</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
        return false;
    } 

    var email = $('#email-user-registration').val();
    if(!email){
        MN.Popup('<center>Введите ваш e-mail</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
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
                $('#modal-registration').modal('hide');
                Swal.fire("Вы зарегистрированы.", 'Пожалуйста, проверьте ваш почтовый ящик '+email+' для активации аккаунта.', "success");
            }else{
                var error = data.error;
                var message = '';
                switch(error){
                    case '1': message = 'Не верный формат e-mail.'; break;
                    case '2': message = 'Пользователь с таким логином уже зарегистрирован.'; break;                                      
                }                 
                MN.Popup('<div style="text-align:center">Ошибка регистрации. <br /> '+message+'</div>', {'radius':'3px', 'padding':'20px', width:'250px'});
            }
        }
    );
}

MN.Login.RegRun = function(th){
    var name = $('#name-user-reg').val();
    if(!name){
        MN.Popup('<center>Введите ваше имя</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
        return false;
    } 

    var surname = $('#surname-user-reg').val();
    if(!surname){
        MN.Popup('<center>Введите вашу фамилию</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
        return false;
    } 

    var email = $('#email-user-reg').val();
    if(!email){
        MN.Popup('<center>Введите ваш e-mail</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
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
                $('#modal-registration').modal('hide');
                Swal.fire("Вы зарегистрированы.", 'Пожалуйста, проверьте ваш почтовый ящик '+email+' для активации аккаунта.', "success");
            }else{
                var error = data.error;
                var message = '';
                switch(error){
                    case '1': message = 'Не верный формат e-mail.'; break;
                    case '2': message = 'Пользователь с таким логином уже зарегистрирован.'; break;                                      
                }                 
                MN.Popup('<div style="text-align:center">Ошибка регистрации. <br /> '+message+'</div>', {'radius':'3px', 'padding':'20px', width:'250px'});
            }
        }
    );
}

MN.Login.Error = function(error){
    var message = '';
    switch(error){
        case '1': message = 'Не указан e-mail.'; break;
        case '2': message = 'Не указан пароль.'; break;  
        case '3': message = 'E-mail или пароль неверен.'; break;
        case '4': message = 'Доступ закрыт.'; break;                                      
    }       
    MN.Popup('<div style="text-align:center">Ошибка авторизации. <br /> '+message+'</div>', {'radius':'3px', 'padding':'20px', width:'300px'});   
}

MN.Login.Reset = function(th){
    var email = $('#email-user').val();
    if(!email){
        MN.Popup('<center>Введите ваш e-mail</center>', {'radius':'3px', 'padding':'20px', 'width':'240px'});
        return false;
    }

    var r = /^[_.0-9a-z-]+@([0-9a-z][0-9a-z-]+.)+[a-z]{2,3}$/i;
    if(!r.test(email)){
        MN.Popup('<div style="text-align:center">Неверно введен e-mail</div>', {'radius':'3px', 'padding':'20px', 'width':'250px'});     
        return false;
    }    
    
    $(th).prop('disabled', true);
    $mn.request(
        'auth.reset', 
        {
            'login': email
        },
        function(data){
            $('#form-reset').html('<div class="alert alert-success mb-0 p-5" role="alert">\
                                        <h4 class="alert-heading">Проверьте вашу почту</h4>\
                                        <p class="font-size-h6 m-0">На вашу почту <b>'+email+'</b> мы отправили письмо для смены пароля.</p>\
                                    </div>');
        }
    );       
}

MN.Login.passwordUpdate = function(th, token){
    var pass_1 = $('#pass-1-user').val();
    var pass_2 = $('#pass-2-user').val();
    if(pass_1.length < 5 || pass_1.length > 20){
        MN.Popup('<center>Некорректная длина пароля</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
        return false;
    }    
    if(pass_1 != pass_2){
        MN.Popup('<center>Пароли не совпадают</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
        return false;
    }
    $(th).prop('disabled', true);
    $mn.request(
        'auth.password_update', 
        {
            'token': token,
            'password': pass_1
        },
        function(data){
            var token = data.token;
            $mn.token.set(token);            
            window.location.href = UrlSite + 'cabinet/';
        }
    );     
}

MN.Login.Auth = function(token, uri){

}

MN.Login.Form = function(){
    var id = 'madal-form-login';
    MN.BModal({'id': id, 'callback': function(){$('#email-user').focus();}});
    $.get(UrlSite+'cabinet/login/form.php', {}, function(html){
        $('#content-'+id).html(html);
    }, 'html');    
}

MN.Login.Send = function(){
    var email = $('#email-user').val();
    if(!email){
        MN.Popup('<center>Введите ваш e-mail</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
        return false;
    }
    var password = $('#password-user').val();
    if(!password){
        MN.Popup('<center>Введите ваш пароль</center>', {'radius':'3px', 'padding':'20px', width:'240px'});
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
                    case '1': message = 'Не указан e-mail.'; break;
                    case '2': message = 'Не указан пароль.'; break;  
                    case '3': message = 'E-mail или пароль неверен.'; break;
                    case '4': message = 'Доступ закрыт.'; break;                                      
                }                 
                MN.Popup('<div style="text-align:center">Ошибка авторизации. <br /> '+message+'</div>', {'radius':'3px', 'padding':'20px', width:'250px'});
            }
        }
    );
}

MN.Login.Out = function(){
    $mn.token.remove();
    window.location.href = window.location.href;       
}

MN.Login.PasswordChange = function(){
    var old_password = $('#old-password').val();
    if(!old_password){
        MN.Popup('<div style="text-align:center">Введите старый пароль.</div>', {'radius':'3px', 'padding':'20px', width:'320px'}); 
        return false;        
    }
    var new_password = $('#new-password').val();
    if(!new_password){
        MN.Popup('<div style="text-align:center">Введите новый пароль.</div>', {'radius':'3px', 'padding':'20px', width:'320px'}); 
        return false;        
    } 
    var new_password_2 = $('#new-password-2').val();     
    if(new_password != new_password_2){
        MN.Popup('<div style="text-align:center">Новые пароли не совпадают.</div>', {'radius':'3px', 'padding':'20px', width:'320px'}); 
        return false;        
    } 
    $('#old-password').val('');
    $('#new-password').val('');
    $('#new-password-2').val('');
    $.post(UrlSite+'app/action/profile/password/new_password.php', {old_password: old_password, new_password: new_password}, function(data){
        var error = data.error;
        if(error == '0'){
            swal.fire({
                "title": "Пароль обновлен.", 
                "text": "", 
                "type": "success",
                "confirmButtonClass": "btn btn-secondary"
            });
        }else{
            var message = data.message;
            MN.Popup('<div style="text-align:center">Ошибка. '+message+'</div>', {'radius':'3px', 'padding':'20px', width:'320px'});
        }        
    }, 'json');
}

MN.Subscriptions = {};

MN.Subscriptions.Save = function(){
    var sub = '';
    $('.item-subscription').each(function () {
        if($(this).prop('checked')){
            if(sub == ''){
                sub = $(this).val();
            }else{
                sub += '-'+$(this).val();
            }            
        }
    });
    if(sub == ''){
        MN.Popup('<div style="text-align:center">Выберите не менее одного пункта</div>', {'radius':'3px', 'padding':'20px', width:'250px'});
        return false;
    }
    $.post(UrlSite+'app/action/profile/subscriptions/save.php', {sub: sub}, function(html){
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        toastr.success("", "Настройки сохранены");

    }, 'html');
}

// Acronym
MN.Acronym = function(str){
    if(!str){
        str = ' ';
    }
    var words = str.split(" ");
    var acronym = '';
    words.forEach(function(item, i, words) {
        var w = item.trim();
        if(i < 2){
            if(acronym == ''){
                acronym = w.substr(0, 1);
            }else{
                acronym += ' '+w.substr(0, 1);
            }
        }
    });
    return acronym;    
}

// Модальное окно
MN.BModal = function(param) {
    var param = param ? param : {};
    var id = param.id;
    var content = param.content || ''; 
    var data_backdrop = param.data_backdrop || ''; 
    if(data_backdrop != ''){
        data_backdrop = 'data-backdrop="'+data_backdrop+'"';
    }
    var centered = param.centered; 
    if(typeof centered !== 'undefined' && centered == false){
        var dialog_centered = '';
    }else{
        var dialog_centered = 'modal-dialog-centered'; 
    }
    var width = param.width;
    if(typeof width !== 'undefined'){
        var width = 'modal-'+width;
    }else{
        var width = ''; 
    }

    var target = param.target || 'body';

    var modal = '<div class="modal fade" id="'+id+'" '+data_backdrop+' tabindex="-1" aria-modal="true" role="dialog" aria-labelledby="staticBackdrop" aria-hidden="true">\
                    <div class="modal-dialog '+dialog_centered+' '+width+'" role="document">\
                        <div class="modal-content" id="content-'+id+'">\
                            '+content+'\
                        </div>\
                    </div>\
                </div>';

    $(target).append(modal);
    $('#'+id).modal('show');

    var callback = param.callback; 
    if(typeof callback !== 'undefined'){
        $('#'+id).on('shown.bs.modal', function () {
            param.callback();
        });
    }
}

MN.Popup = function(content, param) {
    var param = param ? param : {};
    var popup = document.createElement('div');
    popup.className = 'popup-fon';
    popup.style.display = 'flex';
    popup.style.position = 'fixed';
    popup.style.zIndex = 99999;
    if (param.zIndex) popup.style.zIndex = param.zIndex;
    popup.style.top = 0;
    popup.style.right = 0;
    popup.style.bottom = 0;
    popup.style.left = 0;
    popup.style.padding = '20px';
    popup.style.overflowY = 'auto';
    popup.style.backgroundColor = 'rgba(0,0,0,.5)';
    popup.style.opacity = 0;
    var container = document.createElement('div');
    container.style.margin = 'auto';
    container.style.backgroundColor = '#fff';
    if (param.class) container.classList.add(param.class);
    if (param.background) container.style.backgroundColor = param.background;
    if (param.radius) container.style.borderRadius = param.radius;
    if (param.width) container.style.width = param.width;
    if (param.padding) container.style.padding = param.padding;
    popup.appendChild(container);
    (typeof content === 'string') ? container.innerHTML = content : container.appendChild(content);
    popup.addEventListener('click', function (e) {
    if (e.target === this) {
            $('.popup-fon').last().animate({opacity:0}, 200, function(){
                this.remove();
            });
            if (param.callback) param.callback();
        }
    });
    if(param.target){
        $('#'+param.target).append(popup);
    }else{
        document.body.appendChild(popup);
    }
    $('.popup-fon').animate({opacity:1}, 600);
    return popup;
}

MN.ClosePopup = function(){
    $('.popup-fon').last().remove();
}

// Уведомления
MN.Notice = {};

MN.Notice.DataObj = function(id_obj, type){
    var value = ''; 
    return value;
}

MN.Notice.Init = function(){

}

MN.Notice.StatusService = function(){
  
}

// Уведомления

// Куки
MN.Cookie = {};

MN.Cookie.FixDate = function(date){
    var base = new Date(0), skew = base.getTime();
    if(skew > 0) date.setTime (date.getTime() - skew);
}

MN.Cookie.Set = function(name, value, expires, path, domain, secure){
    document.cookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires.toUTCString() : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
}

MN.Cookie.Val = function(offset){
    var endstr = document.cookie.indexOf(";", offset);
    if(endstr == -1) endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

MN.Cookie.Get = function(name){
    var arg = name + "=", alen = arg.length, clen = document.cookie.length, i = 0;
    while (i < clen) {
    var j = i + alen;
    if(document.cookie.substring(i, j) == arg) 
    return MN.Cookie.Val(j);
    i = document.cookie.indexOf(" ", i) + 1;
    if(i == 0) break;
    }
    return null;
}

MN.Cookie.Delete = function(name, path, domain){
    if(MN.Cookie.Get(name)){
        document.cookie = name + "=" + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}

MN.Cookie.Del = function(name){document.cookie = name + "=" + ";       path=/; expires=Mon, 02-Jan-2005 00:00:00 GMT";}

MN.Cookie.FullDelete = function(value){
    allcoockies = document.cookie.substring(0, document.cookie.length)+';';
    while(allcoockies){
        var spos = MN.Strpos(allcoockies, ';', 0), val = allcoockies.substr(0, spos);
        allcoockies = allcoockies.substr(spos+2, allcoockies.length);
        coockie_param = val.substr(0, MN.Strpos(val, '=',0));
        if(coockie_param == value){MN.Cookie.Del(coockie_param);}
    }
}

MN.Cookie.FullGet = function(value){
    allcoockies = document.cookie.substring(0, document.cookie.length)+';';
    while(allcoockies){
        var spos = MN.Strpos(allcoockies, ';',0), val = allcoockies.substr(0, spos);   
        allcoockies = allcoockies.substr(spos+2, allcoockies.length);
        coockie_param = val.substr(0, MN.Strpos(val, '=',0));    
        if(coockie_param == value){return val.substr((MN.Strpos(val, '=',0)+1));}
    }
}
// Куки

// общие функции
MN.Strpos = function(haystack, needle, offset){
    var i = haystack.indexOf( needle, offset ); 
    return i >= 0 ? i : false;
}

MN.declOfNum = function(titles){
    var number;
    number = Math.abs(number);
    var cases = [2, 0, 1, 1, 1, 2];
    return function(number){
        return  titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }
}

MN.getUrlVars = function(url){
    var vars = {}, hash;  
    var hashes = decodeURIComponent(url).slice(url.indexOf('?') + 1).split('&');  
    for(var i = 0; i < hashes.length; i++){hash = hashes[i].split('='); vars[hash[0]] = hash[1];}  
    return vars;  
}

MN.Title = function(title){
    if(!title){
        var _get = MN.getUrlVars(window.location.href), route = _get['route'];
        if(route){
            if(route == 'desktop' || route.indexOf('desktop:') == 0){
                title = 'Рабочий стол';
            }
            if(route == 'team' || route.indexOf('team:') == 0){
                title = 'Команда проекта';
            }
            if(route == 'content' || route.indexOf('content:') == 0){
                title = 'Контент';
            }
            if(route == 'site' || route.indexOf('site:') == 0){
                title = 'Сайт';
            }
            if(route == 'admins' || route.indexOf('admins:') == 0){
                title = 'Администраторы';
            }
            if(route == 'services' || route.indexOf('services:') == 0){
                title = 'Услуги';
            }
            if(route == 'settings' || route.indexOf('settings:') == 0){
                title = 'Настройки';
            }
        }                                                
    }
    if(!title){
        title = 'MatroNet';
    }else{
        title = title+' | MatroNet';
    }
    $('title:first').text(title);
}
// общие функции
