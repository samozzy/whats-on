console.log('NOW / NEXT FUNCTIONS')
console.log(today) // Defined in nownext.html 

function sorter(a,b) {
	return a.dataset.show_sort_time.localeCompare(b.dataset.show_sort_time)
}

show_lists = document.querySelectorAll('.show-list')
show_lists.forEach(function(space){
	space_shows = space.querySelectorAll('.show-card-col')
	space_shows.forEach(function(show){
		// Remove the shows that have already started 
		show.classList.add('d-none') // Hide all of them, we'll unhide the current one later
		if (show.dataset.show_performance_today){
			let show_performance_time = new Date(show.dataset.show_performance_today)
			if (show_performance_time <= today) {
				// console.log(show.id + ' has happened')
				document.getElementById(show.id).remove()
			}
		}
		else {
			// console.log(show.id + ' is not on today, removing')
			document.getElementById(show.id).remove()
		}
	})
	// Then, order the shows based on show_performance_today 
	space_shows = space.querySelectorAll('.show-card-col') // Reset the variable based on what's now in the DOM
	if (space_shows.length > 0){
		// If there are still shows today, sort them in time order and show the first one only
		var space_shows = Array.from(space_shows);
		space_shows_sorted = space_shows.sort(sorter);
		space_shows_sorted.forEach(e => space.appendChild(e))
		space_shows_sorted[0].classList.remove('d-none')
	}
	else {
		// No shows for this space, let's display appropriately.
		space.querySelectorAll('.no-more-shows').forEach(e => e.classList.remove('d-none'))
	}
})

// Hide pagination if there is only one page 
if (document.querySelectorAll('.swiper-pagination-total')[0].innerHTML == '1'){
	document.getElementById('pagination_wrapper').classList.add('d-none')
}
else {
	document.getElementById('pagination_wrapper').classList.remove('d-none');
}