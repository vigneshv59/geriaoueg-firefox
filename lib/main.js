var buttons = require('sdk/ui/button/action');
var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");
var sp = require('sdk/simple-prefs');
var c_script_worker;
var first_time = true

var button = buttons.ActionButton({
  id: "apertium-options",
  label: "Apertium Options",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

var options_panel = require("sdk/panel").Panel({
    width: 470,
    height: 125,
    position: button,
    contentURL: data.url("popup.html"),
    contentStyleFile: [data.url("bootstrap/css/bootstrap.min.css"),data.url("bootstrap/css/bootstrap-responsive.min.css")],
    contentScriptFile: [data.url("jquery.min.js"),data.url("URI.min.js"),data.url("jquery.URI.min.js"),data.url("bootstrap/js/bootstrap.min.js"),data.url("options.js")]
});

options_panel.port.on('simple-storage-f-lang', function(dat) {
    ss.storage.f_lang = dat;
});

options_panel.port.on('simple-storage-t-lang', function(dat) {
    ss.storage.t_lang = dat;
});

options_panel.port.on('simple-storage-get-f-t-lang', function() {
    options_panel.port.emit('recieve-stored-langs',{"to_lang":ss.storage.t_lang,"fr_lang":ss.storage.f_lang});
});

options_panel.port.on('get-enable-state', function(dat) {
    options_panel.port.emit('recieve-enable-state',sp.prefs["atrans_on"]);
});

options_panel.port.on('change-enable-state', function(dat) {
    sp.prefs["atrans_on"] = dat
});

options_panel.port.on('get-apy-url', function(dat) {
    options_panel.port.emit('recieve-apy-url',sp.prefs["apy_url"]);
    options_panel.port.emit('recieve-stored-langs',{"to_lang":ss.storage.t_lang,"fr_lang":ss.storage.f_lang});
});

sp.on("apy_url", function() {
    delete ss.storage.f_lang
    delete ss.storage.t_lang
    
    options_panel.port.emit("recieve-apy-url",sp.prefs["apy_url"])
})

require('sdk/page-mod').PageMod({
    include: ["*"],
    contentStyleFile: data.url('basic.css'),
    contentScriptFile: [data.url("jquery.min.js"), data.url("mousestop.min.js"), data.url("xregexp-all-min.js"), data.url("contentscript.js")],
    onAttach: function onAttach(worker) {
        c_script_worker = worker
        init_ports()
    }
});

var tabs = require("sdk/tabs");

function handleClick(state) {
    options_panel_show()
    options_panel.show();
}

function options_panel_show() {
    options_panel.port.emit('showpopup')   
    if (first_time) {
        options_panel.port.emit('recieve-apy-url',sp.prefs["apy_url"]);
    } 
    first_time = false
}

function init_ports() {
    c_script_worker.port.emit('recieve-apy-url',sp.prefs["apy_url"]);
    
    
    c_script_worker.port.on('get-enable-state', function(dat) {
        c_script_worker.port.emit('recieve-enable-state',sp.prefs["atrans_on"]);
    });
    
    c_script_worker.port.on('get-apy-url', function(dat) {
        c_script_worker.port.emit('recieve-apy-url',sp.prefs["apy_url"]);
    });
    
    sp.on("atrans_on", function() {
        c_script_worker.port.emit("prefchanged",sp.prefs["atrans_on"])
    })
    
    sp.on("apy_url", function() {
        c_script_worker.port.emit("recieve-apy-url",sp.prefs["apy_url"])
    })
}