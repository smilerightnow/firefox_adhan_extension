document.querySelector("#submit").onclick = function(){
	browser.storage.local.set({"coordinates_option":[document.forms["coor"]["lat"].value, document.forms["coor"]["lon"].value]});
	document.querySelector("#msg").innerHTML = "Saved!"
}