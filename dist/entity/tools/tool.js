import Inventory from "../../inventory.js";
import { Entity } from "../entity.js";
export class Tool extends Entity {
    canMake() {
        let tools = [...this.toolRequirements.keys()];
        for (let i = 0; i < tools.length; i++) {
            let tool = tools[i];
            let requiredAmount = this.toolRequirements.get(tool);
            let currentAmount = Inventory.getCount(tool);
            if (currentAmount < requiredAmount) {
                return false;
            }
            else {
                currentAmount -= requiredAmount;
            }
        }
        return true;
    }
}
//# sourceMappingURL=tool.js.map