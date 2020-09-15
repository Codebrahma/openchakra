import merge from 'lodash/merge'

const mergeObject = (object1: any, object2: any) => merge({}, object1, object2)

export default mergeObject
