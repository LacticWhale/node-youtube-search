import { get } from 'https';
import { stringify } from 'querystring'
import { Methods, Channel, Video, PlaylistItem, Playlist, YoutubeResponse, SearchItem, RequestOptions } from '..';

export class Youtube {
	constructor(private readonly apiKey: string) { };

	public getPlaylistVideosIdsByPlaylistId(playlistId: string): Promise<string[]> {
		return new Promise(async (resolve, reject) => {
			let nextPageToken: string = '';
			let ids: string[] = [];

			do {
				let res;

				try {
					res = await this.request('playlistItems', {
						part: 'contentDetails',
						maxResults: 50,
						pageToken: nextPageToken,
						playlistId,
					})
				} catch (e) {
					reject(e);
					return;
				}

				let items = res.items as PlaylistItem[];

				ids.push(...items.map(a => a.contentDetails.videoId))
				if(res.nextPageToken) nextPageToken = res.nextPageToken;
				else nextPageToken = '';

			} while(nextPageToken != '')

			resolve(ids)
		})
	}

	public getPlaylistsByIds(playlistsIds: string): Promise<Playlist[]>;
	public getPlaylistsByIds(playlistsIds: string[]): Promise<Playlist[]>;

	public getPlaylistsByIds(playlistsIds: string | string[]): Promise<Playlist[]> {
		return this.getListByIds('playlists', playlistsIds)
	}

	public async getPlaylistVideosByPlaylistId(playlistId: string): Promise<Video[]> {
		return this.getListByIds('videos', await this.getPlaylistVideosIdsByPlaylistId(playlistId));
	}

	public getChannelsByIds(channelsIds: string): Promise<Channel[]>;
	public getChannelsByIds(channelsIds: string[]): Promise<Channel[]>;

	public getChannelsByIds(channelsIds: string | string[]): Promise<Channel[]> {
		return this.getListByIds('channels', channelsIds);
	}

	public getVideosByIds(videosIds: string): Promise<Video[]>;
	public getVideosByIds(videosIds: string[]): Promise<Video[]>;

	public getVideosByIds(videosIds: string | string[]): Promise<Video[]> {
		return this.getListByIds('videos', videosIds);
	}

	public getRelatedToVideoId(videoId: string): Promise<Video[]> {
		return new Promise(async (resolve, reject) => {
			let res: YoutubeResponse;

			try {
				res = await this.request('search', {
					part: 'snippet',
					maxResults: 25,
					type: 'video',
					relatedToVideoId: videoId,
				});
			} catch (e) {
				reject(e);
				return;
			}

			let items = res.items as SearchItem[];

			let ids = items.map((item: SearchItem) => item.id.videoId);

			resolve(await this.getVideosByIds(ids));
		})
	}

	public search(q: string): Promise<Video[]> {
		return new Promise(async (resolve, reject) => {
			let res: YoutubeResponse;

			try {
				res = await this.request('search', {
					part: 'snippet',
					maxResults: 25,
					q,
				});
			} catch (e) {
				reject(e);
				return;
			}
			let items = res.items as SearchItem[];

			let ids = items.map((item: SearchItem) => item.id.videoId);

			resolve(await this.getVideosByIds(ids));
		});
	}


	private getListByIds(method: 'videos', ids: string | string []): Promise<Video[]>;
	private getListByIds(method: 'channels', ids: string | string []): Promise<Channel[]>;
	private getListByIds(method: 'playlists', ids: string | string []): Promise<Playlist[]>;

	private getListByIds(method: Methods, ids: string | string []): Promise<Video[] | Channel[] | Playlist[]> {
		return new Promise(async (resolve, reject) => {
			let _ids: string[][] = typeof ids === 'string' ? this.splitArray(ids) : this.splitArray(ids);
			let list: Video[] = [];

			for(let reqIds of _ids) {
				let res;

				try {
					res = await this.request(method, {
						part: 'id,snippet,contentDetails',
						maxResults: 50,
						id: reqIds.join(','),
					})
				} catch (e) {
					reject(e);
					return;
				}

				let items = res.items as Video[];

				list.push(...items);
			}

			resolve(list);
		})
	}

	private request(method: Methods, options: RequestOptions): Promise<YoutubeResponse> {
		return new Promise((resolve, reject) => {
			get({
				hostname: 'www.googleapis.com',
        		path: `/youtube/v3/${method}?${stringify(options)}&key=${this.apiKey}`
			}, res => {
				let body = '';

				res.on('data', chank => body += chank)
				.on('close', () => {
					const r = JSON.parse(body);
					if(r.error) {
						reject(r);
						return;
					}
					resolve(r);
				})
				.on('error', reject);
			}).on('error', reject)
		})
	}

	private splitArray(array: string[], size?: number): Array<Array<string>>;
	private splitArray(str: string, size?: number, separator?: string): Array<Array<string>>

	private splitArray(smth: string | string[], size: number = 50, separator: string = ','): Array<Array<string>> {
		let arr;

		if(typeof smth === 'string') arr = smth.split(separator);
		else arr = smth;

		let subarray: string[][] = new Array(Math.ceil(arr.length/size));

		for (let i = 0; i < Math.ceil(arr.length/size); i++)
			subarray[i] = arr.slice((i*size), (i*size) + size);

		return subarray;
	}
}
