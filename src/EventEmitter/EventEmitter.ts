type Callback = (...args: any[]) => void;

export class EventEmitter {
  private _events: Record<string, Callback[]> = {};

  protected on(key: string, listener: Callback) {
    if(!this._events[key]){
      this._events[key] = [];
    }
    this._events[key].push(listener);
    return this;
  }

  protected off(key: string, listener: Callback) {
    if(this._events[key]) {
      if(listener instanceof Function) {
        const idx = this._events[key].indexOf(listener);
        if(idx !== -1){
            this._events[key].splice(idx, 1);
        }
      } else {
        delete this._events[key];
      }
    }
    return this;
  }

  protected emit(key: string, ...args: any[]) {
    if(this._events[key]) {
      const listeners = this._events[key].slice();
      for (const listener of listeners) {
        listener.apply(this, args);
      }
    }
    return this;
  }

  protected once(key: string, listener: Callback) {
    const self = this;
    this.on(key, function cb(...args: any[]){
      self.off(key, cb);
      listener.apply(self, args);
    });
    return this;
  }
}
