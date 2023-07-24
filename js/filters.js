// Define offcanvas sidebar so we can close it on a successful update
the_sidebar = new bootstrap.Offcanvas('#whatson-sidebar')

// Define the shows for filter pickers 
the_shows = document.getElementsByClassName('show-card-col');
loading = document.querySelectorAll(".loading")
var no_results_text = document.getElementById('no_results');
var error_text = document.getElementById('filter_error_text');
// var results_counter = document.getElementById('results_counter');
var update_button = document.getElementById('update_results');

var start_date = document.getElementById('start_date_picker')
var end_date = document.getElementById('end_date_picker')
var time_picker = { start_time_picker: document.getElementById('start_time_picker'), end_time_picker: document.getElementById('end_time_picker')}

//
// Utility Functions // 
//
function countResults() {
	filtered_out_shows = document.querySelectorAll('#show_list div[class*="filtered-out-by"]').length
	number_remaining = (the_shows.length - filtered_out_shows)
	console.log(number_remaining)
	// has_results_text = document.getElementById('results_counter')
	if (number_remaining == 0) {
		// has_results_text.classList.add('d-none')
		no_results_text.classList.remove('d-none')
	}
	else {
		if (filtered_out_shows == 0){
			// If the filter badge container isn't visible, assume nothing is being filtered 
			no_results_text.classList.add('d-none')
			// has_results_text.classList.add('d-none')
		}
		else {
			// Somewhere between 1 and everything has been filtered in, let's go
			// has_results_text.classList.remove('d-none')
			no_results_text.classList.add('d-none')
		}
	}
	return number_remaining;
}

function clearFilteredOutClass(
	className, 
	checkboxes=null, checkbox_default_state=false, 
	input_id=null,input_value="false"){
	// Remove the `filtered-out-by-xxx` class from the shows
	for (const show of the_shows){
		show.classList.remove(className);
	}
	// Reinstate the checkboxes to their default state (default: unchecked)
	if (checkboxes!=null){
		for (const cbox of checkboxes){
			cbox.checked = checkbox_default_state;
			cbox.indeterminate = false; 
		}
	}
	// If not using checkboxes, reset the input_id to its default value (either false or specified)
	if (input_id!=null){
		document.getElementById(input_id).value = input_value
	}
	countResults();
}

function clearAll(){
	clearSearch();
	clearDate();
	clearTimePicked();
	clearAgeCheckboxes();
	clearGenreCheckboxes();
	clearVenueCheckboxes();
	clearAccessCheckboxes();
}

//
// Search // 
//
search_box = document.getElementById('search-input')
function clearSearch(){
	// Reset the search box value, show the shows, and hide the filter
	search_box.value = '';
	clearFilteredOutClass('filtered-out-by-search')
}
function doSearch(term){
	// Strip any whitespace (not that there should be any)
	console.log('SEARCHING...')
	console.log(term)
	search_term = term.replaceAll(' ', '');
	// Iterate over the shows for any searchable term
	for (const show of the_shows){
		// Only remove the class here so that searches for 'foo' and 'bar' include
		// BOTH, not just the latest word in the array
		if (show.dataset.show_search.includes(search_term)) {
			show.classList.remove('filtered-out-by-search');
		}
	}
}

search_box.addEventListener('keyup', ({ key }) => {
	// Hit that update button when enter is pressed within the search box 
	search_value = search_box.value.toLowerCase().replaceAll(' ', '')
	if (key == "Enter"){
		updateFilters();
	}
})
function searchFunction(){
	// Sanitise text input 
	search_value = search_box.value.toLowerCase().replaceAll(' ', '');
	// Do the search! 
	for (const show of the_shows){
		// Hide everything 
		show.classList.add('filtered-out-by-search');
	}
	doSearch(search_value);
	if (document.querySelectorAll('.filtered-out-by-search').length == the_shows.length){
		// If searching for the entire term gets nothing, split on whitespace and 
		// search for each word 
		for (const show of the_shows){
			// Hide everything 
			show.classList.add('filtered-out-by-search');
		}
		search_array = search_box.value.toLowerCase().split(/\s+/);
		if (search_array.length > 1 && search_array[1].match(/^[0-9a-z]+$/i)){
			// Provided there are two alphanumeric words, we can do a multi-word search
			// Quick check that they're all 3+ characters 
			if (Math.max(...(search_array.map(el => el.length))) > 2){
				for (const s of search_array){
					doSearch(s)
				}
			}
		}
	}
	else {
		// Nothing? 
	}
};

