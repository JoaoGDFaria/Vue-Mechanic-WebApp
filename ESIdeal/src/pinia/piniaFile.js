import { defineStore } from 'pinia';

export const storedData = defineStore('counter', {
    state: () => ({
        idMecanico: localStorage.getItem('idMecanico') || null,
        numeroPosto: localStorage.getItem('idPosto') || null,
        previousRoute: localStorage.getItem('previousRoute') || null
    }),
    getters: {
        getNumeroPosto() {
            return this.numeroPosto;
        },
        getIdMecanico() {
            return this.idMecanico;
        },
        getPreviousRoute() {
            return this.previousRoute;
        }
    },
    actions: {
        setNumeroPosto(numeroPosto) {
            this.numeroPosto = numeroPosto;
            localStorage.setItem('idPosto', numeroPosto);
        },
        setIdMecanico(idMecanico) {
            this.idMecanico = idMecanico;
            localStorage.setItem('idMecanico', idMecanico);
        },
        setPreviousRoute(previousRoute) {
            this.previousRoute = previousRoute;
            localStorage.setItem('previousRoute', previousRoute);
        }
    }
});
