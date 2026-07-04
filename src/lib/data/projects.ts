export type Project = {
	title: string;
	description: string;
	url: string; // empty string = card renders without link
	image: string;
};

export const projects: Project[] = [
	{
		title: 'awaio.com',
		description: 'Website for Awaio, a workplace experience platform for booking desks, rooms, lockers and parking.',
		url: 'https://awaio.com',
		image: '/projects/awaio.jpg'
	},
	{
		title: 'jonwest.se',
		description: 'Website for JonWest, a consultancy for office workplace strategy and journey support.',
		url: 'https://jonwest.se',
		image: '/projects/jonwest.jpg'
	},
	{
		title: 'stammy.se',
		description: 'Website for Stammy, a digital punch card app rewarding regulars at restaurants.',
		url: 'https://stammy.se',
		image: '/projects/stammy.jpg'
	},
	// Temporary — will be replaced.
	{
		title: 'Soundscape Magazine',
		description: 'Editorial concept for a music magazine.',
		url: '',
		image: '/projects/soundscape.jpg'
	}
];
