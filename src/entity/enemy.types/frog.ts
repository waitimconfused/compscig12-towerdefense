import { DefenderEntity } from "../defender.js";
import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { Entity } from "../entity.js";

export class Frog extends EnemyEntity {

	public override entityType:string = "enemy/frog";

	public static stats:EnemyEntityStats[] = [
		{
			health: 75,
			speed: 0.75,
			damage: 0,
			knockBack: 10,
			spawnCoolDown: 10,
			attackCoolDown: 10
		}
	]

	public isLeaping:boolean;
	public canLeap:boolean = true;

	public drops : EnemyDrops = {
		coins: 5,
		points: 10,
		materials : [
			{ type : 'jar', chance : 0.3, amount : 1 }
		]
	}

	public override healthScale: number = 1.15;
	
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