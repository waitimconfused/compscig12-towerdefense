import { View } from "./view.js";
export class ViewCollection extends View {
    _currentView;
    get currentView() { return this._currentView; }
    constructor() {
        super();
        this.addEventListener("show", () => {
            let view = this.views.get(this._currentView);
            if (!view)
                return;
            view.dispatchEvent("show");
        });
        this.addEventListener("hide", () => {
            let view = this.views.get(this._currentView);
            if (!view)
                return;
            view.dispatchEvent("hide");
        });
        this.addEventListener("resize", () => {
            let view = this.views.get(this._currentView);
            if (!view)
                return;
            view.dispatchEvent("resize");
        });
    }
    views = new Map();
    createView(name, view) {
        if (this.views.has(name))
            throw new Error(`Cannot create duplicate view of "${name}".`);
        this.views.set(name, view);
        if (!this._currentView)
            this.showView(name);
        return this;
    }
    showView(name) {
        let viewNames = name.split("/");
        let viewName = viewNames.shift();
        let subViewNames = viewNames.join("/");
        if (this.views.has(viewName) == false) {
            if (subViewNames) {
                console.error(`Cannot show unset view of "${name}". Could not resolve "${viewName}".`);
            }
            else {
                console.error(`Cannot show unset view of "${name}".`);
            }
            return null;
        }
        let view = this.views.get(viewName);
        if (subViewNames && view instanceof ViewCollection) {
            view.showView(subViewNames);
        }
        let currentView = this.views.get(this._currentView);
        if (currentView)
            currentView.dispatchEvent("hide");
        view.dispatchEvent("show");
        this._currentView = viewName;
        return view;
    }
    render(canvas, context) {
        super.render(canvas, context);
        if (this.views.has(this._currentView) == false)
            return;
        let view = this.views.get(this._currentView);
        view.render(canvas, context);
    }
}
//# sourceMappingURL=view-collection.js.map