<template>
<v-container fluid>
    <!-- Snackbar -->
    <v-snackbar v-model="$store.state.snackbarTrigger" :timeout="3000">
        {{ $store.state.snackbarMessage }}
        <template v-slot:action="{ attrs }">
            <v-btn color="cyan darken-2" text v-bind="attrs" @click="$store.commit('setSnackbarTrigger', false)">
                Ok
            </v-btn>
        </template>
    </v-snackbar>
    
    <v-row align="center" justify="center">
        <v-col class="d-flex align-center justify-center">
            <v-card color="grey darken-2" class="rounded-xl" width="600">
                <h3 class="my-2 mx-2 text-center grey--text text--lighten-3">
                    Sudoku megoldó alkalmazás
                </h3>  
                <br>
                <h4 class="my-2 mx-2 text-center grey--text text--lighten-3">
                    Ez az alkalmazás azért jött létre, hogy automatikusan megfejtsen sudoku feladványokat, illetve segítsen egy elakadt sudoku folytatásában. Amennyiben követni szeretnéd az app fejlődését iratkozz fel!
                </h4>
                <br>
                <v-row align="center" justify="center">
                    <v-col class="d-flex align-center justify-center">
                        <v-btn color="cyan darken-2" @click.prevent="$router.push('/sudoku')">
                            <v-icon class="mr-2" color="white">mdi-puzzle</v-icon>
                            <h4 class="white--text">Sudoku</h4>
                        </v-btn>
                    </v-col>
                </v-row>
                <br>
                <br>
                <v-row class="d-flex align-center justify-space-around">
                    <v-col class="d-flex alig-center justify-center" cols="10">
                        <v-form v-model="valid" @submit.prevent="subscribe">
                            <v-text-field :rules="emailRules" v-model="email" label="E-mail cím" solo background-color="grey"></v-text-field>
                        </v-form>
                        <v-btn :disabled="!valid" @click.prevent="subscribe" small fab color="grey" class="mt-1 ml-8">
                            <v-icon color="white">
                                mdi-send
                            </v-icon>
                        </v-btn>
                    </v-col>   
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import Cell from "./Cell"

export default {
  name: 'Sudoku',
  components: {
	  Cell,
  },
  methods: {
      subscribe(){
        //Snackbar here
        this.$store.commit('setSnackbarMessage', 'Sikeres feliratkozás')
        this.$store.commit('setSnackbarTimeout', 3000)
        this.$store.commit('setSnackbarTrigger', true)
        this.email = null
      }
  },
  data(){
	  return{
          email: null,
          emailRules: [v => /.+@.+\..+/.test(v) || 'Helytelen formátum(minta@xy.hu)'],
          valid: false,
	  }
  },
}
</script>

<style scoped>
</style>
