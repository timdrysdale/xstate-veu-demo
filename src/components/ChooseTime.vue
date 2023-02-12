<template>
<template v-if="false">
   <div>  Will be a Card for {{ slot.id }} </div>
</template>
<template v-else>
   <div class="container-fluid">
	 <div class="row">
	   
<div class="card mb-3" style="max-width: 540px;">
  <div class="row no-gutters">
    <div class="col-md-4">
      <img :src="image" class="card-img" :alt="title">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title"> {{ title }}</h5>
        <p class="card-text text-secondary"> {{ what }}</p>
		<p class="card-text text-secondary"> {{ nextBookable }} </p>
  		<div class="dropup"> 
					<button type="button" @click='goBack()' class="btn btn-warning" id="cancel">
				  Go back to catalogue
				</button>
		</div>
  </div>	  
  </div>
</div>
</div>

<div class="row">
  {{ slot.available }} <br/>
  details: {{ slot.policyDetails }} <br/>
  suggested: {{ suggested }} <br/>
  </div>

   
  <div class="row mb-2">
	<div class="col-md-2">
	  2023-02-14T18:35:47Z
  <input v-model="start" placeholder="start time...">
</div>
	<div class="col-md-2">
	  2023-02-14T19:35:47Z
  <input v-model="end" placeholder="end time...">
  </div>
  </div>
 
  <div class="row">
 
 		<div class="dropup"> 
				<button type="button" @click='makeBooking()' class="btn btn-primary" id="book">
				  Book
				</button>
		</div>
     </div>
	 </div>
	 
  <div class="row">
 
 		<div class="dropup"> 
				<button type="button" @click='goBack()' class="btn btn-warning" id="cancel">
				  Go back to catalogue
				</button>
		</div>
		
     </div>
	
	 
	 
</div>		
</template>
</template>
<script src="./ChooseTime.js"></script>


<style>
.close-button {
  border: none;
  display: inline-block;
  padding: 8px 16px;
  vertical-align: middle;
  overflow: hidden;
  text-decoration: none;
  color: white;
  background-color: inherit;
  text-align: center;
  cursor: pointer;
  white-space: nowrap
}

.topright {
  position: relative;
  right: 0;
  top: 0;
}
</style>
