<template>
    <div id="contentApp">
        <headerComponent></headerComponent>

        <div id="image">
          <img src="../../logo.png" alt="Logo">
        </div>

        <div id="separator"></div>

        <div id="info">
            <h1>Login</h1>

            <p class="inputTitle">Identificador:</p>
            <input type="text" v-model="idInput">

            <p class="inputTitle">Palavra-passe:</p>
            <input type="password" v-model="passwordInput">

            <div v-if="isVisible" id="errorPopUp">
                <p id="messageError">{{ this.messageError }}</p>
            </div>
            
            <br>
            <button id ="voltar" ref="buttonSwitch" @click="voltarButton()">Voltar</button>
            <button id ="entrar" ref="buttonSwitch" @click="loginButton()">Entrar</button>

        </div>
    </div>
</template>

<style scoped>
  @import '../assets/login.css';
</style>

<script>
  import "../assets/body.css"
  import Header from "../components/Header.vue"
  import { storedData } from '../pinia/piniaFile.js';

  export default{
    data(){
      return{
        isVisible: false,
        idInput: "",
        passwordInput: "",
        allMecanics: [],
        messageError: "",
        numeroPosto: null
      }
    },
    components:{
      'headerComponent': Header
    },
    async created() {
      await this.accessJSON("http://localhost:3000/mechanics")

      const info = storedData()
      this.numeroPosto = info.getNumeroPosto
    },
    methods:{
      loginButton(){
        for(let i = 0; i < this.allMecanics.length; i++){
          if(this.idInput == this.allMecanics[i].id && this.passwordInput == this.allMecanics[i].password){
            if(this.allMecanics[i].posto == this.numeroPosto){
              const info = storedData();
              info.setIdMecanico(this.idInput);
              this.$router.push("/explorador_servicos")
            } else {
              this.messageError = "Não tem permissões para aceder a este posto."
              this.isVisible = true;
              this.$refs.buttonSwitch.style.marginTop = "2%";
            }
            return
          }
        }
        this.messageError = "Identificador e/ou palavra passe inválidos."
        this.isVisible = true;
        this.$refs.buttonSwitch.style.marginTop = "2%";
      },
      voltarButton(){
        const info = storedData();
        info.setNumeroPosto(null);
        this.$router.push("/posto")
      },
      async accessJSON(command){
        try{
            const response = await fetch(command)
            this.allMecanics = await response.json()
        }
        catch (error){
            return "Error";
        }
      },

    }
  }
</script>