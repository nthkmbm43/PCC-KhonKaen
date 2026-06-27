import Image from 'next/image';

type MediaProps = {
  media: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
};

export const MediaBlock = ({ media }: MediaProps) => {
  if (!media?.url) return null;
  return (
    <div className="w-full my-8 flex justify-center">
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg border border-gray-100">
        <img
          src={media.url}
          alt={media.alt || 'Media'}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};
