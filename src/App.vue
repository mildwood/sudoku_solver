<template>
  <v-app>
    <v-app-bar
      app
      color="cyan darken-2"
      dark
    >
    <v-app-bar-nav-icon class="grey--text text--lighten-2" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <h3 class="grey--text text--lighten-2 ml-2">
      Sudoku App
    </h3>
    
    <v-navigation-drawer
      dark 
      v-model="drawer"
      absolute
      temporary
      app
      width="160"
      fixed 
      disable-resize-watcher
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          active-class="white--text text--accent-4"
        >
          <v-list-item @click.prevent="goTo('home')">
            <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
            <v-list-item-title>Főoldal</v-list-item-title>
          </v-list-item>

          <v-list-item @click.prevent="goTo('sudoku')">
            <v-list-item-icon>
            <v-icon>mdi-puzzle</v-icon>
          </v-list-item-icon>
            <v-list-item-title>Sudoku</v-list-item-title>
          </v-list-item>

          
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Sudoku from '@/components/Sudoku'
import HomePage from '@/components/HomePage'

export default {
  name: 'App',
  components: {
    Sudoku,
    HomePage,
  },
  methods: {
    goTo(route){
      if(route == 'sudoku'){
        this.$router.push('/sudoku')
      }
      if(route == 'home'){
        this.$router.push('/')
      }
    }
  },
  data: () => ({
    drawer: false
    //
  }),
};
</script>
