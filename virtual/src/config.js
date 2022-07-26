export function getData(str='fixed') {
    const data = []
    for (let i = 0; i < 1000; i++) {
        data.push({
            title: `fixed height:now is ${i + 1}`,
            index: i
        })
    }
    return data
}
