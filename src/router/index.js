import Vue from 'vue'
import VueRouter from 'vue-router'
import Sudoku from '@/components/Sudoku'
import HomePage from '@/components/HomePage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/sudoku',
    name: 'Sudoku',
    component: Sudoku
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
