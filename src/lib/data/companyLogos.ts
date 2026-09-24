export type CompanyLogo = {
	name: string;
	href: string;
	src: string;
	heightPx: number;
	widthPx: number;
	color: string;
	role: string;
	description: string;
};

export const companyLogos: CompanyLogo[] = [
	{
		name: 'Awaio',
		href: 'https://awaio.com',
		src: '/logos/awaio.svg',
		heightPx: 19,
		widthPx: 90.1,
		color: '#3DBB95',
		role: 'Full time.',
		description: 'Working with marketing, design, web, growth.'
	},
	{
		name: 'Papaja',
		href: 'https://papaja.se',
		src: '/logos/papaja.png',
		heightPx: 34,
		widthPx: 87.8,
		color: '#FF7A53',
		role: 'Internship.',
		description: 'Worked on projects for Awaio, Mitigater and Stammy.'
	},
	{
		name: 'JonWest Consulting',
		href: 'https://jonwest.se',
		src: '/logos/jonwest.png',
		heightPx: 42,
		widthPx: 84,
		color: '#3D7C8A',
		role: 'Web design project.',
		description: "Short web project redesigning JonWest Consulting's website."
	},
	{
		name: 'Jönköping University',
		href: 'https://ju.se/',
		src: '/logos/ju.png',
		heightPx: 27,
		widthPx: 108.5,
		color: '#961C81',
		role: 'Teaching Assistant.',
		description: 'Teaching assistant for the course Web & User Interface Design.'
	},
	{
		name: 'Liberalerna',
		href: 'https://liberalerna.se',
		src: '/logos/liberalerna.png',
		heightPx: 27,
		widthPx: 97,
		color: '#006AB3',
		role: 'Media designer.',
		description: 'Digital design for a political campaign in 2022.'
	}
];
