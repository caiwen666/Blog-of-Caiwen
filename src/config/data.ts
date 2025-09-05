import "server-only";
import {
	Article,
	ArticleList,
	ArticleMap,
	Category,
	Recommend,
} from "@/config/entity";
import Path from "path";
import Fs from "fs";
import dayjs from "dayjs";
import { GlobalRef } from "@/config/global";
import { getConfigInstance } from "@/config/api";
import { MeiliSearch } from "meilisearch";

export interface IData {
	data: ArticleList;
	index: ArticleMap;
	tree: Category;
	recommend: Recommend;
	home: string[];
	discard: string[];
	draft: string[];
}

export function readFile(path: string) {
	return Fs.readFileSync(path, "utf-8");
}

export function getSearchClient(): MeiliSearch {
	const config = getConfigInstance();
	const globalValue = new GlobalRef<MeiliSearch>("blog_search");
	if (globalValue.value) return globalValue.value;
	const client = new MeiliSearch({
		host: "http://localhost:7700",
		apiKey: config.meilisearch_token,
	});
	globalValue.value = client;
	return client;
}

export default function getDataInstance(forceLoad = false) {
	if (forceLoad) getConfigInstance(true);
	const globalValue = new GlobalRef<IData>("blog_db");
	if (globalValue.value && !forceLoad) return globalValue.value;
	else {
		console.log(
			`[${dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss")}] 数据重载`,
		);
		const main = Path.join(process.cwd(), "data", "build");
		const data: IData = {
			data: JSON.parse(readFile(Path.join(main, "data.json"))),
			index: JSON.parse(readFile(Path.join(main, "index.json"))),
			tree: JSON.parse(readFile(Path.join(main, "tree.json"))),
			recommend: JSON.parse(readFile(Path.join(main, "recommend.json"))),
			home: JSON.parse(readFile(Path.join(main, "home.json"))),
			discard: JSON.parse(readFile(Path.join(main, "discard.json"))),
			draft: JSON.parse(readFile(Path.join(main, "draft.json"))),
		};
		globalValue.value = data;
		//更新meilisearch的数据
		const client = getSearchClient();
		const index = client.index("blog");

		async function updateSearch() {
			const task = await index.deleteAllDocuments();
			await client.waitForTask(task.taskUid);
			await index.addDocuments(data.data);
		}

		updateSearch();
		return data;
	}
}

export function getArticle(id: string): Article | null {
	const instance = getDataInstance();
	if (instance.index[id] === undefined) {
		return null;
	}
	return instance.data[instance.index[id]];
}