//
// Date Filter //
//
function clearDate(){
	clearFilteredOutClass('filtered-out-by-date',null,false,'start_date_picker','');
	clearFilteredOutClass('filtered-out-by-date',null,false,'end_date_picker','')

}
function doDateFilter() {

	var picked_start_date = start_date.value || start_date.min
	var picked_end_date = end_date.value || end_date.max 

	days_to_count = ((new Date(picked_end_date)) - (new Date(picked_start_date)))/(86400000)+1;
	all_days = [] 
	for (let i=0; i < days_to_count; i++) {
		next_day = new Date(picked_start_date)
		next_day.setDate(next_day.getDate() + i)
		next_day = new Date(next_day).toISOString().split('T')[0]
		all_days.push(next_day)
	}

	if (picked_start_date == '' && picked_end_date == ''){
		for (i=0; i< the_shows.length; i++ ) {
			if (the_shows[i].classList.contains('filtered-out-by-date')) {
				the_shows[i].classList.remove('filtered-out-by-date');
			}
		}
  }
  else {
  	// Assuming some dates are picked, filter the shows appropriately. 
  	// Hide all of them 
  	for (const show of the_shows) {
  		show.classList.add('filtered-out-by-date');

  		if (show.dataset.show_date_end >= picked_start_date && show.dataset.show_date_start <= picked_end_date){
  			// If the show has performances within the date range, 
  			// Verify if there is an actual performance within the date range
  			for (const day of all_days){
  				if (show.dataset.show_performances.includes(day)){
		  			show.classList.remove('filtered-out-by-date');
  				}
  			}
  		}
  	}
  }
}


// 
// Time Filter //
//

function clearTimePicked() {
	for (const picker in time_picker) {
		clearFilteredOutClass('filtered-out-by-time', null, false, `${picker}`);
	}
	document.getElementById('time_picker_text').classList.add('d-none');
}
function doTimeFilter(){

	if (time_picker.start_time_picker.value != 'false' || time_picker.end_time_picker.value != 'false'){
		for (const picker in time_picker) { console.log( picker + ': ' + time_picker[picker].value);}
  	for (const show of the_shows) {
  		show.classList.add('filtered-out-by-time');

  		let show_start_time = parseInt(show.dataset.show_start_time)
  		console.log(show_start_time)
  		match = false 
  		if (show_start_time > 0) {
  			console.log(show_start_time)
  			// Show's start time is not "Various times"; only working on standard start times (sorry, previews)
  			if (time_picker.start_time_picker.value != 'false' && time_picker.end_time_picker.value != 'false'){
  				console.log('There is both a start and end time picked')
  				if (show_start_time >= time_picker.start_time_picker.value && show_start_time < time_picker.end_time_picker.value){
  					match = true 
  				}
  			}	
  			else if (time_picker.start_time_picker.value != 'false' && show_start_time >= time_picker.start_time_picker.value) {
  				console.log('Only a start time is picked')
 					match = true 
  			}
  			else if (time_picker.end_time_picker.value != 'false' && show_start_time < time_picker.end_time_picker.value){
  				console.log('Only an end time is picked')
  				match = true 
  			}
  			else {
  				match = false 
  			}
  		}
  		if (match == true){
  			console.log('A show has matched!')
				console.log('MATCH');
				if (show.classList.contains('filtered-out-by-time')) show.classList.remove('filtered-out-by-time');
			}
  	}

  	document.getElementById('time_picker_text').classList.remove('d-none');
  }
	else {
		document.getElementById('time_picker_text').classList.add('d-none');
		for (i=0; i< the_shows.length; i++ ) {
			if (the_shows[i].classList.contains('filtered-out-by-time')) {
				the_shows[i].classList.remove('filtered-out-by-time');
			}
		}
	}
};

