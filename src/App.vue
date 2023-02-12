<script setup>
  import Booking from './components/Booking.vue'
</script>

<template>
  <img width="300" src="https://dev.practable.io/static/images/common/practable-logo-3-1980x660.png">

  <div id="nav">
	<router-link to="/">Catalogue</router-link> |
	<router-link to="/user">User</router-link> |
	<router-link to="/about">About</router-link> |
	<router-link to="/cookies">Cookie</router-link>
	
  </div>
 <p style="margin-bottom:0.7cm;"></p>
	
  <router-view />

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


