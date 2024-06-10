<template>
    <div id="contentApp">
        <headerComponent></headerComponent>

        <div id="date">
            <p class="time">Data e hora: 09/03/2024 09:50h</p>
        </div>

        <div id="title">
            <h1>Serviços Atribuídos</h1>
        </div>

        <tabelaComponent></tabelaComponent>

        <div id = "footer">
            <button class="voltar" @click="voltarButton()">Voltar</button>   
        </div>

    </div>

    <div id="image">
        <img id="logoImage" src="../../logo.png" alt="Logo">
    </div>
</template>


<style scoped>
  @import '../assets/servicosAtribuidos.css';
</style>


<script>
  import "../assets/body.css"
  import Header from "../components/Header.vue"
  import Tabela from "../components/Tabela.vue"
  export default{
    components:{
        'headerComponent': Header,
        'tabelaComponent': Tabela
    },
    methods:{
        voltarButton(){
            this.$router.push("/explorador_servicos")
        }
    }
}
</script>
