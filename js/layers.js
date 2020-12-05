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
					if (!player.o.milestones.includes("1")) player.c.points = player.c.points.sub(this.cost());
					player.c.buyables[11] = player.c.buyables[11].add(1);
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				while (this.canAfford()) {
					player.c.buyables[11] = player.c.buyables[11].add(search);
					search *= 2;
				}
				while (!this.canAfford()) {
					player.c.buyables[11] = player.c.buyables[11].sub(1);
				}
				player.c.buyables[11] = player.c.buyables[11].add(1);
			},
			canAfford() {
				return player.c.points.gte(this.cost());
			},
			cost() {
				return Decimal.pow(1.5, player.c.buyables[11].pow(1.05)).floor()
			},
			effect() {
				var base = player.c.buyables[11].add(this.freeLevels());
				if (hasUpgrade("c", 21)) base = Decimal.pow(2, player.c.buyables[11].add(this.freeLevels()).pow(0.5)).sub(1);
				base = base.pow(tmp.c.buyables[13].effect);
				base = base.mul(tUpgEff("c", 11));
				base = base.mul(tUpgEff("c", 12));
				base = base.mul(tmp.o.effect);
				base = base.mul(player.o.dust.add(1).pow(4));
				return base;
			},
			freeLevels() {
				return player.c.buyables[12].mul(hasUpgrade("c", 13)+0).add(player.c.buyables[13].mul(hasUpgrade("c", 15)*10));
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
					if (!player.o.milestones.includes("1")) player.points = player.points.sub(this.cost());
					player.c.buyables[12] = player.c.buyables[12].add(1);
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				while (this.canAfford()) {
					player.c.buyables[12] = player.c.buyables[12].add(search);
					search *= 2;
				}
				while (!this.canAfford()) {
					player.c.buyables[12] = player.c.buyables[12].sub(1);
				}
				player.c.buyables[12] = player.c.buyables[12].add(1);
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			cost() {
				return Decimal.pow(2, player.c.buyables[12].pow(1.5)).mul(50);
			},
			effect() {
				var base = player.c.buyables[12].add(1).add(this.freeLevels());
				base = base.pow(hasUpgrade("c", 22)+0.5);
				return base;
			},
			unlocked() {
				return player.c.buyables[11].gte(5);
			},
			freeLevels() {
				return player.c.buyables[11].mul(hasUpgrade("c", 13)*0.5).floor().add(player.c.buyables[13].mul(hasUpgrade("c", 15)*10))
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
					if (!player.o.milestones.includes("1")) player.points = player.points.sub(this.cost().p);
					if (!player.o.milestones.includes("1")) player.c.points = player.c.points.sub(this.cost().c);
					player.c.buyables[13] = player.c.buyables[13].add(1);
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				while (this.canAfford()) {
					player.c.buyables[13] = player.c.buyables[13].add(search);
					search *= 2;
				}
				while (!this.canAfford()) {
					player.c.buyables[13] = player.c.buyables[13].sub(1);
				}
				player.c.buyables[13] = player.c.buyables[13].add(1);
			},
			canAfford() {
				return player.points.gte(this.cost().p)&&player.c.points.gte(this.cost().c);
			},
			cost() {
				return {
					p: Decimal.pow(3, player.c.buyables[13].pow(1.65)).mul(20000),
					c: Decimal.pow(2, player.c.buyables[13].pow(1.65)).mul(2000),
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
			description: "Non-free [12] gives free levels to [11], and non-free [11] levels give free levels to [12].",
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
		},
		15: {
			title: "Free",
			description: "Each [13] gives ten free levels to [11] and [12].",
			cost: 1e10,
			unlocked() {
				return player.o.milestones.includes("1");
			}
		},
		21: {
			title: "Great Array of Connected Centrifuges",
			description: "[11]'s base uses a controlled exponential formula.",
			cost: 1e13,
			unlocked() {
				return player.o.milestones.includes("1");
			}
		},
		22: {
			title: "Great Array of Connected Pentrifuges",
			description: "Cube [12].",
			cost: 1e21,
			unlocked() {
				return player.o.milestones.includes("1");
			}
		}
	},
	autoUpgrade() {
		return player.o.autoUpg && player.o.milestones.includes("2");
	},
	automate() {
		if (player.o.milestones.includes("1") && player.o.autoBuyBuy) {
			for (var i = 11; i <= 13; i++) {
				layers.c.buyables[i].buyMax();
			}
		}
	},
	update(diff) {
		if (player.o.milestones.includes("0")) addPoints("c", tmp.c.resetGain.mul(diff));
	},
	prestigeNotify() {
		if (player.o.milestones.includes("0")) return;
		else return player.o.points.div(10).lte(tmp.o.resetGain)
	}
})
addLayer("o", {
	name: "compact", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "O", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		autoUpg: false,
		autoBuyBuy: false,
		dust: new Decimal(0)
	}},
	color: "#c76",
	requires: new Decimal(10000), // Can be a function that takes requirement increases into account
	resource: "compactors", // Name of prestige currency
	baseResource: "condensed points", // Name of resource prestige is based on
	baseAmount() {return player.c.points}, // Get the current amount of baseResource
	type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 1.25, // Prestige currency exponent
	base: 5,
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		mult = mult.div(tmp.o.buyables[12].effect)
		return mult
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 1, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "o", description: "O: Reset for compactors", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return player.c.points.gte(5000)},
	effect() {
		var base = new Decimal(2);
		return Decimal.pow(base, player.o.points);
	},
	dust() {
		var mult = new Decimal(1);
		mult = mult.mul(tmp.o.buyables[11].effect);
		return player.o.points.pow(1.5).mul(mult);
	},
	effectDescription() {
		return `boosting point and condensed point gain by ${format(tmp.o.effect)}${player.o.milestones.includes("3")?` and generating ${format(tmp.o.dust)} dust per second with a cap of ${format(tmp.o.dust.mul(100))}.`:""}`
	},
	componentStyles: {
		milestones: {
			width: "500px"
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
			effectDescription: "Autobuy condense buyables, and they cost nothing. Also unlocks a new row of upgrades.",
			toggles: [["o", "autoBuyBuy"]],
			done() {
				return player.o.points.gte(7)
			}
		},
		2: {
			requirementDescription: "9 compactors",
			effectDescription: "Unlock auto-condense upgrades.",
			toggles: [["o", "autoUpg"]],
			done() {
				return player.o.points.gte(9);
			}
		},
		3: {
			requirementDescription: "18 compactors",
			effectDescription: "Unlock dust.",
			done() {
				return player.o.points.gte(18);
			}
		}
	},
	buyables: {
		rows: 3,
		cols: 3,
		11: {
			title: "Dust Gain",
			display() {
				return `<span style="font-size: 12px">Make dust gain better.<br>
				Cost: ${format(tmp.o.buyables[11].cost)} dust
				Amount: ${format(player.o.buyables[11])}
				Effect: x${format(tmp.o.buyables[11].effect)}</span>`
			},
			buy() {
				if (this.canAfford()) {
					player.o.dust = player.o.dust.sub(this.cost());
					player.o.buyables[11] = player.o.buyables[11].add(1);
				}
			},
			canAfford() {
				return player.o.dust.gte(this.cost());
			},
			cost() {
				return Decimal.pow(4, player.o.buyables[11]).mul(200);
			},
			unlocked() {
				return player.o.milestones.includes("3")
			},
			effect() {
				return player.o.buyables[11].add(1).pow(0.6);
			}
		},
		12: {
			title: "Compactor Cheapening",
			display() {
				return `<span style="font-size: 12px">Make compactors cheaper.<br>
				Cost: ${format(tmp.o.buyables[12].cost)} dust
				Amount: ${format(player.o.buyables[12])}
				Effect: /${format(tmp.o.buyables[12].effect)}</span>`
			},
			buy() {
				if (this.canAfford()) {
					player.o.dust = player.o.dust.sub(this.cost());
					player.o.buyables[12] = player.o.buyables[12].add(1);
				}
			},
			canAfford() {
				return player.o.dust.gte(this.cost());
			},
			cost() {
				return Decimal.pow(10, player.o.buyables[12].pow(1.2)).mul(1000);
			},
			unlocked() {
				return player.o.milestones.includes("3")
			},
			effect() {
				return Decimal.pow(10, player.o.buyables[12]);
			}
		}
	},
	upgrades: {
		rows: 5,
		cols: 5
	},
	update(diff) {
		if (player.o.milestones.includes("3")) player.o.dust = player.o.dust.add(tmp.o.dust.mul(diff));
		player.o.dust = player.o.dust.min(tmp.o.dust.mul(100));
	},
	branches: ["c"],
	tabFormat: ["main-display", "prestige-button", "resource-display", "milestones", ["raw-html", _=>{
		return player.o.milestones.includes("3")?`<br><br>You have ${format(player.o.dust)} dust, boosting point gain by x${format(player.o.dust.add(1).pow(4))}.<br><br>`:""
	}], "buyables"]
})