<template>
    <div id="contentApp">
        <headerComponent></headerComponent>

        <div id="date">
            <p class="time">Data e hora: 09/03/2024 09:50h</p>
        </div>

        <div id="title">
            <h1>Suspensão de serviço</h1>
        </div>

        <div id="separator"></div>

        <div id="infoClient">
            <h1 class="title">Serviço:</h1>
            <ul>
                <li>Id:
                    <div class="boxInfo">
                        <p class="infoContent">{{ this.serviceInfo.id }}</p>
                    </div>
                </li>
                
                <li>Nome:
                    <div class="boxInfo">
                        <p class="infoContent">{{ this.serviceInfo.serviceName }}</p>
                    </div>
                </li>

                <li>Duração (min):
                    <div class="boxInfo">
                        <p class="infoContent">{{ this.serviceInfo.duracao }}</p>
                    </div>
                </li>
            </ul>
        </div>


        <div id="infoService">
            <h1 class="title">Motivo:</h1>
            <form>
                <textarea v-model="userInput" rows="10" cols="30" id="reasonInput" placeholder="Por favor insira um motivo pelo qual deseja suspender o serviço ..."></textarea>
            </form>
        </div>

        <div id = "footer">
            <button class="voltar" @click="voltarButton()">Voltar</button>  
            <button class="iniciar" v-bind:class="{ 'nonClickable': userInput=='' }" @click="confirmarButton()">Confirmar</button>   
        </div>
    </div>

    <div id="image">
        <img id="logoImage" src="../../logo.png" alt="Logo">
    </div>

</template>

<style scoped>
  @import '../assets/suspensaoServico.css';
</style>

<script>
    import "../assets/body.css"
    import Header from "../components/Header.vue"
    export default{
        data(){
            return{
                id: this.$route.params.id,
                serviceInfo: {},
                userInput: ""
            }
        },
        components:{
            'headerComponent': Header
        },
        async created() { 
            if (!(await this.getServiceInfoFromServices() && await this.getServiceInfoFromServiceDefinitions())){
                this.$router.push("/notfound")
            }
        },
        methods:{
            voltarButton(){
                this.$router.push("/servicos_decorrer/"+this.id) 
            },
            async confirmarButton(){
                await this.updateServiceInfo()
                window.history.replaceState({}, '', "/servicos_atribuidos/todos_os_servicos/1")
                window.location.reload();
            },

            async getServiceInfoFromServices() {
                try{
                    const response = await fetch("http://localhost:3000/services?id="+this.id)
                    const service = await response.json()
                    this.serviceInfo.id = this.id;
                    this.serviceInfo.serviceID = service[0]["service-definitionId"];
                    this.serviceInfo.descricao = service[0].descrição
                    return true;
                }
                catch (error){
                    return false;
                }
            },
            async getServiceInfoFromServiceDefinitions(){
                try{
                    const response = await fetch("http://localhost:3000/service-definitions?id="+this.serviceInfo.serviceID)
                    const service = await response.json()
                    this.serviceInfo.serviceName = service[0].descr;
                    this.serviceInfo.duracao = service[0].duração;
                    return true;
                }
                catch (error){
                    return false;
                }
            },

            async updateServiceInfo(){
                try{
                    fetch ('http://localhost:3000/services/'+ this.serviceInfo.id, {
                        method : 'PATCH',
                        headers : {
                        'Content-Type': 'application/json'
                        },
                        body : JSON.stringify({
                            estado: "Pendente",
                            descrição: this.userInput
                        })
                    })
                }
                catch{
                    console.log("Error")
                }
            }
        }
    }
</script>