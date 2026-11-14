/* AdKit (itch.io build): no ads; rewards are granted directly. */
(function(){'use strict'; if(window.AdKit)return;
window.AdKit={rewarded:function(){return Promise.resolve(true)},offer:function(){return Promise.resolve(true)},
levelDone:function(){return Promise.resolve(false)},breakpoint:function(){return Promise.resolve()},left:function(){return 99},available:function(){return true}};})();
