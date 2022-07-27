<template>
    <div class="app">
        <div>
            <h2>定高</h2>
            <virtual-list
                :list="datalist"
                :itemHeight="100"
                class="virtual-list"
                v-slot="{item}">
                <div class="virtual-item" style="height: 100px">
                    <span style="color: red">{{item.index}}</span>{{ item.title }}
                </div>
            </virtual-list>
        </div>
        <div>
            <h2>不定高</h2>
            <virtual-list2
                :list="datalist2"
                :estimateHeight="100"
                class="virtual-list"
                v-slot="{item}">
                <div class="virtual-item" style="min-height: 100px">
                    <span style="color: red">{{item.index}}</span>{{ item.title }}
                </div>
            </virtual-list2>
        </div>
    </div>
</template>

<script>
import VirtualList from './weights/VirtualList'
import VirtualList2 from './weights/VirtualList2'

import { getData,getData2 } from "./config"

export default {
    name: 'App',
    components: {
        VirtualList,
        VirtualList2
    },
    data(){
        return{
            datalist:getData(),
            datalist2:getData2(),
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
.virtual-list{
    width: 300px;
    height: 500px;
    box-sizing: border-box;
    border: 1px solid #e8e8e8;
}
.virtual-item{
    box-sizing: border-box;
    border-bottom: 1px solid #e8e8e8;
}

</style>
