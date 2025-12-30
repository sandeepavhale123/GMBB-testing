export function transformDescription(description: string): string {
  if (!description) return "";

  // 1. Remove <a> tags that are just raw video links
  let cleaned = description.replace(
    /<a[^>]+href="(https?:\/\/(?:www\.)?(loom\.com|youtube\.com|youtu\.be|vimeo\.com)[^"]+)"[^>]*>.*?<\/a>/gi,
    "" // strip completely
  );

  // 2. Convert video links into iframes
  cleaned = cleaned.replace(
    /(https?:\/\/(?:www\.)?loom\.com\/share\/([a-zA-Z0-9]+))/g,
    `<div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;margin:12px 0;">
       <iframe src="https://www.loom.com/embed/$2"
         frameborder="0"
         allow="autoplay; fullscreen"
         style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;">
       </iframe>
     </div>`
  );

  cleaned = cleaned.replace(
    /(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))/g,
    `<div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;margin:12px 0;">
       <iframe src="https://www.youtube.com/embed/$2"
         frameborder="0"
         allow="autoplay; fullscreen"
         style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;">
       </iframe>
     </div>`
  );

  cleaned = cleaned.replace(
    /(https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+))/g,
    `<div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;margin:12px 0;">
       <iframe src="https://www.youtube.com/embed/$2"
         frameborder="0"
         allow="autoplay; fullscreen"
         style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;">
       </iframe>
     </div>`
  );

  cleaned = cleaned.replace(
    /(https?:\/\/(?:www\.)?vimeo\.com\/([0-9]+))/g,
    `<div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;margin:12px 0;">
       <iframe src="https://player.vimeo.com/video/$2"
         frameborder="0"
         allow="autoplay; fullscreen"
         style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;">
       </iframe>
     </div>`
  );

  return cleaned;
}
