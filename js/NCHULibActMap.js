function NCHULibActMap(actData,whenCompleted){
    var hover_sensor=$('div#hover_sensor');
    var info_container=$('div#info_container');
    var map_container=$('div#map_container');
    var info_content=$('div#info_content');

    var main_bg_size={width:1994,height:884};
    var base_position={left:0,top:0};
    var zoomRatio=1;
    var viewport_size={
        width:0,
        height:0
    };
    var inited=false;

    var update_view=this.update_view=function(){
        viewport_size={
            width:info_container.width(),
            height:info_container.height()
        };

        viewport_size.ratio=viewport_size.width/viewport_size.height;
        main_bg_size.ratio=main_bg_size.width/main_bg_size.height;

        if(viewport_size.ratio > main_bg_size.ratio){
            base_position.left=(viewport_size.width - viewport_size.height*main_bg_size.ratio)/2;
            base_position.top=0;
            zoomRatio=viewport_size.height/main_bg_size.height;
        }
        else{
            base_position.top=(viewport_size.height - viewport_size.width/main_bg_size.ratio)/2;
            base_position.left=0;
            zoomRatio=viewport_size.width/main_bg_size.width;
        }

        // console.log("zoomRatio="+zoomRatio);
        // console.log("viewport_size:");
        // console.log(viewport_size);
        // console.log("main_bg_size:");
        // console.log(main_bg_size);

        function update_button_location(act,key){
            //console.log(act);
            return $('a.act_block#button-'+(key+1))
                .css('top',base_position.top+act.top*zoomRatio)
                .css('height',act.height*zoomRatio)
                .css('left',base_position.left+act.left*zoomRatio)
                .css('width',act.width*zoomRatio);
        }

        if(!inited){
            hover_sensor.empty();
            info_content.empty();

            $('div#info_content').click(function(e){
                toDetail(0);
            });

            actData.forEach(function(act,key){
                //console.log("key:");
                //console.log(key);
                //console.log("apending!");
                //console.log(act);
                var toBeApd=$('<a class="act_block" id="button-'+(key+1)+'" target="_blank"></a>');
                toBeApd
                    .attr('target','_blank')
                    .attr('href',act.href);
                hover_sensor.append(toBeApd);

                update_button_location(act,key);

                var detail_col_offset_md;
                if(act.detail_col_offset>=2)
                    detail_col_offset_md=6;
                else
                    detail_col_offset_md=0;

                var detail=$('<div id="detail-'+key+'" class="detail_panel col-sm-12 col-xs-12 col-md-6 col-md-offset-'+detail_col_offset_md+' col-lg-3 col-lg-offset-'+act.detail_col_offset*3+'"></div>');
                detail.append($('<h3>'+act.title+'</h3>'));
                
                var detail_content=$('<div class="detail_panel_body"></div>');
                act.detail_list.forEach(function(element,key){
                    var url;
                    if(typeof element.url === "undefined")
                        url="#"
                    else 
                        url=element.url;
                    var element_wrapper=$('<a href="'+url+'" target="_blank"></a>');
                    var element_container=$('<div class="detail_panel_body_list"></div>');
                    var element_title=$('<h4>'+element.title+'</h4>');
                    if((typeof element.main ==="boolean")&&(element.main))
                        element_container.addClass('emphasis');
                    element_container.append(element_title);

                    if(typeof element.description ==="string")
                        element_container.append($('<p>'+element.description+'</p>'));

                    detail_content.append(element_wrapper.append(element_container));
                });
                detail.append(detail_content);
                info_content.append($('<div class="act_detail same_as_viewport_height"></div>').append(detail));
            });


        }
        else{
            actData.forEach(update_button_location);
        }


        hover_sensor.css('height',(viewport_size.height)+"px");
        $('.same_as_viewport_height').css('height',(viewport_size.height)+"px");
        //$('div#fixed_title img').css('left',base_position.left+"px");
        $('.same_as_map_width').css('left',base_position.left+"px").css('right',base_position.left+"px");

        inited=true;
    };

    this.update_view();

    var change_viewing_waiting=false;
    info_container.scroll(function(){
        if(change_viewing_waiting!==false)
            clearInterval(change_viewing_waiting);
        change_viewing_waiting=setInterval(function(){
            var pos=Math.floor((info_container.scrollTop()/viewport_size.height)+0.5);
            //console.log("pos="+pos);

            $('a.focus').removeClass('focus');
            if(pos>0){
                $('div#fixed_title').addClass('small');
                $('a#button-'+(pos)).addClass('focus');
                $('a.backToTop').show();
                //console.log($('a#button-'+(pos)));
            }
            else{
                $('div#fixed_title.small').removeClass('small');
                $('a.backToTop').hide();
            }

            clearInterval(change_viewing_waiting);
            change_viewing_waiting=false;
        },200);
    });

    var toDetail=this.toDetail=function(pos){
        info_container.scrollTo(viewport_size.height*(pos),1000);
    }

    $('a.act_block').click(function(event){
        var pos=parseInt($(this).attr('id').split('-')[1]);
        toDetail(pos);

        event.preventDefault();
        return false;
    });

    $('div.detail_panel_body a').click(function(e){
        var target_url=$(this).attr('href');
        if(target_url.search("http")===0)
            window.open(target_url,"_blank");
        else
            alert("此活動還沒有連結 ><");
        e.preventDefault();
        return false;
    });

    var resize_waiting=false;
    $( window ).resize(function(){
        if(resize_waiting!==false)
            clearInterval(resize_waiting);
        resize_waiting=setInterval(function(){
            update_view();
            //console.log("!?");
            clearInterval(resize_waiting);
            resize_waiting=false;
        },1000);
        //console.log("!!");
    });

    if(typeof whenCompleted === "function")
        whenCompleted();
}
