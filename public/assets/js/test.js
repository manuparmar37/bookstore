var qt;
var inapp;
var onChrome;
var suspend = false;
var end = false;
var mappeddrive;
var countdown = -1;
var leaving = false;
var terminated = false;
var modals = [];
var audioblob = [];
var qtAC;
var STATE_UNANSWERED = "0";
var STATE_INCOMPLETE = "1";
var STATE_COMPLETE = "2";
var STATE_ANSWERED = "3";
var STATE_INAPP = "4";
var lastansweredShown = false;
var lastAudio = null;
var audioCtx = null;
var reloadCount = -1;
var this_itemevent = null;
var qadialog;
var pageCSS;
var bodyCSS;
$.ajaxSetup({
    cache: true
});

function log(msg) {
    if (typeof console === "undefined") return;
   
}

function is_visible(desc) {
    return $(desc + ":visible").length > 0
}

function lang(msg, arg0, arg1, arg2) {
    if (msg == null) return "(null)";
    if (arg0 != null) msg = msg.replace(/@0/g, arg0);
    if (arg1 != null) msg = msg.replace(/@1/g, arg1);
    if (arg2 != null) msg = msg.replace(/@2/g, arg2);
    return msg
}

function isImageOk(img) {
    if (img.length == 0) return true;
    for (var i = 0; i < img.length; i++)
        if (!img[i].complete) return false;
        else if (img[i].naturalWidth != undefined && img[i].naturalWidth == 0 || BrowserDetect.browser === "Explorer" && img[i].width != img[i].naturalWidth || BrowserDetect.browser === "Firefox" && img[i].width != $(img[i]).width()) {
        var div = document.createElement("div");
        div.id = "domrefresh";
        $("#questionframe").append(div);
        $("#domrefresh").remove();
        return false
    }
    return true
}
var mediaObjects = [];

function preloadObjects() {
    var blobUrls = typeof URL.createObjectURL !== "undefined";
    if (!blobUrls) {
        enterQuestion();
        return
    }
    $.each(mediaObjects, function(key, val) {
        URL.revokeObjectURL(val)
    });
    mediaObjects = [];
    var objno = 0;
    var objs = [];
    $("#preload > span").each(function() {
        objs.push($(this).text())
    });
    var total = objs.length;
    var ps = $("#message_download .bar");
    ps.attr("aria-valuemax", 1);
    ps.attr("data-transitiongoal", 0).progressbar();
    ps.attr("data-start", clock.now());
    var downloaded = 0;
    var xhr = null;
    var last_downloaded = -1;
    var last_changed = -1;
    var barupdate = setInterval(function() {
        ps.attr("data-transitiongoal", downloaded).progressbar();
        if (xhr == null) return;
        if (downloaded != last_downloaded) {
            last_downloaded = downloaded;
            last_changed = clock.now()
        } else {
            var stalled = clock.now() - last_changed;
            if (stalled > 30 * 1E3) {
                log("Stalled for more than 30 seconds, aborting");
                xhr.abort()
            }
        }
    }, 1E3);

    function retryObject() {
        $("#download_retry").show();
        $("#btn_download_retry").off("click");
        $("#btn_download_retry").click(function() {
            $("#download_retry").hide();
            setTimeout(preloadObject, 0)
        })
    }

    function preloadObject() {
        var displayTimer = setTimeout(function() {
            $("#message_download").show()
        }, 1E3);
        var msg = lang(GUI_DOWNLOAD_TEXT, objno + 1, total);
        ps.data("message", msg);
        ps.data("start", clock.now());
        downloaded = 0;
        ps.attr("aria-valuemax", 1);
        ps.attr("data-transitiongoal", 0).progressbar();
        xhr = new XMLHttpRequest;
        xhr.open("GET", objs[objno], true);
        xhr.responseType = "blob";
        xhr.onload = function(e) {
            xhr = null;
            clearTimeout(displayTimer);
            var isSuccess = this.status >= 200 && this.status < 300 ||
                this.status === 304;
            if (this.readyState == 4 && isSuccess) {
                mediaObjects[objs[objno]] = URL.createObjectURL(this.response);
                if (++objno >= total) {
                    clearInterval(barupdate);
                    $("#message_download").hide();
                    enterQuestion()
                } else {
                    downloaded = 0;
                    ps.attr("aria-valuemax", 1);
                    ps.attr("data-transitiongoal", 0).progressbar();
                    setTimeout(preloadObject, 0)
                }
            } else retryObject()
        };
        xhr.onprogress = function(e) {
            downloaded = e.loaded;
            ps.attr("aria-valuemax", e.total)
        };
        xhr.onerror = function() {
            xhr = null;
            retryObject()
        };
        xhr.onabort = function() {
            xhr = null;
            retryObject()
        };
        xhr.send()
    }
    if (total > 0 && !$("#qtparams").data("end")) preloadObject();
    else {
        enterQuestion();
        clearInterval(barupdate)
    }
}
var hlDelay;
var imageAttempts = 0;

