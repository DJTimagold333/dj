const mainframe = {
    notify: function(text, title, type){

        var self = this;

        type = (type===true);

        title = (title===undefined) ? '' : title;

        var block = $('.a-alert');

        if(!block.length){
            $('body').append('<div class="a-alert"></div>');

            block = $('.a-alert');
        }

        var id = Math.random();

        block.append('<div data-id="'+id+'" class="alert alert-id '+(type?'alert-success':'alert-danger')+' alert-dismissible" role="alert">'
            +'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><i class="fa fa-times"></i></button>'
            +(title?'<strong>'+title+'</strong> ':'')
            +text
            +'</div>');

        block.find('.alert-id[data-id="'+id+'"]').fadeIn('fast');

        setTimeout(function(){
            self.notify_close(id);
        }, 3000);

        return type;
    },

    notify_close: function(id){

        if(id!==undefined){
            var alert = $('.a-alert > .alert-id[data-id="'+id+'"]');

            if(alert.hasClass('confirm')){
                return;
            }

            var closer = alert.find('.close-trigger');

            if(closer.attr('data-disabled')==='true'){
                return false;
            }

            if(!alert.length){
                return false;
            }

            alert.fadeOut('fast', function(){
                $(this).remove();
            });

            return false;
        }

        var alerts = $('.a-alert > .alert-id:not(.confirm)');

        if(!alerts.length){
            return false;
        }

        alerts.fadeOut('fast', function(){
            $(this).remove();
        });

        return false;
    },

    getPrice: function() {
        const login = $('#login').val();
        const goodName = $('#good').val();
        const amount = $('#amount').val();
        const price = $('#price').val();

        $("#submitBtn").attr('disabled', 1);
        $("#submitBtn").html('Р—Р°РіСЂСѓР·РєР°...');

        setTimeout(function() {
            $.ajax({
                url: 'library/checkPrice.php?username=' + login + '&good=' + goodName + "&amount=" + amount,
                type: 'GET',
                async: true,
                cache: false,
                success: function(data) {
                    const res = JSON.parse(data);
                    if (res.status == 'failed') {
                        $("#submitBtn").html('РћС€РёР±РєР°!');
                        mainframe.notify(res.message, "РћС€РёР±РєР°!", false);
                    } else {
                        $("#submitBtn").removeAttr('disabled');
                        if ($('.modal[data-id=paymodal]').attr('data-withSurcharge') == "1") {
                            $("#submitBtn").html(price == res.message ? "РљСѓРїРёС‚СЊ Р·Р° " + res.message + " <i class=\"fa fa-ruble col-black\"></i>" : "Р”РѕРїР»Р°С‚РёС‚СЊ " + res.message + " <i class=\"fa fa-ruble col-black\"></i>");
                        } else {
                            $("#submitBtn").html("РљСѓРїРёС‚СЊ Р·Р° " + res.message + " <i class=\"fa fa-ruble col-black\"></i>");
                        }

                    }
                }
            })
        }, 1e3);
    }
};

	    $("#cancelform").submit(function (e) {
            let nickname = $("#numb").val();
            e.preventDefault();

            $.ajax({
			    type: "POST",
			    url: "/nick.php",
			    data: $(this).serialize()
		    }).done(function() {

                    Swal.fire(
                        'Р—Р°РїСЂРѕСЃ РѕС‚РїСЂР°РІР»РµРЅ!',
                        'Р’ С‚РµС‡РµРЅРёРµ 24 С‡Р°СЃРѕРІ РїРѕРґРїРёСЃРєР° Р±СѓРґРµС‚ РѕС‚РјРµРЅРµРЅР°',
                        'success'
                    )


		    });	
		});

$(function(){
    setTimeout(function(){
        mainframe.notify_close();
    }, 3500);

    $('body').fadeIn().on('click', '.select-style-render > .select-style-selected', function(e){
        e.preventDefault();

        var that = $(this);

        that.closest('.select-style-render').toggleClass('open');
    }).on('click', '.a-alert > .alert-id:not(.confirm) .close-trigger', function(e){
        e.preventDefault();

        mainframe.notify_close($(this).closest('.alert-id').attr('data-id'));

    }).on('click', '.tabs .tab-links > li > a', function(e){
        e.preventDefault();

        var that = $(this);

        var tabs = that.closest('.tabs');

        var li = that.closest('li');

        if(li.hasClass('active')){ return; }

        tabs.find('.tab-list > .tab-id').removeClass('active');
        that.closest('.tab-links').children('li').removeClass('active');

        tabs.find('.tab-list > .tab-id[data-id="'+li.attr('data-id')+'"]').addClass('active');
        li.addClass('active');
    }).on('click', '.tabs-alt > .nav-tabs > li > a', function(e){
        e.preventDefault();

        var that = $(this);

        var tabs = that.closest('.tabs-alt');

        var li = that.closest('li');

        if(li.hasClass('active')){ return; }

        tabs.find('.tab-content > .tab-pane.active').removeClass('active');
        that.closest('.nav-tabs').children('li').removeClass('active');

        $(that.attr('href')).addClass('active');
        li.addClass('active');
    }).on('click', '.copy-clipboard', function(e){
        e.preventDefault();

        var that = $(this);

        that.text('РЎРєРѕРїРёСЂРѕРІР°РЅРѕ!');

        setTimeout(function(){
            that.text(that.attr('data-clipboard-text'));
        }, 1000);
    }).on('click', '.navbar .navbar-mobile', function(e){
        e.preventDefault();

        $(this).closest('.navbar').toggleClass('active');
    }).on('click', '#restores-accept', function(e){
        e.preventDefault();
    });

    new ClipboardJS('.copy-clipboard');
});

$(function(){
    $('body').on('click', '[data-modal]', function(e){
        var that = $(this);
        var id = that.attr('data-modal');

        var modal = $('.modal[data-id="'+id+'"]');

        if(modal.length){

            if(id == 'paymodal'){
                modal.find('.modal-header').html('РџРѕРєСѓРїРєР° С‚РѕРІР°СЂР° "'+that.children('.title').html()+'"');
                modal.find('[type="submit"]').html('РљСѓРїРёС‚СЊ Р·Р° '+that.children('.price').html());
                modal.find('[name="good"]').val(that.attr('data-name'));
                modal.find('[name="price"]').val(that.attr('data-price'));
                modal.attr('data-withSurcharge', that.attr('data-withSurcharge'));
                if(that.attr('data-amounted') == "1"){
                    $('#amounted').show();
                }else{
                    $('#amounted').hide();
                }
            }

            modal.fadeIn('fast', function(){
                $(this).addClass('active');
            });
        }
    }).on('input', '#login', mainframe.getPrice).on('input', '#amount', mainframe.getPrice).on('click', '.modal [data-modal-close]', function(e){
        e.preventDefault();

        $('.modal').fadeOut('fast', function(){
            $(this).removeClass('active');
            $(this).removeAttr('data-withSurcharge');
            $("#login").val("");
            $("#amount").val(1);
        });
    }).on('click', '.modal', function(e){
        var target = $(e.target);
        if(!target.closest('.modal-content').length){
            $('.modal').fadeOut('fast', function(){
                $(this).removeClass('active');
                $(this).removeAttr('data-withSurcharge');
                $("#login").val("");
                $("#amount").val(1);
            });
        }
    });
});