import { IconButton } from '@/components/button/iconButton';
import { ThreeDots } from '@/components/icons/threeDots';
import { Layout } from '@/components/layout';
import { CreateListModal } from '@/components/modal/createListModal';
import { PopUpMenu } from '@/components/popup';
import { useList } from '@/hooks/use-list';
import { mergeCn } from '@/utils/cn';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ListsPage() {
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const { lists, createList } = useList();
  const navigate = useNavigate();

  const onCreateList = async (name: string) => {
    await createList(name);
  };

  return (
    <Layout className='w-full h-full' page='Lists'>
      <div
        className={mergeCn(
          'flex flex-col md:justify-start items-center md:items-start w-full',
          {
            'md:items-center': lists.length === 0,
          }
        )}
      >
        <div className='mb-6 flex items-center justify-center'>
          <button
            className='
              flex items-center gap-2
              rounded-full
              bg-[#F2A7C6]
              px-5 py-2
              text-sm font-semibold text-white
              shadow
              hover:bg-[#EC8FB4]
              transition
              mt-4
              ml-4
              md:mr-0
            '
            onClick={() => setShowCreateListModal(true)}
          >
            <span className='text-lg leading-none'>+</span>
            Nova lista
          </button>
        </div>

        {lists.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <p className='text-lg font-semibold text-[#6E5A6B]'>
              Você ainda não criou nenhuma lista
            </p>
            <p className='mt-2 text-sm text-[#8F7A8C]'>
              Crie sua primeira lista para organizar seus doramas ✨
            </p>
          </div>
        ) : (
          <div className='flex flex-col md:flex-row md:gap-5 items-center justify-cew-full'>
            {lists.map((list) => (
              <ListCard
                key={list.id}
                listId={list.id ?? ''}
                name={list.name ?? ''}
                total={list.tvShows.length}
                onClickInTheList={() => {
                  navigate(`/list/${list.id}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <CreateListModal
        isOpen={showCreateListModal}
        onClose={() => setShowCreateListModal(false)}
        onCreate={onCreateList}
      />
    </Layout>
  );
}

interface ListCardProps {
  name: string;
  total: number;
  listId: string;
  onClickInTheList: () => void;
}

export function ListCard({
  name,
  total,
  listId,
  onClickInTheList,
}: ListCardProps) {
  const [showPopUpMenu, setShowPopUpMenu] = useState<boolean>();
  const { deleteList } = useList();

  const onRemoveList = async (listId: string) => {
    await deleteList(listId);
  };

  return (
    <div className='mb-8 bg-[#FDFFFE] rounded-xl shadow-lg overflow-visible p-6 w-90 max-w-2xl mx-auto gap-6 cursor-pointer'>
      <div className='flex flex-row justify-between'>
        <div
          className='mt-1 flex flex-col items-start gap-2 text-sm text-gray-600'
          onClick={onClickInTheList}
        >
          <h3 className='text-lg font-semibold text-gray-800'>{name}</h3>

          <span>
            <strong className='text-gray-800'>{total}</strong> doramas
          </span>
        </div>
        <div className='relative p-2'>
          <IconButton
            icon={<ThreeDots className='cursor-pointer' />}
            onClick={() => setShowPopUpMenu(!showPopUpMenu)}
          />
          {showPopUpMenu && (
            <PopUpMenu
              type=''
              title=''
              items={[{ id: listId, label: 'excluir' }]}
              onClick={() => onRemoveList(listId)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
