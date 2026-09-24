export interface TravelStamp {
	place: string;
	date: string;
	imageUrl: string;
	tiltDeg: number;
}

export const travelStamps: TravelStamp[] = [
	{
		place: 'London',
		date: 'May 2025',
		imageUrl: '/stamps/london-2025.webp',
		tiltDeg: -6
	},
	{
		place: 'West Ham vs Luton, London Stadium',
		date: 'May 2025',
		imageUrl: '/stamps/west-ham-luton-2025.webp',
		tiltDeg: 4
	}
];
