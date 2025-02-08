import { writable, type Writable } from 'svelte/store';

export const currentState = writable('N/A');
export const auth = writable(false);

export interface Stores {
	ac2_open: Writable<any>;
	pv1_open: Writable<any>;
    pv2_open: Writable<any>;
    pv3_open: Writable<any>;
    pv4_open: Writable<any>;
    pv5_open: Writable<any>;
    pv6_open: Writable<any>;
	pv7_open: Writable<any>;
	pv8_open: Writable<any>;
	sol5_open: Writable<any>;
    sol6_open: Writable<any>
    sol7_open: Writable<any>;
    sol8a_open: Writable<any>;
    sol8b_open: Writable<any>;
	tc1_temperature: Writable<any>;
    tc2_temperature: Writable<any>;
    tc3_temperature: Writable<any>;
    tc4_temperature: Writable<any>;
    tc5_temperature: Writable<any>;
	tc6_temperature: Writable<any>;
	nos1_mass: Writable<any>;
	nos2_mass: Writable<any>;
	pt1_pressure: Writable<string | number | undefined>;
	pt2_pressure: Writable<string | number | undefined>;
	pt3_pressure: Writable<string | number | undefined>;
	pt4_pressure: Writable<string | number | undefined>;
    pt5_pressure: Writable<string | number | undefined>;
	pt6_pressure: Writable<string | number | undefined>;
	pt7_pressure: Writable<string | number | undefined>;
	pt8_pressure: Writable<string | number | undefined>;
	system_state: Writable<string | undefined>;
	timer_state: Writable<string | undefined>;
	timer_period: Writable<number | undefined>;
	timer_remaining: Writable<number | undefined>;
	box1_on: Writable<any>;
	box2_on: Writable<any>;
	mev_open: Writable<any>;
	battery_voltage: Writable<any>;
	power_source: Writable<any>;
}

export const initStores = () => {
	return {

		ac2_open: writable(undefined),
		pv1_open: writable(undefined),
		pv2_open: writable(undefined),
		pv3_open: writable(undefined),
		pv4_open: writable(undefined),
		pv5_open: writable(undefined),
		pv6_open: writable(undefined),
		pv7_open: writable(undefined),
		pv8_open: writable(undefined),
		sol5_open: writable(undefined),
		sol6_open: writable(undefined),
		sol7_open: writable(undefined),
		sol8a_open: writable(undefined),
		sol8b_open: writable(undefined),
		tc1_temperature: writable(undefined),
		tc2_temperature: writable(undefined),
		tc3_temperature: writable(undefined),
		tc4_temperature: writable(undefined),
		tc5_temperature: writable(undefined),
		tc6_temperature: writable(undefined),
		nos1_mass: writable(undefined),
		nos2_mass: writable(undefined),
		pt1_pressure: writable<string | number | undefined>(undefined),
		pt2_pressure: writable<string | number | undefined>(undefined),
		pt3_pressure: writable<string | number | undefined>(undefined),
		pt4_pressure: writable<string | number | undefined>(undefined),
		pt5_pressure: writable<string | number | undefined>(undefined),
		pt6_pressure: writable<string | number | undefined>(undefined),
		pt7_pressure: writable<string | number | undefined>(undefined),
		pt8_pressure: writable<string | number | undefined>(undefined),
		system_state: writable<string | undefined>(undefined),
		timer_state: writable<string | undefined>(undefined),
		timer_period: writable<number | undefined>(undefined),
		timer_remaining: writable<number | undefined>(undefined),
		box1_on: writable(undefined),
		box2_on: writable(undefined),
		mev_open: writable(undefined),
		battery_voltage: writable(undefined),
		power_source: writable(undefined)
	};
};
