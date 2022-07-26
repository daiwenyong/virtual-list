import faker from 'faker'
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
export function getData2() {
    const data = []
    for (let i = 0; i < 1000; i++) {
        data.push({
            title: faker.lorem.sentences(),
            index: i
        })
    }
    return data
}
