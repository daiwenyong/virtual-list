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
                <slot :item="item" />
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
            buffer: 5 // 缓存数，防止滑动过快页面白屏
        }
    },
    computed: {
        visibleData() {
            let { start, end, list, buffer } = this
            start = Math.max(start - buffer, 0)
            end = end + buffer
            const res = list.slice(start, end)
            return res
        },
        // 列表总高度
        listHeight() {
            return this.positions[this.list.length - 1].bottom
        },
        visibleCount() {
            return Math.ceil(this.screenHeight / this.estimateHeight);
        },
    },
    created() {
        this.initPositions()
    },
    mounted() {
        this.screenHeight = this.$el.clientHeight
        this.end = this.start + this.visibleCount
    },
    updated() {
        const nodes = this.$refs.items
        nodes.forEach(node => {
            const rect = node.getBoundingClientRect()
            const height = rect.height
            const index = +node.id
            const oldHeight = this.positions[index].height
            const diffHeight = oldHeight - height
            if (diffHeight) {
                const pos = this.positions[index]
                pos.height = height

                let bot = index === 0 ? 0 : this.positions[index - 1].bottom
                pos.bottom = height + bot
            }
        })
    },
    methods: {
        initPositions() {
            this.positions = this.list.map((item, index) => {
                return {
                    index,
                    height: this.estimateHeight,
                    bottom: (index + 1) * this.estimateHeight
                }
            })
        },
        // 获取列表起始索引
        getStartIndex(scrollTop = 0) {
            // console.time(1) // 测试1w条数据
            // let index = this.positions.find(i => i && i.bottom >= scrollTop).index // 9 10ms
            let index = this.binarySearch(this.positions, scrollTop) // 1ms内
            // console.timeEnd(1)
            return index
        },
        binarySearch(nums, target) {
            if (target === 0) return 0
            const len = nums.length
            let left = 0, right = len - 1

            while (left <= right) {
                const middleIndex = Math.floor((left + right) / 2)
                const middleVal = nums[middleIndex].bottom
                if (left === right || target === middleVal || target > middleVal && target < nums[middleIndex + 1].bottom) {
                    return middleIndex
                } else if (middleVal > target) {
                    right = middleIndex - 1
                } else if (middleVal < target) {
                    left = middleIndex + 1
                }
            }
            return -1
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
            this.start = this.getStartIndex(scrollTop)
            this.end = this.start + this.visibleCount
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

