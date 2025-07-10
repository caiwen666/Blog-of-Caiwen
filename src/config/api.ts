import "server-only";
import { GlobalRef } from "@/config/global";
import { readFile } from "@/config/data";
import Path from "path";

export interface IConfig {
	api_token: string;
	meilisearch_token: string;
}

export function getConfigInstance(loadForce = false): IConfig {
	const globalValue = new GlobalRef<IConfig>("blog_config");
	if (globalValue.value && !loadForce) return globalValue.value;
	else {
		const data = JSON.parse(readFile(Path.join(process.cwd(), "config.json")));
		globalValue.value = data;
		return data;
	}
}
