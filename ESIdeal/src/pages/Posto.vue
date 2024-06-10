<template>
    <div id="app">
        <headerComponent></headerComponent>

        <div id="image">
            <img src="../../logo.png" alt="Logo">
        </div>

        <div id="datetime">
            <p class="time">Data e hora: 09/03/2024 09:50h</p>
        </div>

        <div id="info">
            <h1>Escolha um posto:</h1>

            <button class="menuButton" @click=goToLogin(1)>Posto 1: Motores a combustão</button>
            <br>
            <button class="menuButton" @click=goToLogin(2)>Posto 2: Motores elétricos</button>
            <br>
            <button class="menuButton" @click=goToLogin(3)>Posto 3: Motores híbridos</button>
        </div>


        <div id = "footer"></div> 
    </div>
</template>


<style scoped>
  @import '../assets/posto.css';
</style>

<script>
    import "../assets/body.css"
    import Header from "../components/Header.vue"
    import { storedData } from '../pinia/piniaFile.js';

    export default{
        created () {
            const info = storedData();
            info.setNumeroPosto(null);
            info.setIdMecanico(null);
        },
        components:{
            'headerComponent': Header
        },
        methods:{
            goToLogin(numero){
                const info = storedData();
                info.setNumeroPosto(numero);
                this.$router.push("/login")
            }
        }
    }
</script>