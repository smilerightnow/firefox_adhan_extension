
var adhan_element = document.querySelector("#adhan");
var date = new Date().toLocaleDateString("fr", {year: 'numeric', month: '2-digit', day: '2-digit'});
date = date.replaceAll("/", "-")

let d = new Date(); 
let time_now = `${(d.getHours() <= 9 ? "0" : "") + d.getHours()}:${(d.getMinutes() <= 9 ? "0" : "") + d.getMinutes()}`;

function diff(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0)
       hours = hours + 24;

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}

// GET COORDINATES FROM IP
browser.storage.local.get("coordinates").then(function(result){
	if(!("coordinates" in result)){
		fetch (`http://ip-api.com/json/`)
		.then(res => res.json())
		.then(function process(data){
			browser.storage.local.set({"coordinates":[data["lat"], data["lon"]]})
		})
	}
})
//

browser.storage.local.get(["Adhan_data", "coordinates"]).then(function(result){
	if(!("Adhan_data" in result)){
		fetch (`http://api.aladhan.com/v1/timings/${date}?latitude=${result["coordinates"][0]}&longitude=${result["coordinates"][1]}&method=4`)
		.then(res => res.json())
		.then(function process(data){
			let msg = `
Fajr: ${data["data"]["timings"]["Fajr"]} <br>
Dhuhr: ${data["data"]["timings"]["Dhuhr"]} <br>
Asr: ${data["data"]["timings"]["Asr"]} <br>
Maghrib: ${data["data"]["timings"]["Maghrib"]} <br>
Isha: ${data["data"]["timings"]["Isha"]} <br>	
`
			browser.storage.local.set({"Adhan_data":[date, msg, [data["data"]["timings"]["Fajr"], data["data"]["timings"]["Dhuhr"], data["data"]["timings"]["Asr"], data["data"]["timings"]["Maghrib"], data["data"]["timings"]["Isha"]]]})
			
			////
			let timings = [data["data"]["timings"]["Fajr"], data["data"]["timings"]["Dhuhr"], data["data"]["timings"]["Asr"], data["data"]["timings"]["Maghrib"], data["data"]["timings"]["Isha"]]
			timings.push(time_now);
			timings.sort(function(a, b){return parseInt(a.replace(":","")) - parseInt(b.replace(":",""))});
			let i = timings.indexOf(time_now);
			let text = "";
			if (i+1 == timings.length) text = diff(time_now, timings[0])
			else text = diff(time_now, timings[i+1])
			////
			
			adhan_element.innerHTML = "Until next Adhan: "+ text +"<br><br>" + msg
			})
		}
	else {
		if (result["Adhan_data"][0] != date){
			fetch (`http://api.aladhan.com/v1/timings/${date}?latitude=${result["coordinates"][0]}&longitude=${result["coordinates"][1]}&method=4`)
			.then(res => res.json())
			.then(function process(data){
				let msg = `
Fajr: ${data["data"]["timings"]["Fajr"]} <br>
Dhuhr: ${data["data"]["timings"]["Dhuhr"]} <br>
Asr: ${data["data"]["timings"]["Asr"]} <br>
Maghrib: ${data["data"]["timings"]["Maghrib"]} <br>
Isha: ${data["data"]["timings"]["Isha"]} <br>	
`
				browser.storage.local.set({"Adhan_data":[date, msg, [data["data"]["timings"]["Fajr"], data["data"]["timings"]["Dhuhr"], data["data"]["timings"]["Asr"], data["data"]["timings"]["Maghrib"], data["data"]["timings"]["Isha"]]]})
				////
				let timings = [data["data"]["timings"]["Fajr"], data["data"]["timings"]["Dhuhr"], data["data"]["timings"]["Asr"], data["data"]["timings"]["Maghrib"], data["data"]["timings"]["Isha"]]
				timings.push(time_now);
				timings.sort(function(a, b){return parseInt(a.replace(":","")) - parseInt(b.replace(":",""))});
				let i = timings.indexOf(time_now);
				let text = "";
				if (i+1 == timings.length) text = diff(time_now, timings[0])
				else text = diff(time_now, timings[i+1])
				////
				
				adhan_element.innerHTML = "Until next Adhan: "+ text +"<br><br>" + msg
				})
			}
		else {
			console.log("cached")
			////
			var timings = result["Adhan_data"][2].slice()
			timings.push(time_now);
			timings.sort(function(a, b){return parseInt(a.replace(":","")) - parseInt(b.replace(":",""))});
			let i = timings.indexOf(time_now);
			let text = "";
			if (i+1 == timings.length) text = diff(time_now, timings[0])
			else text = diff(time_now, timings[i+1])
			
			console.log("time_now:", time_now, ",timings:", result["Adhan_data"][2], ",index of time_now in timings:", i, ",remaining until next adhan:", text, ",coordinates:", result["coordinates"])
			
			////
			adhan_element.innerHTML = "Until next Adhan: "+ text +"<br><br>" + result["Adhan_data"][1]
			}
		}
})