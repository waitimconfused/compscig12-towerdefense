import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";

export class Frog extends EnemyEntity {

	public override entityType:string = "enemy/frog";

	public isLeaping:boolean;
	public canLeap:boolean = true;

	public override drops = {
		coins: 5,
		points: 10,
		materials: {
			jar : 0.2
		}
	};

	private leapCooldown : number = 0;
	
	private async tryLeap(target: DefenderEntity) {
	
		this.isLeaping = true;
	
		// Cannot deal damage but can't take damage when leaping
		this.stunned = true;
		this.invulnerable = true;
	
		await this.walkTo(
			// placeholder for now
			target.position[0] + 2,
			target.position[1]
		);
	
		this.isLeaping = false;
		this.stunned = false;
		this.invulnerable = false;
	}

	public async brain() {
		await this.wait(200);
		let target = Entity.nearestEntity(this, DefenderEntity) as DefenderEntity;
		
		if (!target) return;
		
		// Try leap occasionally
		if (this.canLeap) {
			this.tryLeap(target);
		}
		
		// normal movement
		await this.walkTo(
			target.position[0],
			target.position[1]
		);
	}
}