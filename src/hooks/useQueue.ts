const Sequence = function() {}

Sequence.prototype.enqueue = function(fn: Function) {
  this.tail = this.tail ? this.tail.finally(fn) : fn()
}

type SequenceType = {
  tail?: Function
  enqueue: Function
}
// @ts-ignore
export const useQueue = (): SequenceType => new Sequence()
