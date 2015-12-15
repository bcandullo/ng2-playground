/// <reference path="../typings/rx/rx.d.ts" />

// simple custom event pubsub wrapped around rx
export class RxEmitterService {
    static instance:RxEmitterService
    private subjects

    constructor() {
        this.subjects = {}
    }

    private createName(name:string):string {
        return `$${name}`
    }

    public emit(name:string, data:any) {
        let fnName = this.createName(name)
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject())
        this.subjects[fnName].onNext(data)
    }

    public listen(name:string, handler:Function) {
        let fnName = this.createName(name)
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject())
        return this.subjects[fnName].subscribe(handler)
    }

    // would be more useful to dispose a topic instead...
    public dispose() {
        let subjects = this.subjects
        let hasOwnProp = {}.hasOwnProperty
        for (let prop in subjects) {
            if (hasOwnProp.call(subjects, prop)) {
                subjects[prop].dispose()
            }
        }
        this.subjects = {}
    }

    public instance() {
        if (!RxEmitterService.instance) {
            RxEmitterService.instance = new RxEmitterService()
        }
        return RxEmitterService.instance
    }

}

export const RXEMITTER_SERVICE_BINDINGS = [
    RxEmitterService
]