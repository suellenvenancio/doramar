import type { TvShow } from '@/types';
import { mergeCn } from '@/utils/cn';

type PopUpType = 'Status' | 'Gêneros' | 'Listas' | '';

interface PopUpProps {
  type: PopUpType;
  items: any[];
  onClick: (data: any) => void;
  title: string;
  tvShow?: TvShow;
  className?: string;
  hasCheckBoxes?: boolean;
  selectedGenres?: string[];
}

export function PopUpMenu({
  items,
  onClick,
  title,
  tvShow,
  className,
  type,
  hasCheckBoxes = false,
  selectedGenres,
}: PopUpProps) {
  return (
    <div
      className={mergeCn(
        `absolute bottom-full md:left-1/2 transform md:-translate-x-1/2 mb-2 w-32 bg-gray-50 text-gray-700 text-xs border border-t border-gray-100 z-50 py-2`,
        className,
      )}
    >
      <p className="font-semibold text-gray-400 pl-2 bg-gray-50 w-full">
        {title}
      </p>
      {items.map((item) => (
        <div className="flex flex-row bg-gray-50 pl-2" key={item.id}>
          {hasCheckBoxes && (
            <input
              checked={selectedGenres?.some((genre) => genre === item.id)}
              type="checkbox"
              className="accent-pink-500 "
              onChange={() => onClick(item.id)}
            />
          )}
          <p
            key={item.id}
            className={mergeCn(
              "block w-full text-left px-3 py-2 bg-gray-50 cursor-pointer",
              {
                "md:text-lg": type === "",
              },
            )}
            onClick={() => {
              switch (type) {
                case "Status":
                  onClick({ tvShow, watchedStatusId: item.id })
                  break

                case "Listas":
                  onClick({ tvShow, list: item })
                  break
                case "Gêneros":
                  onClick(item.id)
                  break
                case "":
                  onClick(item.id)
              }
            }}
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}
