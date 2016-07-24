module.exports = '.book{position:relative;background-color:transparent;}.book p.book--loading_message{padding:3em 1em;margin:0;height:1em;font-style:italic;text-align:center;opacity:1;transition-property:opacity,height,padding}.book.ready p.book--loading_message{opacity:0;height:0;padding:0}.book:fullscreen{width:100%;height:100%}.book--background{background-color:#ebebeb;position:relative;}:fullscreen .book--background{background-color:transparent;width:100%}.book--wrapper{position:relative;margin:0 auto;height:0;opacity:0;border:1px solid #eee;transition:opacity .3s ease-in-out .2s,height .2s ease-in-out,width $page_turn_duration ease-in-out;background-color:transparent;}.fast .book--wrapper{transition:opacity .3s ease-in-out .2s,height .2s ease-in-out,width $fast_page_turn_duration ease-in-out}.ready .book--wrapper{opacity:1}:fullscreen .book--wrapper{border:0}.navigator_button{display:inline-block;padding:0;border:2px solid #ccc;border-radius:2px;background-color:$teal_light;overflow:hidden;outline:none;transition-property:border-color,transform;}.navigator_button img{display:block;float:left;opacity:.85;max-width:em(80);height:auto;transition-property:opacity}.navigator_button span{display:block;width:0;height:0;color:transparent;text-indent:-999em}.navigator_button:focus,.navigator_button:hover{border-color:#000;transform:scale(1.1);transform-origin:center}.navigator_button.selected{border-color:$teal_light;}.navigator_button.selected img{opacity:1}.navigator_list{position:relative;z-index:102;margin:0 auto;padding:0;width:100%;max-height:0;text-align:left;white-space:nowrap;opacity:.2;overflow:hidden;transition-property:max-height,padding,opacity;transition-duration:.5s;}.show_navigator .navigator_list{padding:1em 0;max-height:em(120);opacity:1}.navigator_list ul{list-style:none;display:block;width:auto;margin:0;padding:0;position:relative;left:4em;transition-property:left}.navigator_list--item{display:inline;padding:0 .4em;overflow:visible}.navigator_list--prev,.navigator_list--next{display:block;background-color:rgba(0,0,0,0.5);border:none;color:transparent;text-indent:-999em;position:absolute;top:0;bottom:0;width:3em;outline:none;z-index:102;}.navigator_list--prev::before,.navigator_list--next::before{content:"";display:block;width:em(72);height:em(72);position:absolute;top:50%;left:50%;margin-top:em(-36);margin-left:em(-36);background-image:url("/images/booklet/booklet_nav_chevrons@1x.png");background-size:em(144) auto;background-repeat:no-repeat}.navigator_list--prev{left:0;}.navigator_list--prev::before{background-position:left bottom}.navigator_list--next{right:0;}.navigator_list--next::before{background-position:right bottom}.book--nav_buttons{bottom:100%;opacity:0;overflow:hidden;transition-property:bottom,opacity;}.ready .book--nav_buttons{bottom:0;opacity:1}.book--nav_buttons--prev,.book--nav_buttons--next{position:absolute;top:0;bottom:0;z-index:100;display:block;width:50%;background-color:transparent;color:transparent;text-indent:-999em;border:none;outline:none;transition-property:bottom;transition-duration:.5s;}.show_navigator .book--nav_buttons--prev,.show_navigator .book--nav_buttons--next{bottom:em(120)}.book--nav_buttons--prev::before,.book--nav_buttons--next::before{content:"";display:block;width:em(72);height:em(72);position:absolute;top:50%;margin-top:em(-36);background-image:url("/images/booklet/booklet_nav_chevrons@1x.png");background-size:em(144) auto;background-repeat:no-repeat}.book--nav_buttons--prev{left:0;right:50%;}.book--nav_buttons--prev::before{left:em(12);background-position:left top}.book--nav_buttons--next{left:50%;right:0;}.book--nav_buttons--next::before{right:em(12);background-position:right top}.book_page_displayed,.book_page_opening--from_left,.book_page_opening--from_right,.book_page_behind,.book_page_hidden--left,.book_page_hidden--right,.book_page_hidden_immediately--left,.book_page_hidden_immediately--right{display:block;position:absolute;top:0;bottom:0;width:auto;overflow:hidden;box-shadow:0 0 20px rgba(0,0,0,0);background-size:auto 100%;background-repeat:no-repeat;transition-duration:$page_turn_duration,$page_turn_duration,$page_turn_duration,$page_turn_duration,.2s;transition-property:left,right,width,max-width,box-shadow;}.book_layout--single .book_page_displayed,.book_layout--single .book_page_opening--from_left,.book_layout--single .book_page_opening--from_right,.book_layout--single .book_page_behind,.book_layout--single .book_page_hidden--left,.book_layout--single .book_page_hidden--right,.book_layout--single .book_page_hidden_immediately--left,.book_layout--single .book_page_hidden_immediately--right{max-width:100%;max-height:100%}.book_layout--spread .book_page_displayed,.book_layout--spread .book_page_opening--from_left,.book_layout--spread .book_page_opening--from_right,.book_layout--spread .book_page_behind,.book_layout--spread .book_page_hidden--left,.book_layout--spread .book_page_hidden--right,.book_layout--spread .book_page_hidden_immediately--left,.book_layout--spread .book_page_hidden_immediately--right{max-width:50%;max-height:100%}.book_page_displayed.spread--left,.book_page_opening--from_left.spread--left,.book_page_opening--from_right.spread--left,.book_page_behind.spread--left,.book_page_hidden--left.spread--left,.book_page_hidden--right.spread--left,.book_page_hidden_immediately--left.spread--left,.book_page_hidden_immediately--right.spread--left{background-position:right top}.book_page_displayed.spread--right,.book_page_opening--from_left.spread--right,.book_page_opening--from_right.spread--right,.book_page_behind.spread--right,.book_page_hidden--left.spread--right,.book_page_hidden--right.spread--right,.book_page_hidden_immediately--left.spread--right,.book_page_hidden_immediately--right.spread--right{background-position:left top}.book_page_displayed::after,.book_page_opening--from_left::after,.book_page_opening--from_right::after,.book_page_behind::after,.book_page_hidden--left::after,.book_page_hidden--right::after,.book_page_hidden_immediately--left::after,.book_page_hidden_immediately--right::after{content:"";display:block;padding-top:$height}.book_page_displayed,.book_page_behind{display:block;z-index:10;}.book_layout--spread .book_page_displayed.spread--left,.book_layout--spread .book_page_behind.spread--left{left:0;right:50%}.book_layout--spread .book_page_displayed.spread--right,.book_layout--spread .book_page_behind.spread--right{left:50%;right:0}.book_layout--single .book_page_displayed.spread--left,.book_layout--single .book_page_behind.spread--left,.book_layout--single .book_page_displayed.spread--right,.book_layout--single .book_page_behind.spread--right{left:0;right:0}.book_layout--spread .book_page_opening--from_left.spread--left,.book_layout--spread .book_page_opening--from_right.spread--left{left:0;right:50%}.book_layout--spread .book_page_opening--from_left.spread--right,.book_layout--spread .book_page_opening--from_right.spread--right{left:50%;right:0}.book_layout--single .book_page_opening--from_left.spread--left,.book_layout--single .book_page_opening--from_right.spread--left,.book_layout--single .book_page_opening--from_left.spread--right,.book_layout--single .book_page_opening--from_right.spread--right{left:0;right:0}.book_page_hidden--left,.book_page_hidden--right,.book_page_hidden_immediately--left,.book_page_hidden_immediately--right{z-index:6}.book_page_opening--from_left.spread--left{transition:left $page_turn_duration ease-in-out,right $page_turn_duration ease-in-out;z-index:9;background-position:left top}.book_page_opening--from_left.spread--right{transition:left $page_turn_duration ease-in-out,right $page_turn_duration ease-in-out;z-index:11;box-shadow:80px 0 80px -40px rgba(0,0,0,0.2),-120px 0 120px -80px rgba(0,0,0,0.1);background-position:right top}.book_page_opening--from_right.spread--left{transition:left $page_turn_duration ease-in-out,right $page_turn_duration ease-in-out;z-index:11;box-shadow:-80px 0 80px -40px rgba(0,0,0,0.2),120px 0 120px -80px rgba(0,0,0,0.1);background-position:left top}.book_page_opening--from_right.spread--right{transition:left $page_turn_duration ease-in-out,right $page_turn_duration ease-in-out;z-index:9;background-position:right top}.book_page_behind{z-index:8}.book_page_hidden--left,.book_page_hidden_immediately--left{left:0 !important;right:100% !important;}.book_page_hidden--left.spread--left,.book_page_hidden_immediately--left.spread--left{transition-duration:0s}.book_page_hidden--left.spread--right,.book_page_hidden_immediately--left.spread--right{transition:left $page_turn_duration ease-in-out $page_turn_duration_half,right $page_turn_duration ease-in-out}.book_page_hidden--right,.book_page_hidden_immediately--right{left:100% !important;right:0 !important;}.book_page_hidden--right.spread--right,.book_page_hidden_immediately--right.spread--right{transition-duration:0s}.book_page_hidden--right.spread--left,.book_page_hidden_immediately--right.spread--left{transition:left $page_turn_duration ease-in-out,right $page_turn_duration ease-in-out $page_turn_duration_half;background-position:right top}.book_page_hidden_immediately--left{transition:none !important}.book_page_hidden_immediately--right{transition:none !important}'