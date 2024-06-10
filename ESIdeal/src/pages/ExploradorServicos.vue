<template>
    <div id="contentApp">
        <headerComponent></headerComponent>

        <div id="image">
            <img src="../../logo.png" alt="Logo">
        </div>

        <div id="datetime">
            <p class="time">Data e hora: 09/03/2024 09:50h</p>
        </div>

        <div id="info">
            <h1>Explorador de serviços:</h1>

            <button class="menuButton" @click="servAtrButton()">Serviços Atribuídos</button>
            <br>
            <button class="menuButton" @click="servFinButton()">Serviços Finalizados</button>

        </div>


        <div id = "footer">
            <button class="logout" @click="logoutButton()">Logout</button>   
        </div>
        
    </div>
</template>

<style scoped>
  @import '../assets/exploradorServicos.css';
</style>


<script>
  import "../assets/body.css"
  import Header from "../components/Header.vue"
  import { storedData } from '../pinia/piniaFile.js';

  export default{
    components:{
      'headerComponent': Header
    },
    methods:{
      logoutButton(){
        const info = storedData()
        info.setIdMecanico(null)
        this.$router.push("/login")
      },
      servAtrButton(){
        this.$router.push("/servicos_atribuidos/todos_os_servicos/1")
      },
      servFinButton(){
        this.$router.push("/servicos_finalizados/1")
      }
    }
  }
</script>