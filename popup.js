$(document).ready(function(){
  if(!load("menus")) {
    refreshData();
  }

  display();

  $('div.panel-body a.menu-link').bind('click', function(){
    window.open($(this).attr("link"));
  });

  $('button.refresh-btn').bind('click', function(){
    refreshData();
    display();
  });
});

function store(menus, timestamp){
  var storage = judgeBrower();

  storage.setItem("menus", menus);
  storage.setItem("timestamp", timestamp);
}

function load(key){
  var storage = judgeBrower();
  return storage.getItem(key);
}

function judgeBrower(){
  var storage = window.localStorage;
  if(!storage){
    alert('浏览器不支持localStorage!');
    return false;
  }

  return storage;
}

function refreshData(){
  $.ajax({
    url: 'https://www.baidu.com/home/xman/show/liteoff',
    type: 'get',
    async: false
  });

  $.ajax({
    url: 'https://www.baidu.com',
    type: 'get',
    async: false,
    success: function(o){
      var baidu = $(o);
      // 获取所有的导航
      var menuBars = $('div.s-mblock-content', baidu);
      // 导航中每一个分类
      var items = $('div.dir-item', menuBars).filter(function(){
        return !$(this).hasClass("dir-blank");
      });
      var bar = [];
      items.each(function(i){
        var item = $(items[i]);
        var content = $('div.dir-content', item);
        var typeName = $.trim($('div.dir-name span.name-text', item).html());
        var linkItems = $('div.d-nav-item', content);
        var links = [];
        linkItems.each(function(j){
          var linkItem = $('a', linkItems[j]);
          var link = [];
          link.push('"href":"' + linkItem.attr('href') + '"');
          link.push('"title":"' + linkItem.attr('title') + '"');
          link.push('"img":"' + $('img', linkItem).attr('src') + '"');

          links.push('{' + link.join(',') + '}');
        });

        bar.push('{' + '"name":"' + typeName + '", "items":[' + links.join(',') + ']}');
      });

      var barsInBaidu = '[' + bar.join(',') + ']';
      store(barsInBaidu, new Date().getTime());
    }
  });

  closeBaiduNav();
}

function closeBaiduNav(){
  $.ajax({
    url: 'https://www.baidu.com/home/pcweb/submit/manusertips',
    data: 'prop=isLite&value=on&indextype=manht&bsToken=d1185a117bfcb1d1d5c149ad49557d8f&_req_seqid=0xe147ab4700032d65&sid=10299_12896_1448_17619_17813_17640_12824_17782_17502_17001_17072_15096_11903_17157_17050',
    type: 'post'
  });
}

function display(){
  var menus = window.eval(load("menus"));

  var html = [];
  for(var i in menus) {
    var menu = menus[i];
    var _html = [];
    _html.push('<div class="panel panel-default">');
    _html.push('  <div class="panel-heading">');
    _html.push('    <div class="row">');
    _html.push('      <div class="col-sm-8">' + menu.name + '</div>');
    _html.push('    </div>');
    _html.push('  </div>');
    _html.push('  <div class="panel-body">');
    var links = menu.items;
    var linkHtml = [];
    for(var j in links) {
      var link = links[j];
      var _link = [];
      _link.push('  <a herf="javaScript:void(0);" class="btn btn-default menu-link" link="' + link.href + '" role="button" title="' + link.title + '">');
      _link.push('    <img src="' + link.img + '" alt="Google" height="16" width="16" class="nav-icon">');
      _link.push('      ' + link.title);
      _link.push('  </a>');

      linkHtml.push(_link.join(""));
    }

    _html.push(linkHtml.join(""));
    _html.push('  </div>');
    _html.push('</div>');

    html.push(_html.join(''));
  };

  $('div.container').html(html.join(""));
  var date = new Date(parseInt(load("timestamp")));
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minute = date.getMinutes();
  $('#timestamp').html(year + "-" + month + "-" + day + " " + hours + ":" + minute);
}