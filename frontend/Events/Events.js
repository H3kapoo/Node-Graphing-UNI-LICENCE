export class Events {
    static notifyTriggerRenderLoop
    static notifyTriggerRenderOnce

    static init() {
        this.notifyTriggerRenderLoop = new Event("notifyTriggerRenderLoop");
        this.notifyTriggerRenderOnce = new Event("notifyTriggerRenderOnce")
        return new Events();
    }
}