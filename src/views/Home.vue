<template>
  <div class="home">
    <playList />
  </div>
</template>

<script>
// @ is an alias to /src
import playList from '../components/playList';
export default {
  name: 'Home',
  components: {
    playList
  }
}
</script>
