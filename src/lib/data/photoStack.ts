export function depthFromFront(photoIndex: number, frontIndex: number, photoCount: number): number {
	return (photoIndex - frontIndex + photoCount) % photoCount;
}
