<script lang="ts">
	import "../styles/display.postcss";
	import Diagram from '$lib/components/Diagram.svelte';
	import { initTimestamps, type Timestamps } from '$lib/timestamps';
	import { usePocketbase } from '$lib/hooks/usePocketbase';
	import { initStores, auth, currentState } from '$lib/stores';
	import { useInteraction } from '$lib/hooks/useInteraction';
	import { onMount } from 'svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	const timestamps = initTimestamps();
	const stores = initStores();
	const usePocketbaseHook = usePocketbase(timestamps, stores);
	const useInteractionHook = useInteraction(usePocketbaseHook);

	const {
		authenticate,
		sendHeartbeat,
		subscribeToCollections,
		writeStateChange,
		writeArbitraryCommand,
		writeLoadCellCommand
	} = usePocketbaseHook;

	const {
		confirmStateChange,
		instantStateChange,
		resumeConfirmRemoveWeight
	} = useInteractionHook;

	// Destructure stores for later use
	const {
		ac2_open,

        pv1_open,
        pv2_open,
        pv3_open,
        pv4_open,
        pv5_open,
        pv6_open,
		pv7_open,
		pv8_open,

        sol5_open,
        sol6_open,
        sol7_open,
        sol8a_open,
        sol8b_open,

        tc1_temperature,
        tc2_temperature,
        tc3_temperature,
        tc4_temperature,
        tc5_temperature,
        tc6_temperature,

		nos1_mass,
		nos2_mass,
        
		pt1_pressure,
		pt2_pressure,
		pt3_pressure,
		pt4_pressure,
        pt5_pressure,
		pt6_pressure,
		pt7_pressure,
		pt8_pressure,

		box1_on,
        box2_on,

		system_state,
		timer_state,
		timer_period,
		timer_remaining,

		mev_open, 
		power_source,
		battery_voltage
	} = stores;
	
	onMount(() => {
		let heartbeatInterval: NodeJS.Timeout;

		// Handle pocketbase authentication
		const handleAuth = async () => {
			$auth = await authenticate();

			if ($auth === true) {
				heartbeatInterval = setInterval(async () => {
					await sendHeartbeat();
				}, 5000); // 5000 milliseconds = 5 seconds
			}
		}

		handleAuth();

		// Subscribe to pocket base events
		subscribeToCollections();

		// Handle displaying outdated data
		let containerElement = document.querySelector('.container') as HTMLElement;

		let timestampInterval = setInterval(() => {
			for (let variable in timestamps) {
				let elements = document.getElementsByClassName(variable);
				if (!elements.length) continue;

				for(let i = 0; i < elements.length; i++) {
					let element = elements[i];

					if (Date.now() - timestamps[variable as keyof Timestamps] > 5000) {
						element.classList.add('outdated');
					} else {
						element.classList.remove('outdated');
					}
				}
			}
		}, 1000);

		// Define the resize handler
		const handleResize = () => {
			if (containerElement) {
				let containerWidth = containerElement.offsetWidth;
				let containerHeight = containerElement.offsetHeight;

				document.documentElement.style.setProperty('--container-width', `${containerWidth}px`);
				document.documentElement.style.setProperty('--container-height', `${containerHeight}px`);
				document.documentElement.style.setProperty(
					'--container-width-unitless',
					`${containerWidth}`
				);
			} else {
				console.error('No element with class "container" found');
			}
		};

		// Call the resize handler once on mount
		handleResize();

		// Attach the resize handler to the resize event
		window.addEventListener('resize', handleResize);

		// Return a cleanup function
		return () => {
			clearInterval(heartbeatInterval); // Stop the interval when the component is destroyed
			clearInterval(timestampInterval);

			window.removeEventListener('resize', handleResize);
		};
	});

	$: ac2_display = $ac2_open === undefined ? 'AC2 N/A' : $ac2_open ? 'ON' : 'OFF';

	$: pv1_display = $pv1_open === undefined ? 'pv1 N/A' : $pv1_open ? 'OPEN' : 'CLOSED';
	$: pv2_display = $pv2_open === undefined ? 'pv2 N/A' : $pv2_open ? 'OPEN' : 'CLOSED';
	$: pv3_display = $pv3_open === undefined ? 'pv3 N/A' : $pv3_open ? 'OPEN' : 'CLOSED';
	$: pv4_display = $pv4_open === undefined ? 'pv4 N/A' : $pv4_open ? 'CLOSED' : 'OPEN';
    $: pv5_display = $pv5_open === undefined ? 'pv5 N/A' : $pv5_open ? 'CLOSED' : 'OPEN';
    $: pv6_display = $pv6_open === undefined ? 'pv6 N/A' : $pv6_open ? 'CLOSED' : 'OPEN';

	$: sol5_display = $sol5_open === undefined ? 'sol5 N/A' : $sol5_open ? 'OPEN' : 'CLOSE';
	$: sol6_display = $sol6_open === undefined ? 'sol6 N/A' : $sol6_open ? 'OPEN' : 'CLOSE';
	$: sol7_display = $sol7_open === undefined ? 'sol7 N/A' : $sol7_open ? 'OPEN' : 'CLOSE';
	$: sol8a_display = $sol8a_open === undefined ? 'sol8a N/A' : $sol8a_open ? 'OPEN' : 'CLOSE';
	$: sol8b_display = sol8b_open === undefined ? 'sol8b N/A' : $sol8b_open ? 'OPEN' : 'CLOSE';

	$: tc1_display = $tc1_temperature === undefined ? 'N/A' : $tc1_temperature;
	$: tc2_display = $tc2_temperature === undefined ? 'N/A' : $tc2_temperature;
    $: tc3_display = $tc3_temperature === undefined ? 'N/A' : $tc3_temperature;
    $: tc4_display = $tc4_temperature === undefined ? 'N/A' : $tc4_temperature;
    $: tc5_display = $tc5_temperature === undefined ? 'N/A' : $tc5_temperature;
	$: tc6_display = $tc6_temperature === undefined ? 'N/A' : $tc6_temperature;

	$: nos1_mass_display = $nos1_mass === undefined ? 'N/A' : Number($nos1_mass).toFixed(2);
	$: nos2_mass_display = $nos2_mass === undefined ? 'N/A' : Number($nos2_mass).toFixed(2);

	$: pt1_pressure_display = $pt1_pressure === undefined ? 'N/A' : $pt1_pressure;
	$: pt2_pressure_display = $pt2_pressure === undefined ? 'N/A' : $pt2_pressure;
	$: pt3_pressure_display = $pt3_pressure === undefined ? 'N/A' : $pt3_pressure;
	$: pt4_pressure_display = $pt4_pressure === undefined ? 'N/A' : $pt4_pressure;
    $: pt5_pressure_display = $pt5_pressure === undefined ? 'N/A' : $pt5_pressure;
	$: pt6_pressure_display = $pt6_pressure === undefined ? 'N/A' : $pt6_pressure;
	$: pt7_pressure_display = $pt7_pressure === undefined ? 'N/A' : $pt7_pressure;
	$: pt8_pressure_display = $pt8_pressure === undefined ? 'N/A' : $pt8_pressure;

	$: system_state_display = $system_state === undefined ? 'N/A' : $system_state.replace('SYS_', '');

	$: timer_state_display = $timer_state === undefined ? 'N/A' : $timer_state;
	$: timer_period_display = $timer_period === undefined ? 'N/A' : ($timer_period / 1000).toFixed(0); // Convert to seconds
	$: timer_remaining_display = $timer_remaining === undefined ? 'N/A' : ($timer_remaining / 1000).toFixed(0); // Convert to seconds

	$: box1_display = $box1_on === undefined ? 'N/A' : $box1_on ? 'LIVE' : 'DEAD';
	$: box2_display = $box2_on === undefined ? 'N/A' : $box2_on ? 'LIVE' : 'DEAD';

	$: mev_display = $mev_open === undefined ? 'N/A' : $mev_open ? 'OPEN' : 'CLOSED';
	$: battery_display = $battery_voltage === undefined ? 'N/A' : $battery_voltage;
	$: power_display = $power_source === undefined ? 'N/A' : $power_source ? 'ROCKET' : 'GROUND';

	$: pv7_display = $pv7_open === undefined ? 'N/A' : $pv7_open ? 'OPEN' : 'CLOSE';
	$: pv8_display = $pv8_open === undefined ? 'N/A' : $pv8_open ? 'OPEN' : 'CLOSE';

	$: relayStatusOutdated = Date.now() - timestamps.relay_status > 5000;
	$: combustionControlStatusOutdated = Date.now() - timestamps.combustion_control_status > 5000;
	$: rcuTempOutdated = Date.now() - timestamps.rcu_temp > 5000;
	$: batteryOutdated = Date.now() - timestamps.battery > 5000;
	$: launchRailLoadCellOutdated = Date.now() - timestamps.launch_rail_load_cell > 5000;
	$: nosLoadCellOutdated = Date.now() - timestamps.nos_load_cell > 5000;
	$: pbbPressureOutdated = Date.now() - timestamps.pbb_pressure > 5000;
	$: pbbTemperatureOutdated = Date.now() - timestamps.pbb_temperature > 5000;
	$: rcuPressureOutdated = Date.now() - timestamps.rcu_pressure > 5000;
	$: sysStateOutdated = Date.now() - timestamps.sys_state > 5000;
	$: heartbeatOutdated = Date.now() - timestamps.heartbeat > 5000;

	const handleSliderChange = async (e: any, target: string, openCommand: string, closeCommand: string) => {
		e.preventDefault();

		// Determine the command based on the current value of the slider
		const command = e.target.checked ? openCommand : closeCommand;

		// Create a change on the 'RelayStatus' collection
		writeArbitraryCommand(target, command);
	}

	let wasLiveAtAnyPoint = false;

	const pollIgnitors = async () => {
		if (box1_display === 'LIVE' || box2_display === 'LIVE') {
			wasLiveAtAnyPoint = true;
		}
	}

	const handleLaunchSequence = async () => {
		await writeArbitraryCommand('NODE_RC', 'RC_IGNITE_PAD_BOX1');
		await writeArbitraryCommand('NODE_RC', 'RC_IGNITE_PAD_BOX2');

		const pollInterval = setInterval(pollIgnitors, 100);
		await new Promise(resolve => setTimeout(resolve, 3500));

		clearInterval(pollInterval);

		if (wasLiveAtAnyPoint) {
			for (let i = 0; i < 3; i++) {
				await writeStateChange('RSC_IGNITION_TO_LAUNCH');
				await new Promise(resolve => setTimeout(resolve, 100));
			} 
		}

		wasLiveAtAnyPoint = false;
	}

	const performTare = (loadcell: string) => {
		writeLoadCellCommand(loadcell, "TARE", 0);
	}

	// NOTE: This seems odd but since the event will switch these MUST be swapped
	// Open to alternate ways of doing it. Everything I tried didn't work.
	const handleIgnition = async (e: MouseEvent) => {
		await handleSliderChange(e, 'NODE_RCU', 'RCU_IGNITE_PAD_BOX1', 'RCU_KILL_BOX1');
		await handleSliderChange(e, 'NODE_RCU', 'RCU_KILL_PAD_BOX2', 'RCU_IGNITE_PAD_BOX2');
	}

