export class ViewElementCollection {
    children = [];
    constructor(...elements) {
        if (elements.length > 0)
            this.addElement(...elements);
    }
    addElement(...elements) {
        this.children.push(...elements);
        return this;
    }
    removeElement(element) {
        let index = this.children.indexOf(element);
        if (index == -1)
            return this;
        this.children.splice(index, 1);
        return this;
    }
    render(canvas, context) {
        for (let i = 0; i < this.children.length; i++) {
            let element = this.children[i];
            element.render(canvas, context);
        }
    }
}
//# sourceMappingURL=view-element-collection.js.map