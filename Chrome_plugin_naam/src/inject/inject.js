
var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('src/inject/script.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
var s = document.createElement('link');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.href = chrome.extension.getURL('css/main.css');
s.rel = "stylesheet";
s.type = "text/css";
(document.head).appendChild(s);


chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

			chrome.runtime.sendMessage({method: "getStatus"}, function(response) {
				var data = JSON.parse(JSON.parse( response.status)).data;
				var allJobs = {};
				var allCompanies = {};
				for(var y in data.jobs)
				{
					allJobs[data.jobs[y].id.toString()] = data.jobs[y].title;
				}
				for(var y in data.companies)
				{
					allCompanies[data.companies[y].id.toString()] = data.companies[y].name;
				}
				for(var a in data.persons)
				{
					var p = data.persons[a];
					console.log(p);
					var j = data.persons[a].jobs;
					
					for(var x in j)
					{
						j[x]["jobtitle"] = allJobs[j[x].jobid.toString()];
						j[x]["companyname"] = allCompanies[j[x].companyid.toString()];
					}
					console.log(j);
					for(var b in p.names)
					{
						var fnd = $(document).find("*:contains('" + p.names[b] + "'):not(:has('*'))");
						
						if(fnd.length>0)
						{
							var s = JSON.stringify(j,null,false);
							var span = fnd.html().replace(p.names[b],'<a href="#" class="lnk-'+ p.id +'" >' + p.names[b] + '</a>');
							fnd.html(span);
							$(".lnk-" + p.id).click(function(){ showData(s); });
							
						}	
					}
					
					//var rgx = new RegExp(data[a].names[0],"g");
					//document.body.innerHTML = document.body.innerHTML.replace(rgx,"<a href='#' onclick='showData(\""+ data[a].titles.join(";;")+"\");'>" + data[a].names[0] + "</a>");
				}
		});
	}
	}, 10);
});

