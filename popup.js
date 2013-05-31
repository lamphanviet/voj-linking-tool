// Copyright (c) 2012 Lam Phan Viet. All rights reserved.
// Contact: lamphanviet@gmail.com

// Google analytics code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-37158283-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
// end - Google analytics code

var domain = ["http://vn.spoj.com", "http://vnoi.info"];
var nlinks = 0, links = [];
links[++nlinks] = "http://vn.spoj.com/problems/"; // problem statement (VOJ)
links[++nlinks] = "http://vn.spoj.com/submit/"; // submit (VOJ)
links[++nlinks] = "http://vn.spoj.com/status/"; // submissions (VOJ)
links[++nlinks] = "http://vn.spoj.com/ranks/"; // ranking (VOJ)
links[++nlinks] = "http://vnoi.info/index.php?option=com_voj2&page=problem&problem="; // statement (VNOI)

function getId(id) {
	return document.getElementById(id);
}

function isDigit(charCode) {
	return (48 <= charCode && charCode <= 57);
}

function isUpper(charCode) {
	return (65 <= charCode && charCode <= 90);
}

function getProblemHistory() {
	var res = localStorage.getItem("problems");
	if (res == null) {
		localStorage.setItem("problems", "NKTEAM");
		return getProblemHistory();
	}
	return res.split("|");
}

function setProblemHistory(history) {
	localStorage.setItem("problems", history.join("|"));
}

function addProblem(problem) {
	var problems = getProblemHistory();
	var newProblems = [ problem ];
	for (var i = 0; i < problems.length; i++) {
		if (problems[i] != problem)
			newProblems.push(problems[i]);
		if (newProblems.length >= 10) break; // remember only the last 10 problems
	}
	setProblemHistory(newProblems); // store into localStorage
}

function changeLinks(problem) { // update links
	for (var i = 1; i <= nlinks; i++) {
		$("#link_" + i).attr("href", links[i] + problem);
	}
	$("#search").attr("value", problem);
	$("#problem").attr("value", problem);
	addProblem(problem);
}

function updateProblemList() {
	var list = getProblemHistory();
	$("#problemList").empty();
	for (var i = 0; i < list.length; i++) {
		$("#problemList").append($("<option></option>").attr("value", list[i]).text(list[i]));
	}
	changeLinks(list[0]);
}

$(document).ready(function() {
	updateProblemList();
});

$("#problemList").change(function() {
	changeLinks($("#problemList").val()); // update links
});

$("#problem").change(function() {
	var problem = $("#problem").val();
	addProblem(problem);
	changeLinks(problem); // update links
});

chrome.tabs.getSelected(null,function(tab) {
    var url = tab.url, found = false;
	for (var i = 0; i < domain.length; i++) {
		 if (url.length < domain[i].length) continue;
		 var prefix = url.substring(0, domain[i].length);
		 if (prefix == domain[i]) found = true;
	}
	if (!found) return;
	
	var id = 0, problem = "";
	while (id < url.length && problem.length < 3) {
		while (id < url.length && !isUpper(url.charCodeAt(id))) id++;
		while (id < url.length && (isUpper(url.charCodeAt(id)) || isDigit(url.charCodeAt(id)))) {
			problem += url[id++];
		}
	}
	
	if (problem.length >= 3) {
		addProblem(problem);
		updateProblemList();
	}
});

