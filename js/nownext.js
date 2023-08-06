console.log('NOW / NEXT FUNCTIONS')
console.log(today) // Defined in upcoming.html 
var timeout = 60 * 1000;

function sorter(a,b) {
	return a.querySelector('.show-card-col').dataset.show_performance_today.localeCompare(b.querySelector('.show-card-col').dataset.show_performance_today)
}

var all_shows = document.querySelectorAll('.show-item') 
function reloadUpcomingShows(){
	console.log("RELOADING SHOWS");
	var today = new Date();
	console.log(today)
	if (today.getMinutes() == 21){
		console.log('RELOADING in 60 seconds')
		setTimeout(() => {  location.reload(); }, 60000);
	}
	var wrapper = document.getElementById('nownext-wrapper');
	all_shows = document.querySelectorAll('.show-item')
	all_shows.forEach(function(show_item){ // Iterate over each .show-card-col 
		// Remove the shows that have already started 
		show = show_item.querySelector('.show-card-col')
		if (show.dataset.show_performance_today){
			let show_performance_time = new Date(show.dataset.show_performance_today)
			if (show_performance_time <= today) {
				console.log(show.id + ' has happened, removing')
				document.getElementById(show_item.id).remove()
			}
		}
		else {
			console.log(show.id + ' is not on today, removing')
			document.getElementById(show_item.id).remove()
		}
	})
	// Then, order the shows based on show_performance_today 
	all_shows = document.querySelectorAll('.show-item') // Reset the variable based on what's now in the DOM
	if (all_shows.length > 0){
		// If there are still shows today, sort them in time order and show the first one only
		var all_shows = Array.from(all_shows);
		all_shows_sorted = all_shows.sort(sorter);
		all_shows_sorted.forEach(e => wrapper.appendChild(e))
		for (let i = 0; i < 5; i++){
			if (all_shows[i]){
				all_shows_sorted[i].classList.remove('d-none');
			}
		}

		if (today.getMinutes() < 10){
			today_mins = '0' + today.getMinutes()
		}
		else {
			today_mins = today.getMinutes() 
		}
		var current_time = today.getHours() + ":" + today_mins
		if (typeof current_time == 'string') {
			document.getElementById('current_time').innerHTML = current_time
			document.getElementById('current_time').classList.remove('d-none')
		}
		else {
			document.getElementById('current_time').classList.add('d-none')
		}
		if (typeof swiper == 'object'){
			console.log('Resuming swiper')
			setTimeout(swiper.autoplay.resume(),900);
		}
	}
	else {
		// No shows for this space, let's display appropriately.
		document.getElementById('no_shows_wrapper').classList.remove('d-none')
		document.getElementById('upcoming_wrapper').classList.add('d-none')
		document.querySelectorAll('.no-more-shows').forEach(e => e.classList.remove('d-none'))
		document.getElementById('nownext_progress').classList.add('d-none')
	}
}
document.onload = reloadUpcomingShows()

setTimeout(setInterval(reloadUpcomingShows, timeout), 500);

// function hidePagination(){
// 	// Hide pagination if there is only one page 
// 	if (document.querySelectorAll('.swiper-pagination-total')){
// 		if (document.querySelectorAll('.swiper-pagination-total')[0].innerHTML == '1'){
// 			document.getElementById('pagination_wrapper').classList.add('d-none')
// 		}
// 		else {
// 			document.getElementById('pagination_wrapper').classList.remove('d-none');
// 		}
// 	}
// }
// setTimeout(hidePagination, 500); // Wait for swiper to initialise and create the component 