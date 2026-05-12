import { DefenderEntity } from "../defender.js";
import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { DamageType, Entity, EntityEvent } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";

/**
 * Creates an Ant as an EnemyEntity
 * 
 * Ants are low health enemies that deal damage and spawn in clusters
 * Vulnerable to AOE, health increases every wave by 10%
 */
export class Ant extends EnemyEntity {

	public entityType = "enemy/ant";
	
	public static stats : EnemyEntityStats[] = [
		{
			health: 100,
			speed: 0.1,
			damage: 10,
			knockBack: 10,
			spawnCoolDown: 10,
			attackCoolDown: 10
		}
	]

	public drops : EnemyDrops = {
		coins: 2,
		points: 5,
		materials: [
			{ type : 'wood', chance : 0.2, amount : 2 },
			{ type : 'glassLemonade', chance : 0.1, amount : 1 }
		]
	}

	public override healthScale: number = 1.1;

	public override dealDamage(dealtDamage:number, attacker:Entity, damageType : DamageType = 'melee'):Promise<undefined|EntityEvent> {

		return new Promise((resolve) => {
			if (this.invulnerable) {
				resolve(undefined);
				return;
			}

			let finalDamage = dealtDamage;

			if (damageType == 'aoe') {
				finalDamage *= 1.25;
			}

			this.stats.health -= finalDamage;

			this.interruptTimers(null, {
				triggered_by: attacker,
				interrupt_type: "attacked"
			});

			resolve(undefined);
		});

	}

	public async brain() {
		await this.wait(100);
		
		// Get the closest DEFENDER entity
		let closestEntity = Entity.nearestEntity(this, DefenderEntity);
	
		if (!closestEntity) {
			return;
		}
	
		// Walk toward defender
		let interrupt = await this.walkTo(
			closestEntity.position[0],
			closestEntity.position[1]
		);
	
		// Attack if nothing was interrupted
		if (!interrupt) {
			// Store defender health
			let defenderHealth = closestEntity.stats.health;

			// Attacks closest entity
			await this.attackEntity(closestEntity);

			if (defenderHealth > 0 && closestEntity.stats.health <= 0) {
				await StatusEffects.regenerateEntity(this, 5000, 2);
			}

		}
	
	}

	public static clusterSpawn(waveNumber : number) : void {
		let spawnSpecialCluster = Math.random();
		let cluster : number = Math.min(waveNumber, 20);
		let randomAnts : number = Math.floor(Math.random() * 6 + 3);
		let count : number;

		if (spawnSpecialCluster < 0.1) {
			count = cluster;
		} else {
			count = randomAnts;
		}

		this.spawn(count, [0,0], 2);
	}
}