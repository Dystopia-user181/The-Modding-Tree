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
	symbol: "CD", // This appears on the layer's node. Default is the id with the first letter capitalized
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
		mult = mult.mul(hasUpgrade("o", 13)?player.o.dust.pow((hasUpgrade("o", 12)+1)*4):1)
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
				while (!(!this.canAfford()&&this.canAfford(player.c.buyables[11].sub(1)))) {
					search /= 2;
					if (this.canAfford()) player.c.buyables[11] = player.c.buyables[11].add(Math.ceil(search));
					else player.c.buyables[11] = player.c.buyables[11].sub(Math.ceil(search));
				}
			},
			canAfford(value=player.c.buyables[11]) {
				return player.c.points.gte(this.cost(value));
			},
			cost(value=player.c.buyables[11]) {
				return Decimal.pow(1.5, value.pow(1.05)).div(tmp.o.buyables[13].effect).floor().pow(1-hasUpgrade("v", 11)*0.1)
			},
			effect() {
				var base = player.c.buyables[11].add(this.freeLevels());
				if (hasUpgrade("c", 21)) base = Decimal.pow(2, player.c.buyables[11].add(this.freeLevels()).pow(0.5)).sub(1);
				base = base.pow(tmp.c.buyables[13].effect);
				base = base.mul(tUpgEff("c", 11));
				base = base.mul(tUpgEff("c", 12));
				base = base.mul(tmp.o.effect);
				base = base.mul(player.o.dust.add(1).pow((hasUpgrade("o", 12)+1)*4));
				base = base.mul(tmp.v.effect);
				base = base.mul(tUpgEff("s", 11));
				base = base.pow(tmp.s.buyables[11].effect);
				return base;
			},
			freeLevels() {
				return player.c.buyables[12].mul(hasUpgrade("c", 13)+0).add(player.c.buyables[13].mul(hasUpgrade("c", 15)*10)).add(player.o.buyables[13].pow(1.5).floor().mul(3));
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
				while (!(!this.canAfford()&&this.canAfford(player.c.buyables[12].sub(1)))) {
					search /= 2;
					if (this.canAfford()) player.c.buyables[12] = player.c.buyables[12].add(Math.ceil(search));
					else player.c.buyables[12] = player.c.buyables[12].sub(Math.ceil(search));
				}
			},
			canAfford(value=player.c.buyables[12]) {
				return player.points.gte(this.cost(value));
			},
			cost(value=player.c.buyables[12]) {
				return Decimal.pow(2, value.pow(1.5)).mul(50).div(tmp.o.buyables[13].effect).floor().pow(1-hasUpgrade("v", 11)*0.1);
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
				return player.c.buyables[11].mul(hasUpgrade("c", 13)*0.5).floor().add(player.c.buyables[13].mul(hasUpgrade("c", 15)*10)).add(player.o.buyables[13].pow(1.5).floor().mul(3));
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
				while (!(!this.canAfford()&&this.canAfford(player.c.buyables[13].sub(1)))) {
					search /= 2;
					if (this.canAfford()) player.c.buyables[13] = player.c.buyables[13].add(Math.ceil(search));
					else player.c.buyables[13] = player.c.buyables[13].sub(Math.ceil(search));
				}
			},
			canAfford(value=player.c.buyables[13]) {
				return player.points.gte(this.cost(value).p)&&player.c.points.gte(this.cost(value).c);
			},
			cost(value=player.c.buyables[13]) {
				return {
					p: Decimal.pow(3, value.pow(1.65)).mul(20000).div(tmp.o.buyables[13].effect).floor().pow(1-hasUpgrade("v", 11)*0.1),
					c: Decimal.pow(2, value.pow(1.65)).mul(2000).div(tmp.o.buyables[13].effect).floor().pow(1-hasUpgrade("v", 11)*0.1)
				}
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
				return player.o.buyables[13].pow(1.5).floor().mul(3);
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
				return player.c.total.add(2.5).log(2.5).pow(hasUpgrade("s", 12)*9+1);
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
				return player.points.add(10).log10().pow(0.5).pow(hasUpgrade("s", 12)*9+1);
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
		},
		23: {
			title: "Condensed Dust",
			description: "Make dust gain better based on condensed points.",
			cost: 1e90,
			unlocked() {
				return player.o.milestones.includes("1");
			},
			effect() {
				return player.c.points.add(10).log10().pow(0.3);
			},
			effectDisplay() {
				return `x${format(this.effect())}`
			}
		},
		24: {
			title: "Compacted Power",
			description: "Unlock compact upgrades.",
			cost: 1e120,
			unlocked() {
				return player.o.milestones.includes("1");
			}
		},
		25: {
			title: "AntiCondense",
			description: "Unlock vapourised points.",
			cost: "1e600",
			unlocked() {
				return player.o.milestones.includes("1");
			}
		},
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
		else return player.c.points.div(10).lte(tmp.c.resetGain)
	},
	doReset(layer) {
		if (layers[layer].row > 0) {
			var keep = [];
			if (player.o.milestones.includes("2")) keep.push("upgrades");
			layerDataReset("c", keep);
			player.o.dust = player.o.dust.div(2);
		}
	}
})
addLayer("v", {
	name: "vapour", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "V", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#88bbee",
	requires: new Decimal("1e650"), // Can be a function that takes requirement increases into account
	resource: "vapourised points", // Name of prestige currency
	baseResource: "points", // Name of resource prestige is based on
	baseAmount() {return player.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 3, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1);
		mult = mult.mul(tUpgEff("o", 33));
		mult = mult.mul(tUpgEff("v", 13));
		mult = mult.pow(tmp.s.buyables[11].effect);
		return mult;
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 0, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "v", description: "V: Reset for vapourised points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return hasUpgrade("c", 25)},
	effect() {
		return player.v.points.add(10).log10().pow(hasUpgrade("v", 15)*20+10);
	},
	effectDescription() {
		return `boosting point gain by x${format(this.effect())}`
	},
	upgrades: {
		rows: 5,
		cols: 5,
		11: {
			title: "Vapourise scaling",
			description: "Raise condense buyable costs to the 0.9th power.",
			cost: "1e400"
		},
		12: {
			title: "Vapourise scaling II",
			description: "Divide compactor costs based on vapourised points.",
			cost: "1e1480",
			effect() {
				return player.v.points.add(10).log10().pow(10);
			},
			effectDisplay() {
				return `/${format(this.effect())}`
			}
		},
		13: {
			title: "Vapourise <s>scaling</s>",
			description: "Condense buyable [12] boosts vapourised points at an increased rate.",
			cost: "1e1800",
			effect() {
				return tmp.c.buyables[12].effect.pow(20);
			},
			effectDisplay() {
				return `x${format(this.effect())}`
			}
		},
		14: {
			title: "Vapourise Scaling III",
			description: "Raise dust buyable cost to 0.7.",
			cost: "1e8800"
		},
		15: {
			title: "A Cubic Metre of Cloud",
			description: "Cube vapour effect.",
			cost: "1e15000"
		}
	},
	update(diff) {
		if (player.s.milestones.includes("0")) addPoints("v", tmp.v.resetGain.mul(diff));
	},
	prestigeNotify() {
		if (player.s.milestones.includes("0")) return;
		else return player.v.points.div(10).lte(tmp.v.resetGain)
	},
	doReset(layer) {
		if (layers[layer].row > 0) {
			var keep = [];
			if (player.o.milestones.includes("5")) keep.push("upgrades");
			layerDataReset("v", keep);
		}
	}
})
addLayer("o", {
	name: "compact", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "CM", // This appears on the layer's node. Default is the id with the first letter capitalized
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
		mult = mult.div(tmp.o.buyables[12].effect);
		mult = mult.div(tUpgEff("v", 12));
		return mult
	},
	row: 1, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "o", description: "O: Reset for compactors", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return player.c.points.gte(5000)||player.o.unlocked},
	effect() {
		var base = new Decimal(2);
		base = base.add(tUpgEff("o", 31, 0));
		return Decimal.pow(base, player.o.points);
	},
	dust() {
		var mult = new Decimal(1);
		mult = mult.mul(tmp.o.buyables[11].effect);
		mult = mult.mul(tUpgEff("c", 23));
		if (hasUpgrade("s", 14)) return Decimal.pow(1.04, player.o.points).pow((hasUpgrade("o", 11)*0.5+1)).mul(mult)
		return player.o.points.pow((hasUpgrade("o", 11)*0.5+1)*1.5).mul(mult);
	},
	effectDescription() {
		return `boosting point and condensed point gain by ${format(tmp.o.effect)}${player.o.milestones.includes("3")?` and generating ${format(tmp.o.dust.mul(hasUpgrade("o", 32)*99+1))} dust per second with a cap of ${format(tmp.o.dust.mul(100))}`:""}`
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
			effectDescription: "Keep condense upgrades on all resets.",
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
		},
		4: {
			requirementDescription: "50 compactors",
			effectDescription: "You can buy max compactors.",
			done() {
				return player.o.points.gte(50);
			}
		},
		5: {
			requirementDescription: "360 compactors",
			effectDescription: "Keep vapour upgrades on reset, and unlock a new layer.",
			done() {
				return player.o.points.gte(360);
			},
			unlocked() {
				return hasUpgrade("c", 25);
			}
		}
	},
	buyables: {
		rows: 3,
		cols: 3,
		11: {
			title: "Dust Gain [11]",
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
				return Decimal.pow(4, player.o.buyables[11]).mul(200).pow(1-hasUpgrade("v", 14)*0.3);
			},
			unlocked() {
				return player.o.milestones.includes("3")
			},
			effect() {
				return player.o.buyables[11].add(1).pow(0.6);
			}
		},
		12: {
			title: "Compactor Cheapening [12]",
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
				return Decimal.pow(10, player.o.buyables[12].pow(1.2)).mul(1000).pow(1-hasUpgrade("v", 14)*0.3);
			},
			unlocked() {
				return player.o.milestones.includes("3")
			},
			effect() {
				return Decimal.pow(10, player.o.buyables[12]);
			}
		},
		13: {
			title: "Buyable Cheapening [13]",
			display() {
				return `<span style="font-size: 12px">Make condense buyables cheaper, and give free levels to all of them.<br>
				Cost: ${format(tmp.o.buyables[13].cost)} dust
				Amount: ${format(player.o.buyables[13])}
				Effect: /${format(tmp.o.buyables[13].effect)} cost, +${format(tmp.o.buyables[13].effect2)} to levels</span>`
			},
			buy() {
				if (this.canAfford()) {
					player.o.dust = player.o.dust.sub(this.cost());
					player.o.buyables[13] = player.o.buyables[13].add(1);
				}
			},
			canAfford() {
				return player.o.dust.gte(this.cost());
			},
			cost() {
				return Decimal.pow(20, player.o.buyables[13].pow(1.5)).mul(10000).pow(1-hasUpgrade("v", 14)*0.3);
			},
			unlocked() {
				return player.o.milestones.includes("3")
			},
			effect() {
				return Decimal.pow(10000, player.o.buyables[13]);
			},
			effect2() {
				var softcap = new Decimal(40);
				var base = player.o.buyables[13].pow(1.5).floor().mul(3);
				if (base.gte(softcap)) base = base.mul(softcap.pow(2)).pow(1/3);
				return base;
			}
		},
		respec() {
			Vue.set(player.o, "upgrades", []);
			doReset("o", true);
		},
		showRespec() {
			return hasUpgrade("c", 24);
		},
		respecText: "Respec Upgrades",
		respecConfirmation: "Are you sure you want to respec your upgrades? This will cause a compact reset as well."
	},
	upgrades: {
		rows: 5,
		cols: 5,
		11: {
			title: "1;1",
			description: "Raise dust gain to 1.5.",
			cost() {
				return Decimal.pow(10, player.o.upgrades.length)*50000
			},
			currencyInternalName: "dust",
			currencyDisplayName: "dust",
			currencyLayer: "o",
			unlocked() {
				return hasUpgrade("c", 24)
			}
		},
		12: {
			title: "1;2",
			description: "Square dust effect.",
			cost() {
				return Decimal.pow(5, player.o.upgrades.length)*600000
			},
			currencyInternalName: "dust",
			currencyDisplayName: "dust",
			currencyLayer: "o",
			unlocked() {
				return hasUpgrade("c", 24)
			}
		},
		13: {
			title: "1;3",
			description: "Dust also boosts condensed point gain.",
			cost() {
				return Decimal.pow(10, player.o.upgrades.length)*1000000;
			},
			currencyInternalName: "dust",
			currencyDisplayName: "dust",
			currencyLayer: "o",
			unlocked() {
				return hasUpgrade("c", 24)
			}
		},
		21: {
			style: {visibility: "hidden", height: "40px"},
			cost: Infinity
		},
		31: {
			title: "2;1",
			description: "Boost compactor base based on compactors.",
			cost: 120,
			unlocked() {
				return hasUpgrade("c", 24)
			},
			effect() {
				var base = player.o.points.mul(0.01);
				if (base.gte(1.5)) base = base.mul(1.5).sqrt();
				if (base.gte(2.5)) base = base.mul(Math.pow(10, 2.5)).log10();
				return base;
			},
			effectDisplay() {
				return `+${format(this.effect())}`
			}
		},
		32: {
			title: "2;2",
			description: "Multiply dust gain by 100 but it caps at 1 second's worth of production.",
			cost: 250,
			unlocked() {
				return hasUpgrade("c", 24)
			}
		},
		33: {
			title: "2;3",
			description: "Compactors also boost vapourised points.",
			cost: 375,
			unlocked() {
				return hasUpgrade("c", 24)
			},
			effect() {
				return tmp.o.effect;
			},
			unlocked() {
				return player.v.unlocked
			}
		}
	},
	canBuyMax() {
		return player.o.milestones.includes("4");
	},
	update(diff) {
		if (player.o.milestones.includes("3")) player.o.dust = player.o.dust.add(tmp.o.dust.mul(diff).mul(hasUpgrade("o", 32)?100:1));
		player.o.dust = player.o.dust.min(tmp.o.dust.mul(100));
	},
	branches: ["c", "v"],
	tabFormat: ["prestige-display", "milestones", ["raw-html", _=>{
		return player.o.milestones.includes("3")?`<br><br>You have ${format(player.o.dust)} dust, boosting point gain by x${format(player.o.dust.add(1).pow((hasUpgrade("o", 12)+1)*4))}.<br><br>`:""
	}], "respec-button", "upgrades", "buyables"]
})
addLayer("s", {
	name: "superdense", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		decayInput: "1",
		best: new Decimal(0),
		pentafllryium: new Decimal(0),
	}},
	color: "#666",
	requires: new Decimal("e1200"), // Can be a function that takes requirement increases into account
	resource: "superdense points", // Name of prestige currency
	baseResource: "points", // Name of resource prestige is based on
	baseAmount() {return player.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 0.003, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1);
		mult = mult.mul(tmp.s.effect.spGain);
		return mult;
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 1, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "s", description: "S: Reset for superdense points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return player.o.milestones.includes("5")},
	componentStyles: {
		milestone: {
			width: "500px",
			verticalAlign: "middle"
		}
	},
	insert() {
		let amount = new Decimal(player.s.decayInput);
		if (player.s.decayInput.includes("%")) amount = player.s.points.mul(parseInt(player.s.decayInput)*0.01).ceil();
		return amount;
	},
	canDecay() {
		return player.s.points.gte(0)&&player.s.points.gte(tmp.s.insert);
	},
	buyables: {
		rows: 1,
		cols: 3,
		11: {
			title: "Decay α",
			display() {
				return `<span style="font-size: 12px">
				Inserted: ${format(player.s.buyables[11])}<br>
				Effect: ^${format(tmp.s.buyables[11].effect, 4)} to point gain and v.p. gain<br>
				Half life: 100s<br>
				Decays into: ${format(player.s.buyables[11].mul(0.5))} pentafllryium</span>`;
			},
			buy() {
				if (this.canAfford()) {
					player.s.buyables[11] = player.s.buyables[11].add(tmp.s.insert);
					player.s.points = player.s.points.sub(tmp.s.insert);
				}
			},
			canAfford() {return layers.s.canDecay()},
			cost() {
				return new Decimal(0);
			},
			effect() {
				var base = player.s.buyables[11].add(1000).log(1000).add(4).log(5).pow(0.3);
				if (base.gte(1.1)) base = base.mul(1.21).pow(1/3);
				return base;
			}
		},
		/*12: {
			title: "Decay α",
			display() {
				return `<span style="font-size: 12px">
				Inserted: ${format(player.s.buyables[12])}<br>
				Effect: x${format(tmp.s.buyables[12].effect)} to c.p. gain and divides compactor cost by this number<br>
				Half life: 100s<br>
				Decays into: ${format(player.s.buyables[12].mul(0.01))} α</span>`;
			},
			buy() {
				if (this.canAfford()) {
					player.s.buyables[12] = player.s.buyables[12].add(tmp.s.insert);
					player.s.points = player.s.points.sub(tmp.s.insert);
				}
			},
			canAfford() {return layers.s.canDecay()},
			cost() {
				return new Decimal(0);
			},
			effect() {
				var base = player.s.buyables[12].add(1).pow(10);
				return base;
			}
		}*/
	},
	upgrades: {
		rows: 5,
		cols: 5,
		11: {
			title: "Point Relations",
			description: "Best Superdense points boost point gain.",
			cost: 1,
			effect() {
				return player.s.best.add(1).pow(30);
			},
			effectDisplay() {
				return `x${format(this.effect())}`;
			}
		},
		12: {
			title: "Acceleration Jerk Jounce Crackle Pop",
			description: "Raise <b>Inertia Boost</b> and <b>Reverse Inertia</b> to the 10th power.",
			cost: 20
		},
		13: {
			title: "Unstable Collapse",
			description: "Unlock superdense decay.",
			cost: 3000
		},
		14: {
			title: "Hyperinflation Compactors",
			description: "Compactor to dust uses exponential growth instead of polynomial growth.",
			cost: 100000
		}
	},
	milestones: {
		0: {
			requirementDescription: "300 superdense points",
			effectDescription: "Gain 100% of vapourised point gain on prestige per second.",
			done() {
				return player.s.points.gte(300);
			}
		},
		1: {
			requirementDescription: "Toggle amount to insert in decays",
			effectDescription() {
				return `Currently: ${format(tmp.s.insert)} superdense ${tmp.s.insert.gt(1)?"points":"point"}`
			},
			toggles: [["s", "decayInput", ["1", "10", "10%", "50%", "100%"]]],
			done() {
				return true;
			},
			style: {
				display: "block"
			}
		}
	},
	update(diff) {
		var b11diff = player.s.buyables[11];
		player.s.buyables[11] = player.s.buyables[11].div(Decimal.pow(2, diff/100)).mul(10000).floor().div(10000);
		player.s.pentafllryium = player.s.pentafllryium.add(b11diff.sub(player.s.buyables[11]).mul(0.5));
	},
	branches: ["c", "v"],
	tabFormat: {
		"Main": {
			content: ["prestige-display", ["milestone", 0], "upgrades"]
		},
		"Decay": {
			content: ["prestige-display", ["milestone", 1], ["raw-html", "<br><br>"], "buyables", ["raw-html", _=> {
				return `<br><br>You have ${format(player.s.pentafllryium)} pentafllryium, boosting superdense point gain by ${format(tmp.s.effect.spGain)}`
			}]],
			unlocked() {
				return hasUpgrade("s", 13);
			}
		}
	},
	effect() {
		return {
			spGain: player.s.pentafllryium.add(10).log10().pow(1.3)
		}
	}
})
/*addLayer("sd", {
	name: "slow", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "SD", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#cc9999",
	requires: new Decimal("1e6600"), // Can be a function that takes requirement increases into account
	resource: "slowdown", // Name of prestige currency
	baseResource: "points", // Name of resource prestige is based on
	baseAmount() {return player.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 0.01, // Prestige currency exponent
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		return mult
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 1, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "S", description: "Shift+S: Reset for slowdown", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return player.s.points.gte(1e18)||player.sd.unlocked},
	branches: ["c", "v"]
})*/