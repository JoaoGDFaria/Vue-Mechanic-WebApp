import { createRouter, createWebHistory } from 'vue-router';
import Posto from '../pages/Posto.vue';
import Login from '../pages/Login.vue';
import ExploradorServicos from '../pages/ExploradorServicos.vue'; 
import ServicosAtribuidos from '../pages/ServicosAtribuidos.vue'; 
import DetalhesServico from '../pages/DetalhesServico.vue';
import ServicosDecorrer from '../pages/ServicosDecorrer.vue';
import SuspensaoServico from '../pages/SuspensaoServico.vue';
import ServicosFinalizados from '../pages/ServicosFinalizados.vue';
import NotFound from '../pages/NotFound.vue';
  
const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', redirect: '/posto'},
      { path: '/posto', component: Posto},
      { path: '/login', component: Login },
      { path: '/explorador_servicos', component: ExploradorServicos },
      { path: '/servicos_atribuidos/:tipoServicos/:page', component: ServicosAtribuidos },
      { path: '/servicos_finalizados/:page', component: ServicosFinalizados },
      { path: '/detalhes_servico/:id', component: DetalhesServico },
      { path: '/servicos_decorrer/:id', component: ServicosDecorrer },
      { path: '/suspensao_servico/:id', component: SuspensaoServico },
      { path: '/:notFound(.*)', component: NotFound} 
    ],
});

export default router;