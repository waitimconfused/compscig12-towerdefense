import { Position2D } from "../../types.js";
import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityEventInterrupt } from "../entity.js";

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
		while (this.stats.health > 0) {
			const TARGET = Entity.nearestEntity(this, DefenderEntity);
			
			if (!TARGET) {
				await this.wait(200);
				continue;
			}
			
			// Try leap occasionally
			if (this.canLeap && this.leapCooldown <= 0) {
				this.tryLeap(TARGET);
				this.leapCooldown = 3000;
			}
			
			// normal movement
			await this.walkTo(
				TARGET.position[0],
				TARGET.position[1]
			);
			
			this.leapCooldown -= 200;
			await this.wait(200);
		}
	}
}