// import faker from 'faker'
export function getData() {
    const data = []
    for (let i = 0; i < 1000; i++) {
        data.push({
            title: `fixed height:now is`,
            index: i
        })
    }
    return data
}
const a = '斯文·本德尔在2009年夏天从慕尼黑1860转会至多特蒙德，在至今的八个赛季里'
const b = '，他代表大黄蜂在各项赛事中共出场224次，攻入4球。其间率队获得过两次德甲冠军、两次德国杯冠军，以及两次德国超级杯冠军斯文·本德尔在2009年夏天从慕尼黑1860转会至多特蒙德，在至今的八个赛季里，他代表大黄蜂在各项赛事中共出场224次，攻入4球。其间率队获得过两次德甲冠军、两次德国杯冠军，以及两次德国超级杯冠军'
export function getData2() {
    const data = []
    for (let i = 0; i < 100000; i++) {
        data.push({
            // title: faker.lorem.sentences(),
            title: i%2===0?b:a,
            index: i
        })
    }
    return data
}
