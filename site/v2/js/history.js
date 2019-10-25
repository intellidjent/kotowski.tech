function historyInit() {
    if (localStorage.historyItems) {
        const histor = JSON.parse(localStorage.getItem('historyItems'))
        return histor
    } else {
        const historyItems = []
        localStorage.setItem('historyItems', JSON.stringify(historyItems))
        return historyItems
    }
}