(function(resultStorage, $, undefined) {
    var data = {};
    var MAX_RESULTS = 5;
    var SAVE_TIME = 1E3;
    var saveTimeout = null;

    function save() {
        if (localStorage == null) return;
        var resultid = $("#params").data("resultid");
        if (resultid === "null" || resultid === "undefined" || resultid === "preview") return;
        var key = "__et2result__" + resultid;
        data["__changed__"] = clock.now();
        if (saveTimeout != null) return;
        saveTimeout = setTimeout(function() {
            localStorage.setItem(key, JSON.stringify(data));
            saveTimeout = null
        }, SAVE_TIME)
    }
    resultStorage.load = function() {
        if (localStorage ==
            null) return;
        var resultid = $("#params").data("resultid");
        if (resultid === "null" || resultid === "undefined" || resultid === "preview") return;
        var key = "__et2result__" + resultid;
        var len = localStorage.length;
        var results = [];
        for (var i = 0; i < len; i++) {
            var xkey = localStorage.key(i);
            if (xkey.indexOf("__et2result__") != 0) continue;
            var x = localStorage.getItem(xkey);
            results[i] = JSON.parse(x);
            results[i]["__key__"] = xkey;
            if (xkey == key) results[i]["__changed__"] = clock.now()
        }
        results.sort(function(a, b) {
            var ca = a["__changed__"] || -1;
            var cb = b["__changed__"] ||
                -1;
            if (ca < cb) return 1;
            if (ca > cb) return -1;
            return 0
        });
        for (var i = MAX_RESULTS; i < results.length; i++) {
            var r = results[i];
            if (r == null) continue;
            localStorage.removeItem(r["__key__"])
        }
        var x = localStorage.getItem(key);
        if (x == null) data = {};
        else data = JSON.parse(x)
    };

    function getQKey(key) {
        var qid = $("#qtparams").data("qid");
        return "__question__" + qid + "__" + key
    }
    resultStorage.setItem = function(key, obj) {
        data[key] = obj;
        save()
    };
    resultStorage.getItem = function(key) {
        return data[key]
    };
    resultStorage.removeItem = function(key) {
        delete data[key];
        save()
    };
    resultStorage.setQuestionItem = function(key, obj) {
        resultStorage.setItem(getQKey(key), obj)
    };
    resultStorage.getQuestionItem = function(key) {
        return resultStorage.getItem(getQKey(key))
    };
    resultStorage.removeQuestionItem = function(key) {
        resultStorage.removeItem(getQKey(key))
    }
})(window.resultStorage = window.resultStorage || {}, jQuery);
(function(tools, $, undefined) {
    var toolList = {};

    function setEnabled(name) {
        toolList[name] = true;
        resultStorage.setItem("tools", toolList)
    }

    function setDisabled(name) {
        delete toolList[name];
        resultStorage.setItem("tools", toolList)
    }

    function isEnabled(name) {
        return toolList[name] == true
    }
    tools.magnifier = new function() {
        var iev;

        function positionMagnifier(x, y, contentOnly) {
            var isRTL = $("body").css("direction") == "rtl";
            var pw = $("body").width();
            var ph = $("body").height();
            var magw = $("#magnifier").width();
            var magh = $("#magnifier").height();
            var magblw = $("#magnifier").css("borderLeftWidth");
            var magbrw = $("#magnifier").css("borderRightWidth");
            var magbtw = $("#magnifier").css("borderTopWidth");
            var magbbw = $("#magnifier").css("borderBottomWidth");
            magblw = parseInt(magblw, 10);
            magbrw = parseInt(magbrw, 10);
            magbtw = parseInt(magbtw, 10);
            magbbw = parseInt(magbbw, 10);
            var maxX = pw - magw - magblw - magbrw;
            var maxY = ph - magh - magbtw - magbbw;
            if (!contentOnly) {
                if (x < 0) x = 0;
                else if (x > maxX) x = maxX;
                if (y < 0) y = 0;
                else if (y > maxY) y = maxY;
                $("#magnifier").css("left", x + "px");
                $("#magnifier").css("top",
                    y + "px")
            }
            var factor = 2;
            var percentX = x / maxX;
            if (isRTL) percentX = 1 - percentX;
            var posX = (pw - magw / factor) * percentX;
            var posY = (ph - magh / factor) * y / maxY;
            if (isRTL) {
                posX = posX - pw / factor;
                posY = -posY
            } else {
                posX = -posX;
                posY = -posY
            }
            $("#mag_content").css("transform", "scale(" + factor + ") translate(" + posX + "px, " + posY + "px)")
        }

        function moveMagnifier(dx, dy) {
            var x = $("#magnifier").offset().left;
            var y = $("#magnifier").offset().top;
            x += dx;
            y += dy;
            positionMagnifier(x, y)
        }

        function handleScroll(ev) {
            if ($("#magnifier:visible").length == 0) return;
            var id = $(ev.target).attr("id");
            var scrollLeft = $(ev.target).scrollLeft();
            var scrollTop = $(ev.target).scrollTop();
            var qframe = $("#magnifier #" + id);
            qframe.scrollLeft(scrollLeft);
            qframe.scrollTop(scrollTop)
        }

        function addLineReader() {
            var x = $("#linereader").clone(false, false);
            $(x).attr("id", "mag_linereader");
            $("div", x).each(function() {
                var id = $(this).attr("id");
                if (id != null) $(this).attr("id", "mag_" + id)
            });
            $("#mag_content").append(x)
        }
        this.init = function() {
            var pos = resultStorage.getQuestionItem("magnifier");
            if (pos ==
                null) pos = {
                x: 50,
                y: 50
            };
            positionMagnifier(pos.x, pos.y);
            $(".ev_toolmag").click(function() {
                tools.magnifier.toggle()
            });
            $("#questionframe").scroll(handleScroll);
            $(".et2-scrollable").scroll(handleScroll);
            if (isEnabled("magnifier")) {
                this.enable();
                if (iev == null) iev = itemevent.start("magnifier")
            }
            $("#params").on("et2:clock:tick", function() {
                var x = $("#clock").html();
                $("#mag_clock").html(x)
            });
            $("#params").on("et2:linereader:resize", function() {
                $.each(["linereader", "linereader_top", "linereader_left", "linereader_right",
                    "linereader_bottom", "linereader_inner"
                ], function(i, val) {
                    var s = $("#" + val).attr("style");
                    $("#mag_" + val).attr("style", s)
                })
            });
            $("#params").on("et2:linereader:show", function() {
                addLineReader()
            });
            $("#params").on("et2:linereader:hide", function() {
                $("#mag_linereader").remove()
            })
        };
        this.toggle = function() {
            if ($("#magnifier:visible").length > 0) {
                this.disable();
                iev = itemevent.end(iev)
            } else {
                this.enable();
                iev = itemevent.start("magnifier")
            }
        };
        this.enable = function() {
            if ($(".ev_toolmag").length == 0) return;
            $("#magnifier").draggable({
                containment: "body",
                drag: function(event, ui) {
                    var x = ui.position.left;
                    var y = ui.position.top;
                    positionMagnifier(x, y, true)
                }
            });
            $("#magnifier").show();
            this.refresh();
            positionMagnifier($("#magnifier").offset().left, $("#magnifier").offset().top);
            $(window).on("resize", function() {
                $("#mag_viewport").css("width", $("#page").outerWidth(true) + "px");
                $("#mag_viewport").css("height", $("#page").outerHeight(true) + "px")
            });
            $(".ev_toolmag span").addClass("icon-ok");
            $(".ev_toolmag").attr("aria-checked", "true");
            setEnabled("magnifier")
        };
        this.disable =
            function() {
                $("#magnifier").hide();
                if (typeof tinymce !== "undefined") tinymce.remove("#mag_essay");
                $("#mag_content").empty();
                resultStorage.removeQuestionItem("magnifier");
                $(".ev_toolmag span").removeClass("icon-ok");
                $(".ev_toolmag").attr("aria-checked", "false");
                setDisabled("magnifier")
            };
        this.refresh = function() {
            if ($("#magnifier:visible").length < 1) return;
            $("#mag_content").empty();
            var html = $("#page").clone(false, false);
            var modals = $(".modal").clone(false, false);
            modals.appendTo(html);
            var backdrop = $(".modal-backdrop").clone(false,
                false);
            backdrop.appendTo(html);
            $(".mc-alt input", html).each(function() {
                var id = $(this).attr("id");
                id = "mag-" + id;
                $(this).attr("id", id)
            });
            $(".mc-alt input", html).attr("name", "mag-mcalt");
            $(".mce-tinymce", html).remove();
            $("#essayPlain", html).remove();
            $("#essay", html).show();
            $("#tbcont", html).attr("id", "mag_tbcont");
            $("#essay", html).attr("id", "mag_essay");
            $("#clock", html).attr("id", "mag_clock");
            $("#words-container", html).attr("id", "mag_words-container");
            $("#chars-container", html).attr("id", "mag_chars-container");
            $(".modal-backdrop", html).each(function() {
                $(this).attr("id", "mag-modal-backdrop");
                $(this).removeClass("fade")
            });
            $(".modal", html).each(function() {
                var id = $(this).attr("id");
                id = "mag-" + id;
                $(this).attr("id", id);
                $(this).removeClass("fade")
            });
            html.appendTo("#mag_content");
            $("#mag_tbcont").append($("#tbcont").clone(false, false));
            $("#mag_content .mc-alt-eliminator canvas").each(function() {
                var id = $(this).parent().data("alt");
                var e = $("#" + id).closest(".mc-alt");
                var c = $("canvas", e)[0];
                var context = $(this)[0].getContext("2d");
                context.drawImage(c, 0, 0)
            });
            if ($("#linereader_bottom:visible").length > 0) addLineReader();
            if (typeof tinymce !== "undefined") {
                tinymce.EditorManager.execCommand("mceRemoveEditor", true, "mag_essay");
                var tinline = $("#params").data("tinymceinline") || false;
                var mceparams = {
                    selector: "#mag_essay",
                    content_css: pageCSS,
                    body_class: bodyCSS,
                    theme: "modern",
                    schema: "html5",
                    menubar: false,
                    inline: tinline,
                    elementpath: false,
                    branding: false
                };
                if ($("#qtparams").data("formatted")) mceparams.toolbar = "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent";
                else mceparams.toolbar = false;
                if (tinline) mceparams.toolbar = false;
                tinymce.init(mceparams);
                var edE = tinymce.get("essay");
                var edME = tinymce.get("mag_essay");
                if (edE != null && edME != null) {
                    var x = edE.getContent();
                    edME.setContent(x)
                }
                var twidth = $(".mce-tinymce", "#page").width();
                var theight = $(".mce-tinymce", "#page").height();
                $(".mce-tinymce", "#mag_content").width(twidth);
                $(".mce-tinymce", "#mag_content").height(theight);
                var fwidth = $("#essay_ifr").width();
                var fheight = $("#essay_ifr").height();
                $("#mag_essay_ifr").width(fwidth);
                $("#mag_essay_ifr").height(fheight);
                if ($("#words-container").is(":visible")) {
                    var wcount = $("#words-container").html();
                    $("#mag_words-container").html(wcount);
                    $("#mag_words-container").width($("#words-container").width());
                    $("#mag_words-container").height($("#words-container").height())
                }
                if ($("#chars-container").is(":visible")) {
                    var ccount = $("#chars-container").html();
                    $("#mag_chars-container").html(ccount);
                    $("#mag_chars-container").width($("#chars-container").width());
                    $("#mag_chars-container").height($("#chars-container").height())
                }
            }
            $("[tabindex]",
                html).each(function() {
                $(this).attr("tabindex", "-1")
            });
            $("a", html).each(function() {
                $(this).attr("tabindex", "-1")
            });
            $("div", html).each(function() {
                $(this).attr("tabindex", "-1")
            });
            $(".modal").each(function() {
                var id = $(this).attr("id");
                if (id.indexOf("mag-") == 0) return true;
                if ($("#" + id).hasClass("in") || $("#" + id).is(":visible")) {
                    $("#mag-modal-backdrop").addClass("in");
                    $("#mag-" + id).show();
                    $("#mag-" + id).width($("#" + id).width());
                    $("#mag-" + id).height($("#" + id).height())
                } else {
                    $("#mag-modal-backdrop").removeClass("in");
                    $("#mag-" + id).hide()
                }
            });
            $("#mag_viewport").css("width", $("#page").outerWidth(true) + "px");
            $("#mag_viewport").css("height", $("#page").outerHeight(true) + "px");
            $("#magnifier").focus();
            $("#magnifier").on("keydown", function(evt) {
                var step = 10;
                if (evt.shiftKey) step = 1;
                if (evt.ctrlKey) step = 50;
                switch (evt.which) {
                    case 37:
                        moveMagnifier(-step, 0);
                        break;
                    case 38:
                        moveMagnifier(0, -step);
                        break;
                    case 39:
                        moveMagnifier(step, 0);
                        break;
                    case 40:
                        moveMagnifier(0, step);
                        break;
                    default:
                        return
                }
                evt.preventDefault()
            });
            handleScroll({
                target: "#questionframe"
            });
            $(".et2-scrollable").each(function() {
                var that = this;
                handleScroll({
                    target: that
                })
            })
        }
    };
    tools.eliminator = new function() {
        var iev;

        function saveEliminated() {
            var ids = [];
            $(".mc-alt.eliminated input").not("#magnifier .mc-alt input").each(function() {
                ids.push(this.id)
            });
            resultStorage.setQuestionItem("eliminator", {
                "ids": ids
            })
        }

        function restoreEliminated() {
            $(".mc-alt-eliminator-canvas").remove();
            var e = resultStorage.getQuestionItem("eliminator");
            if (e != null) $.each(e.ids, function(index, value) {
                var alt = $("#" + value).closest(".mc-alt");
                if (alt.length == 0) return;
                addElim(alt);
                addCross(alt)
            });
            setState()
        }

        function addCross(alt) {
            var elim = alt.find(".mc-alt-eliminator");
            var w = elim.width();
            var h = elim.height();
            elim.append("<canvas class='mc-alt-eliminator-canvas' width='" + w + "' height='" + h + "'></canvas>");
            var cv = elim.find(".mc-alt-eliminator-canvas");
            var color = cv.css("color");
            if (color == null) color = "#cc0000";
            var left = 22;
            var ctx = cv[0].getContext("2d");
            ctx.strokeStyle = color;
            ctx.lineWidth = "2";
            ctx.beginPath();
            ctx.moveTo(left, 2);
            ctx.lineTo(w, h - 2);
            ctx.moveTo(left,
                h - 2);
            ctx.lineTo(w, 2);
            ctx.stroke()
        }

        function removeCross(alt) {
            alt.find(".mc-alt-eliminator-canvas").remove()
        }

        function addElim(e) {
            $(e).addClass("eliminated");
            $(e).find("input").prop("disabled", true);
            $(e).find("input").prop("checked", false)
        }

        function removeElim(e) {
            $(e).removeClass("eliminated");
            if (!$(e).hasClass("masked")) $(e).find("input").prop("disabled", false)
        }

        function eliminate(alt) {
            addElim(alt);
            saveEliminated();
            setState();
            addCross(alt);
            tools.magnifier.refresh()
        }

        function uneliminate(alt) {
            removeElim(alt);
            saveEliminated();
            removeCross(alt);
            tools.magnifier.refresh()
        }
        this.init = function() {
            $("body").removeClass("answer-eliminator");
            $(".ev_eliminate").click(function(e) {
                var id = $(this).data("alt");
                var alt = $("#" + id).closest(".mc-alt");
                if (alt.hasClass("eliminated")) uneliminate(alt);
                else eliminate(alt);
                e.preventDefault()
            });
            $(".ev_uneliminate").click(function(e) {
                var id = $(this).data("alt");
                var alt = $("#" + id).closest(".mc-alt");
                uneliminate(alt);
                e.preventDefault()
            });
            $(".ev_toolelim").click(function() {
                tools.eliminator.toggle()
            });
            if (isEnabled("eliminator")) {
                this.enable();
                restoreEliminated();
                if (iev == null) iev = itemevent.start("eliminator")
            }
        };
        this.toggle = function() {
            if ($("body").hasClass("answer-eliminator")) {
                this.disable();
                iev = itemevent.end(iev)
            } else {
                this.enable();
                iev = itemevent.start("eliminator");
				
            }
        };
        this.enable = function() {
            if ($(".ev_toolelim").length == 0) return;
            $("body").addClass("answer-eliminator");
            $(".ev_toolelim span").addClass("icon-ok");
            $(".ev_toolelim").attr("aria-checked", "true");
            setEnabled("eliminator");
            restoreEliminated()
        };
        this.disable = function() {
            $("body").removeClass("answer-eliminator");
            $(".ev_toolelim span").removeClass("icon-ok");
            $(".ev_toolelim").attr("aria-checked", "false");
            setDisabled("eliminator");
            $(".mc-alt").each(function() {
                removeElim(this)
            })
        }
    };
    tools.highlighter = new function() {
        var highlighter;
        var iev;

        function saveHighlight() {
            var data = highlighter.serialize();
            resultStorage.setQuestionItem("highlighter", {
                "data": data
            });
            tools.magnifier.refresh()
        }

        function setHighlight() {
            if (!$("body").hasClass("highlighter")) return;
            var found = false;
            var sel = rangy.getSelection();
            var ranges = sel.getAllRanges();
            $.each(ranges, function(i, val) {
                var nodes = val.getNodes();
                $.each(nodes, function(i, val) {
                    if (val.nodeType == 3) val = val.parentNode;
                    if ($(val).hasClass("et2highlight")) found = true
                })
            });
            if (found) highlighter.unhighlightSelection();
            else highlighter.highlightSelection("et2highlight");
            $(".et2highlight").each(function() {
                if ($(this).data("hasClose") != undefined) return;
                $(this).data("hasClose", "1")
            });
            sel.removeAllRanges();
            saveHighlight()
        }
        var lastSelection =
            null;

        function checkSelectionMouse(evt) {
            if (!$("body").hasClass("highlighter")) return;
            if ($(evt.target).is("input")) return;
            setHighlight();
            lastSelection = null
        }

        function checkSelectionKey(evt) {
            if (!$("body").hasClass("highlighter")) return;
            var sel = rangy.getSelection();
            if (evt.which == 27) {
                lastSelection = null;
                sel.removeAllRanges();
                return
            }
            if (sel.isCollapsed) {
                if (lastSelection != null) {
                    rangy.deserializeSelection(lastSelection);
                    setHighlight();
                    lastSelection = null
                }
                return
            }
            lastSelection = rangy.serializeSelection(sel, true)
        }

        function highlightSelection(evt) {
            if (!$("body").hasClass("highlighter")) return;
            if (lastSelection != null) {
                rangy.deserializeSelection(lastSelection);
                setHighlight();
                lastSelection = null;
                evt.preventDefault()
            }
        }
		
        this.init = function() {
			 
            var that = this;
            $("#params").off("et2:highlighter:init");
            $("#params").on("et2:highlighter:init", function() {
				
                rangy.init();
                highlighter = rangy.createHighlighter();
                highlighter.addClassApplier(rangy.createClassApplier("et2highlight", {
                    ignoreWhiteSpace: true,
                    tagNames: ["span", "a"]
                }));
                var d = resultStorage.getQuestionItem("highlighter");
                if (d != null) highlighter.deserialize(d.data);
                $("body").mouseup(checkSelectionMouse);
                $("body").mousedown(highlightSelection);
                $("body").keyup(checkSelectionKey);
                $(".ev_clearhighlight").click(function() {
                    highlighter.removeAllHighlights();
                    saveHighlight()
                });
				
                $(".ev_toolhigh").click(function() {
					
                    tools.highlighter.toggle()
                });
				
                if (isEnabled("highlighter")) {
                    that.enable();
                    if (iev == null) iev = itemevent.start("highlighter")
                }
            });
            $("#params").trigger("et2:highlighter:ready")
        };
        this.toggle = function() {
            if ($("body").hasClass("highlighter")) {
                this.disable();
                iev = itemevent.end(iev)
            } else {
                this.enable();
                iev = itemevent.start("highlighter");
				 
            }
        };
        this.enable = function() {
            if ($(".ev_toolhigh").length == 0) return;
            $("body").addClass("highlighter");
            $(".ev_toolhigh span").addClass("icon-ok");
            $(".ev_toolhigh").attr("aria-checked", "true");
            enableButton(".ev_clearhighlight");
            setEnabled("highlighter")
        };
        this.disable = function() {
            $("body").removeClass("highlighter");
            $(".ev_toolhigh span").removeClass("icon-ok");
            $(".ev_toolhigh").attr("aria-checked", "false");
            disableButton(".ev_clearhighlight");
            setDisabled("highlighter")
        }
    };
    tools.masking = new function() {
        var iev;

        function saveMaskState() {
            var masked = [];
            $(".mc-alt").each(function(i, e) {
                masked[i] = $(e).hasClass("masked")
            });
            resultStorage.setQuestionItem("masked", masked)
        }

        function restoreMaskState() {
            var masked = resultStorage.getQuestionItem("masked");
            if (masked == null) return;
            $(".mc-alt").each(function(i, e) {
                if (masked[i]) addMask(e);
                else removeMask(e)
            });
            setState()
        }

        function addMask(e) {
            $(e).find("input").prop("disabled", true);
            $(e).addClass("masked");
            var id =
                $(e).find("input").prop("id");
            $("#mask_" + id + " span").removeClass("icon-eye-close");
            $("#mask_" + id + " span").addClass("icon-eye-open")
        }

        function removeMask(e) {
            if (!$(e).hasClass("eliminated")) $(e).find("input").prop("disabled", false);
            $(e).removeClass("masked");
            var id = $(e).find("input").prop("id");
            $("#mask_" + id + " span").removeClass("icon-eye-open");
            $("#mask_" + id + " span").addClass("icon-eye-close")
        }

        function maskAlt(id) {
            addMask($("#" + id).closest(".mc-alt"));
            tools.magnifier.refresh();
            saveMaskState();
            setState()
        }

        function unmaskAlt(id) {
            removeMask($("#" + id).closest(".mc-alt"));
            tools.magnifier.refresh();
            saveMaskState();
            setState()
        }
        this.init = function() {
            $(".ev_toolmask").click(function() {
                tools.masking.toggle()
            });
            $(".ev_mask_toggle").click(function() {
                var id = $(this).data("alt");
                if ($("#" + id).closest(".mc-alt").hasClass("masked")) unmaskAlt(id);
                else maskAlt(id)
            });
            $(".ev_mask_disable").click(function() {
                var id = $(this).data("alt");
                unmaskAlt(id)
            });
            $("body").removeClass("masking");
            if (isEnabled("masking")) {
                this.enable();
                restoreMaskState();
                if (iev == null) iev = itemevent.start("masking")
            }
        };
        this.toggle = function() {
            if ($("body").hasClass("masking")) {
                this.disable();
                iev = itemevent.end(iev)
            } else {
                this.enable();
                iev = itemevent.start("masking")
            }
        };
        this.enable = function() {
            if ($(".ev_toolmask").length == 0) return;
            $("body").addClass("masking");
            $(".ev_toolmask span").addClass("icon-ok");
            $(".ev_toolmask").attr("aria-checked", "true");
            setEnabled("masking");
            if (!isAnswered()) {
                $(".mc-alt").each(function(i, e) {
                    addMask(e)
                });
                setState()
            }
            restoreMaskState()
        };
        this.disable = function() {
            $("body").removeClass("masking");
            $(".mc-alt").each(function(i, e) {
                removeMask(e)
            });
            $(".ev_toolmask span").removeClass("icon-ok");
            $(".ev_toolmask").attr("aria-checked", "false");
            setDisabled("masking")
        }
    };
    tools.zoom = new function() {
        function setZoom(level, init) {
            var isRTL = $("body").css("direction") == "rtl";
            var origin = isRTL ? "top right" : "top left";
            resultStorage.setItem("zoom", level);
            $("body").css({
                "transform": "scale(" + level + ")",
                "transform-origin": origin
            });
            var per = Math.round(level * 100) +
                "%";
            if (!init) {
                window.scrollTo(0, 0);
                $("#zoomcontent").html(per);
                $("#zoompopup").dialog("open")
            }
        }
        this.init = function() {
            $("#zoomtoolbar").removeClass("hide");
            var level = resultStorage.getItem("zoom");
            if (level == undefined) level = 1;
            var per = Math.round(level * 100) + "%";
            $("#zoomcontent").html(per);
            $("#zoompopup").dialog({
                autoOpen: false,
                show: "fade",
                hide: "fade",
                draggable: false,
                position: {
                    my: "left top",
                    at: "left top",
                    of: window
                },
                maxHeight: 30,
                width: "auto",
                height: 50,
                open: function(event, ui) {
                    setTimeout(function() {
                            $("#zoompopup").dialog("close")
                        },
                        1E3)
                }
            });
            $("#zoompopup").siblings(".ui-dialog-titlebar").hide();
            setZoom(level, true);
            $(".ev_zoomin").click(function() {
                if ($(".ev_zoomin").hasClass("disabled")) return false;
                var level = resultStorage.getItem("zoom");
                level += .2;
                setZoom(level);
                if (level >= 5) $(".ev_zoomin").addClass("disabled");
                $(".ev_zoomout").removeClass("disabled")
            });
            $(".ev_zoomout").click(function() {
                if ($(".ev_zoomout").hasClass("disabled")) return false;
                var level = resultStorage.getItem("zoom");
                level -= .2;
                if (level < .5) level = .5;
                setZoom(level);
                if (level <=
                    .5) $(".ev_zoomout").addClass("disabled");
                $(".ev_zoomin").removeClass("disabled")
            });
            $(".ev_zoomreset").click(function() {
                setZoom(1);
                $(".ev_zoomin").removeClass("disabled");
                $(".ev_zoomout").removeClass("disabled")
            })
        };
        this.toggle = function() {};
        this.enable = function() {};
        this.disable = function() {}
    };
    tools.linereader = new function() {
        var iev;
        var initial = {};

        function getZoomLevel() {
            var level = resultStorage.getItem("zoom");
            if (level == undefined || level <= 0) return 1;
            return level
        }

        function offset(selector) {
            var top = parseInt($(selector).css("top"));
            top = isNaN(top) ? 0 : top;
            var left = parseInt($(selector).css("left"));
            left = isNaN(left) ? 0 : left;
            var pos = {
                top: top,
                left: left
            };
            return pos
        }

        function z(coord) {
            if (initial.level == null) return coord;
            return coord / initial.level
        }

        function handleResizeStartOuter(event, ui) {
            $(".linereader").addClass("lr-transparent");
            initial.level = getZoomLevel();
            initial.ipos = offset("#linereader_inner");
            initial.iwidth = $("#linereader_inner").width();
            initial.iheight = $("#linereader_inner").height();
            initial.isRTL = $("body").css("direction") == "rtl";
            initial.cpos = offset("#page");
            initial.cpos.left += parseInt($("#page").css("marginLeft"));
            initial.cpos.top += parseInt($("#page").css("marginTop"));
            initial.cpos.left++;
            initial.cpos.top++;
            initial.cwidth = $("#page").width() - 2;
            initial.cheight = $("#page").height() - 4
        }

        function handleResizeStopOuter(event, ui) {
            $(".linereader").removeClass("lr-transparent");
            savePosition();
            tools.magnifier.refresh()
        }

        function handleResizeOuter(event, ui) {
            var xdelta = z(ui.size.width) - z(ui.originalSize.width);
            var ydelta = z(ui.size.height) -
                z(ui.originalSize.height);
            ui.size.width = ui.originalSize.width + xdelta;
            ui.size.height = ui.originalSize.height + ydelta;
            if (ui.size.width < lr_omin_w) ui.size.width = lr_omin_w;
            if (ui.size.height < lr_omin_h) ui.size.height = lr_omin_h;
            xdelta = z(ui.position.left) - z(ui.originalPosition.left);
            ydelta = z(ui.position.top) - z(ui.originalPosition.top);
            ui.position.left = ui.originalPosition.left + xdelta;
            ui.position.top = ui.originalPosition.top + ydelta;
            if (initial.isRTL) {
                var minright = initial.ipos.left + initial.iwidth + 5;
                if (ui.position.left +
                    ui.size.width < minright) ui.size.width = minright - ui.position.left;
                var maxleft = initial.ipos.left - 5;
                if (ui.position.left > maxleft) ui.position.left = maxleft
            } else {
                var maxleft = initial.ipos.left - 5;
                if (ui.position.left > maxleft) {
                    var dx = ui.position.left - maxleft;
                    ui.position.left = maxleft;
                    ui.size.width += dx
                }
            }
            var maxtop = initial.ipos.top - 5;
            if (ui.position.top > maxtop) {
                var dy = ui.position.top - maxtop;
                ui.position.top = maxtop;
                ui.size.height += dy
            }
            if (ui.position.left < initial.cpos.left) {
                var dx = initial.cpos.left - ui.position.left;
                ui.position.left +=
                    dx;
                ui.size.width -= dx
            }
            if (ui.position.top < initial.cpos.top) {
                var dy = initial.cpos.top - ui.position.top;
                ui.position.top += dy;
                ui.size.height -= dy
            }
            if (ui.position.left + ui.size.width > initial.cpos.left + initial.cwidth) ui.size.width = initial.cpos.left + initial.cwidth - ui.position.left;
            if (ui.position.top + ui.size.height > initial.cpos.top + initial.cheight) ui.size.height = initial.cpos.top + initial.cheight - ui.position.top;
            $("#linereader").css("top", ui.position.top + "px");
            $("#linereader").css("left", ui.position.left + "px");
            $("#linereader").css("width",
                ui.size.width + "px");
            $("#linereader").css("height", ui.size.height + "px");
            calcSides()
        }

        function handleDragStartOuter(event, ui) {
            $(".linereader").addClass("lr-transparent");
            var dpos = offset(this);
            initial.dpos = dpos;
            initial.dwidth = $(this).width();
            initial.dheight = $(this).height();
            initial.level = getZoomLevel();
            initial.isRTL = $("body").css("direction") == "rtl";
            var opos = offset("#linereader");
            var ipos = offset("#linereader_inner");
            initial.innerDeltaTop = ipos.top - opos.top;
            initial.innerDeltaLeft = ipos.left - opos.left;
            initial.cpos =
                offset("#page");
            initial.cpos.left += parseInt($("#page").css("marginLeft"));
            initial.cpos.top += parseInt($("#page").css("marginTop"));
            initial.cpos.left++;
            initial.cpos.top++;
            initial.cwidth = $("#page").width() - 2;
            initial.cheight = $("#page").height() - 4
        }

        function handleDragStopOuter(event, ui) {
            $(".linereader").removeClass("lr-transparent");
            savePosition();
            tools.magnifier.refresh()
        }

        function handleDragOuter(event, ui) {
            var xdelta = z(ui.position.left) - initial.dpos.left;
            var ydelta = z(ui.position.top) - initial.dpos.top;
            ui.position.left = initial.dpos.left + xdelta;
            ui.position.top = initial.dpos.top + ydelta;
            if (ui.position.left < initial.cpos.left) ui.position.left = initial.cpos.left;
            if (ui.position.top < initial.cpos.top) ui.position.top = initial.cpos.top;
            if (ui.position.left + initial.dwidth > initial.cpos.left + initial.cwidth) ui.position.left = initial.cpos.left + initial.cwidth - initial.dwidth;
            if (ui.position.top + initial.dheight > initial.cpos.top + initial.cheight) ui.position.top = initial.cpos.top + initial.cheight - initial.dheight;
            $("#linereader_inner").css("top",
                ui.position.top + initial.innerDeltaTop + "px");
            $("#linereader_inner").css("left", ui.position.left + initial.innerDeltaLeft + "px")
        }

        function handleResizeStartInner(event, ui) {
            $(".linereader").addClass("lr-transparent");
            initial.level = getZoomLevel();
            initial.opos = offset("#linereader");
            initial.owidth = $("#linereader").width();
            initial.oheight = $("#linereader").height();
            initial.ipos = offset("#linereader_inner");
            initial.isRTL = $("body").css("direction") == "rtl"
        }

        function handleResizeStopInner(event, ui) {
            $(".linereader").removeClass("lr-transparent");
            savePosition();
            tools.magnifier.refresh()
        }

        function handleResizeInner(event, ui) {
            var xdelta = z(ui.size.width) - z(ui.originalSize.width);
            var ydelta = z(ui.size.height) - z(ui.originalSize.height);
            ui.size.width = ui.originalSize.width + xdelta;
            ui.size.height = ui.originalSize.height + ydelta;
            xdelta = z(ui.position.left) - z(ui.originalPosition.left);
            ydelta = z(ui.position.top) - z(ui.originalPosition.top);
            ui.position.left = ui.originalPosition.left + xdelta;
            ui.position.top = ui.originalPosition.top + ydelta;
            if (ui.size.width < 20) {
                var dx =
                    20 - ui.size.width;
                ui.size.width += dx;
                if (ui.position.left > ui.originalPosition.left) ui.position.left -= dx
            }
            if (ui.size.height < 35) {
                var dy = 35 - ui.size.height;
                ui.size.height += dy;
                if (ui.position.top > ui.originalPosition.top) ui.position.top -= dy
            }
            var mintop = initial.opos.top + 5;
            var maxbottom = initial.opos.top + initial.oheight - 5;
            var minleft = initial.opos.left + 5;
            var maxright = initial.opos.left + initial.owidth - 5;
            if (ui.position.top + ui.size.height > maxbottom) ui.size.height = maxbottom - ui.position.top;
            if (ui.position.left + ui.size.width >
                maxright) ui.size.width = maxright - ui.position.left;
            if (ui.position.top < mintop) {
                var dy = ui.position.top - mintop;
                ui.position.top = mintop;
                ui.size.height += dy
            }
            if (ui.position.left < minleft) {
                var dx = ui.position.left - minleft;
                ui.position.left = minleft;
                ui.size.width += dx
            }
            $("#linereader_inner").css("top", ui.position.top + "px");
            $("#linereader_inner").css("left", ui.position.left + "px");
            $("#linereader_inner").css("width", ui.size.width + "px");
            $("#linereader_inner").css("height", ui.size.height + "px");
            calcSides()
        }

        function handleDragStartInner(event,
            ui) {
            $(".linereader").addClass("lr-transparent");
            $("#linereader_inner").addClass("lr-transparent");
            var dpos = offset(this);
            initial.dpos = dpos;
            initial.iwidth = $("#linereader_inner").width();
            initial.iheight = $("#linereader_inner").height();
            initial.opos = offset("#linereader");
            initial.owidth = $("#linereader").width();
            initial.oheight = $("#linereader").height();
            initial.level = getZoomLevel()
        }

        function handleDragStopInner(event, ui) {
            $(".linereader").removeClass("lr-transparent");
            $("#linereader_inner").removeClass("lr-transparent");
            calcSides();
            savePosition();
            tools.magnifier.refresh()
        }

        function handleDragInner(event, ui) {
            var xdelta = z(ui.position.left) - initial.dpos.left;
            var ydelta = z(ui.position.top) - initial.dpos.top;
            ui.position.left = initial.dpos.left + xdelta;
            ui.position.top = initial.dpos.top + ydelta;
            var minleft = initial.opos.left + 5;
            var maxleft = initial.opos.left + initial.owidth - 5 - initial.iwidth;
            var mintop = initial.opos.top + 5;
            var maxtop = initial.opos.top + initial.oheight - 5 - initial.iheight;
            if (ui.position.left < minleft) ui.position.left = minleft;
            if (ui.position.left > maxleft) ui.position.left = maxleft;
            if (ui.position.top < mintop) ui.position.top = mintop;
            if (ui.position.top > maxtop) ui.position.top = maxtop;
            calcSides()
        }

        function calcSides() {
            var ow = $("#linereader").width();
            var oh = $("#linereader").height();
            var opos = offset("#linereader");
            var iw = $("#linereader_inner").width();
            var ih = $("#linereader_inner").height();
            var ipos = offset("#linereader_inner");
            var isRTL = $("body").css("direction") == "rtl";
            var top_h = ipos.top - opos.top;
            var left_y = top_h;
            var left_w = ipos.left -
                opos.left;
            var left_h = ih;
            var right_y = top_h;
            var right_w = ow - iw - left_w;
            var right_h = ih;
            var bottom_y = top_h + left_h;
            var bottom_h = oh - bottom_y;
            $("#linereader_top").css("width", ow + "px");
            $("#linereader_top").css("height", top_h + "px");
            if (isRTL) {
                var tmp;
                tmp = left_y;
                left_y = right_y;
                right_y = tmp;
                tmp = left_w;
                left_w = right_w;
                right_w = tmp;
                tmp = left_h;
                left_h = right_h;
                right_h = tmp
            }
            $("#linereader_left").css("top", left_y + "px");
            $("#linereader_left").css("width", left_w + "px");
            $("#linereader_left").css("height", left_h + "px");
            $("#linereader_right").css("top",
                right_y + "px");
            $("#linereader_right").css("width", right_w + "px");
            $("#linereader_right").css("height", right_h + "px");
            $("#linereader_bottom").css("top", bottom_y + "px");
            $("#linereader_bottom").css("width", ow + "px");
            $("#linereader_bottom").css("height", bottom_h + "px");
            var omin_w = left_w + iw + 5;
            var omin_h = top_h + ih + 5;
            lr_omin_w = omin_w;
            lr_omin_h = omin_h;
            $("#params").trigger("et2:linereader:resize")
        }

        function savePosition() {
            var outer = $("#linereader");
            var inner = $("#linereader_inner");
            var opos = offset("#linereader");
            var ipos =
                offset("#linereader_inner");
            var pos = {
                outer: {
                    x: opos.left,
                    y: opos.top,
                    w: outer.width(),
                    h: outer.height()
                },
                inner: {
                    x: ipos.left,
                    y: ipos.top,
                    w: inner.width(),
                    h: inner.height()
                }
            };
            resultStorage.setQuestionItem("linereader", pos)
        }

        function restorePosition() {
            var pos = resultStorage.getQuestionItem("linereader");
            if (pos == null) {
                focusFirstLine();
                return
            }
            $("#linereader").css("top", pos.outer.y + "px");
            $("#linereader").css("left", pos.outer.x + "px");
            $("#linereader").css("width", pos.outer.w + "px");
            $("#linereader").css("height", pos.outer.h +
                "px");
            $("#linereader_inner").css("top", pos.inner.y + "px");
            $("#linereader_inner").css("left", pos.inner.x + "px");
            $("#linereader_inner").css("width", pos.inner.w + "px");
            $("#linereader_inner").css("height", pos.inner.h + "px");
            calcSides()
        }

        function handle_key_inner(evt) {
            var outer = $("#linereader");
            var obj = $("#linereader_inner");
            var opos = offset("#linereader");
            var ipos = offset("#linereader_inner");
            var ui = {
                position: {
                    left: 0,
                    top: 0
                },
                size: {
                    width: 0,
                    height: 0
                }
            };
            var border = {
                top: parseInt(obj.css("border-top-width")),
                left: parseInt(obj.css("border-left-width")),
                bottom: parseInt(obj.css("border-bottom-width")),
                right: parseInt(obj.css("border-right-width"))
            };
            var level = getZoomLevel();
            ui.position.left = ipos.left;
            ui.position.top = ipos.top;
            ui.size.width = obj.width();
            ui.size.height = obj.height();
            var isRTL = $("body").css("direction") == "rtl";
            var step = 10;
            if (evt.shiftKey) step = 1;
            if (evt.ctrlKey) step = 50;
            step = step / level;
            switch (evt.which) {
                case 37:
                    if (evt.altKey)
                        if (isRTL) {
                            ui.position.left -= step / level;
                            ui.size.width += step
                        } else ui.size.width -= step;
                    else ui.position.left -= step;
                    break;
                case 38:
                    if (evt.altKey) ui.size.height -= step;
                    else ui.position.top -= step;
                    break;
                case 39:
                    if (evt.altKey)
                        if (isRTL) {
                            ui.position.left += step / level;
                            ui.size.width -= step
                        } else ui.size.width += step;
                    else ui.position.left += step;
                    break;
                case 40:
                    if (evt.altKey) ui.size.height += step;
                    else ui.position.top += step;
                    break;
                default:
                    return
            }
            var oui = {
                position: {
                    left: 0,
                    top: 0
                },
                size: {
                    width: 0,
                    height: 0
                }
            };
            oui.position.left = opos.left;
            oui.position.top = opos.top;
            oui.size.width = outer.width();
            oui.size.height = outer.height();
            if (!check_inner(ui, oui)) {
                evt.preventDefault();
                return
            }
            if (evt.altKey) {
                $("#linereader_inner").css("top", ui.position.top + "px");
                $("#linereader_inner").css("left", ui.position.left + "px");
                $("#linereader_inner").css("width", ui.size.width + "px");
                $("#linereader_inner").css("height", ui.size.height + "px");
                calcSides();
                evt.preventDefault();
                return
            }
            $("#linereader_inner").css("top", ui.position.top + "px");
            $("#linereader_inner").css("left", ui.position.left + "px");
            calcSides();
            evt.preventDefault()
        }

        function check_inner(ui, outer_ui) {
            if (ui.size.width < 20) return false;
            if (ui.size.height <
                35) return false;
            var ow = outer_ui.size.width;
            var oh = outer_ui.size.height;
            var mintop = outer_ui.position.top + 5;
            var maxbottom = outer_ui.position.top + oh - 5;
            var minleft = outer_ui.position.left + 5;
            var maxright = outer_ui.position.left + ow - 5;
            if (ui.position.top < mintop) return false;
            if (ui.position.top + ui.size.height > maxbottom) return false;
            if (ui.position.left < minleft) return false;
            if (ui.position.left + ui.size.width > maxright) return false;
            return true
        }

        function handle_key(evt) {
            var container = $("#page");
            var cpos = offset("#page");
            var obj = $("#linereader");
            var inner = $("#linereader_inner");
            var ui = {
                position: {
                    left: 0,
                    top: 0
                },
                size: {
                    width: 0,
                    height: 0
                }
            };
            var opos = offset("#linereader");
            var ipos = offset("#linereader_inner");
            innerDeltaTop = ipos.top - opos.top;
            innerDeltaLeft = ipos.left - opos.left;
            var level = getZoomLevel();
            ui.position.left = opos.left;
            ui.position.top = opos.top;
            ui.size.width = obj.width();
            ui.size.height = obj.height();
            var isRTL = $("body").css("direction") == "rtl";
            var step = 10;
            if (evt.shiftKey) step = 1;
            if (evt.ctrlKey) step = 50;
            switch (evt.which) {
                case 37:
                    if (evt.altKey)
                        if (isRTL) {
                            ui.position.left -=
                                step / level;
                            ui.size.width += step
                        } else ui.size.width -= step;
                    else ui.position.left -= step / level;
                    break;
                case 38:
                    if (evt.altKey) ui.size.height -= step;
                    else ui.position.top -= step / level;
                    break;
                case 39:
                    if (evt.altKey)
                        if (isRTL) {
                            ui.position.left += step / level;
                            ui.size.width -= step
                        } else ui.size.width += step;
                    else ui.position.left += step / level;
                    break;
                case 40:
                    if (evt.altKey) ui.size.height += step;
                    else ui.position.top += step / level;
                    break;
                default:
                    return
            }
            if (!check_outer(ui, container, inner, cpos, ipos)) {
                evt.preventDefault();
                return
            }
            if (evt.altKey) {
                $("#linereader").css("top",
                    ui.position.top + "px");
                $("#linereader").css("left", ui.position.left + "px");
                $("#linereader").css("width", ui.size.width + "px");
                $("#linereader").css("height", ui.size.height + "px");
                calcSides();
                evt.preventDefault();
                return
            }
            $("#linereader").css("top", ui.position.top + "px");
            $("#linereader").css("left", ui.position.left + "px");
            $("#linereader_inner").css("top", ui.position.top + innerDeltaTop + "px");
            $("#linereader_inner").css("left", ui.position.left + innerDeltaLeft + "px");
            evt.preventDefault();
            $("#params").trigger("et2:linereader:resize")
        }

        function check_outer(ui, outer, inner, opos, ipos) {
            var outer_w = outer.width();
            var outer_h = outer.height();
            var outer_x = opos.left;
            var outer_y = opos.top;
            var obj = $("#linereader");
            var border = {
                top: parseInt(obj.css("border-top-width")),
                left: parseInt(obj.css("border-left-width")),
                bottom: parseInt(obj.css("border-bottom-width")),
                right: parseInt(obj.css("border-right-width"))
            };
            if (ui.position.left < outer_x) return false;
            if (ui.position.left + ui.size.width + border.left + border.right > outer_x + outer_w) return false;
            if (ui.position.top <
                outer_y) return false;
            if (ui.position.top + ui.size.height + border.top + border.bottom > outer_y + outer_h) return false;
            var inner = $("#linereader_inner");
            var border = {
                top: parseInt(inner.css("border-top-width")),
                left: parseInt(inner.css("border-left-width")),
                bottom: parseInt(inner.css("border-bottom-width")),
                right: parseInt(inner.css("border-right-width"))
            };
            var iui = {
                position: {
                    left: 0,
                    top: 0
                },
                size: {
                    width: 0,
                    height: 0
                }
            };
            iui.position.left = ipos.left;
            iui.position.top = ipos.top;
            iui.size.width = inner.width();
            iui.size.height = inner.height();
            return check_inner(iui, ui)
        }

        function findFirstText(el) {
            var pos = {};
            var tmprange = document.createRange();
            $(el).contents().each(function() {
                if ($(this).text().trim()) {
                    tmprange.selectNodeContents($(this)[0]);
                    var rect = tmprange.getBoundingClientRect();
                    if (pos.top == null || rect.top < pos.top) pos.top = rect.top;
                    if (pos.left == null || rect.left < pos.left) pos.left = rect.left;
                    if (pos.right == null || rect.right > pos.right) pos.right = rect.right
                }
            });
            if (pos.left != null && pos.right != null) pos.width = pos.right - pos.left + 10;
            return pos.left == null ?
                null : pos
        }

        function focusFirstLine() {
            var pos = findFirstText($("#itext"));
            if (!pos) pos = findFirstText($("#qtext"));
            if (true || !pos) {
                $("#linereader").css("top", "100px");
                $("#linereader").css("left", "180px");
                $("#linereader").css("width", "400px");
                $("#linereader").css("height", "300px");
                $("#linereader_inner").css("top", "118px");
                $("#linereader_inner").css("left", "195px");
                $("#linereader_inner").css("width", "180px");
                $("#linereader").css("height", "300px");
                calcSides();
                return
            }
            var opos = offset("#linereader");
            $("#linereader").css("top",
                pos.top - 20 + "px");
            $("#linereader").css("left", pos.left - 20 + "px");
            $("#linereader").css("width", pos.width + 40 + "px");
            $("#linereader_inner").css("top", pos.top + "px");
            $("#linereader_inner").css("left", pos.left - 4 + "px");
            $("#linereader_inner").css("width", pos.width + "px");
            calcSides()
        }
        this.init = function() {
            $("#linereader").resizable({
                minHeight: -1E3,
                minWidth: -1E3,
                handles: "e, w, n, s, ne, nw, se, sw",
                start: handleResizeStartOuter,
                stop: handleResizeStopOuter,
                resize: handleResizeOuter
            }).draggable({
                start: handleDragStartOuter,
                stop: handleDragStopOuter,
                drag: handleDragOuter
            });
            $("#linereader_inner").resizable({
                minHeight: -1E3,
                minWidth: -1E3,
                handles: "e, w, n, s, ne, nw, se, sw",
                start: handleResizeStartInner,
                stop: handleResizeStopInner,
                resize: handleResizeInner
            }).draggable({
                start: handleDragStartInner,
                stop: handleDragStopInner,
                drag: handleDragInner
            });
            if ($("body").css("direction") == "rtl") {
                $("#linereader .ui-resizable-se").removeClass("ui-icon");
                $("#linereader .ui-resizable-sw").addClass("ui-icon").addClass("ui-icon-gripsmall-diagonal-sw");
                $("#linereader_inner .ui-resizable-se").removeClass("ui-icon");
                $("#linereader_inner .ui-resizable-sw").addClass("ui-icon").addClass("ui-icon-gripsmall-diagonal-sw")
            }
            $("#linereader").on("keydown", handle_key);
            $("#linereader_inner").on("keydown", handle_key_inner);
            $(window).resize(calcSides);
            
            if (isEnabled("linereader")) {
                this.enable();
                restorePosition();
                if (iev == null) iev = itemevent.start("linereader")
            }
        };
        this.toggle = function() {
            if ($("#linereader_bottom:visible").length >
                0) {
                this.disable();
                iev = itemevent.end(iev)
            } else {
                this.enable();
                restorePosition();
                iev = itemevent.start("linereader")
            }
        };
        this.enable = function() {
            if ($(".ev_toolliner").length == 0) return;
            $("#linereader").show();
            $("#linereader_inner").show();
            $("#linereader").focus();
            $(".ev_toolliner span").addClass("icon-ok");
            $(".ev_toolliner").attr("aria-checked", "true");
            setEnabled("linereader");
            $("#params").trigger("et2:linereader:show");
            calcSides()
        };
        this.disable = function() {
            savePosition();
            $("#linereader").hide();
            $("#linereader_inner").hide();
            $(".ev_toolliner span").removeClass("icon-ok");
            $(".ev_toolliner").attr("aria-checked", "false");
            setDisabled("linereader");
            $("#params").trigger("et2:linereader:hide")
        }
    };
    tools.init = function() {
        toolList = resultStorage.getItem("tools");
        if (toolList == null) toolList = {};
        setTimeout(function() {
            tools.magnifier.init()
        }, 500);
        tools.eliminator.init();
        tools.highlighter.init();
        tools.masking.init();
        tools.zoom.init();
        tools.linereader.init()
    }
	 $(".ev_toolhigh").click(function() {
					 
                    tools.highlighter.toggle()
                });
	$(".ev_toolliner").click(function() {
                tools.linereader.toggle()
            });			
				
})(window.tools = window.tools || {}, jQuery);