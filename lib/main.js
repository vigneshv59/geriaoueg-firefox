var buttons = require('sdk/ui/button/action');
var data = require("sdk/self").data;

require('sdk/page-mod').PageMod({
    include: ["*"],
    contentStyleFile: data.url('basic.css'),
    contentScriptFile: [data.url("jquery.min.js"), data.url("mousestop.min.js"), data.url("xregexp-all-min.js"), data.url("contentscript.js")]
});

var tabs = require("sdk/tabs");

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

function handleClick(state) {
    //Open options popup here.
}