function enterQuestion() {
    modals = [];
    leaving = false;
    hlDelay = (new Delay("et2:highlighter:init")).require("et2:highlighter:ready");
    if (!$("#qtparams").data("timestopped")) hlDelay.require("et2:clock:tick");
    if (!isAnswered() && $("#qtparams").data("countdown") > 0) {
        countdown = $("#qtparams").data("countdown");
        countdownUpdater()
    }
    if ($("#pagination-tooltip").css("display") == "none") $(".navitem").removeAttr("title");
    $("#mainvideo").on("ended", function() {
        $("#mainvideo").load();
        $(".video-ui").removeClass("active")
    });
    $(".ev_video").click(function() {
        if ($("#mainvideo").get(0).paused) $("#mainvideo").get(0).play();
        else $("#mainvideo").get(0).pause();
        var isActive = $(this).hasClass("active");
        $(".video-ui").removeClass("active");
        $("#mainvideo").get(0).pause();
        if (!isActive) {
            $(this).addClass("active");
            $("#mainvideo").get(0).play()
        }
    });
    var testpdfid = $("#qtparams").data("testpdftextid");
    if (testpdfid > 0) {
        var testpdfname = $("#qtparams").data("testpdfname");
        pdf.load(testpdfid, testpdfname)
    }
    if ($("#showfeedback") && !$("#params").data("showfeedback")) $("#showfeedback").removeClass("active");
    if ($("math").length > 0) {
        document.cookie =
            "mjx.menu=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        if (typeof MathJax === "undefined") {
            var script = document.createElement("script");
            script.src = $("#params").data("mathjax");
            script.async = false;
            script.defer = false;
            document.head.appendChild(script);
            script.addEventListener("load", function() {
                MathJax.Hub.Config({
                    showMathMenu: false,
                    showMathMenuMSIE: false,
                    messageStyle: "none",
                    "CommonHTML": {
                        scale: 150,
                        linebreaks: {
                            automatic: true
                        }
                    }
                })
            })
        } else MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    }
    if ($("#params").data("forcetabindex")) forceTabindex();
    imageAttempts = 0;
    internalEnterQuestion()
}

function internalEnterQuestion() {
    qtAC = null;
    var qtype = $("#qtparams").data("type");
    switch (qtype) {
        case 1:
        case 12:
        case 13:
            qt = new qtMC;
            break;
        case 2:
            qt = new qtHS;
            break;
        case 3:
        case 14:
            qt = new qtFIB;
            break;
        case 4:
            qt = new qtMatch;
            break;
        case 10:
            qt = new qtDnD;
            break;
        case 11:
            qt = new qtOrder;
            break;
        case 18:
            qt = new qtEssay;
            break;
        case 16:
            qt = inapp;
            break;
        case 19:
        case 20:
        case 21:
        case 22:
            qt = new qtTutor;
            break;
        case 23:
            qt = new qtReaction;
            break;
        case 24:
        case 26:
            qt = new qtContainer;
            break;
        case 25:
            qt = new qtAudioCapture;
            qtAC = qt;
            break;
        case 27:
            qt = new qtBranch;
            break;
        case 28:
            qt = new qtDnDText;
            break;
        case 29:
            qt = new qtAdvancedHS;
            break;
        case 30:
            qt = new qtInfo;
            break;
        case 31:
            qt = new qtPunct;
            break;
        default:
            alert("Unknown question type: " + qtype);
            doSuspendTest();
            return
    }
    $("html").focus();
    kbd.init(qtype);
    setupExtraStyles();
    var autoanswer = parseInt($("#qtparams").data("autoanswer"));
    var start = $("#clock").data("start");
    start = start / 1E3;
    if (!isAnswered() && autoanswer > 0 && start >= autoanswer) $("#qtparams").data("answer", "dummy");
    var isviewanswer = $("#qtparams").data("isviewanswer");
    if (isAnswered() && !isviewanswer) setAnswered();
    try {
        var hideitemid = $("#qtparams").data("hideitemid");
        if (hideitemid) window.location.hash = $("#qtparams").data("qnumber");
        else window.location.hash = $("#qtparams").data("tsqnumber")
    } catch (e) {}
    $(".btn").on("dragstart", function(e) {
        e.preventDefault()
    });
    $("input").on("drop", function(e) {
        e.preventDefault()
    });
    if (!isImageOk($("#mainimg,.drop-image-actual")) || !pdf.isLoaded()) {
        imageAttempts++;
        if (imageAttempts < 100) {
            setTimeout("internalEnterQuestion()", 200);
            return
        }
        alert("Timeout waiting for images to load - question may not display properly")
    }
    audiop.init();
    var timeStopped = $("#qtparams").data("timestopped");
    clock.setStopped(timeStopped);
    var isPaused = false;
    if (typeof et2websocket !== "undefined" && et2websocket.isPaused()) isPaused = true;
    else $("#pause").hide();
    clock.setDisplayed(isPaused);
    if (countdown > -1) {
        setTimeout("internalEnterQuestion()", 200);
        return
    }
    clock.clearStored();
    if ($("#qapanel-wrapper")) makeQAPanel();
    this_itemevent = itemevent.start("item");
    var answer = "" + $("#qtparams").data("answer");
    var restore = $("#qtparams").data("restore");
    qt.video();
    qt.prepare(answer,
        restore);
    qt.enter(answer, restore);
    setState();
    var navanswer = $("#controls").data("navanswer");
    var end = $("#qtparams").data("end");
    if (end && $("#qtparams").data("autoend") && canEnd()) {
        doEndTest();
        return
    }
    if (end && !lastansweredShown && canEnd()) {
        lastansweredShown = true;
        endTest()
    }
    $(".ev_comment").off("click");
    $(".ev_comment").click(function() {
        $.post("comment.do", {
            ts_qid: $("#qtparams").data("qid"),
            comment: $("#comment").val(),
            anonymous: $("#anonymous").prop("checked")
        });
        $("#commentModal").modal("hide")
    });
    tools.init();
    if ($("#qtparams").data("paused")) et2websocket.doPause();
    loading(null)
}

