const PATH_PREFIX = "/img";

export function getSrcPath(path: string): string {
	if (path.startsWith("@")) {
		return PATH_PREFIX + path.slice(1);
	}
	return path;
}

export function omitFields<T, K extends keyof T>(
	obj: T,
	keys: K[],
): Omit<T, K> {
	const result = { ...obj };
	keys.forEach((key) => {
		delete result[key];
	});
	return result;
}
