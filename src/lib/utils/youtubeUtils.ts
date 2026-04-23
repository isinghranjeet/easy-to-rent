/**
 * Convert any YouTube or Vimeo URL to an embed-friendly URL.
 */
export const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';

  let videoId = '';

  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('/shorts/')[1]?.split('?')[0];
  } else if (url.includes('m.youtube.com/shorts/')) {
    videoId = url.split('/shorts/')[1]?.split('?')[0];
  } else if (url.includes('youtu.be/shorts/')) {
    videoId = url.split('/shorts/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    return url;
  } else if (url.includes('vimeo.com/')) {
    const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
};

