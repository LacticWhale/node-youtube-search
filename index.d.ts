declare module "node-youtube-search" {

	export class Youtube {
		constructor(apiKey: string);

		private readonly apiKey: string;
		private request(method: Methods, options: RequestOptions): Promise<YoutubeResponse>;
		private splitArray(array: string, size: number, separator: string): Array<Array<string>>;
		
		public getPlaylistVideosIdsByPlaylistId(playlistId: string): Promise<string[]>;
		
		public getPlaylistsByIds(playlistsIds: string): Promise<Playlist[]>;
		public getPlaylistsByIds(playlistsIds: string[]): Promise<Playlist[]>;

		public getPlaylistVideosByPlaylistId(playlistsId: string): Promise<Video[]>;

		public getChannelsByIds(channelsIds: string): Promise<Channel[]>;
		public getChannelsByIds(channelsIds: string[]): Promise<Channel[]>;

		public getVideosByIds(videosIds: string): Promise<Video[]>;
		public getVideosByIds(videosIds: string[]): Promise<Video[]>;

		public getRelatedToVideoId(videosId: string): Promise<Video[]>;

		public search(q: string): Promise<Video[]>;
	}
}

type ThumbnailsResolutionAll = 'maxres' | 'standart' | 'high' | 'medium' | 'default';
type ThumbnailsResolutionChannel = 'high' | 'medium' | 'default'
type ResponseKinds = 'youtube#videoListResponse' | 'youtube#searchListResponse' | 'youtube#playlistListResponse' | 'youtube#playlistItemListResponse' | 'youtube#channelListResponse';
export type Methods = 'search' | 'videos' | 'channels' | 'playlists' | 'playlistItems';

export type RequestOptions = {
	part: string,
	q?: string,
	maxResults: number,
	relatedToVideoId?: string,
	type?: string,
	id?: string,
	pageToken?: string,
	playlistId?: string,
	videoId?: string,
	channelId?: string
}

export interface YoutubeResponse {
	kind: ResponseKinds,
	etag: string,
	nextPageToken: string,
	prevPageToken: string,
	pageInfo: {
		totalResults: number,
		resultsPerPage: number
	},
	items: Video[] | Playlist[] | PlaylistItem[] | SearchItem[] | Channel[]
}

export interface Video {
	kind: 'youtube#video',
	id: string,
	snippet: {
		publishedAt: string,
		channelId: string,
		title: string,
		description: string,
		channelTitle: string,
		tags: string[],
		categoryId: string,
		liveBroadcastContent: string,
		thumbnails: {
			[key in ThumbnailsResolutionAll]: {
				url: string,
			}
		},
		localized: {
			title: string,
			description: string,
		},
		defaultAudioLanguage: string,
	},
	contentDetails: {
		duration: string,
		dimension: string,
		definition: string,
		caption: string,
		licensedContent: boolean,
		projection: string,
	},
}

export interface Playlist {
	kind: 'youtube#playlist',
	id: string,
	snippet: {
		publishedAt: string,
		channelId: string,
		title: string,
		description: string,
		thumbnails: {
			[key in ThumbnailsResolutionAll]: {
				url: string,
			}
		},
		channelTitle: string,
		localized: {
			title: string,
			description: string,
		},
	},
}

export interface PlaylistItem {
	kind: 'youtube#playlistItem',
	contentDetails: {
		videoId: string,
	},
}

export interface SearchItem {
	kind: 'youtube#searchResult',
	id: {
		videoId: string,
	},
	snippet: {
		publishedAt: string,
		channelId: string,
		title: string,
		description: string,
		thumbnails: {
			[key in ThumbnailsResolutionAll]: {
				url: string,
			}
		},
		channelTitle: string,
		liveBroadcastContent: string,
	},
}

export interface Channel {
	kind: 'youtube#channel',
	id: string,
	snippet: {
		title: string,
		description: string,
		customUrl?: string,
		publishedAt: string,
		thumbnails: {
			[key in ThumbnailsResolutionChannel]: {
				url: string,
			}
		},
		locolizad: {
			title: string,
			description: string,
		},
		country: string,
	},
}
