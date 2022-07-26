<template>
    <div ref="containerRef" class="container" @scroll="handleScroll($event)">
        <div class="container-placeholder" :style="{height:listHeight+'px'}"></div>
        <div ref="listRef" class="container-list" :style="{transform:'translate3d(0,'+top+'px,0)'}">
            <div
                ref="items"
                v-for="item in visibleData"
                :key="item.index"
                :id="item.index"
                class="container-item"
            >
                <slot :item="item"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "virtualList2",
    props: {
        estimateHeight: Number,
        list: Array
    },
    data() {
        return {
            screenHeight: 0,
            start: 0,
            end: 10,
            top: 0,
            tick: false,
            positions: [],
            bufferScale: 1
        }
    },
    computed: {
        visibleData() {
            let {start, end} = this
            start = Math.ceil(start, start - 2);
            end = end + 2;
            const res = this.list.slice(start, end)
            return res
        },
        // 列表总高度
        listHeight() {
            let res = this.positions[this.positions.length - 1].bottom
            return res
        },
        visibleCount() {
            return Math.ceil(this.screenHeight / this.estimateHeight);
        },
    },
    created() {
        this.initPositions()
    },
    mounted() {
        this.screenHeight = this.$el.clientHeight;
        this.end = this.start + this.visibleCount
    },
    updated() {
        const nodes = this.$refs.items
        nodes.forEach(node => {
            const rect = node.getBoundingClientRect()
            const height = rect.height
            const index = +node.id.slice(1)
            const oldHeight = this.positions[index].height
            const diffHeight = oldHeight - height
            if (diffHeight) {
                const pos = this.positions[index]
                pos.height = height
                pos.bottom = pos.bottom - diffHeight
                this.positions[index + 1].top = this.positions[index].bottom
            }
        })
    },
    methods: {
        initPositions() {
            this.positions = this.list.map((item, index) => {
                return {
                    index,
                    height: this.estimateHeight,
                    top: index * this.estimateHeight,
                    bottom: (index + 1) * this.estimateHeight
                }
            })
        },
        // 获取列表起始索引
        getStartIndex(scrollTop = 0) {
            console.time(1)
            // let index = this.positions.find(i => i && i.bottom >= scrollTop).index
            let index = this.fn(this.positions, scrollTop)
            console.log(index)
            console.timeEnd(1)
            return index
        },
        // 10 20 30  40  50 60 70 / 12
        fn(nums, target) {
            const n = nums.length
            let left = 0, right = n - 1, index = n
            while (left <= right) {
                const midIndex = parseInt((left + right) / 2)
                const midValue = nums[midIndex].bottom
                if (midValue === target) {
                    return midIndex + 1
                } else if (midValue < target) {
                    left = midIndex + 1
                } else if (midValue > target) {
                    if (index > midIndex) {
                        index = midIndex
                    }
                    right = right -1
                }
            }
            return index
        },
        // 获取当前的偏移量
        setStartOffset() {
            let startOffset
            if (this.start >= 1) {
                startOffset = this.positions[this.start - 1].bottom
            } else {
                startOffset = 0;
            }
            this.top = startOffset
        },
        handleScroll() {
            if (!this.tick) {
                requestAnimationFrame(this.scrollFunc)
                this.tick = true
            }
        },
        scrollFunc() {
            let scrollTop = this.$refs.containerRef.scrollTop
            const {visibleCount} = this
            this.start = this.getStartIndex(scrollTop)
            this.end = this.start + visibleCount
            this.setStartOffset();

            this.tick = false
        }
    }
}
</script>

<style>
.container {
    position: relative;
    width: 100%;
    margin: auto;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
}


.container-list {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
}

.container-item {
    box-sizing: border-box;
}
</style>

