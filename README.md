## Install

Install via npm:

```
npm i node-youtube-search
```

## Example
### CommonJS
```js
const { Youtube, } = require('node-youtube-search');
```
### Typescript
```ts
import { Youtube, } from 'node-youtube-search'
```
### Common
```js
const youtubeApi = new Youtube('google api key');

youtubeApi.getPlaylistVideosIdsByPlaylistId('playlistId')	// Promise<string[]>;
		
youtubeApi.getPlaylistsByIds('playlistsId,playlistsId')		// Promise<Playlist[]>
youtubeApi.getPlaylistsByIds(['playlistsId', 'playlistsId'])	// Promise<Playlist[]>

youtubeApi.getPlaylistVideosByPlaylistId('playlistId')		// Promise<Video[]>

youtubeApi.getChannelsByIds('channelsId,channelsId')		// Promise<Channel[]>
youtubeApi.getChannelsByIds(['channelsId', 'channelsId'])	// Promise<Channel[]>

youtubeApi.getVideosByIds('videosId,videosId')			// Promise<Video[]>
youtubeApi.getVideosByIds(['videosId', 'videosId'])		// Promise<Video[]>

youtubeApi.getRelatedToVideoId('videosId')			// Promise<Video[]>

youtubeApi.search('search')					// Promise<Video[]>
```
