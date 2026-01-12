import React from 'react';
import { X } from 'lucide-react';

interface VideoPlayerModalProps {
  videoUrl: string | null;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoUrl, onClose }) => {
  if (!videoUrl) return null;

  const isYoutubeLink = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  const getVideoSrc = (filenameOrUrl: string) => {
    if (isYoutubeLink(filenameOrUrl)) {
      return getYoutubeEmbedUrl(filenameOrUrl);
    }
    return `http://localhost:3000/${filenameOrUrl.replace(/^\/+/, '')}`; 
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header Modal - Nút đóng */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-end z-10 bg-gradient-to-b from-black/60 to-transparent">
            <button 
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition"
            >
                <X size={28} />
            </button>
        </div>

        {/* Video Content */}
        <div className="aspect-video w-full flex items-center justify-center bg-gray-900">
            {isYoutubeLink(videoUrl) ? (
                <iframe 
                    src={getVideoSrc(videoUrl)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Youtube Video"
                />
            ) : (
                <video 
                    src={getVideoSrc(videoUrl)} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                />
            )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;