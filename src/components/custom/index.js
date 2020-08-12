import more from "./components/more"

const components = [
    more
]

export default {
    install(Vue){
        components.forEach(component=>{
            Vue.component(component.name,component)
        })
    }
}