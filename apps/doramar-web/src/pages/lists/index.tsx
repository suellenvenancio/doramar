import { IconButton } from '@/components/button/iconButton'
import { CircleIcon } from '@/components/icons/circle'
import { TrashIcon } from '@/components/icons/trash'
import { Layout } from '@/components/layout'
import { ConfirmationModal } from '@/components/modal/confirmationModal'
import { CreateListModal } from '@/components/modal/createListModal'
import { useList } from '@/hooks/use-list'
import { mergeCn } from '@/utils/cn'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function ListsPage() {
  const [showCreateListModal, setShowCreateListModal] = useState(false)
  const { lists, createList, isLoading } = useList()
  const navigate = useNavigate()

  const onCreateList = async (name: string) => {
    await createList(name)
  }

  return (
    <Layout className="w-full h-full" page="Lists">
      <div
        className={mergeCn(
          "flex flex-col md:justify-start items-center md:items-start w-full",
          {
            "md:items-center": lists.length === 0,
          },
        )}
      >
        <div className="mb-6 flex items-center justify-center">
          <button
            className="
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
            "
            onClick={() => setShowCreateListModal(true)}
          >
            <span className="text-lg leading-none">+</span>
            Nova lista
          </button>
        </div>
        {isLoading && (
          <div className="flex flex-col items-center justify-center w-full py-24">
            <CircleIcon className="h-12 w-12 text-pink-600" /> 
          </div>
        )}

        {lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-semibold text-[#6E5A6B]">
              Você ainda não criou nenhuma lista
            </p>
            <p className="mt-2 text-sm text-[#8F7A8C]">
              Crie sua primeira lista para organizar seus doramas ✨
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-6">
            {lists.map((list) => (
              <ListCard
                key={list.id}
                listId={list.id ?? ""}
                name={list.name ?? ""}
                total={list.tvShows.length}
                onClickInTheList={() => {
                  navigate(`/list/${list.id}`)
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
  )
}

interface ListCardProps {
  name: string
  total: number
  listId: string
  onClickInTheList: () => void
}

export function ListCard({
  name,
  total,
  listId,
  onClickInTheList,
}: ListCardProps) {
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
  const { deleteList } = useList()

  const onRemoveList = async (listId: string) => {
    await deleteList(listId)
  }

  return (
    <div className="bg-[#FDFFFE] rounded-xl shadow-lg p-6 w-full max-w-[95vw] md:max-w-md mx-auto cursor-pointer border border-gray-100">
      <div className="flex flex-row justify-between">
        <div
          className="mt-1 flex flex-col items-start gap-2 text-sm text-gray-600"
          onClick={onClickInTheList}
        >
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>

          <span>
            <strong className="text-gray-800">{total}</strong> doramas
          </span>
        </div>
        <div className="relative p-2">
          <IconButton
            icon={<TrashIcon className="cursor-pointer text-pink-600" />}
            onClick={() => setShowConfirmationModal(!showConfirmationModal)}
          />
          <ConfirmationModal
            id={listId}
            isOpen={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onClick={async () => {
              await onRemoveList(listId)
            }}
            question={"Tem certeza que deseja deletar esta lista?"}
          />
        </div>
      </div>
    </div>
  )
}