</script>

<div class="container">
	<Diagram />

	<div class="ac2_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="ac2_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$ac2_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_AC2', 'RCU_CLOSE_AC2')}
		>
			{ac2_display}
		</SlideToggle>
	</div>

	<div class="pv1_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="pv1_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pv1_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_PV1', 'RCU_CLOSE_PV1')}
		>
			{pv1_display}
		</SlideToggle>
	</div>

	<div class="pv2_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="pv2_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pv2_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_PV2', 'RCU_CLOSE_PV2')}
		>
			{pv2_display}
		</SlideToggle>
	</div>

	<div class="pv3_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="pv3_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pv3_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_PV3', 'RCU_CLOSE_PV3')}
		>
			{pv3_display}
		</SlideToggle>
	</div>

	<div class="pv4_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="pv4_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pv4_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_PV4', 'RCU_CLOSE_PV4')}
		>
			{pv4_display}
		</SlideToggle>
	</div>

    <div class="pv5_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="pv5_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pv5_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_PV5', 'RCU_CLOSE_PV5')}
		>
			{pv5_display}
		</SlideToggle>
	</div>

    <div class="pv6_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="pv6_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pv6_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_PV6', 'RCU_CLOSE_PV6')}
		>
			{pv6_display}
		</SlideToggle>
	</div>
	
	<div class="sol5_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="sol5_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol5_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_SOL5', 'RCU_CLOSE_SOL5')}
		>
			{sol5_display}
		</SlideToggle>
	</div>

	<div class="sol6_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="sol6_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol6_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_SOL6', 'RCU_CLOSE_SOL6')}
		>
			{sol6_display}
		</SlideToggle>
	</div>

	<div class="sol7_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="sol7_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol7_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_SOL7', 'RCU_CLOSE_SOL7')}
		>
			{sol7_display}
		</SlideToggle>
	</div>

	<div class="sol8a_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="sol8a_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol8a_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_SOL8A', 'RCU_CLOSE_SOL8A')}
		>
			{sol8a_display}
		</SlideToggle>
	</div>

	<div class="sol8b_slider relay_status {relayStatusOutdated ? 'outdated' : ''}">
		<SlideToggle
			name="sol8b_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$sol8b_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_SOL8B', 'RCU_CLOSE_SOL8B')}
		>
			{sol8b_display}
		</SlideToggle>
	</div>

	<div class="tc1 rcu_temp {rcuTempOutdated ? 'outdated' : ''}">
		<p>{tc1_display}</p>
	</div>

	<div class="tc2 rcu_temp {rcuTempOutdated ? 'outdated' : ''}">
		<p>{tc2_display}</p>
	</div>

    <div class="tc3 rcu_temp {rcuTempOutdated ? 'outdated' : ''}">
		<p>{tc3_display}</p>
	</div>

    <div class="tc4 rcu_temp {rcuTempOutdated ? 'outdated' : ''}">
		<p>{tc4_display}</p>
	</div>

    <div class="tc5 rcu_temp {rcuTempOutdated ? 'outdated' : ''}">
		<p>{tc5_display}</p>
	</div>

	<div class="tc6 rcu_temp {rcuTempOutdated ? 'outdated' : ''}">
		<p>{tc6_display}</p>
	</div>

	<div class="nos1 nos_load_cell {nosLoadCellOutdated ? 'outdated' : ''}">
		<p>{nos1_mass_display}</p>
	</div>

	<div class="nos2 nos_load_cell {nosLoadCellOutdated ? 'outdated' : ''}">
		<p>{nos2_mass_display}</p>
	</div>

	<div class="pt1_pressure rcu_pressure {rcuPressureOutdated ? 'outdated' : ''}">
		<p>{pt1_pressure_display}</p>
	</div>

	<div class="pt2_pressure rcu_pressure {rcuPressureOutdated ? 'outdated' : ''}">
		<p>{pt2_pressure_display}</p>
	</div>

	<div class="pt3_pressure rcu_pressure {rcuPressureOutdated ? 'outdated' : ''}">
		<p>{pt3_pressure_display}</p>
	</div>

	<div class="pt4_pressure rcu_pressure {rcuPressureOutdated ? 'outdated' : ''}">
		<p>{pt4_pressure_display}</p>
	</div>

    <div class="pt5_pressure rcu_pressure {rcuPressureOutdated ? 'outdated' : ''}">
		<p>{pt5_pressure_display}</p>
	</div>

	<div class="pt6_pressure rcu_pressure {rcuPressureOutdated ? 'outdated' : ''}">
		<p>{pt6_pressure_display}</p>
	</div>

	<div class="pt7_pressure rcu_pressure {rcuPressureOutdated ? 'outdated' : ''}">
		<p>{pt7_pressure_display}</p>
	</div>

	<div class="pt8_pressure rcu_pressure {rcuPressureOutdated ? 'outdated' : ''}">
		<p>{pt8_pressure_display}</p>
	</div>

	<div class="system_state sys_state {sysStateOutdated ? 'outdated' : ''}">
		<p>{system_state_display}</p>
	</div>

	<div class="timer_state heartbeat {heartbeatOutdated ? 'outdated' : ''}">
		<p>{timer_state_display}</p>
	</div>

	<div class="timer_period heartbeat {heartbeatOutdated ? 'outdated' : ''}">
		<p>{timer_period_display}</p>
	</div>

	<div class="timer_remaining heartbeat {heartbeatOutdated ? 'outdated' : ''}">
		<p>{timer_remaining_display}</p>
	</div>

	<div class="pv7_display">
		<SlideToggle
			name="pv7_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pv7_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_PV7', 'RCU_CLOSE_PV7')}
		>
			{pv7_display}
		</SlideToggle>
	</div>

	<div class="pv8_display">
		<SlideToggle
			name="pv8_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$pv8_open}
			on:click={(e) => handleSliderChange(e, 'NODE_RCU', 'RCU_OPEN_PV8', 'RCU_CLOSE_PV8')}
		>
			{pv8_display}
		</SlideToggle>
	</div>

	{#if $currentState === "RS_IGNITION" || $currentState === "RS_TEST" || $currentState === "RS_ABORT" || $currentState === "RS_LAUNCH" || $currentState === "RS_BURN" || $currentState === "RS_COAST" || $currentState === "RS_RECOVERY"}
		<div class="box1_slider">
			<SlideToggle
				name="box1_slider"
				active="bg-primary-500 dark:bg-primary-500"
				size="sm"
				bind:checked={$box1_on}
				on:click={handleIgnition}
				disabled={$currentState === "RS_IGNITION" || $currentState === "RS_ABORT" || $currentState === "RS_LAUNCH" || $currentState === "RS_BURN" || $currentState === "RS_COAST" || $currentState === "RS_RECOVERY"}
			>
				{box1_display}
			</SlideToggle>
		</div>

		<div class="box2_slider">
			<SlideToggle
				name="box2_slider"
				active="bg-primary-500 dark:bg-primary-500"
				size="sm"
				bind:checked={$box2_on}
				on:click={handleIgnition}
				disabled={$currentState === "RS_IGNITION" || $currentState === "RS_ABORT" || $currentState === "RS_LAUNCH" || $currentState === "RS_BURN" || $currentState === "RS_COAST" || $currentState === "RS_RECOVERY"}
			>
				{box2_display}
			</SlideToggle>
		</div>
	{/if}

	<div class="nos1_tare_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-secondary" 
			on:click={() => performTare("NOS1")}
		>
			TARE
		</button>
	</div>

	<div class="nos1_cal_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-error" 
			on:click={() => {
				writeLoadCellCommand("NOS1", "CANCEL", 0);
				resumeConfirmRemoveWeight("NOS1");}}
		>
			CAL
		</button>
	</div>

	<div class="nos2_tare_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-secondary" 
			on:click={() => performTare("NOS2")}
		>
			TARE
		</button>
	</div>

	<div class="nos2_cal_button">
		<button 
			type="button" 
			class="btn btn-sm variant-filled-error" 
			on:click={() => {
				writeLoadCellCommand("NOS2", "CANCEL", 0);
				resumeConfirmRemoveWeight("NOS2");}}
		>
			CAL
		</button>
	</div>

	<div class="mev_status combustion_control_status {combustionControlStatusOutdated ? 'outdated' : ''}">
		<p>{mev_display}</p>
	</div>

	<div class="battery_voltage  battery {batteryOutdated ? 'outdated' : ''}">
		<p>{battery_display}</p>
	</div>

	<div class="power_source_slider battery {batteryOutdated  ? 'outdated' : ''}">
		<SlideToggle
			name="power_source_slider"
			active="bg-primary-500 dark:bg-primary-500"
			size="sm"
			bind:checked={$power_source}
			on:click={(e) =>
				handleSliderChange(
					e,
					'NODE_DMB',
					'RSC_POWER_TRANSITION_ONBOARD',
					'RSC_POWER_TRANSITION_EXTERNAL'
				)}
		>
			{power_display}
		</SlideToggle>
	</div>

	<!-- Render different buttons based on the current state -->
	{#if $currentState == "RS_PRELAUNCH"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => confirmStateChange("RSC_GOTO_FILL")}
		>
			Go to Fill
		</button>
		<button
			class="btn variant-ghost-error next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}
		>
			Go to Abort
		</button>
	{:else if $currentState == "RS_FILL"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => confirmStateChange("RSC_GOTO_PRELAUNCH")}
		>
			Go to Pre-Launch
		</button>
		<button
			class="btn variant-filled-warning arm_button"
			style="top: calc(var(--container-width) * 0.47);"
			on:click={() => instantStateChange("RSC_ARM_CONFIRM_1")}
		>
			ARM CONFIRM 1
		</button>
		<button
			class="btn variant-filled-warning arm_button"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => instantStateChange("RSC_ARM_CONFIRM_2")}
		>
			ARM CONFIRM 2
		</button>
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.47);"
			on:click={() => confirmStateChange("RSC_GOTO_ARM")}
		>
			Go to Arm
		</button>
		<button
			class="btn variant-ghost-error next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}
		>
			Go to Abort
		</button>
	{:else if $currentState == "RS_ARM"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => confirmStateChange("RSC_GOTO_FILL")}
		>
			Go to Fill
		</button>
		<button
			class="btn variant-filled-warning next-state-btn"
			style="top: calc(var(--container-width) * 0.47);"
			on:click={() => confirmStateChange("RSC_GOTO_IGNITION")}
		>
			Go to Ignition
		</button>
		<button
			class="btn variant-ghost-error next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}
		>
			Go to Abort
		</button>
	{:else if $currentState == "RS_IGNITION"}
		<button
			class="btn variant-filled-error next-state-btn"
			style="top: calc(var(--container-width) * 0.47);"
			on:click={() => handleLaunchSequence()}
		>
			LAUNCH
		</button>
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => confirmStateChange("RSC_GOTO_ARM")}
		>
			Go to Arm
		</button>
	{:else if $currentState == "RS_ABORT"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => confirmStateChange("RSC_GOTO_PRELAUNCH")}
		>
			Go to Pre-Launch
		</button>
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => confirmStateChange("RSC_GOTO_TEST")}
		>
			Go to Test
		</button>
	{:else if $currentState == "RS_RECOVERY"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}
		>
			Go to Abort
		</button>
	{:else if $currentState == "RS_TEST"}
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.53);"
			on:click={() => instantStateChange("RSC_ANY_TO_ABORT")}
		>
			Go to Abort
		</button>
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.5);"
			on:click={() => instantStateChange("RSC_TEST_MEV_OPEN")}
		>
			Open MEV
		</button>
		<button
			class="btn variant-filled-secondary next-state-btn"
			style="top: calc(var(--container-width) * 0.47);"
			on:click={() => instantStateChange("RSC_MEV_CLOSE")}
		>
			Close MEV
		</button>
	{/if}
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	@media (min-width: 576px) {
		.container {
			max-width: 100%;
		}
	}
</style>