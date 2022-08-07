<template>
  <v-form>
	<!-- Snackbar -->
    <v-snackbar v-model="$store.state.snackbarTrigger" :timeout="3000">
        {{ $store.state.snackbarMessage }}
        <template v-slot:action="{ attrs }">
            <v-btn color="cyan darken-2" text v-bind="attrs" @click="$store.commit('setSnackbarTrigger', false)">
                Ok
            </v-btn>
        </template>
    </v-snackbar>

    <v-container fluid>
		<v-row class="d-flex" justify="center" align="center">
			<v-col class="d-flex justify-center mb-n4">
				<v-card ripple color="grey lighten-3 mr-12" class="rounded" elevation="10">
					<v-row align="center" justify="center">
						<v-col class="d-flex align-center justify-center">
							<h4 class="mx-4 my-2">Minimum kitöltendő mező: 17</h4>
						</v-col>
					</v-row>
				</v-card>
				<v-card ripple color="grey lighten-3" class="rounded mr-12" elevation="10">
					<v-row align="center" justify="center">
						<v-col class="d-flex align-center justify-center">
							<h4 class="mx-4 my-2">Kitöltött mező: {{filledCellNum}}</h4>
						</v-col>
					</v-row>
				</v-card>
				<v-card ripple color="grey lighten-3" class="rounded" elevation="10">
					<v-row align="center" justify="center">
						<v-col class="d-flex align-center justify-center">
							<h4 class="mx-4 my-2">Gép által kitöltött mező: {{filledCellNumMachine}}</h4>
						</v-col>
					</v-row>
				</v-card>
				
				
			</v-col>				
		</v-row>
		<v-row class="align-center justify-center mt-4">
			<v-col class="d-flex align-center justify-center">
				<v-card elevation="8" solo class="pt-3 pb-3 mx-n12 rounded-xl" color="grey darken-3" min-width="620" >
					<v-row justify="space-between" class="align-center ma-0 py-n3 px-3" v-for="x in xObj.num" :key="x.uuid">
						<v-col class="d-flex align-center justify-space-around ma-0 px-1 blockColumn py-1" v-for="y in yObj.num" :key="y.uuid">
							<v-card hover solo color="grey darken-1 rounded" class="px-3" width="200" height="160" >
								<v-row justify="space-around" class="align-center justify-space-between" v-for="z in zObj.num" :key="z.uuid">
        							<v-col class="align-center px-n12 cellColumn" v-for="g in gObj.num" :key="g.uuid">
          								<v-text-field
										v-mask="'#'"
					  					:background-color="!sudoku[(((x-1)*3)+z)-1][(((y-1)*3)+g)-1].value.length ? 'white' : sudoku[(((x-1)*3)+z)-1][(((y-1)*3)+g)-1].wrong === 'true' ? 'red lighten-2' : sudoku[(((x-1)*3)+z)-1][(((y-1)*3)+g)-1].inputType === 'human' ? 'teal lighten-2' : sudoku[(((x-1)*3)+z)-1][(((y-1)*3)+g)-1].inputType === 'machine' ? 'orange lighten-2' : ''"
					  					@input="modifyCell((((x-1)*3)+z)-1,(((y-1)*3)+g)-1)"
										v-model="sudoku[(((x-1)*3)+z)-1][(((y-1)*3)+g)-1].value"
		  								class="mb-n11 pa-0 centered-input cell"
		  								height="48px"
		  								width="40px"
		  								dense
										solo
										single-line
          								>
										</v-text-field>
        							</v-col>
	  							</v-row>
							</v-card>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
		</v-row>
		<v-row justify="center" class="d-flex">
			<v-col class="d-flex justify-center">
				<v-btn :disabled="parseInt(filledCellNum) < 17" class="mr-5" @click="solvePuzzle">Megoldás</v-btn>
				<v-btn :disabled="parseInt(filledCellNum)  == 0" class="mr-5" @click="resetPuzzle">Reset</v-btn>
				<v-btn :disabled="parseInt(filledCellNumMachine)  < 1" class="mr-5" @click="rollBack">Visszaállítás
					<v-icon class="ml-2">
						mdi-arrow-u-left-top
					</v-icon>
				</v-btn>
				<v-btn :disabled='parseInt(filledCellNum) > 80 || parseInt(filledCellNum) < 17' @click="hint">Tipp
					<v-icon class="ml-2">
						mdi-lightbulb-on-outline
					</v-icon>
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
  </v-form>
</template>


<script>
import Cell from "./Cell"
import { v4 as uuidv4 } from 'uuid';
import * as sudoku_library from './Solver.js'

