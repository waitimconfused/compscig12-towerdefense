import { Entity } from "../entity";

export class Carrier extends Entity{

	public override entityType = "entity/carrier";

	onDeath(): void {
		//game over
	}

	public async brain(){
		
	}
}