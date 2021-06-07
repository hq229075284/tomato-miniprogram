function createId() {
    return (new Date().valueOf() + Math.random().toString(36).substr(0, 3))
}

function createTaskFromTemplate() {
    return {
        id: createId(),
        name: '',
        turnNum: 0,
        remark: '',
        isComplete: false,
        children: []
    }
}
module.exports = {
    createId,
    createTaskFromTemplate
}