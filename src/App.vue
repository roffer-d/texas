<template>
  <div>
    <router-view />
  </div>
</template>

<script>
  import {mapActions,mapMutations,mapGetters} from 'vuex'

  export default {
    name: "index",
    computed:{
      ...mapGetters({
        //使用带名字空间store
        data: 'common/data',
      })
    },
    data(){
      return{

      }
    },
    mounted() {
      this.update(this.data.concat([{id:2,name:'test2'}]))
    },
    methods:{
      ...mapActions({
        update: 'common/updateData' // 将 `this.update()` 映射为 `this.$store.dispatch('updateData')`
      })
    }
  }
</script>

<style scoped>

</style>