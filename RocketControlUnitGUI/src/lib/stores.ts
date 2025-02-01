import { writable, type Writable } from 'svelte/store';

export const currentState = writable('N/A');
export const auth = writable(false);

export interface Stores {
	ac2_open: Writable<any>;
	pbv1_open: Writable<any>;
    pbv2_open: Writable<any>;
    pbv3_open: Writable<any>;
    pbv4_open: Writable<any>;
    pbv5_open: Writable<any>;
    pbv6_open: Writable<any>;
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
	nos1_mass: Writable<any>;
	nos2_mass: Writable<any>;
	pt1_pressure: Writable<string | number | undefined>;
	pt2_pressure: Writable<string | number | undefined>;
	pt3_pressure: Writable<string | number | undefined>;
	pt4_pressure: Writable<string | number | undefined>;
    pt5_pressure: Writable<string | number | undefined>;
	system_state: Writable<string | undefined>;
	timer_state: Writable<string | undefined>;
	timer_period: Writable<number | undefined>;
	timer_remaining: Writable<number | undefined>;
	box1_on: Writable<any>;
	box2_on: Writable<any>;
}

export const initStores = () => {
	return {

		ac2_open: writable(undefined),
		pbv1_open: writable(undefined),
		pbv2_open: writable(undefined),
		pbv3_open: writable(undefined),
		pbv4_open: writable(undefined),
		pbv5_open: writable(undefined),
		pbv6_open: writable(undefined),
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
		nos1_mass: writable(undefined),
		nos2_mass: writable(undefined),
		pt1_pressure: writable<string | number | undefined>(undefined),
		pt2_pressure: writable<string | number | undefined>(undefined),
		pt3_pressure: writable<string | number | undefined>(undefined),
		pt4_pressure: writable<string | number | undefined>(undefined),
		pt5_pressure: writable<string | number | undefined>(undefined),
		system_state: writable<string | undefined>(undefined),
		timer_state: writable<string | undefined>(undefined),
		timer_period: writable<number | undefined>(undefined),
		timer_remaining: writable<number | undefined>(undefined),
		box1_on: writable(undefined),
		box2_on: writable(undefined),
	};
};
