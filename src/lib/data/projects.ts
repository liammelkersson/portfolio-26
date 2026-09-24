export type Project = {
	title: string;
	description: string;
	url: string; // empty string = card renders without link
	image: string;
	tags?: string[];
	badges?: string[]; // pills on the card, e.g. ['Y Combinator', 'B2B']
	tint: string; // card background accent, hex
	/** Projects without a start year stay off the timeline */
	startYear?: number;
	ongoing?: true;
	logoUrl?: string;
};

export const projects: Project[] = [
	{
		title: 'awaio.com',
		description: 'Website for Awaio, a workplace experience platform for booking desks, rooms, lockers and parking.',
		url: 'https://awaio.com',
		image: '/projects/awaio.webp',
		tags: ['Workplace platform', 'Product'],
		badges: ['Workplace platform', 'Product'],
		tint: '#3DBB95',
		startYear: 2024,
		ongoing: true,
		logoUrl: '/timeline/awaio.webp'
	},
	{
		title: 'jonwest.se',
		description: 'Website for JonWest, a consultancy for office workplace strategy and journey support.',
		url: 'https://jonwest.se',
		image: '/projects/jonwest.webp',
		tags: ['Consultancy', 'Web'],
		badges: ['Consultancy', 'Web'],
		tint: '#8FA8FF',
		startYear: 2025,
		logoUrl: '/timeline/jonwest.webp'
	},
	{
		title: 'stammy.se',
		description: 'Website for Stammy, a digital punch card app rewarding regulars at restaurants.',
		url: 'https://stammy.se',
		image: '/projects/stammy.webp',
		tags: ['Loyalty app', 'Product'],
		badges: ['Loyalty app', 'Product'],
		tint: '#F2A7C3',
		startYear: 2024,
		logoUrl: '/timeline/stammy.webp'
	},
	// Temporary — will be replaced.
	{
		title: 'Soundscape Magazine',
		description: 'Editorial concept for a music magazine.',
		url: '',
		image: '/projects/soundscape.webp',
		tags: ['Editorial', 'Concept'],
		badges: ['Editorial', 'Concept'],
		tint: '#B7A4F5'
	}
];
