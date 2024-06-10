<template>
    <div id="contentApp">
        <headerComponent></headerComponent>

        <div id="date">
            <p class="time">Data e hora: 09/03/2024 09:50h</p>
        </div>

        <div id="title">
            <h1>Serviço a decorrer</h1>
        </div>

        <div id = "servicoInfo">
            <p id="servico"><b>Nome do serviço:</b>  {{ this.serviceInfo.serviceName }} </p>
            <p id="dataInicio"><b>Data de início:</b> {{ this.serviceInfo.dataInicio }} </p>
            <p id="servicosAdd"><b>Serviços adicionais:</b> </p>
                    
            <div id="dropdown">
                <div @click="show = !show">
                    <label id="dropdownTexto">----------------</label>
                </div>
                <div class="dropdown-body" v-show="show">
                    <div v-for="(option, index) in possibleServices" :key="index">
                        <input type="checkbox" :id="option[0]" :checked="selectedIDs.includes(option[0])" @change.stop="updateSelected(option[0])">
                        <label :for="option[0]" @change.stop="updateSelected(option[0])">{{ option[1] }}</label>
                    </div>
                </div>
            </div>
        </div>

        <div id = "footer">
            <button class="terminarButton" @click="terminarButton()">Terminar</button>   
            <button class="suspenderButton" @click="suspenderButton()">Suspender</button>
        </div>

    </div>

    <div id="image">
        <img id="logoImage" src="../../logo.png" alt="Logo">
    </div>
</template>


<style scoped>
    @import '../assets/servicosDecorrer.css';
</style>

<script>
    import '../assets/body.css'
    import Header from '../components/Header.vue'
    export default {
        data(){
            return{
                id: this.$route.params.id,
                serviceInfo: {},
                show: false,
                possibleServices: [],
                selectedIDs: []

            }
        },
        components:{
            'headerComponent': Header
        },
        async created() { 
            if (!(await this.getServiceInfoFromServices() &&
                    await this.getServiceInfoFromServiceDefinitions() &&
                    await this.getServiceInfoFromVehicles() &&
                    await this.getAdditionalServices() &&
                    await this.getOptionsReady())){
                //this.$router.push("/notfound")
            }
        },
        methods: {
            async terminarButton() {
                await this.updateServiceInfo()
                window.history.replaceState({}, '', "/servicos_atribuidos/todos_os_servicos/1")
                window.location.reload();
            },

            async suspenderButton() {
                await this.updateServiceInfo()
                this.$router.push('/suspensao_servico/'+this.id)
            },

            updateSelected(option) {
                let flag = this.selectedIDs.includes(option);
                if (!flag) {
                    this.selectedIDs.push(option);
                } else {
                    this.selectedIDs = this.selectedIDs.filter(id => id !== option);
                }    
            },

            async getServiceInfoFromServices() {
                try{
                    const response = await fetch("http://localhost:3000/services?id="+this.id)
                    const service = await response.json()
                    this.serviceInfo.id = this.id;
                    this.serviceInfo.matricula = service[0].vehicleId;
                    this.serviceInfo.dataInicio = service[0].data;

                    // If there are additional services, they are added to the selectedIDs array
                    if (service[0].servicosAdicionais != null && service[0].servicosAdicionais.length > 0){
                        this.selectedIDs = service[0].servicosAdicionais;
                        
                        // Clearing the servicosAdicionais field in the service
                        fetch ('http://localhost:3000/services/'+ this.id, {
                            method : 'PATCH',
                            headers : {
                            'Content-Type': 'application/json'
                            },
                            body : JSON.stringify({
                                servicosAdicionais: []
                            })
                        })
                    }


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
                    this.serviceInfo.tipo = service[0]["vehicle-typeId"];
                    return true;
                }
                catch (error){
                    return false;
                }
            },

            async getAdditionalServices(){
                try{
                    const response = await fetch("http://localhost:3000/vehicle-types?id="+this.serviceInfo.tipo)
                    const services = await response.json()
                    for (let i = 0; i < services[0].serviços.length; i++){
                        if( services[0].serviços[i] != this.serviceInfo.serviceID){
                            this.possibleServices.push(services[0].serviços[i]);
                        }
                    }
                    return true;
                }
                catch (error){
                    return false;
                }
            },

            async getOptionsReady(){

                this.possibleServices.sort();

                for (let i = 0; i < this.possibleServices.length; i++){
                    this.possibleServices[i] = [this.possibleServices[i], await this.getServiceName(this.possibleServices[i])];
                }

            },

            async getServiceName(serviceID){
                try{
                    const response = await fetch("http://localhost:3000/service-definitions?id="+serviceID)
                    const service = await response.json()
                    return service[0].descr;
                }
                catch (error){
                    return "Failed to fetch service name!";
                }
            },

            async updateServiceInfo(flag){
                if (flag){
                    if (this.selectedIDs.length > 0){
                        try{
                            fetch ('http://localhost:3000/services/'+ this.serviceInfo.id, {
                                method : 'PATCH',
                                headers : {
                                'Content-Type': 'application/json'
                                },
                                body : JSON.stringify({
                                    servicosAdicionais: this.selectedIDs
                                })
                            })
                        }
                        catch{
                            console.log("Error")
                        }
                    }
                }
                else{
                    if (this.selectedIDs.length > 0){
                        try{
                            fetch ('http://localhost:3000/services/'+ this.serviceInfo.id, {
                                method : 'PATCH',
                                headers : {
                                'Content-Type': 'application/json'
                                },
                                body : JSON.stringify({
                                    estado: "Finalizado",
                                    servicosAdicionais: this.selectedIDs
                                })
                            })
                        }
                        catch{
                            console.log("Error")
                        }
                    }
                    else{
                        try{
                            fetch ('http://localhost:3000/services/'+ this.serviceInfo.id, {
                                method : 'PATCH',
                                headers : {
                                'Content-Type': 'application/json'
                                },
                                body : JSON.stringify({
                                    estado: "Finalizado",
                                })
                            })
                        }
                        catch{
                            console.log("Error")
                        }
                    }
                }
            }

        }
    }
</script>