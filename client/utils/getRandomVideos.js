export const getRandomVideos = (videos, excludeId, count=4) => {
    //exclude current video 
    const filtered = videos.filter(video => video._id !== excludeId );

    //shuffled array of videos
    const shuffled = filtered.sort(()=> 0.5 - Math.random());

    //return first count no. of videos
    return shuffled.slice(0, count);
}