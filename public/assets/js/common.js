function setLanguage(name)
{
	var url = window.location.href;
	var anchor = null;
	var query = null;

	var pos = url.indexOf('#');
	if (pos != -1) {
		anchor = url.substring(pos);
		url = url.substring(0, pos);
	}

	pos = url.indexOf('?')
	if (pos == -1) {
		query = '?language=' + name;
	} else {
		query = url.substring(pos);
		query = query.replace(/[?&]language=[^&]*/, '');
		if (query === "") {
			query = '?language=' + name;
		} else {
			query = '?' + query.substring(1);
			query += '&language=' + name;
		}

		url = url.substring(0, pos);
	}

	if (query != null)
		url += query;
	if (anchor != null)
		url += anchor;
	window.location.href = url; 
}

// Expand the "vcenter-expander" filler divs, based on the sum of all rows
function activateVCenter()
{
	$(window).resize(function() {
		var h = $(window).height();
		$(".vcenter").each(function (index) {
			h -= $(this).outerHeight();
		});
		var num = $(".vcenter-expander").length;
		if (num > 0) {
			$(".vcenter-expander").css({
				height: (h/num) + "px"
			});
		}
	});
	$(window).resize();
}

function resizeVFill()
{
	$(window).resize(function() {
		var h = $(window).height();
		$(".vfill").each(function (index) {
			h -= $(this).outerHeight();
		});
		$("#vfill").css({
			height: h + "px"
		});
	});
	$(window).resize();
}

function closeWindow(xname)
{
	try {
		xname = xname.replace(/-/g, "x");
		var win = window.open("", xname, "width=100,height=100");
		win.close();
	} catch (e) {
	}
}

function logout(url)
{
	url = url + "&csrf=" + csrf;

	var win = window.top;
	var host = win.location.host;
	host = host.split(':')[0];
	host = host.replace(/\./g, "_");
	var inst = win.location.pathname.split('\/')[1];

	closeWindow(host + inst + "phoenix");
	closeWindow(host + inst + "user");
	closeWindow(host + inst + "et2test");

	win.location.href = url; 
}

// Unfortunately jquery has deprecated their $.browser, this simple
// implementation should be improved maybe...
// http://stackoverflow.com/questions/5916900/detect-version-of-browser
var _browser = {};
function detectBrowser() {
	if (_browser.found) return;

	var uagent = navigator.userAgent.toLowerCase();

	var browser = {};
	browser.firefox = /mozilla/.test(uagent) && /firefox/.test(uagent);
	browser.chrome = /webkit/.test(uagent) && /chrome/.test(uagent);
	browser.safari = /applewebkit/.test(uagent) && /safari/.test(uagent) 
						    && !/chrome/.test(uagent);
	browser.opera = /opera/.test(uagent);
	browser.msie = /msie/.test(uagent) || /trident/.test(uagent);
	browser.version = '';

	for (x in browser) {
		if (browser[x]) {
			var mm = uagent.match(new RegExp("(" + x + ")( |/)([0-9]+)"));
			if (mm != null)
				browser.version = mm[3];
			else {
				mm = uagent.match(new RegExp("rv:([0-9]+)"));
				if (mm != null)
					browser.version = mm[1];
			}
			break;
		}
	}
	browser.found = true;
	_browser = browser;
}

function ie7_hasLayoutFix()
{
	// Detect IE7
	detectBrowser();
	if (_browser.msie && _browser.version == 7) {
		// Workaround for IE7 hasLayout bug because of relative body.
		// Footer appears mid-page and this triggers a layout update
		$("body").addClass("dummy-clazz");
		$("body").removeClass("dummy-clazz");
	}
}

