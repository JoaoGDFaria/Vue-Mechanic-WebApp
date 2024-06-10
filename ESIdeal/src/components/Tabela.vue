<template>
    <div id="searchButtons" v-if="this.isFinalizado === false">
            <button class="search" @click="todosOsServicosButton()" :class="{ 'non-clickable': $route.path === '/servicos_atribuidos/todos_os_servicos/' + this.currentPage}">Todos os serviços</button>
            <button class="search" @click="servicosAgendadosButton()" :class="{ 'non-clickable': $route.path === '/servicos_atribuidos/servicos_agendados/' + this.currentPage}">Serviços agendados</button>
            <button class="search" @click="servicosNaoAgendadosButton()" :class="{ 'non-clickable': $route.path === '/servicos_atribuidos/servicos_nao_agendados/' + this.currentPage}">Serviços não agendados</button>
        </div>

        <div id="tabelaContainer" v-if="isLoaded">
            <table id="tabelaServicos">
                <tr>
                    <th class="rowButton" @click="sortByDate()">
                        <div class="column">
                            Data de início
                            <img :id="this.dateArrow" :src="this.srcToTriangleDate" alt="Seta">
                        </div>
                    </th>
                    <th>
                        <div class="column">
                            Serviço
                        </div>
                    </th>
                    <th class="rowButton" @click = "sortByDuration()">
                        <div class="column">
                            Duração (min)
                            <img :id="this.durationArrow" :src="this.srcToTriangleDuration" alt="Seta">
                        </div>
                    </th>
                    <th>                        
                        <div class="column">
                            Estado
                        </div>

                    </th>
                </tr>

                <tr class="rowButton" 
                    v-for="service in allServices.slice(serviceIndexStart,serviceIndexEnd)"
                    v-bind:key="service.id"
                    @click="serviceButton(service.id)">

                    <td>{{ formatDateTime(service) }}</td>
                    <td>{{ service.name }} </td>
                    <td>{{ service.length }}</td>
                    <td>
                        <div class="statusItem" :style="{ color: getStatusColor(service.estado) }">
                            {{ service.estado }}
                            <span class="plus">+</span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div id="paginationContent" v-if="isLoaded"> 
            <div id="pagination" v-if="this.allServices.length !== 0">

                <button class="page"
                    v-for="page in this.pagesShown"
                    v-bind:key="page"
                    @click="changePage(page)"
                    :class="{ 'non-clickable': this.currentPage == page || page === '<<' || page === '>>' }">

                    {{ page }}

                </button>

            </div>
        </div>

</template>

<style scoped>
    @import '../assets/tabela.css';
</style>

