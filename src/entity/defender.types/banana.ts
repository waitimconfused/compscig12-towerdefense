import { Position2D } from "../../types.js";
import { DefenderEntity } from "../defender.js";
import { Entity, EntityStats } from "../entity.js";

export class BananaSpawner extends DefenderEntity {
	public override entityType: string = "defender/banana_spawner";

	public static override upgrades: EntityStats[] = [
		{
			health: 100,
			max_health: 100,
			speed: 0.1,
			damage: 10,
			knockback: 10,
			spawnCooldown: 10,
			attackCooldown: 10,
			entityPurchaseCost: 10,
			entityResaleCost: 10
		}
	];

	protected override die(): void {}

	public override async brain() {

		await this.wait(1000);
		console.log("Spawning Banana");
		Banana.spawn(1, this.position);

	}
}

export class Banana extends BananaSpawner {
	
	public override entityType: string = "defender/banana_entity";

	public override async brain() {

		//TODO: Replace "Y" value to be MAX-Y-VALUE
		let interrupt = await this.walkTo( this.position[0], window.innerHeight );

		if (interrupt) return;

		this.stats.health = 0;

	}

}