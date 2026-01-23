import { alpha, styled } from '@mui/material/styles';

import { carouselClasses } from '../classes';

import type { CarouselProgressBarProps } from '../types';

// ----------------------------------------------------------------------

export function CarouselProgressBar({ sx, value, className, ...other }: CarouselProgressBarProps) {
	return (
		<ProgressBarRoot
			className={carouselClasses.progress.root}
			sx={[{ '--progress-value': value }, ...(Array.isArray(sx) ? sx : [sx])]}
			{...other}
		>
			<ProgressBar className={carouselClasses.progress.bar} />
		</ProgressBarRoot>
	);
}

// ----------------------------------------------------------------------

const ProgressBarRoot = styled('div')(({ theme }) => ({
	height: 6,
	maxWidth: 120,
	width: '100%',
	borderRadius: 6,
	overflow: 'hidden',
	position: 'relative',
	color: theme.palette.text.primary,
	backgroundColor: alpha(theme.palette.grey['500'], 0.2),
}));

const ProgressBar = styled('span')(({ theme }) => ({
	top: 0,
	bottom: 0,
	width: '100%',
	left: '-100%',
	position: 'absolute',
	backgroundColor: 'currentColor',
	transform: `translate3d(calc(var(--progress-value) * ${theme.direction === 'rtl' ? -1 : 1}%), 0px, 0px)`,
}));