<script>
    import { storedData } from '../pinia/piniaFile.js';

  export default{
    data(){
      return{
        allServices: [],
        allServicesByDate: [],
        estadoServicosGET: null,
        currentPage : 1,
        tipoServicos: null,
        serviceIndexStart: null,
        serviceIndexEnd: null,
        pagesShown: null,
        srcToTriangleDate: "../../Seta-baixo.png",
        srcToTriangleDuration: "../../Seta-lado.png",
        dateArrow: "columnArrowDown",
        durationArrow: "columnArrowSide",
        isFinalizado: false,
        isLoaded: false,
        numeroPosto: storedData().getNumeroPosto
      }
    },
    async created() {

        this.currentPage = this.$route.params.page;
        this.serviceIndexStart = (this.currentPage - 1) * 7;
        this.serviceIndexEnd = this.currentPage * 7;

        if (this.$route.path.split('/')[1] === "servicos_finalizados"){
            this.estadoServicosGET = "http://localhost:3000/services?estado=Finalizado&_sort=data"
            this.isFinalizado = true
        }

        else{

            this.tipoServicos = this.$route.params.tipoServicos;
            
            if (this.tipoServicos === "todos_os_servicos"){
                this.estadoServicosGET = "http://localhost:3000/services?estado_ne=Finalizado&_sort=data"
            }
            else if (this.tipoServicos === "servicos_agendados"){
                this.estadoServicosGET = "http://localhost:3000/services?estado_ne=Finalizado&agendamento=programado&_sort=data"
            }
            else if (this.tipoServicos === "servicos_nao_agendados"){
                this.estadoServicosGET = "http://localhost:3000/services?estado_ne=Finalizado&agendamento=filaDeEspera&_sort=data"
            }
            else {
                this.$router.push("/notfound")
            }

        }
 
        await this.accessJSON(this.estadoServicosGET);
        await this.filterJSONByPosto();

        this.determinePages(this.currentPage)
        
        if(this.currentPage != 1 && (this.currentPage <=0 || this.currentPage-1 >= (this.allServices.length / 7) )){
            this.$router.push("/notfound")
        }   

        for(let service of this.allServices) {
            service.name = await this.getServiceName(service["service-definitionId"]);
            service.length = await this.getServiceLenght(service["service-definitionId"]);
        }

        this.isLoaded = true


    },
    methods:{
        voltarButton(){
            this.$router.push("/explorador_servicos")
        },
        todosOsServicosButton(){
            window.history.replaceState({}, '', "/servicos_atribuidos/todos_os_servicos/1")
            window.location.reload();
        },
        servicosAgendadosButton(){
            window.history.replaceState({}, '',"/servicos_atribuidos/servicos_agendados/1")
            window.location.reload();
        },
        servicosNaoAgendadosButton(){
            window.history.replaceState({}, '', "/servicos_atribuidos/servicos_nao_agendados/1")
            window.location.reload();
        },
        serviceButton(idService){
            const info = storedData()
            info.setPreviousRoute(this.$route.fullPath)
            this.$router.push("/detalhes_servico/"+idService)
        },
        async accessJSON(command){
            try{
                const response = await fetch(command)
                this.allServices = await response.json()
            }
            catch (error){
                return "Error";
            }
        },
        async filterJSONByPosto(){
            let correctList = []
            for(let i = 0; i < this.allServices.length; i++){
                try{
                    const response = await fetch("http://localhost:3000/vehicles?id="+this.allServices[i].vehicleId)
                    let vehicle = await response.json()
                    let tipo = vehicle[0]["vehicle-typeId"]
                    if ((this.numeroPosto == 1 && (tipo === "Gasolina" || tipo === "Gasóleo")) ||
                        this.numeroPosto == 2 && tipo === "Elétrico" ||
                        this.numeroPosto == 3 && tipo === "Híbrido"){

                        correctList.push(this.allServices[i])
                    }
                }
                catch (error){ return "Error"; }
            }
            this.allServices = correctList.slice()
            this.allServicesByDate = this.allServices.slice()
        },
        formatDateTime(service){
            if ("data" in service){
                return service.data
            }
            else{
                return "-------------------"
            }
        },
        async getServiceLenght(serviceID) {
            try {
                const response = await fetch("http://localhost:3000/service-definitions?id=" + serviceID);
                const service = await response.json();
                return service[0].duração;
            } catch (error) {
                return "Error";
            }
        },
        async getServiceName(serviceID) {
            try {
                const response = await fetch("http://localhost:3000/service-definitions?id=" + serviceID);
                const service = await response.json();
                return service[0].descr;
            } catch (error) {
                return "Error";
            }
        },
        getStatusColor(status){
            if (status === "Não iniciado") {
                return "#2AEC26";
            }
            else if (status === "Pendente") {
                return "#F9E002";
            }
            else {
                return "#F05C48";
            }
        },
        changePage(page) {
            if (page === ">"){ page = parseInt(this.currentPage) + 1 }
            else if (page === "<"){ page = parseInt(this.currentPage) - 1 }

            this.currentPage = page;
            this.serviceIndexStart = (page - 1) * 7;
            this.serviceIndexEnd = page * 7;
            this.determinePages(this.currentPage)

            if (this.isFinalizado) { this.$router.push("/servicos_finalizados/" + this.currentPage); }
            else { this.$router.push("/servicos_atribuidos/" + this.tipoServicos + "/" + this.currentPage); }
        },
        totalAmmountOfPages(){
            if(this.allServices.length % 7 == 0){
                return this.allServices.length / 7
            }
            else {
                return parseInt(this.allServices.length / 7) + 1
            }
        },

        determinePages(page){
            let totalPages = this.totalAmmountOfPages()
            this.pagesShown = [1, "<" ,page, ">", totalPages]
            if (page == 1 ){ this.pagesShown[1] = "<<" }
            if (page == totalPages ){ this.pagesShown[this.pagesShown.length-2] = ">>" }
        },

        sortByDuration(){
            this.allServices.sort((a, b) => {
                return a.length - b.length;
            });
            this.changePage(1)
            this.srcToTriangleDate= "../../Seta-lado.png"
            this.srcToTriangleDuration= "../../Seta-baixo.png"
            this.dateArrow= "columnArrowSide"
            this.durationArrow= "columnArrowDown"
        },

        sortByDate(){
            this.allServices = this.allServicesByDate.slice();
            this.changePage(1)
            this.srcToTriangleDate= "../../Seta-baixo.png"
            this.srcToTriangleDuration= "../../Seta-lado.png"
            this.dateArrow= "columnArrowDown"
            this.durationArrow= "columnArrowSide"
        },
    }
}
</script>