// 
// Venue Filter //
//
var venue_checkboxes = document.querySelectorAll('input[name="filter-venue-item"]');
var space_checkboxes = document.querySelectorAll('input[name="filter-space-item"]');
let picked_venues = [] 

function clearVenueCheckboxes() {
	clearFilteredOutClass('filtered-out-by-venue', venue_checkboxes)
	clearFilteredOutClass('filtered-out-by-venue', space_checkboxes)
}
function doVenueFilter(){
	space_checkboxes.forEach(function(checkbox) {
    picked_venues = 
      Array.from(space_checkboxes) // Convert checkboxes to an array to use filter and map.
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
	clearFilteredOutClass('filtered-out-by-genre', genre_checkboxes);
	genre_checkboxes.forEach(function(checkbox){
  	checkbox.labels.forEach(function(elem){
  		elem.classList.remove('active');
  	})
	})
}

genre_checkboxes.forEach(function(checkbox){
  checkbox.addEventListener('change', function() {
	  if (this.checked) {
	  	this.labels.forEach(function(elem){
	  		elem.classList.add('active');
	  	})
	  } else {
	  	this.labels.forEach(function(elem){
	  		elem.classList.remove('active');
	  	})
	  }
  })
})

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
	  		console.log(picked_genres);
	  		for (s=0; s < the_shows.length; s++) {
	  			if (the_shows[s].dataset.show_genre == picked_genres[p]) {
						// If the genre matches, unhide the show
						// Should be an exact match because there should only be one main genre per show
						if (the_shows[s].classList.contains('filtered-out-by-genre')) the_shows[s].classList.remove('filtered-out-by-genre');
					}
				}
	  	}
	  }
	});
}

// 
// Age Filter //
//
var age_checkboxes = document.querySelectorAll('input[name="filter-age-item"]');
let picked_ages = [] 

function clearAgeCheckboxes() {
	clearFilteredOutClass('filtered-out-by-age', age_checkboxes)
}
function doAgeFilter(){
	age_checkboxes.forEach(function(checkbox) {
    picked_ages = 
      Array.from(age_checkboxes) // Convert checkboxes to an array to use filter and map.
      .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
      .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

    // If all checkboxes are empty, show everything (rather than nothing)
    if (picked_ages.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-age')) {
					the_shows[i].classList.remove('filtered-out-by-age');
				}
			}
    }
    else {
    	// Assuming something is ticked, filter the shows appropriately. 

    	// Hide all of them 
    	for (const show of the_shows) {
    		show.classList.add('filtered-out-by-age');
    	}
    	// Iterate over the picked ages and display shows that match
    	for (p=0; p < picked_ages.length; p++) {
    		console.log(picked_ages);
    		for (s=0; s < the_shows.length; s++) {
    			if (the_shows[s].dataset.show_age_guidance.includes(picked_ages[p])) {
    				// If the age matches one ticked, unhide the show
    				console.log('MATCH');
						if (the_shows[s].classList.contains('filtered-out-by-age')) the_shows[s].classList.remove('filtered-out-by-age');
					}
				}
    	}
    }
	});
}

//
// Access Filter //
//
var access_checkboxes = document.querySelectorAll('input[name="filter-access-item"]');
let picked_access = [] 

function clearAccessCheckboxes() {
	clearFilteredOutClass('filtered-out-by-access', access_checkboxes);
}

function doAccessFilter(){
	access_checkboxes.forEach(function(checkbox) {
	  picked_access = 
	    Array.from(access_checkboxes) // Convert checkboxes to an array to use filter and map.
	    .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
	    .map(i => i.value) // Use Array.map to extract only the checkbox values from the array of objects.

	  // If all checkboxes are empty, show everything (rather than nothing)
	  if (picked_access.length == 0) {
			for (i=0; i< the_shows.length; i++ ) {
				if (the_shows[i].classList.contains('filtered-out-by-access')) {
					the_shows[i].classList.remove('filtered-out-by-access');
				}
			}
	  }
	  else {
	  	// Assuming something is ticked, filter the shows appropriately. 
	  	// Hide all of them 
	  	for (const show of the_shows) {
	  		show.classList.add('filtered-out-by-access');
	  	}
	  	// Iterate over the picked accesss and display shows that match
	  	for (p=0; p < picked_access.length; p++) {
	  		console.log(picked_access);
	  		for (s=0; s < the_shows.length; s++) {
	  			if (the_shows[s].dataset.show_access.includes(picked_access[p])) {
						// If the access matches, unhide the show
	  				// Access in the dataset is a list so going for includes() 
						if (the_shows[s].classList.contains('filtered-out-by-access')) the_shows[s].classList.remove('filtered-out-by-access');
					}
				}
	  	}
	  }
	});
}