function leaveQuestion(cb_hide) {
    if (leaving) return;
    leaving = true;
    clock.setLeave();
    if ($("#calculator").dialog("instance") != null) $("#calculator").dialog("destroy");
    $("#calc_container").append("<div id='calculator'></div>");
    if ($("#zoompopup").dialog("instance") != null) $("#zoompopup").dialog("destroy");
    audiop.pause($("#mainaudio, .qtxtaudio, .audio-player"));
    audiop.leave();
    loading(1, function() {
        $("*").off();
        if (cb_hide) cb_hide()
    })
}

function undoLeaveQuestion() {
    leaving = false;
    loading(null);
    clock.resume()
}

function updateQuestionArea(url, params) {
    leaveQuestion(function() {
        if (this_itemevent != null) this_itemevent = itemevent.end(this_itemevent);
        if (!params) params = {};
        qt.exit();
        qt.leave(url, params)
    })
}

function next(mode, skipWarn) {
    if (!canNext()) return;
    if ($("#qtparams").data("type") == 18 && $("#qtparams").data("warnleave") && !skipWarn) {
        $("#essayWarnModal").modal("show");
        $(".ev_essaywarn_confirm").off("click");
        $(".ev_essaywarn_confirm").click(function() {
            $("#essayWarnModal").modal("hide");
            next(mode, true)
        });
        return
    }
    if (mode == 1 && navAnswer($("#controls").data("lastunanswered") ? "" : "next")) return;
    if (navAnswer(lastansweredShown ? "next2" : "")) return;
    $(".modal-backdrop").remove();
    updateQuestionArea("next.do")
}

function prev(mode, skipWarn) {
    if (!canPrev()) return;
    if ($("#qtparams").data("type") == 18 && $("#qtparams").data("warnleave") && !skipWarn) {
        $("#essayWarnModal").modal("show");
        $(".ev_essaywarn_confirm").off("click");
        $(".ev_essaywarn_confirm").click(function() {
            $("#essayWarnModal").modal("hide");
            prev(mode, true)
        });
        return
    }
    if (mode == 1 && navAnswer($("#controls").data("lastunanswered") ? "" : "prev")) return;
    if (navAnswer(lastansweredShown ? "prev2" : "")) return;
    updateQuestionArea("prev.do", {
        "mode": mode == 1 ? "order" : "unanswered"
    })
}

function navcat(cat) {
    if (canNav()) updateQuestionArea("navcat.do", {
        "cat": cat
    })
}

function navAnswer(nav) {
    var qtNavOnTimeout = false;
    if (!$("#controls").data("navanswer") && nav === "end") {
        var qtype = $("#qtparams").data("type");
        var left = clock.getTimeLeft();
        if (left < 0 && qtype == 18) qtNavOnTimeout = true
    }
    if (!$("#controls").data("navanswer") && !qtNavOnTimeout) return false;
    var autoanswer = $("#qtparams").data("autoanswer");
    if (nav != "end") autoanswer = 0;
    var overwrite = $("#controls").data("answeroverwrite");
    if (isAnswered() && !overwrite || autoanswer < 1 && !canAnswer()) return false;
    if (nav && nav.length > 0) doAnswer({
        "nav": nav
    });
    else doAnswer(null);
    return true
}

function jump(n, skipWarn) {
    if (navAnswer("" + n)) return;
    if (canNav()) {
        if ($("#qtparams").data("type") == 18 && $("#qtparams").data("warnleave") && !skipWarn) {
            $("#essayWarnModal").modal("show");
            $(".ev_essaywarn_confirm").off("click");
            $(".ev_essaywarn_confirm").click(function() {
                $("#essayWarnModal").modal("hide");
                jump(n, true)
            });
            return
        }
        updateQuestionArea("jump.do", {
            "qnumber": n
        });
        clock.clearStored()
    }
}

function nojump(n) {
    $(".navitem.active > a").focus()
}

function et2clear() {
    if (!canClear()) return;
    if ($("#controls").data("confirmclear"))
        if (isAnswered() && qt.clearDoesEdit()) {
            $("#editModal").modal("show");
            $("#editModal").off("hidden");
            $("#editModal").on("hidden", tools.magnifier.refresh);
            setTimeout(tools.magnifier.refresh, 200)
        } else {
            $("#clearModal").modal("show");
            $("#clearModal").off("hidden");
            $("#clearModal").on("hidden", tools.magnifier.refresh);
            setTimeout(tools.magnifier.refresh, 200)
        } else confirmClear()
}

function confirmClear() {
    if (isAnswered() && qt.clearDoesEdit()) {
        qt.edited = true;
        $("li.navitem.active a").off("focusout");
        setUnanswered();
        if ($("#qtparams").data("audioplaymode") > 0) audiop.init()
    } else justclear()
}

function justclear() {
    $(".modal-backdrop").remove();
    qt.edited = false;
    updateQuestionArea("clear.do");
    clock.clearStored()
}

function setUnanswered() {
    $("#qtparams").data("answer", null);
    $("#overlay").hide();
    $(".button-clear:visible").tooltip("destroy");
    $(".button-clear:visible").data("title", GUI_CLEARABLE_MSG);
    $(".clear_edit").hide();
    $(".clear_clear").show();
    $(".button-clear:visible").tooltip("show");
    setState()
}
var overlayCounter;

function resizeOverlay() {
    var w = $("#questionscroll").width();
    if (w != $("#overlay").width()) $("#overlay").css({
        width: w
    });
    if (overlayCounter++ < 50) setTimeout("resizeOverlay()", 100)
}

