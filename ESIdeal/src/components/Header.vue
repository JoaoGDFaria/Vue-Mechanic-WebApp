<template>
    <div id="header">
            <p id="idUser" v-if = "idMecanico !== null">Id: {{ idMecanico }}</p>
            <p id="idUser" v-else>  </p>
            <p id="idPosto" v-if = "numeroPosto !== null">Posto nº {{ numeroPosto }}</p>
            <p id="idPosto" v-else>  </p>
    </div>
</template>

<style scoped>
    @import '../assets/header.css';
</style>

<script>
    import { storedData } from '../pinia/piniaFile.js';
    
    export default{
        computed: {
            numeroPosto(){
                const info = storedData();
                return info.getNumeroPosto;
            },
            idMecanico(){
                const info = storedData();
                return info.getIdMecanico;
            }
        }
    }
</script>