import { calculateBaseAttribute, parseRuneBonuses, parseUpgradeBuffs, calculateBonusHealth } from '../services/gw2';
import { createSelector } from 'reselect';

const getMyCharacters = state => state.user.characters;
const getColumns = state => state.window.columns;
const fetchingCharacter = state => state.characters.fetching;
const getGw2ItemsData = state => state.gw2.items.data;
const getGw2SkinsData = state => state.gw2.skins.data;
const getFetchingGw2Data = state => state.gw2.items.fetching || state.gw2.skins.fetching; 
const getTooltipOpen = state => state.gw2.tooltip.open;

const getSelectedCharacter = state => {
	return state.characters.data[state.characters.selected];
};

const getIHaveCharacters = state => {
	let has = !state.user.characters || !state.user.characters.length;

	return !has;
};

export const myCharactersSelector = createSelector(
	getMyCharacters,
	getIHaveCharacters,
	getColumns,
	(characters, hasCharacters, columns) => {
		return {
			characters,
			hasCharacters,
			columns
		};
	}
);

// TODO: Figure out what to do for bonus count. Probably 
// can just total amount of runes, since there will be multiples.. !

const AQUATIC_EXCLUSION_LIST = [
	'Trident',
	'HelmAcquatic'
];

const getItemAttributes = (state) => {
	let selectedCharacter = getSelectedCharacter(state);

	let attributes = {
		Power: 0,
		Precision: 0,
		Toughness: 0,
		Vitality: 0,
		BoonDuration: 0,
		ConditionDamage: 0,
		ConditionDuration: 0,
		Ferocity: 0,
		HealingPower: 0,
		CriticalChance: 0,
		Health: 0,
		Armor: 0
	};

	for (let equip in selectedCharacter.equipment) {
		if (!selectedCharacter.equipment.hasOwnProperty(equip)) {
			continue;
		}

		let equipObject = selectedCharacter.equipment[equip];
		if (!equipObject) {
			continue;
		}

		let equipObjectItem = state.gw2.items.data[equipObject.id];
		if (!equipObjectItem ||
				!equipObjectItem.details ||
				!equipObjectItem.details.infix_upgrade) {
			continue;
		}

		attributes.Armor += equipObjectItem.details.defense || 0;

		if (AQUATIC_EXCLUSION_LIST.indexOf(equipObjectItem.details.type) >= 0) {
			continue;
		}

		equipObjectItem.details.infix_upgrade.attributes.forEach((attribute) => {
			attributes[attribute.attribute] += attribute.modifier;
		});

		if (!equipObject.upgrades) {
			continue;
		}

		equipObject.upgrades.forEach((upgrade) => {
			let item = state.gw2.items.data[upgrade];

			if (item.details.type === 'Rune') {
				// TODO: Calculate total amount of runes available
				let bonuses = parseRuneBonuses(item.details.bonuses, 1);
				combineAttributes(attributes, bonuses);
			} else {
				let bonuses = parseUpgradeBuffs(item.details.infix_upgrade.buff.description);
				combineAttributes(attributes, bonuses);
			}
		});

		// TODO: Calculate infusion upgrades
	}

	return attributes;
};

function combineAttributes (attr1, attr2) {
	attr1.Power += attr2.Power || 0;
	attr1.Precision += attr2.Precision || 0;
	attr1.Toughness += attr2.Toughness || 0;
	attr1.Vitality += attr2.Vitality || 0;
	attr1.BoonDuration += attr2.BoonDuration || 0;
	attr1.ConditionDamage += attr2.ConditionDamage || 0;
	attr1.ConditionDuration += attr2.ConditionDuration || 0;
	attr1.Ferocity += attr2.Ferocity || 0;
	attr1.HealingPower += attr2.HealingPower || 0;
	attr1.CriticalChance += attr2.CriticalChance || 0;
	attr1.Health += attr2.Health || 0;
}

const BASE_CRITICAL_DAMAGE = 150;
const getAttributes = (state) => {
	if (getFetchingGw2Data(state)) {
		return;
	}

	let selectedCharacter = getSelectedCharacter(state);
	if (!selectedCharacter) {
		return;
	}

	let base = calculateBaseAttribute(selectedCharacter.level);
	let bonusHealth = calculateBonusHealth(selectedCharacter.level, selectedCharacter.profession);
	let itemBonus = getItemAttributes(state);

	let precision = base + itemBonus.Precision;
	let toughness = base + itemBonus.Toughness;

	return {
		// Primary
		power: base + itemBonus.Power,
		precision: precision,
		toughness: base + itemBonus.Toughness,
		vitality: base + itemBonus.Vitality,

		// Secondary
		boon: itemBonus.BoonDuration,
		conditionDamage: itemBonus.ConditionDamage,
		conditionDuration: itemBonus.ConditionDuration.toFixed(1),
		ferocity: itemBonus.Ferocity,
		healing: itemBonus.HealingPower,

		// Derived
		armor: toughness + itemBonus.Armor,
		// TODO: Critical chance is currently rounding up. Fix it.
		criticalChance: ((precision - 916) / 21).toFixed(2),
		criticalDamage: (BASE_CRITICAL_DAMAGE + (itemBonus.Ferocity / 15)).toFixed(1),
		health: (base * 10) + bonusHealth,

		// Special
		agony: 0,
		magic: 0,

		// Profession
		profession: 0
	};
};

export const characterViewerSelector = createSelector(
	fetchingCharacter,
	getSelectedCharacter,
	getGw2ItemsData,
	getGw2SkinsData,
	getFetchingGw2Data,
	getAttributes,
	(fetching, selected, items, skins, fetchingGw2Data, attributes) => {
		return {
			fetching,
			selected,
			items,
			skins,
			fetchingGw2Data,
			attributes
		};
	}
);