function setAnswered() {
    if ($("#controls").data("answeroverwrite")) return;
    $(window).resize(function() {
        var w = $("#questionscroll").width();
        $("#overlay").css({
            width: w
        })
    });
    overlayCounter = 0;
    setTimeout("resizeOverlay()", 100);
    var w = $("#questionscroll").width();
    $("#overlay").css({
        width: w
    });
    $("#overlay").show();
    $("#overlay").mousewheel(function(event) {
        var dy = event.deltaY * event.deltaFactor;
        var top = $("#questionframe").scrollTop();
        $("#questionframe").scrollTop(top - dy)
    });
    if (canClear()) {
        if (qt.clearDoesEdit()) {
            $(".clear_edit").show();
            $(".clear_clear").hide();
            $(".button-clear:visible").data("title", GUI_ANSWERED_MSG)
        } else $(".button-clear:visible").data("title", GUI_CLEARABLE_MSG);
        $(".button-clear:visible").data("trigger", "manual hover");
        $("#topbar .button-clear:visible").data("placement", "bottom");
        $("#bottombar .button-clear:visible").data("placement", "top");
        $(".button-clear:visible").tooltip("show")
    }
}

function doAnswer(params) {
    leaveQuestion(function() {
        if (params == null) params = {};
        if (qt.edited && qt.getState() == STATE_UNANSWERED) params.clear = "1";
        if (showFeedback()) params.feedback = "1";
        else delete params.feedback;
        qt.calcAnswer(function(status, answer) {
            if (inapp != undefined)
                if (status == "ERROR") {
                    undoLeaveQuestion();
                    reportError();
                    return
                } else if (answer == undefined) {
                undoLeaveQuestion();
                reportError();
                return
            } else if (answer == -1) {
                undoLeaveQuestion();
                reportWarnDialog();
                return
            } else if (answer == -2) {
                undoLeaveQuestion();
                if (canNav()) reportClosedApp();
                else justclear();
                return
            } else if (answer == -3) {
                undoLeaveQuestion();
                reportError();
                return
            }
            qt.exit();
            qt.answer(answer, params)
        })
    });
    clock.clearStored()
}

function answer(skipWarn) {
    if ($(".button-answer").hasClass("dimmed")) return;
    if ($("#qtparams").data("type") == 18 && $("#qtparams").data("warnleave") && !skipWarn) {
        $("#essayWarnModal").modal("show");
        $(".ev_essaywarn_confirm").off("click");
        $(".ev_essaywarn_confirm").click(function() {
            $("#essayWarnModal").modal("hide");
            answer(true)
        });
        return
    }
    var overwrite = $("#controls").data("answeroverwrite");
    if (!isAnswered() && canAnswer() || overwrite && qt.getState() == STATE_ANSWERED) doAnswer(null)
}

function autoanswerTimeout() {
    var state = qt.getState();
    if (isAnswered()) return;
    if (state != STATE_COMPLETE && state != STATE_INAPP);
    doAnswer(null)
}

