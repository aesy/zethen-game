enum AttackType {
  SLASH,
  PUNCTURE,
  BASH,
  DEFENSE,
  BUFF,
  DEBUFF,
}

export enum AttackElement {
  NONE,
  FIRE,
  WATER,
  GRASS,
  WIND,
}

export type Effect = {
  apply(attack: Readonly<Action>): Action;
};

export type PeriodicEffect = {
  effects: Effect[];
  tickRateMs: number;
};

export type Action = {
  // baseDamage?: number;
  fireRate?: number;
  procChance?: number;
  accuracy?: number;
  radius?: number;
  range?: number;
  staminaCost?: number;
  chargeTime?: number;
  burstCount?: number;
  critModifier?: number;
  critChance?: number;
  type?: AttackType;
  element?: AttackElement;
  // trigger, speed, falloff
};
