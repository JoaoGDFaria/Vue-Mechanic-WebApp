<template>
    <div id="contentApp">
        <headerComponent></headerComponent>

        <div id="date">
            <p class="time">Data e hora: 09/03/2024 09:50h</p>
        </div>

        <div id="title">
            <h1>Detalhes do serviço</h1>
        </div>

        <div id="separator"></div>

        <div id="infoClient">
            <h1 class="title">Cliente:</h1>
            <ul>
                <li>Nome:
                    <div class="boxInfo">
                        <p class="infoContent">{{ this.serviceInfo.clientName }}</p>
                    </div>
                </li>
                
                <li>Contacto:
                    <div class="boxInfo">
                        <p class="infoContent">{{ this.serviceInfo.contacto }}</p>
                    </div>
                </li>

                <li>Matrícula do Veículo:
                    <div class="boxInfo">
                        <p class="infoContent">{{ this.serviceInfo.matricula }}</p>
                    </div>
                </li>

                <li>Tipo de Veículo:
                    <div class="boxInfo">
                        <p class="infoContent">{{ this.serviceInfo.tipo }}</p>
                    </div>
                </li>
            </ul>
        </div>


        <div id="infoService">
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

                <li>Horário de finalização:
                    <div class="boxInfo">
                        <p class="infoContent">{{ this.serviceInfo.duracao }}</p>
                    </div>
                </li>

                <li>Informações:
                    <div class="boxInfo">
                        <p class="infoContent">{{ this.serviceInfo.informacoes }}</p>
                    </div>
                </li>
            </ul>
        </div>

        

        <div id = "footer">
            <button class="voltar" @click="voltarButton()">Voltar</button>  
            <button v-if="this.iniciarButtonStatus !== 'Finalizado'" class="iniciar" @click="iniciarButton()">Iniciar</button>
        </div>

    </div>

    <div id="image">
        <img id="logoImage" src="../../logo.png" alt="Logo">
    </div>
</template>

<style scoped>
  @import '../assets/detalhesServico.css';
</style>

<script>
    import "../assets/body.css"
    import Header from "../components/Header.vue"
    import { storedData } from '../pinia/piniaFile.js';

    export default{
        data(){
            return{
                id: this.$route.params.id,
                serviceInfo: {},
                iniciarButtonStatus: "Finalizado"
            }
        },
        components:{
            'headerComponent': Header
        },
        async created() { 
            if (!(await this.getServiceInfoFromServices() && await this.getServiceInfoFromServiceDefinitions() && await this.getServiceInfoFromVehicles() && await this.getServiceInfoFromClients())){
                this.$router.push("/notfound")
            }
        },
        methods:{
            voltarButton(){
                const info = storedData()
                this.$router.push(info.getPreviousRoute) 
            },
            iniciarButton(){
                this.$router.push("/servicos_decorrer/"+this.id)
            },

            async getServiceInfoFromServices() {
                try{
                    const response = await fetch("http://localhost:3000/services?id="+this.id)
                    const service = await response.json()
                    this.serviceInfo.id = this.id;
                    this.serviceInfo.matricula = service[0].vehicleId;
                    this.serviceInfo.informacoes = service[0].descrição;
                    if (this.serviceInfo.informacoes === ""){
                        this.serviceInfo.informacoes = "Nenhuma"
                    }
                    this.serviceInfo.estado = service[0].estado;
                    this.iniciarButtonStatus = this.serviceInfo.estado.slice()

                    this.serviceInfo.serviceID = service[0]["service-definitionId"];
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
            async getServiceInfoFromVehicles(){
                try{
                    const response = await fetch("http://localhost:3000/vehicles?id="+this.serviceInfo.matricula)
                    const service = await response.json()
                    this.serviceInfo.clienteID = service[0].clientId;
                    this.serviceInfo.tipo = service[0]["vehicle-typeId"];
                    return true;
                }
                catch (error){
                    return false;
                }
            },
            async getServiceInfoFromClients(){
                try{
                    const response = await fetch("http://localhost:3000/clients?id="+this.serviceInfo.clienteID)
                    const service = await response.json()
                    this.serviceInfo.clientName = service[0].nome;
                    this.serviceInfo.contacto = service[0].telefone;
                    return true;
                }
                catch (error){
                    return false;
                }
            }
        }
    }
</script>