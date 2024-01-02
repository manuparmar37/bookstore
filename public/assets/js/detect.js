// http://www.quirksmode.org/js/detect.html
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";

		this.OSversion = "Unknown";
		var clientStrings = [
			{s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
			{s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
			{s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
			{s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
			{s:'Windows Vista', r:/Windows NT 6.0/},
			{s:'Windows Server 2003', r:/Windows NT 5.2/},
			{s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
			{s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
			{s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
			{s:'Windows 98', r:/(Windows 98|Win98)/},
			{s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
			{s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
			{s:'Windows CE', r:/Windows CE/},
			{s:'Windows 3.11', r:/Win16/},
			{s:'Android', r:/Android/},
			{s:'Open BSD', r:/OpenBSD/},
			{s:'Sun OS', r:/SunOS/},
			{s:'Linux', r:/(Linux|X11)/},
			{s:'iOS', r:/(iPhone|iPad|iPod)/},
			{s:'Mac OS X', r:/Mac OS X/},
			{s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
			{s:'QNX', r:/QNX/},
			{s:'UNIX', r:/UNIX/},
			{s:'BeOS', r:/BeOS/},
			{s:'OS/2', r:/OS\/2/},
			{s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
		];
		for (var id in clientStrings) {
			var cs = clientStrings[id];
			if (cs.r.test(navigator.userAgent)) {
				this.OSversion = cs.s;
				break;
			}
		}
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Edge",
			identity: "Edge"
		},
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{	// for IE11+
			string: navigator.userAgent,
			subString: "Trident",
			identity: "Explorer",
			versionSearch: "rv"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();
