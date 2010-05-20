
$(function on_document_ready(){
    window.hist = [];

    $("body").layout({south__resizable: false,
		      south__spacing_open:0});

    var prompt_hist_pos, current_prompt_val;
    var prompt = $("#prompt")
	.blur(function(){
	    setTimeout(function(){prompt.focus()});
	})
	.focus()
	.keydown(function(ev){
	    window.x = ev;
	    switch (ev.which) {
	    case 13: // enter
		repl();
		setTimeout(function(){current_prompt_val = prompt.val();});
		prompt_hist_pos = null;
		return false;
	    case 38: // arrow ^
		if (hist.length > 0) {
		    if (prompt_hist_pos === null) {
			prompt_hist_pos = hist.length - 1;
		    } else if (prompt_hist_pos > 0) {
			prompt_hist_pos -= 1;
		    }
		    prompt.val(hist[prompt_hist_pos]["in"]);		    
		}
		return false;
	    case 40: // arrow v
		if (prompt_hist_pos != null){
		    prompt_hist_pos += 1;
		    if (prompt_hist_pos >= hist.length){
			prompt_hist_pos = null;
			prompt.val(current_prompt_val);
		    } else {
			prompt.val(hist[prompt_hist_pos]["in"]);
		    }
		}
		return false;
	    default:
		setTimeout(function(){current_prompt_val = prompt.val();});
		prompt_hist_pos = null;
		return true;
	    }
	});

    var echo = $("#echo");

    function repl(){
	var v = prompt.val();
	var hist_entry = {"in":v};
	var line = $("<div>").addClass("line ui-state-highlight");
	if (v.length > 0){
	    line.append($("<div>")
			.text("> " + v)
			.addClass("in"));
	    prompt.val("");
	    var resp = $("<pre>");
	    var resp_class = "";
	    var resp_text = "";
	    try{
		var r = eval(v);
		hist_entry.out = r;
		resp_text = prettyPrint(r, {
		    maxDepth:1
		});
		resp_class = "out";
	    } catch (err) {
		hist_entry.out = err;
		resp_text = String(err.stack);
		resp_class = "out ui-state-error-text";
	    }
	    line.append(resp.html(resp_text).addClass(resp_class));
	    hist.push(hist_entry);
	    echo.append(line.attr("id", "line_"+hist.length));
	    
	    echo.scrollTop(echo.scrollTop() + line.offset().top);
	}
    }
}); 