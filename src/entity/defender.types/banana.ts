import { Entity, EntityStats } from "../entity.js";

export class BananaSpawner extends Entity {
	public override entityType: string = "defender/banana_spawner";

	public static override upgrades: EntityStats[] = [];

	protected override die(): void {}

	public override async brain() {

		await this.wait(5000);
		Banana.spawn(1, this.position);

	}
}

class Banana extends Entity {
	
	public override entityType: string = "defender/banana_entity";

	public static override upgrades: EntityStats[] = [];

	protected override die(): void {}

	public override async brain() {

		//TODO: Replace "Y" value to be MAX-Y-VALUE
		let interrupt = await this.walkTo( this.position[0], window.innerHeight );

		if (interrupt) return;

		this.stats.health = 0;

	}

}