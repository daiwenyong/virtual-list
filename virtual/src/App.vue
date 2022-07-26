<template>
    <div class="app">
        <div>
            <h2>定高</h2>
            <virtual-list
                :list="datalist"
                :itemHeight="100"
                v-slot="{item}">
                <div class="virtual-item">
                    <span style="color: red">{{item.index}}</span>{{ item.title }}
                </div>
            </virtual-list>
        </div>
        <div>
            <h2>不定高</h2>
        </div>
    </div>
</template>

<script>
import VirtualList from './weights/VirtualList'

import { getData } from "./config"

export default {
    name: 'App',
    components: {
        VirtualList
    },
    data(){
        return{
            datalist:getData()
        }
    }
}
</script>
<style>
.app {
    width: 800px;
    height: 600px;
    margin: 50px auto;
    border: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-around;
}
.virtual-item{
    box-sizing: border-box;
    border: 1px solid #e8e8e8;
    height: 100px;
}

</style>
