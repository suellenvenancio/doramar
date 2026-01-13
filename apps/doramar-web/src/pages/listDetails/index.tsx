import { IconButton } from '@/components/button/iconButton';
import { MenuIcon } from '@/components/icons/menu';
import { TrashIcon } from '@/components/icons/trash';
import { Layout } from '@/components/layout';
import { useList } from '@/hooks/use-list';
import type { TvShow } from '@/types';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

export function ListsDetailsPage() {
  const [items, setItems] = useState<TvShow[]>([]);

  const { lists, removeTvShowFromTheList, updateListOrder } = useList();
  const { listId } = useParams();

  const listTvShows = lists.find((list) => list.id === listId)?.tvShows;

  useEffect(() => {
    if (listTvShows) {
      setItems(listTvShows);
    }
  }, [listTvShows]);

  const removeTvShow = async (tvShow: TvShow, listId: string) => {
    await removeTvShowFromTheList({ listId, tvShow });
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(items, oldIndex, newIndex);

    setItems(newOrder);

    updateListOrder({
      listId: listId!,
      tvShows: newOrder,
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,  
        tolerance: 5, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
 

  return (
    <Layout page="Lists">
      {listTvShows && listTvShows?.length > 0 ? (
        <div className="w-full">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items
                ? items?.map((tvShow) => (
                    <ListItem
                      key={tvShow.id}
                      tvShow={tvShow}
                      onRemoveTvShow={removeTvShow}
                      listId={listId!}
                    />
                  ))
                : null}
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center m-2">
          <p className="text-lg font-semibold text-[#6E5A6B]">
            Não existe nenhum dorama na sua lista!
          </p>
          <p className="mt-2 text-sm text-[#8F7A8C]">
            Vá até a página inicial e adicione✨
          </p>
        </div>
      )}
    </Layout>
  )
}

interface ListItemProps {
  tvShow: TvShow;
  onRemoveTvShow: (tvShow: TvShow, listId: string) => void;
  listId: string;
}
function ListItem({ tvShow, onRemoveTvShow, listId }: ListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tvShow.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.6 : 1,
  }
  return (
    <div
      className="max-w-dvw rounded-2xl bg-[#F9E1F1] px-6 py-4 shadow-[0_8px_24px_rgba(219,170,201,0.35)] m-4"
      style={style}
      ref={setNodeRef}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="cursor-grab select-none text-lg text-[#9B8AA0]"
            {...attributes}
            {...listeners}
            style={{ touchAction: "none" }}
          >
            <MenuIcon />
          </span>

          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-[#4B2E3F]">
              {tvShow.title}
            </p>
          </div>
        </div>
        <IconButton
          icon={<TrashIcon className="text-[#C2185B]" />}
          onClick={() => onRemoveTvShow(tvShow, listId)}
        />
      </div>
    </div>
  )
}