function bsModalShowSized(id, skiphorizontal, skipvertical)
{
	$(window).off("resize");
	$(window).on("resize", function() {
		var h = $(window).height();

		//var hh = $(id + " .modal-header").outerHeight();
		//var fh = $(id + " .modal-footer").outerHeight();
		// FIXME: Scenario dialog for one customer
		hh = 59;
		fh = 76;

		if (h < 800)
			h -= 150;
		else if (h < 400)
			h -= 50;
		else if (h < 100)
			h -= 30;
		else
			h -= 150;

		h -= hh;
		h -= fh;

		var w = $(window).width();
		if (w < 1000)
			w -= 100;
		else
			w -= 200;
		if (w > 800)
			w = 800;

		var margin = -w / 2;

		if (!skipvertical)
			$(id + " .modal-body").css("height", h + "px");
		if (!skiphorizontal) {
			$(id).css("width", w + "px");
			$(id).css("margin-left", margin + "px");
		}
	});
	$(window).trigger("resize");

	$(id).modal("show");
}

function showAbout(url)
{
	// Ensure about url is the same protocol as the page
	var thisUrl = document.location.href;
	var isHttps = thisUrl.lastIndexOf("https:", 0) === 0;
	var isHttpsAfter = url.lastIndexOf("https:", 0) === 0;
	if (isHttps !== isHttpsAfter) {
		if (isHttps) {
			url = url.replace("http:", "https:");
			url = url.replace(":8080", ":8443");
		} else {
			url = url.replace("https:", "http:");
			url = url.replace(":8443", ":8080");
		}
	}

	if ($("#aboutdialog").length == 0) {
		var html = '';
		html += '<div class="modal hide fade focus-trap" id="aboutdialog" tabindex="-1" role="dialog" aria-labelledby="aboutdialog-title" aria-hidden="true" data-hide="main">';
		html += '<div id="aboutdialog-header" class="modal-header">';
		html += '<button type="button" class="close" data-dismiss="modal" aria-labelledby="aboutdialog-close">&#x00d7;</button>';
		html += '<h1 id="aboutdialog-title">About</h1>';
		html += '</div>';
		html += '<div class="modal-body" id="aboutdialog-contents" tabindex="0"></div>';
		html += '<div id="aboutdialog-footer" class="modal-footer">';
		html += '<button class="btn" id="aboutdialog-close" data-dismiss="modal">Close</button>';
		html += '</div>';
		html += '</div>';
		$("body").append(html);
	}

	$("#aboutdialog-contents").load(url, function () {
		var hide = $("#oed-build").length > 0;

		if ((window.ldc != null && window.ldc.version != null) ||
		    (window.external != null && window.external.version != null))
			hide = true;

		if (navigator.userAgent.indexOf("psi-secure-browser") != -1)
			hide = true;

		if (hide) {
			$("#aboutdialog-contents a").each(function () {
				var href = $(this).attr("href");
				var html = $(this).html();
				var span = document.createElement("span");
				$(span).html(html);
				$(this).after(span);
				$(this).remove();
			});
		}
	});

	bsModalShowSized("#aboutdialog");
}

function setupExtraStyles()
{
	// FIXME: this should be more configurable
	$(".ev_toggle_css_extraspace").off("click");
	$(".ev_toggle_css_extraspace").on("click", function () {
		if ($("body").hasClass("large-text-spacing")) {
			$("body").removeClass("large-text-spacing");
			$("iframe").contents().find("body").removeClass("large-text-spacing");
			document.cookie = "et2_extra_spacing=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		} else {
			$("body").addClass("large-text-spacing");
			$("iframe").contents().find("body").addClass("large-text-spacing");
			document.cookie = "et2_extra_spacing=1; path=/";
		}
	});
	if (document.cookie.split(';').filter(function(item) {
		return item.indexOf('et2_extra_spacing=1') >= 0
	}).length) {
		$(".ev_toggle_css_extraspace").addClass("active");
		if ($("body").hasClass("large-text-spacing") == false) {
			$("body").addClass("large-text-spacing");
		}
	}
}

$(function() {
	var host = window.location.host;
	host = host.split(':')[0];
	host = host.replace(/\./g, "_");
	var inst = window.location.pathname.split('\/')[1];

	setupExtraStyles();

	$(".target").each(function(index, e) {
		var t = $(e).data("target");
		$(e).attr("target", host + inst + t);
	});

	if (window.ldc != null && window.ldc.version != null)
		$("body").addClass("trifork-lockdown");
});