function comment() {
    $("#commentModal").modal("show");
    $("#commentModal").off("hidden");
    $("#commentModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function info() {
    var h = $(window).height();
    h -= 150;
    if (h < 150) h = 150;
    h -= 150;
    $("#infoModal-contents").html("<iframe id='infoModal-iframe' name='infoiframe'></iframe>");
    $("#infoModal-iframe").attr("src", "info.html");
    $("#infoModal-contents iframe").css("height", h + "px");
    $("#infoModal").modal("show");
    $("#infoModal").off("hidden");
    $("#infoModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function scenario() {
    bsModalShowSized("#scenarioModal");
    $("#scenarioModal").off("hidden");
    $("#scenarioModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function setMarkedText() {
    var count = parseInt($("#qtparams").data("nummarked"));
    if (count > 0) {
        var txt = GUI_NUM_MARKED.replace(/@0/, count);
        $("#numMarked").text(txt)
    } else $("#numMarked").text("")
}

function populateItemlist() {
    $("#itemNavItemList tbody").empty();
    $.get("navigation.do", function(data, status, jqXHR) {
        $("#itemNavItemList tbody").append(data);
        $(".ev_navrow").off("click");
        $(".ev_navrow").click(function() {
            $(".navcol-state").popover("hide");
            $("#itemNavModal").modal("hide");
            $(".modal-backdrop").remove();
            jump($(this).data("number"))
        });
        $(".ev_navrow input:checkbox").off("click");
        $(".ev_navrow input:checkbox").click(function(e) {
            e.stopPropagation();
            var n = $(this).closest("tr").data("number");
            $("#navitem-" + n).toggleClass("item-marked");
            $("#fnavitem-" + n).toggleClass("item-marked");
            $.post("mark.do", {
                number: n
            }, function(data) {
                $("#qtparams").data("nummarked", data.markedCount)
            })
        });
        navfilterRestoreState()
    })
}

function itemnav() {
    populateItemlist();
    $(".ev_navfilter").off("click");
    $(".ev_navfilter").click(function() {
        togglePopover()
    });
    $("#itemNavModal").off("hide.bs.modal");
    $("#itemNavModal").on("hide.bs.modal", function(ev) {
        $(".popover").hide()
    });
    setMarkedText();
    $("#itemNavModalLabelEnd").hide();
    $("#itemNavModalLabelSuspend").hide();
    $("#itemNavModalMsgEnd").hide();
    $("#itemNavModalMsgSuspend").hide();
    $("#itemNavModalBtnEnd").hide();
    $("#itemNavModalBtnSuspend").hide();
    $("#itemNavModalLabelNav").show();
    $("#itemNavItemList").show();
    $("#itemNavModalMsgCount").hide();
    $("#itemNavModal").attr("aria-labelledby", "itemNavModalLabelNav");
    $("#itemNavModal").attr("aria-describedby", "itemNavModalDescNav");
    $("#itemNavModal").addClass("fullscreen");
    $("#itemNavModal").removeClass("normal");
    $("#itemNavModal").modal("show");
    $("#itemNavModal").off("hidden");
    $("#itemNavModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function markitem() {
    var n = $(".navitem.active").data("number");
    $("#navitem-" + n).toggleClass("item-marked");
    $("#fnavitem-" + n).toggleClass("item-marked");
    var cb = $("#navrow-" + n + " input:checkbox");
    cb.prop("checked", !cb.prop("checked"));
    $.post("mark.do", function(data) {
        $("#qtparams").data("nummarked", data.markedCount)
    })
}

function setTaskBar(tasknum) {
    var taskpos = $("#qtparams").data("taskpos");
    taskpos = parseInt(taskpos);
    var taskbar = $(".taskbar li").toArray();
    for (var i = 0; i <= tasknum; i++) {
        var ind = taskpos + i;
        if (ind >= taskbar.length) continue;
        taskbar[ind].className = "";
        if (i == tasknum) $(taskbar[ind]).addClass("active");
        else $(taskbar[ind]).addClass("complete")
    }
}

function calculator() {
    if ($("#calculator").dialog("instance") != null) {
        $("#calculator").dialog("destroy");
        return
    }
    if (calcType == 0) return;
    if (calcType == 1) $("#calculator").calculator({
        layout: $.calculator.standardLayout
    });
    else $("#calculator").calculator({
        layout: $.calculator.scientificLayout
    });
    var pos = {
        my: "right top",
        at: "right top",
        of: "#questionframe"
    };
    $("#calculator").dialog({
        draggable: true,
        dialogClass: "calcwrapper",
        closeOnEscape: false,
        position: pos,
        resizable: false,
        width: "auto"
    });
    $(".ui-dialog-titlebar-close").addClass("icon-remove");
    $("div.calcwrapper > div").css("padding", 0);
    $("#calculator").dialog("option", "position", pos)
}

function showStyle() {
    if (!canStyle()) return;
    iev = itemevent.start("style");
    document.location.href = "style.html"
}

function toggleFeedback() {
    $("#showfeedback").toggleClass("active");
    $("#params").data("showfeedback", !$("#params").data("showfeedback"))
}

function showFeedback() {
    return $("#showfeedback") && $("#showfeedback").hasClass("active")
}

function parseUrl(str, start, resultid, guid, score, status, categories) {
    var url = str.substring(start, str.length);
    url = url.replace("@resultid@", resultid);
    url = url.replace("@guid@", encodeURIComponent(guid));
    url = url.replace("@score@", score);
    url = url.replace("@status@", encodeURIComponent(status));
    url = url.replace("@categories@", encodeURIComponent(categories));
    return url
}

function closeaction(win, doc, data) {
    var action = data.action;
    var resultid = data.resultid;
    $("#loading").html("");
    if (action == "close") win.top.close();
    else if (action == "blank") doc.location.href = "about:blank";
    else if (action == "none");
    else if (action == "result") doc.location.href = "../user/viewResult.do?endOfTest=1&resultid=" + resultid;
    else doc.location.href = action
}

function resultaction(win, doc, data) {
    var action = data.action;
    var resultid = data.resultid;
    var guid = data.guid;
    var score = data.score;
    var status = data.status;
    var typeid = data.typeid;
    var categories = data.categories;
    $("#loading").html("");
    var allowClose = true;
    if (action == "close") win.top.close();
    else if (action == "blank");
    else if (action == "chain") {
        document.location.href = "../../ls/user/user?op=jsonlaunch" + "&ui=1&rid=" + data.chainid + "&typeid=" + typeid + "&lw=1&chain=1";
        allowClose = false
    } else if (action == "chain-oed") document.location.href =
        "test.html";
    else if (action == "result:") window.open("../user/viewResult.do?endOfTest=1&resultid=" + resultid);
    else if (action != null && action.lastIndexOf("url:", 0) === 0) {
        var url = parseUrl(action, 4, resultid, guid, score, status, categories);
        doc.location.href = url
    } else if (action != null && action.lastIndexOf("opener:", 0) === 0) {
        var url = parseUrl(action, 7, resultid, guid, score, status, categories);
        if (win.top.opener != null && !win.top.opener.closed) win.top.opener.document.location.href = url;
        win.top.close()
    } else if (action == "blankresult") window.open("../user/viewResult.do?endOfTest=1&resultid=" +
        resultid, data.target);
    else doc.location.href = "../user/viewResult.do?endOfTest=1&resultid=" + resultid;
    return allowClose
}

function suspendTest() {
    setMarkedText();
    $("#itemNavModalLabelNav").hide();
    $("#itemNavModalLabelEnd").hide();
    $("#itemNavModalMsgEnd").hide();
    $("#itemNavModalBtnEnd").hide();
    $("#itemNavModalLabelSuspend").show();
    $("#itemNavModalMsgSuspend").show();
    $("#itemNavModalBtnSuspend").show();
    $("#itemNavItemList").hide();
    $("#itemNavModalMsgCount .alert").removeClass("alert-error");
    $("#itemNavModalMsgCount .alert").addClass("alert-info");
    $("#itemNavModalMsgCount").show();
    $("#itemNavModal").attr("aria-labelledby",
        "itemNavModalLabelSuspend");
    $("#itemNavModal").attr("aria-describedby", "itemNavModalDescSuspend");
    $("#itemNavModal").removeClass("fullscreen");
    $("#itemNavModal").addClass("normal");
    bsModalShowSized("#itemNavModal", false, true);
    $("#itemNavModal").off("hidden");
    $("#itemNavModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function doSuspendTest() {
    $("#itemNavModal").modal("hide");
    if (typeof et2websocket !== "undefined") et2websocket.disconnect();
    if (inapp != undefined && inapp.shutdown != undefined) {
        suspend = true;
        inapp.shutdown()
    } else internalDoSuspend()
}

function internalDoSuspend() {
    leaveQuestion(function() {
        if (this_itemevent != null) this_itemevent = itemevent.end(this_itemevent);
        var newWindow = $("#params").data("window");
        var resourceid = $("#params").data("resourceid");
        var url = "endTest.do";
        var params = {
            "suspend": "1",
            "resourceid": resourceid
        };
        var cb = null;
        if (newWindow) cb = function(data, textStatus, xhr) {
            var wo = window.opener;
            if (wo == null || wo == undefined) {
                window.resizeTo(self.screen.availWidth, self.screen.availHeight);
                closeaction(window, document, data)
            } else {
                closeaction(wo,
                    wo.document, data);
                window.close()
            }
        };
        else cb = function(data, textStatus, xhr) {
            closeaction(window, document, data)
        };
        net.post(url, params, cb)
    });
    clock.clearStored()
}

function endTest() {
    setMarkedText();
    $("#itemNavModalLabelNav").hide();
    $("#itemNavModalLabelSuspend").hide();
    $("#itemNavModalMsgSuspend").hide();
    $("#itemNavModalBtnSuspend").hide();
    $("#itemNavModalLabelEnd").show();
    $("#itemNavModalMsgEnd").show();
    $("#itemNavModalBtnEnd").show();
    if ($("#qtparams").data("sectionreview")) {
        populateItemlist();
        $("#itemNavItemList").show()
    } else $("#itemNavItemList").hide();
    $("#itemNavModalMsgCount .alert").removeClass("alert-info");
    $("#itemNavModalMsgCount .alert").addClass("alert-error");
    $("#itemNavModalMsgCount").show();
    $("#itemNavModal").attr("aria-labelledby", "itemNavModalLabelEnd");
    $("#itemNavModal").attr("aria-describedby", "itemNavModalDescEnd");
    $("#itemNavModal").removeClass("fullscreen");
    $("#itemNavModal").addClass("normal");
    bsModalShowSized("#itemNavModal", false, true);
    $("#itemNavModal").off("hidden");
    $("#itemNavModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function showConfirmEndTest() {
    $(".ev_confirm_endtest_ok").off("click");
    $(".ev_confirm_endtest_ok").click(function() {
        $("#confirmEndTestModal").modal("hide");
        if (!navAnswer("end")) doEndTest()
    });
    $(".ev_confirm_endtest_cancel").off("click");
    $(".ev_confirm_endtest_cancel").click(function() {
        $("#confirmEndTestModal").modal("hide");
        setTimeout(tools.magnifier.refresh, 200)
    });
    $("#itemNavModal").on("hidden", function() {
        $("#confirmEndTestModal").modal("show");
        setTimeout(tools.magnifier.refresh, 200);
        $("#itemNavModal").off("hidden")
    });
    $("#itemNavModal").modal("hide")
}

function noConfirmEndTest() {
    $("#itemNavModal").modal("hide");
    if (!navAnswer("end")) doEndTest()
}

function doEndTest() {
    $("#itemNavModal").modal("hide");
    $("#confirmEndTestModal").hide();
    if (typeof et2websocket !== "undefined") et2websocket.disconnect();
    if (inapp != undefined && inapp.shutdown != undefined) {
        end = true;
        inapp.shutdown()
    } else internalDoEnd()
}

function internalDoEnd() {
    leaveQuestion(function() {
        if (this_itemevent != null) this_itemevent = itemevent.end(this_itemevent);
        internalEndTest()
    })
}

function internalEndTest() {
    var endsection = $("#qtparams").data("endsection");
    if (endsection) {
        lastansweredShown = false;
        $("#itemNavModal").modal("hide");
        net.load("#question", "endSection.do", {
            "ct": clock.now()
        })
    } else internalEndTest2("endTest.do", null)
}

function internalEndTest2(url, params, uploadUrl, names, arrays, md5sum) {
    var newWindow = $("#params").data("window");
    var resourceid = $("#params").data("resourceid");
    var cb = null;
    params = params || {};
    params.ev_client = clock.now();
    params.ev_timezone = -(new Date).getTimezoneOffset();
    params.resourceid = resourceid;
    if (newWindow) cb = function(data, textStatus, xhr) {
        var wo = window.opener;
        if (wo == null || wo == undefined) {
            window.resizeTo(self.screen.availWidth, self.screen.availHeight);
            resultaction(window, document, data)
        } else if (resultaction(wo,
                wo.document, data)) window.close()
    };
    else cb = function(data, textStatus, xhr) {
        if (!newWindow && inapp != undefined) window.resizeTo(self.screen.availWidth, self.screen.availHeight);
        resultaction(window, document, data)
    };
    if ($("#qtparams").data("type") == 25) net.postblobSafe(uploadUrl, names, arrays, md5sum, function() {
        net.post(url, params, cb)
    });
    else net.post(url, params, cb)
}

function selectTagGroup(x) {
    updateQuestionArea("tags.do", {
        "groupid": x.value
    });
    clock.clearStored()
}

function setState() {
	console.log(qt);
    var state = qt.getState();
    setButtonState(".button-answer", canAnswer(state));
    setButtonState(".button-clear", canClear(state));
    setButtonState(".button-next", canNext(state));
    setButtonState(".button-prev", canPrev(state));
    setButtonState(".button-style", canStyle(state));
    if ($("#controls").data("navanswer") && $("#controls").data("lastunanswered") && !$("#controls").data("next") && canEnd()) {
        var txt = null;
        if (canAnswer(state)) txt = $("#qtparams").data("lastunansweredtext");
        else txt = $("#qtparams").data("nexttext");
        $(".button-next").text(txt)
    }
}

function canNext(state) {
   
    var automanualanswer = $("#qtparams").data("automanualanswer");
    var autoanswer = $("#qtparams").data("autoanswer");
    if (automanualanswer == 2) autoanswer = null;
    var ans = (state == STATE_COMPLETE || state == STATE_INAPP) && !isAnswered() && autoanswer < 1;
    var nav = state != STATE_INCOMPLETE && state != STATE_COMPLETE && autoanswer < 1;
    if (automanualanswer == 1) ans = true;
    return nav && $("#controls").data("next") || ans && $("#controls").data("navanswer")
}

function canPrev(state) {
   
    var automanualanswer = $("#qtparams").data("automanualanswer");
    var autoanswer = $("#qtparams").data("autoanswer");
    if (automanualanswer == 2) autoanswer = null;
    var ans = (state == STATE_COMPLETE || state == STATE_INAPP) && !isAnswered() && autoanswer < 1;
    var nav = state != STATE_INCOMPLETE && state != STATE_COMPLETE && autoanswer < 1;
    if (automanualanswer == 1) ans = true;
    return nav && $("#controls").data("prev") || ans && $("#controls").data("navanswer") && $("#controls").data("prev")
}

function canAnswer(state) {
   
    var automanualanswer = $("#qtparams").data("automanualanswer");
    var autoanswer = $("#qtparams").data("autoanswer");
    if (automanualanswer == 2) autoanswer = null;
    var overwrite = $("#controls").data("answeroverwrite");
    var ans = (state == STATE_COMPLETE || state == STATE_INAPP || qt.edited && state == STATE_UNANSWERED) && (!isAnswered() && autoanswer < 1) || state == STATE_ANSWERED && overwrite;
    if (autoanswer > 0 && automanualanswer == 1) ans = true;
    return ans
}

function canClear(state) {
    var clr = false;
    var autoanswer = $("#qtparams").data("autoanswer");
    if (autoanswer < 1) {
        if (typeof state === "undefined") state = qt.getState();
        clr = $("#controls").data("change") ? state != STATE_UNANSWERED : state != STATE_UNANSWERED && state != STATE_ANSWERED
    }
    return clr
}

function canNav(state) {
   
    var autoanswer = $("#qtparams").data("autoanswer");
    var nav = state != STATE_INCOMPLETE && state != STATE_COMPLETE && autoanswer < 1;
    return nav && $("#controls").data("nav")
}

function canStyle(state) {
    var autoanswer = $("#qtparams").data("autoanswer");
    if (autoanswer > 0) return false;
    if (typeof state === "undefined") state = qt.getState();
    return state == STATE_UNANSWERED || state == STATE_ANSWERED || state == STATE_INAPP
}

function canEnd() {
    var tl = $("#params").data("timelimits");
    if (tl && (tl.length > 0 || tl > 0) && $("#params").data("mandatorytime")) return clock.getTimeLeft() <= 0;
    else return true
}

function setButtonState(btnsel, enabled) {
    if (enabled) enableButton(btnsel);
    else disableButton(btnsel)
}

function enableButton(btnsel) {
    $(btnsel).each(function() {
        $(this).removeClass("disabled");
        $(this).removeAttr("aria-disabled")
    })
}

function disableButton(btnsel) {
    $(btnsel).each(function() {
        $(this).addClass("disabled");
        $(this).attr("aria-disabled", "true")
    })
}

function isAnswered() {
    var answer = $("#qtparams").data("answer");
    return answer !== null && answer !== "" && answer !== -1
}

function isVisited() {
    return $("#qtparams").data("visited")
}

function countdownUpdater() {
    if ($("#qtparams").data("reactstart") == 1) {
        $(".countdown-overlay").show();
        $("#countdown-overlay-vcenter").html(lang(GUI_CLICKTOSTART_MSG));
        $(".countdown-overlay").mousedown(function() {
            $(".countdown-overlay").hide();
            countdown = -1
        });
        countdown = 1
    } else if (countdown > 0) {
        $(".countdown-overlay").show();
        $("#countdown-overlay-vcenter").html(lang(GUI_COUNTDOWN_MSG, countdown));
        setTimeout(countdownUpdater, 1E3)
    } else $(".countdown-overlay").hide();
    countdown--
}
var urlmap = [];

function lookup_reset() {
    urlmap = []
}

function lookup_add(name, url) {
    urlmap[name] = url
}

function lookup_url(name) {
    var url = urlmap[name];
    if (url == null) {
        $(".tutor_urlmapping span").each(function() {
            lookup_add($(this).data("key"), $(this).data("value"))
        });
        url = urlmap[name]
    }
    return url
}

function getlog() {
    if (inapp != undefined && inapp != null) inapp.getLog()
}

function reportError() {
    $("#errorModal").modal("show");
    $("#errorModal").off("hidden");
    $("#errorModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function reportCOMError() {
    $("#comModal").modal("show");
    $("#comModal").off("hidden");
    $("#comModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function reportLocked() {
    $("#lockedModal").modal("show");
    $("#lockedModal").off("hidden");
    $("#lockedModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function reportIncompatible() {
    $("#incompatibleModal").modal("show");
    $("#incompatibleModal").off("hidden");
    $("#incompatibleModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function reportWarnDialog() {
    $("#warnModal").modal("show");
    $("#warnModal").off("hidden");
    $("#warnModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function reportClosedApp() {
    $("#closedModal").modal("show");
    $("#closedModal").off("hidden");
    $("#closedModal").on("hidden", tools.magnifier.refresh);
    setTimeout(tools.magnifier.refresh, 200)
}

function oldIEdisableSelect() {
    return !$("body").hasClass("highlight")
}

function oldIEdisableDrag(e) {
    if ($("#magnifier:visible").length > 0) return true;
    if ($("#linereader_bottom:visible").length > 0) return true;
    var c = e.target.className;
    return c && c.indexOf("drop-image") != -1
}

function loading(state, cb_hide) {
    $("#message_wait").hide();
    if (state == null) {
        $("#loading .cover").fadeOut(300, function() {
            $("#loading").hide();
            scrollText()
        });
        return
    }
    if (state == 2) {
        $("#message").text(GUI_LOADING_2);
        return
    }
    if (state == 3) {
        $("#message").text(GUI_LOADING_3);
        return
    }
    $("#loading .animation").hide();
    $("#clock").css("visibility", "hidden");
    $("#timer").css("visibility", "hidden");
    setTimeout(function() {
            var url = $("#loading").data("url");
            $("#loading .animation img").attr("src", url);
            $("#loading .animation").show()
        },
        600);
    $("#message").text(GUI_LOADING_1);
    $("#loading").show();
    $("#loading .cover").fadeIn(600, cb_hide)
}

function scrollText() {
    if ($(".et2-scrollIntoView").length == 0) return;
    if ($(".et2-scrollIntoViewContainer").length == 0) return;
    var e = $($(".et2-scrollIntoView")[0]);
    var container = $($(".et2-scrollIntoViewContainer")[0]);
    var padding = 50;
    var scrollTop = container.scrollTop();
    var top = e.offset().top;
    var bottom = e.offset().top + e.height();
    var viewTop = container.offset().top;
    var viewBottom = container.offset().top + container.height();
    if (top - 50 >= viewTop && top + 50 <= viewBottom) return;
    var delta = top - viewTop - padding;
    var position =
        container[0].scrollTop + delta;
    if (position < 0) position = 0;
    container[0].scrollTop = position
}

function cb_postblob(data) {
    var error = data.indexOf("@@NO_SESSION@@") != -1 || data.indexOf("@@KICKED@@") != -1 || data.indexOf("@@TEST_ERROR@@") != -1;
    if (error) loading(null);
    $("#question").html(data)
}

function makeQAPanel() {
    if (qadialog) qadialog.dialog("destroy");
    var pos = {
        my: "left bottom",
        at: "left bottom",
        of: "#questionframe"
    };
    qadialog = $("#qapanel-wrapper").dialog({
        draggable: true,
        dialogClass: "no-close qapanel",
        closeOnEscape: false,
        position: pos,
        autoResize: true,
        resizable: false,
        width: "auto",
        maxHeight: 400
    });
    $(".ui-dialog-titlebar-close").hide();
    $("div.qapanelwrapper > div").css("padding", 0);
    $("#qapanel-wrapper").dialog("option", "position", pos)
}

function tab_GUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1)
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
}

function registerTabGUID() {
    if (sessionStorage["tabGUID"] == null) sessionStorage["tabGUID"] = tab_GUID();
    var guid = sessionStorage["tabGUID"];
    window.addEventListener("storage", storage_Handler, false);
    localStorage["tabGUID"] = guid
}

function storage_Handler(e) {
    if (e.key == "tabGUID")
        if (e.oldValue != e.newValue) {
            $("#pmessage").text("You have opened the test in a new tab.");
            $("#pause").show()
        }
}

function forceTabindex() {
    $('[tabindex]:not([tabindex="0"]):not([tabindex^="-"])').each(function() {
        if ($(this).attr("tabindex") < 1E3) $(this).attr("tabindex", 0)
    })
}
$(function() {
    if (typeof Storage !== "undefined" && sessionStorage != null && localStorage != null) registerTabGUID();
    clock.init();
    resultStorage.load();
    if ($("#params").data("disabledrag")) $("head").append("<style type='text/css'>a, img { -webkit-user-drag: none; }</style>");
    reloadCount = parseInt($("#params").data("reloadcount"));
    if (reloadCount < 1) reloadCount = NaN;
    if ($("#params").data("isinapp")) {
        reloadCount = NaN;
        var isChromium = window.chrome;
        var vendorName = window.navigator.vendor;
        if (isChromium !== null && isChromium !==
            undefined && vendorName === "Google Inc.") {
            onChrome = true;
            inapp = new qtInappChrome
        } else if (BrowserDetect.browser === "Firefox" && BrowserDetect.version >= 50) {
            onChrome = false;
            inapp = new qtInappFirefox
        } else {
            onChrome = false;
            var plugin = document.getElementById("plugin");
            if (plugin.version == undefined) {
                alert("No In-Application plugin found");
                internalDoSuspend();
                return
            } else inapp = new qtInapp
        }
        inapp.init()
    } else net.load("#question", "question.html", {
        "ct": clock.now()
    })
});