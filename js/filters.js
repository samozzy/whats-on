// Define the shows for filter pickers 
the_shows = document.getElementsByClassName('show-card-col');
// This contains double the number of shows due to the implementation of sorting
var no_results_text = document.getElementById('no_results');
var results_counter = document.getElementById('results_counter');
var update_button = document.getElementById('update_results');

//
// Utility Functions // 
//
function countResults() {
	filtered_out_shows = document.querySelectorAll('#show_list div[class*="filtered-out-by"]').length
	number_remaining = (the_shows.length - filtered_out_shows)
	console.log(number_remaining)
	has_results_text = document.getElementById('results_counter')
	if (number_remaining == 0) {
		has_results_text.classList.add('d-none')
		no_results_text.classList.remove('d-none')
	}
	else {
		if (filtered_out_shows == 0){
			// If the filter badge container isn't visible, assume nothing is being filtered 
			no_results_text.classList.add('d-none')
			has_results_text.classList.add('d-none')
		}
		else {
			// Somewhere between 1 and everything has been filtered in, let's go
			has_results_text.classList.remove('d-none')
			no_results_text.classList.add('d-none')
		}
	}
}

function clearFilteredOutClass(
	className, 
	checkboxes=null, checkbox_default_state=false, 
	filter_buttons=null, filter_button_default_class=null){
	// Remove the `filtered-out-by-xxx` class from the shows
	for (const show of the_shows){
		show.classList.remove(className);
	}
	// Reinstate the checkboxes to their default state (default: unchecked)
	if (checkboxes!=null){
		for (const cbox of checkboxes){
			cbox.checked = checkbox_default_state;
		}
	}
	// Reset the filter buttons to their default state (default: not `.active`)
	if (filter_buttons!=null){
		for (const btn of filter_buttons){
			if (filter_button_default_class!=null) {
				filter_buttons[btn].classList.add(filter_button_default_class)
			}
			else {
				btn.classList.remove('active');
			}
		}
	}
	hideActiveFilter(className.replace('filtered-out-by-',''))
	countResults();
}

//
// Active Filter Buttons
//
function showActiveFilter(btn_id, looking_for_checked=true){
	// Show the filter buttons! 
	// Because it iterates each time, this is a toggler as much as it is a show-er 
	document.getElementById('filter-badge-container').classList.remove('d-none');
	document.getElementById('active-filter-' + btn_id).classList.remove('d-none');
	if (btn_id == 'access' || btn_id == 'content-warning') {
		document.getElementById('edit-circle-'+ btn_id).classList.add('d-inline');
	}
	else if (btn_id != 'search'){
		document.getElementById('edit-circle-'+ btn_id).classList.remove('d-none');
	}

	filter_query = 'filter-' + btn_id + '-item'
	inner_text = [];
	if (btn_id == 'date'){
		date_options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
		picked_start_date = picker.getStartDate().toLocaleString(undefined,date_options)
		picked_end_date = picker.getEndDate().toLocaleString(undefined,date_options)
		if (picked_start_date != picked_end_date){
			inner_text.push('Between ' + picked_start_date + ' and ' + picked_end_date)
		}
		else {
			inner_text.push('On ' + picked_start_date)
		}
	}
	else if (btn_id == 'search'){
		if (typeof(looking_for_checked)=='string'){
			inner_text.push(looking_for_checked);
		}
	}
	else { 
		if (looking_for_checked == true){
			document.querySelectorAll('[name="'+filter_query+'"]:checked').forEach(filter_btn => {
				el_inner_text = filter_btn.labels[0].innerText
				if (el_inner_text == '' && filter_btn.labels[0].dataset.zoo_tooltip != ''){
					// The access inner text is actually a picture so let's use this data attribute
					el_inner_text = filter_btn.labels[0].dataset.zoo_tooltip
				}
				inner_text.push(el_inner_text);
			});
		}
		else {
			// Special case for content warnings where we click to hide rather than additive 
			document.querySelectorAll('[name="'+filter_query+'"]:not(:checked)').forEach(filter_btn => {
				el_inner_text = filter_btn.labels[0].innerText
				if (el_inner_text == '' && filter_btn.labels[0].dataset.zoo_tooltip != ''){
					el_inner_text = filter_btn.labels[0].dataset.zoo_tooltip
				}
				inner_text.push(el_inner_text);
			});
		}
	}
	filter_button_inner_text = document.getElementById('active-filter-' + btn_id + '-list')
	if (inner_text.length == 0){
		// If we've removed all the things, hide the filter badge
		hideActiveFilter(btn_id);
	}
	else {
		filter_button_inner_text.innerText = ': ' + inner_text.join('; ');
	}
	countResults();
}

