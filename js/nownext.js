console.log('NOW / NEXT FUNCTIONS')
console.log(today) // Defined in upcoming.html 

function sorter(a,b) {
	return a.querySelector('.show-card-col').dataset.show_performance_today.localeCompare(b.querySelector('.show-card-col').dataset.show_performance_today)
}

wrapper = document.getElementById('nownext-wrapper');
all_shows = document.querySelectorAll('.show-item') // Iterate over each .show-card-col 
all_shows.forEach(function(show_item){
	// Remove the shows that have already started 
	// show_item.classList.add('d-none') // Hide all of them, we'll unhide the current one later
	show = show_item.querySelector('.show-card-col')
	if (show.dataset.show_performance_today){
		let show_performance_time = new Date(show.dataset.show_performance_today)
		if (show_performance_time <= today) {
			// console.log(show.id + ' has happened')
			document.getElementById(show_item.id).remove()
		}
	}
	else {
		// console.log(show.id + ' is not on today, removing')
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
	// space_shows_sorted[0].classList.remove('d-none')
	for (let i = 0; i < 5; i++){
		if (all_shows[i]){
			all_shows_sorted[i].classList.remove('d-none');
		}
	}
}
else {
	// No shows for this space, let's display appropriately.
	document.querySelectorAll('.no-more-shows').forEach(e => e.classList.remove('d-none'))
}
function hidePagination(){
	// Hide pagination if there is only one page 
	if (document.querySelectorAll('.swiper-pagination-total')){
		if (document.querySelectorAll('.swiper-pagination-total')[0].innerHTML == '1'){
			document.getElementById('pagination_wrapper').classList.add('d-none')
		}
		else {
			document.getElementById('pagination_wrapper').classList.remove('d-none');
		}
	}
}
setTimeout(hidePagination, 500); // Wait for swiper to initialise and create the component 