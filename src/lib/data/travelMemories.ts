import { travelStamps, type TravelStamp } from './travelStamps';

export interface TravelPhoto {
	url: string;
	alt: string;
}

export interface TravelMemory {
	place: string;
	date: string;
	photos: TravelPhoto[];
	stamps: TravelStamp[];
}

export interface UpcomingTrip {
	place: string;
	date: string;
}

export const travelMemories: TravelMemory[] = [
	{
		place: 'London',
		date: 'May 2025',
		photos: [
			{
				url: '/travel/london-2025-320.webp',
				alt: 'Liam in the stands at London Stadium, home of West Ham'
			},
			{
				url: '/travel/london-2025-park-320.webp',
				alt: 'Liam crossing a road into a London park, throwing up a hand sign'
			}
		],
		stamps: travelStamps
	}
];

/** Shown under the passports as "next up"; hidden while empty */
export const upcomingTrips: UpcomingTrip[] = [];