export default {
  name: 'Sudoku',
  components: {
	  Cell,
  },
  data(){
	  return{
	  	sudoku : [
  			[{value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}],
  			[{value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}],
  			[{value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}],
  			[{value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}],
  			[{value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}],
  			[{value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}],
  			[{value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}],
  			[{value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}],
  			[{value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}, {value:"",inputType: "", wrong: "false"}],
				],
			cellNum: null,
			xObj: {uuid: uuidv4(), num:[1,2,3]},
			yObj: {uuid: uuidv4(), num:[1,2,3]},
			zObj: {uuid: uuidv4(), num:[1,2,3]},
			gObj: {uuid: uuidv4(), num:[1,2,3]},
			solveInProgress: "",
			filledCellNum: 0,
			filledCellNumMachine: 0,

	  }
  },
  created() {
	//   Check if sudoku is present
    if (localStorage.sudoku) {
		var tempSudokuObj = localStorage.sudoku.split(";")
		tempSudokuObj.length = 81;
		for (const item of tempSudokuObj){
			var data = item.split(",")
			if(data[2]){
				this.sudoku[data[0]][data[1]].value = parseInt(data[2])
			}
			if(data[3]){
				this.sudoku[data[0]][data[1]].inputType = data[3]
			}
			if(data[4]){
				this.sudoku[data[0]][data[1]].wrong = data[4]
			}	
		}
	
		this.countFilledCells()
    }
  },
  methods: {
	modifyCell(row,col){
	// Clear wrong flag
	this.sudoku[row][col].wrong = "false"
	
	// Check if cell was cleared or filled
	if(this.sudoku[row][col].value.length){
		if(!this.sudoku[row][col].inputType.length){
			this.checkRow(row,col,this.sudoku[row][col].value,"human")
			this.checkColumn(row,col,this.sudoku[row][col].value,"human")
			this.checkBlock(row,col,this.sudoku[row][col].value,"human")
		}
		else{
			this.checkRow(row,col,this.sudoku[row][col].value,this.sudoku[row][col].inputType)
			this.checkColumn(row,col,this.sudoku[row][col].value,this.sudoku[row][col].inputType)
			this.checkBlock(row,col,this.sudoku[row][col].value,this.sudoku[row][col].inputType)
		}	
	}
	// Number was possibly cleared
	else {	
		this.countFilledCells()
		}
},

// Check number in row
checkRow(row,col,num,inputType){
	for (var i=0; i<=8; i++) {
		if (this.sudoku[row][i].value == num && i !== col) {
			if(inputType === 'human'){
				this.sudoku[row][col].wrong = "true"
			}
			return false;
		}
	}
	return true;
},
// Check number in column
checkColumn(row,col,num,inputType){
	for (var i=0; i<=8; i++) {
		if (this.sudoku[i][col].value == num && i !== row) {
			if(inputType === 'human'){
				this.sudoku[row][col].wrong = "true"
			}
			return false;
		}
	}
	return true;
},
// Check number in 3x3 block
checkBlock(row,col,num,inputType){
	// Calculate blockNum
	var blockNum = Math.floor(row/3)*3+Math.floor(col/3)
	// Calculate column
	if(blockNum*3 < 9){
		var column = blockNum*3
	}
	if(blockNum*3 >=9 && blockNum*3 < 16){
		var column = (blockNum*3)-9
	}
	if(blockNum*3 >= 16){
		var column = (blockNum*3)-18
	}
	// Calculate block numbers
	var numbers = [{value:"",x:"",y:""},{value:"",x:"",y:""},{value:"",x:"",y:""},{value:"",x:"",y:""},{value:"",x:"",y:""},{value:"",x:"",y:""},{value:"",x:"",y:""},{value:"",x:"",y:""},{value:"",x:"",y:""}]
	numbers[0].value = this.sudoku[Math.floor(blockNum/3)*3][column].value
	numbers[0].x = Math.floor(blockNum/3)*3
	numbers[0].y = column
	numbers[1].value = this.sudoku[Math.floor(blockNum/3)*3][column+1].value
	numbers[1].x = Math.floor(blockNum/3)*3
	numbers[1].y = column+1
	numbers[2].value = this.sudoku[Math.floor(blockNum/3)*3][column+2].value
	numbers[2].x = Math.floor(blockNum/3)*3
	numbers[2].y = column+2
	numbers[3].value = this.sudoku[Math.floor(blockNum/3)*3+1][column].value
	numbers[3].x = Math.floor(blockNum/3)*3+1
	numbers[3].y = column
	numbers[4].value = this.sudoku[Math.floor(blockNum/3)*3+1][column+1].value
	numbers[4].x = Math.floor(blockNum/3)*3+1
	numbers[4].y = column+1
	numbers[5].value = this.sudoku[Math.floor(blockNum/3)*3+1][column+2].value
	numbers[5].x = Math.floor(blockNum/3)*3+1
	numbers[5].y = column+2
	numbers[6].value = this.sudoku[Math.floor(blockNum/3)*3+2][column].value
	numbers[6].x = Math.floor(blockNum/3)*3+2
	numbers[6].y = column
	numbers[7].value = this.sudoku[Math.floor(blockNum/3)*3+2][column+1].value
	numbers[7].x = Math.floor(blockNum/3)*3+2
	numbers[7].y = column+1
	numbers[8].value = this.sudoku[Math.floor(blockNum/3)*3+2][column+2].value
	numbers[8].x = Math.floor(blockNum/3)*3+2
	numbers[8].y = column+2

	for (var i=0; i<=8; i++) {
		if (numbers[i].value == num && numbers[i].x !== row && numbers[i].y !== col) {
			if(inputType === 'human'){
				this.sudoku[row][col].wrong = "true"
			}
			return false;
		}
	}
	// This is the last checking function so do everything final here
	// Insert input type
	if(!this.sudoku[row][col].inputType.length && this.sudoku[row][col].value.length){
		this.sudoku[row][col].inputType = "human"
	}
	// Count all the numbers
	this.countFilledCells()
	return true;
},

countFilledCells(){
	// Count all cells
	this.filledCellNum = 0
	// Count machine cells
	this.filledCellNumMachine = 0
	// Init new localStorage value
	var tempSudoku = ""
	for(var x=0; x<=8; x++){
		for(var y=0; y<=8; y++){
			if(this.sudoku[x][y].value.length){
				this.filledCellNum++
				if(this.sudoku[x][y].inputType == 'machine'){
					this.filledCellNumMachine++
				}
			}
		tempSudoku = tempSudoku + x + "," + y + "," + this.sudoku[x][y].value + "," + this.sudoku[x][y].inputType + "," + this.sudoku[x][y].wrong + ";"
		}
	}
	// Save current state of the sudoku
	localStorage.sudoku = tempSudoku
},

solvePuzzle(){
	// Generate string for solver
	var sudokuString = ""
	for (var r = 0; r <=8; r++){
		for (var c = 0; c <=8; c++){
			if(this.sudoku[r][c].value.length){
				sudokuString = sudokuString + this.sudoku[r][c].value.toString()
			}
			else {
				sudokuString = sudokuString + "."
				}
			}
		}
		var result = sudoku_library.sudoku.solve(sudokuString)
		if(!result){
			this.$store.commit('setSnackbarMessage', 'Ezt a sudoku-t nem lehet megfejteni!')
        	this.$store.commit('setSnackbarTimeout', 3000)
        	this.$store.commit('setSnackbarTrigger', true)
		}
		else {
			var x = ""
			var y = ""
			var num = ""
			for (var r = 0; r <=8; r++){
				for (var c = 0; c <=8; c++){
					if(!this.sudoku[r][c].value.length){
						this.sudoku[r][c].inputType = "machine"
          				this.sudoku[r][c].value = result[(r*9)+c]
						x = r
						y = c
						num = parseInt(result[(r*9)+c])
					}
				}
			}
			// Update DOM for proper GUI management
			this.$nextTick(()=>{
				this.sudoku[x][y].value = num
			})
			
		}
		this.countFilledCells()
},

hint(){
	// Generate string for solver
	var sudokuString = ""
	for (var r = 0; r <=8; r++){
		for (var c = 0; c <=8; c++){
			if(this.sudoku[r][c].value.length){
				sudokuString = sudokuString + this.sudoku[r][c].value.toString()
				}
			else {
				sudokuString = sudokuString + "."
				}
			}
		}
		var result = sudoku_library.sudoku.solve(sudokuString)
		if(!result){
			this.$store.commit('setSnackbarMessage', 'Ezt a sudoku-t nem lehet megfejteni!')
        	this.$store.commit('setSnackbarTimeout', 3000)
        	this.$store.commit('setSnackbarTrigger', true)
		}
		else {
			var _value = "1"
			var _row = ""
			var _col = ""
			while(_value.length){
				_row = Math.floor(Math.random()*9)
				_col = Math.floor(Math.random()*9)
				_value = this.sudoku[_row][_col].value
			}
			this.sudoku[_row][_col].value = result[(_row*9)+_col]
			// Update DOM for proper GUI management
			this.$nextTick(()=>{
				this.sudoku[_row][_col].inputType = "machine"
			})
			
		}
		this.countFilledCells()
},
// Reset sudoku
resetPuzzle(){
	for (var x = 0; x<=8; x++){
		for (var z = 0; z<=8; z++){
			this.sudoku[x][z].value = ""
			this.sudoku[x][z].inputType = ""
			this.sudoku[x][z].wrong = "false"
		}	
	}
	this.countFilledCells()
	},

// Roll back to original state
rollBack(){
	for (var r = 0; r <=8; r++){
		for (var c = 0; c <=8; c++){
			if(this.sudoku[r][c].inputType === 'machine'){
				this.sudoku[r][c].value = ""
				this.sudoku[r][c].inputType = ""
				this.sudoku[r][c].wrong = "false"	
			}
		}
	}
	this.countFilledCells()
	},
}
}


</script>

<style scoped>
.centered-input >>> input {
      text-align: center
    }


#cell {
  height: 60px;
  width: 20px;
  font-size: 20pt;
}
.cellColumn {
	padding-right: 10px;
	padding-left: 12px;
	margin-right: -20px;
	margin-left: -20px;
}
.cell {
	padding-right: 30px;
	margin-right: 15px;
	margin-left: 12px;
}

</style>
