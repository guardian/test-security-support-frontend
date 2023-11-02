import { useEffect, useState } from 'react';
import { fetchJson } from 'helpers/async/fetch';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { TickerProps } from './ticker';
import type { TickerConfigData, TickerCountType, TickerEndType } from './types';

function getInitialTickerValues(
	tickerCountType: TickerCountType,
): Promise<TickerConfigData> {
	return fetchJson<TickerConfigData>(
		tickerCountType === 'money' ? '/ticker.json' : '/supporters-ticker.json',
		{},
	).then((data: TickerConfigData) => {
		const total = Math.floor(data.total);
		const goal = Math.floor(data.goal);
		return {
			total,
			goal,
		};
	});
}

function getDefaultTickerEnd(total: number, goal: number) {
	if (goal > total) return goal;
	return total;
}

type TickerContainerProps = {
	countType: TickerCountType;
	endType: TickerEndType;
	headline: string;
	calculateEnd?: (total: number, goal: number) => number;
	render: (props: TickerProps) => JSX.Element;
};

export function TickerContainer({
	render,
	countType,
	endType,
	headline,
	calculateEnd = getDefaultTickerEnd,
}: TickerContainerProps): JSX.Element {
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const [tickerConfig, setTickerConfig] = useState<TickerConfigData>({
		total: 0,
		goal: 0,
	});

	const end = calculateEnd(tickerConfig.total, tickerConfig.goal);

	useEffect(() => {
		void getInitialTickerValues(countType).then(setTickerConfig);
	}, []);

	return render({
		total: tickerConfig.total,
		goal: tickerConfig.goal,
		countType,
		endType,
		countryGroupId,
		headline,
		end,
	});
}
