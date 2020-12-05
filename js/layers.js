/*addLayer("p", {
	name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#4BDC13",
	requires: new Decimal(10), // Can be a function that takes requirement increases into account
	resource: "prestige points", // Name of prestige currency
	baseResource: "points", // Name of resource prestige is based on
	baseAmount() {return player.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 0.5, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		return mult
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 0, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return true}
})*/
function freeLevels(layer, id, format=true) {
	if (!format) {
		return tmp[layer].buyables[id].freeLevels
	}
	return tmp[layer].buyables[id].freeLevels.gt(0)?`+${tmp[layer].buyables[id].freeLevels}`:""
}
addLayer("c", {
	name: "condense", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		total: new Decimal(0)
	}},
	color: "#8899aa",
	requires: new Decimal(10), // Can be a function that takes requirement increases into account
	resource: "condensed points", // Name of prestige currency
	baseResource: "points", // Name of resource prestige is based on
	baseAmount() {return player.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 2/3, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1);
		mult = mult.mul(tmp.c.buyables[12].effect);
		mult = mult.mul(tUpgEff("c", 14));
		mult = mult.mul(tmp.o.effect);
		return mult;
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 0, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "c", description: "C: Reset for condensed points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return true},
	buyables: {
		rows: 2,
		cols: 3,
		11: {
			title: "Point Centrifuge [11]",
			display() {
				return `<span style="font-size: 12px">Generate points.<br>
				Cost: ${format(tmp.c.buyables[11].cost)} condensed points
				Amount: ${formatWhole(player.c.buyables[11])}${freeLevels("c", 11)}
				Effect: ${format(tmp.c.buyables[11].effect)}/s</span>`
			},
			buy() {
				if (this.canAfford()) {
					player.c.points = player.c.points.sub(this.cost());
					player.c.buyables[11] = player.c.buyables[11].add(1);
				}
			},
			canAfford() {
				return player.c.points.gte(this.cost());
			},
			cost() {
				return Decimal.pow(1.5, player.c.buyables[11].pow(1.05)).floor()
			},
			effect() {
				var base = player.c.buyables[11].add(this.freeLevels());
				base = base.pow(tmp.c.buyables[13].effect);
				base = base.mul(tUpgEff("c", 11));
				base = base.mul(tUpgEff("c", 12));
				base = base.mul(tmp.o.effect);
				return base;
			},
			freeLevels() {
				return player.c.buyables[12].mul(player.c.upgrades.includes(13)+0);
			}
		},
		12: {
			title: "Coint Pentrifuge [12]",
			display() {
				return `<span style="font-size: 12px">Make condensed point gain better.<br>
				Cost: ${format(tmp.c.buyables[12].cost)} points
				Amount: ${formatWhole(player.c.buyables[12])}${freeLevels("c", 12)}
				Effect: x${format(tmp.c.buyables[12].effect)}</span>`
			},
			buy() {
				if (this.canAfford()) {
					player.points = player.points.sub(this.cost());
					player.c.buyables[12] = player.c.buyables[12].add(1);
				}
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			cost() {
				return Decimal.pow(2, player.c.buyables[12].pow(1.5)).mul(50);
			},
			effect() {
				var base = player.c.buyables[12].add(1).add(this.freeLevels());
				base = base.pow(0.5);
				return base;
			},
			unlocked() {
				return player.c.buyables[11].gte(5);
			},
			freeLevels() {
				return player.c.buyables[11].mul(player.c.upgrades.includes(13)*0.5).floor()
			}
		},
		13: {
			title: "Condenser [13]",
			display() {
				return `<span style="font-size: 12px">Exponentiate the base [11] effect.<br>
				Cost: ${format(tmp.c.buyables[13].cost.p)} points and ${format(tmp.c.buyables[13].cost.c)} condensed points
				Amount: ${formatWhole(player.c.buyables[13])}${freeLevels("c", 13)}
				Effect: ^${format(tmp.c.buyables[13].effect)}</span>`
			},
			buy() {
				if (this.canAfford()) {
					player.points = player.points.sub(this.cost().p);
					player.c.points = player.c.points.sub(this.cost().c);
					player.c.buyables[13] = player.c.buyables[13].add(1);
				}
			},
			canAfford() {
				return player.points.gte(this.cost().p)&&player.c.points.gte(this.cost().c);
			},
			cost() {
				return {
					p: Decimal.pow(3, player.c.buyables[13].pow(1.7)).mul(20000),
					c: Decimal.pow(2, player.c.buyables[13].pow(1.7)).mul(2000),
				};
			},
			effect() {
				var base = player.c.buyables[13].add(this.freeLevels());
				base = base.mul(0.25).add(1);
				return base;
			},
			unlocked() {
				return player.c.buyables[12].gte(5);
			},
			freeLevels() {
				return new Decimal(0);
			}
		}
	},
	upgrades: {
		rows: 2,
		cols: 5,
		11: {
			title: "Inertia Boost",
			description: "Gain more points based on total condensed points.",
			cost: 2,
			effect() {
				return player.c.total.add(2.5).log(2.5);
			},
			effectDisplay() {
				return `x${format(tmp.c.upgrades[11].effect)}`;
			},
			unlocked() {
				return player.c.buyables[11].gte(1)
			}
		},
		12: {
			title: "Acceleration Boost",
			description: "Gain more points based on points.",
			cost: 30,
			effect() {
				return player.points.add(10).log(5);
			},
			effectDisplay() {
				return `x${format(tmp.c.upgrades[12].effect)}`;
			},
			unlocked() {
				return player.c.buyables[11].gte(1)
			}
		},
		13: {
			title: "Point Pentrifuge",
			description: "[12] gives free levels to [11], and non-free [11] levels give free levels to [12].",
			cost: 1000,
			unlocked() {
				return player.c.buyables[11].gte(1)
			}
		},
		14: {
			title: "Reverse Inertia",
			description: "Gain more condensed points based on points.",
			cost: 2500,
			effect() {
				return player.points.add(10).log(10).pow(0.5);
			},
			effectDisplay() {
				return `x${format(tmp.c.upgrades[14].effect)}`;
			},
			unlocked() {
				return player.c.buyables[11].gte(1)
			}
		}
	},
	autoUpgrade() {
		return player.o.autoUpg && player.o.milestones.includes("2");
	},
	update(diff) {
		if (player.o.milestones.includes("1")) player.c.points = player.c.points.add(tmp.c.resetGain.mul(diff));
	}
})
addLayer("o", {
	name: "compact", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "O", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0),
		autoUpg: false
	}},
	color: "#998877",
	requires: new Decimal(10000), // Can be a function that takes requirement increases into account
	resource: "compactors", // Name of prestige currency
	baseResource: "condensed points", // Name of resource prestige is based on
	baseAmount() {return player.c.points}, // Get the current amount of baseResource
	type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 1.25, // Prestige currency exponent
	base: 5,
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		return mult
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 1, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "o", description: "O: Reset for compactors", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return true},
	effect() {
		var base = new Decimal(2);
		return Decimal.pow(base, player.o.points);
	},
	effectDescription() {
		return `boosting point and condensed point gain by ${format(tmp.o.effect)}`
	},
	componentStyles: {
		milestones: {
			width: "350px"
		}
	},
	milestones: {
		0: {
			requirementDescription: "5 compactors",
			effectDescription: "Gain 100% of condensed points per second.",
			done() {
				return player.o.points.gte(5);
			}
		},
		1: {
			requirementDescription: "7 compactors",
			effectDescription: "Autobuy condense buyables, and they cost nothing.",
			done() {
				return player.o.points.gte(7)
			}
		}
		2: {
			requirementDescription: "9 compactors",
			effectDescription: "Unlock auto-condense upgrades.",
			toggles: [["o", "autoUpg"]],
			done() {
				return player.o.points.gte(9);
			}
		}
	},
	upgrades: {
		rows: 5,
		cols: 5
	},
	branches: ["c"]
})