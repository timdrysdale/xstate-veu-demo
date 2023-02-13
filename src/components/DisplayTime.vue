<template>
  <div class="row">

	<div class="col">
	  {{ start }} 
	</div>
	<div class="col">
		<div class="dropup"> 
				<button type="button" @click='makeBooking(id, time)' class="btn btn-primary" id="book">
				  Book
				</button>

          </div>	  
	  </div>
</div>
</template>
<script src="./DisplayTime.js"></script>