function hideActiveFilter(btn_id){
	filter_container = document.getElementById('filter-badge-container')
	document.getElementById('active-filter-' + btn_id).classList.add('d-none');
	document.getElementById('active-filter-' + btn_id + '-list').innerText = '';
	if (btn_id == 'access' || btn_id == 'content-warning') {
		document.getElementById('edit-circle-'+ btn_id).classList.remove('d-inline');
	}
	else if (btn_id != 'search'){
		document.getElementById('edit-circle-'+ btn_id).classList.add('d-none');
	}
	else {
		document.getElementById('hint-to-scroll').classList.add('d-none');
	}

	countResults();

	// If all of the filters have been hidden, hide the container 
	if (filter_container.querySelectorAll('button').length == filter_container.querySelectorAll('button.d-none').length){
		filter_container.classList.add('d-none');
	}
}

//
// Search // 
//
search_box = document.getElementById('search-input')
function clearSearch(){
	// Reset the search box value, show the shows, and hide the filter
	search_box.value = '';
	clearFilteredOutClass('filtered-out-by-search')
	hideActiveFilter('search')
}
function doSearch(term){
	// Strip any whitespace (not that there should be any)
	search_term = term.replaceAll(' ', '');
	// Iterate over the shows for any searchable term
	if (term.length >= 3){
		for (const show of the_shows){
			// Only remove the class here so that searches for 'foo' and 'bar' include
			// BOTH, not just the latest word in the array
			if (show.dataset.search.includes(search_term)) {
				show.classList.remove('filtered-out-by-search');
			}
			// Use the raw value so it's more human-readable than the query term
			showActiveFilter('search',search_box.value)
		}
	}
}

// 
// Venue Filter //
//
var venue_checkboxes = document.querySelectorAll('input[name="filter-venue-item"]');
let picked_venues = [] 
// var venue_buttons = document.getElementsByClassName('btn-venue');

function clearVenueCheckboxes() {
	clearFilteredOutClass('filtered-out-by-venue', venue_checkboxes, false, venue_buttons)
}
function doVenueFilter(){
	venue_checkboxes.forEach(function(checkbox) {
    picked_venues = 
      Array.from(venue_checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

    // If all checkboxes are empty, show everything (rather than nothing)
    if (picked_venues.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-venue')) {
					the_shows[i].classList.remove('filtered-out-by-venue');
				}
			}
    }
    else {
    	// Assuming something is ticked, filter the shows appropriately. 

    	// Hide all of them 
    	for (const show of the_shows) {
    		show.classList.add('filtered-out-by-venue');
    	}
    	// Iterate over the picked venues and display shows that match
    	for (p=0; p < picked_venues.length; p++) {
    		// STEP 1: Apply the filter to the show classes
    		console.log(picked_venues);
    		for (s=0; s < the_shows.length; s++) {
    			if (the_shows[s].dataset.show_performance_space.includes(picked_venues[p])) {
    				// If the venue matches one ticked, unhide the show
    				console.log('MATCH');
						if (the_shows[s].classList.contains('filtered-out-by-venue')) the_shows[s].classList.remove('filtered-out-by-venue');
					}
				}
    	}
    }
	});
}

//
// Genre Filter //
//
var genre_checkboxes = document.querySelectorAll('input[name="filter-genre-item"]');
let picked_genres = [] 
var genre_buttons = document.getElementsByClassName('btn-genre');

function clearGenreCheckboxes() {
	clearFilteredOutClass('filtered-out-by-genre', genre_checkboxes, false, genre_buttons);
}
function doGenreFilter(){
	genre_checkboxes.forEach(function(checkbox) {
	  picked_genres = 
	    Array.from(genre_checkboxes) // Convert checkboxes to an array to use filter and map.
	    .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
	    .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

	  // If all checkboxes are empty, show everything (rather than nothing)
	  if (picked_genres.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-genre')) {
					the_shows[i].classList.remove('filtered-out-by-genre');
				}
			}
	  }
	  else {
	  	// Assuming something is ticked, filter the shows appropriately. 

	  	// Hide all of them 
	  	for (const show of the_shows) {
	  		show.classList.add('filtered-out-by-genre');
	  	}
	  	// Iterate over the picked genres and display shows that match
	  	for (p=0; p < picked_genres.length; p++) {
	  		// STEP 1: Apply the filter to the show classes
	  		console.log(picked_genres);
	  		for (s=0; s < the_shows.length; s++) {
	  			if (the_shows[s].dataset.show_genre.includes(picked_genres[p])) {
						// If the genre matches, unhide the show
						if (the_shows[s].classList.contains('filtered-out-by-genre')) the_shows[s].classList.remove('filtered-out-by-genre');
					}
				}
	  	}
	  }
	});
}


// UPDATE RESULTS BUTTON

document.getElementById('update_results').addEventListener('click', function(){
	console.log('UPDATE RESULTS GO GO GO');
	doVenueFilter();
	doGenreFilter();

	countResults();
});