function doSort(value="title"){
	var showsArray = Array.from(the_shows);
	let sorted = showsArray.sort(sorter);
	function sorter(a,b) {
		if (value == "time"){
			return a.dataset.show_sort_time.localeCompare(b.dataset.show_sort_time)
		}
		else {
			// If the value isn't time, default to title.
			return a.id.localeCompare(b.id);
		}
	}
	sorted.forEach(e => document.querySelector("#show_list").appendChild(e))
}

function showLoading(){
	console.log('ACTIVATING LOADING...');
	document.getElementById('show_list').classList.add('d-none');
	loading.forEach(function(element) {
		element.classList.remove("d-none");
	});
}

function hideLoading(){
	console.log('...DEACTIVATING')
	loading.forEach(function(element) {
		element.classList.add("d-none");
	});
	document.getElementById('show_list').classList.remove('d-none')
}

function filterFunctions(){
	searchFunction();
	doDateFilter();
	doTimeFilter();
	doVenueFilter();
	doGenreFilter();
	doAgeFilter();
	doAccessFilter();

	countResults();
}

// UPDATE RESULTS BUTTON
function updateFilters(){
	has_error = false 
	error_text.innerHTML = '' 
	error_date = "The end date must be after the start date"
	error_time = "The end time must be after the start time"
	if (start_date.value != '' && end_date.value != '' && start_date.value > end_date.value) {
		console.log("End date after start date; aborting")
		if (error_text.innerHTML.length > 0) { error_text.innerHTML += '<br>' }
		error_text.innerHTML += error_date
		has_error = true 
	}
	if (time_picker.start_time_picker.value != 'false' && time_picker.end_time_picker.value != 'false' && time_picker.start_time_picker.value > time_picker.end_time_picker.value){
		console.log("End time after start time; aborting")
		if (error_text.innerHTML.length > 0) { error_text.innerHTML += '<br>' }
		error_text.innerHTML += error_time 
		has_error = true 
	}
	if (has_error == false){
		document.getElementById('filter_error_text').innerHTML = document.getElementById('filter_error_text').innerHTML.replace(error_date,'')
		sort_value = document.getElementById('sort_picker_select').value
		console.log('UPDATE RESULTS GO GO GO');

		showLoading();
		the_sidebar.hide(); 
		console.log("SORTING BY " + sort_value);
		setTimeout(filterFunctions,250);
		setTimeout(doSort(sort_value), 500)
		setTimeout(toggleResetButton, 750);
		setTimeout(hideLoading,1000);
	}
	else {
		toggleResetButton(has_error) 
	}
}

function toggleResetButton(error=false){
	results = countResults()
	if (results < the_shows.length){
		console.log('THERE ARE SOME FILTERS')
		document.getElementById('clear_results').classList.remove('d-none');
	}
	else if (error){
		console.log('THERE ARE SOME ERRORS, OFFERING RESET BUTTON')
		document.getElementById('clear_results').classList.remove('d-none');
	}
	else {
		console.log('THERE ARE NO FILTERS')
		document.getElementById('clear_results').classList.add('d-none');
	}
}

document.getElementById('update_results').addEventListener('click', function(){
	updateFilters();
});

document.getElementById('clear_results').addEventListener('click', function(){
	console.log('CLEARING RESULTS');
	showLoading()
	setTimeout(clearAll, 250);
	setTimeout(hideLoading, 1000);
	setTimeout(toggleResetButton, 750);
});

