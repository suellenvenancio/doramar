import { Avatar } from "@/components/avatar"
import { CircleIcon } from "@/components/icons/circle"
import { Layout } from "@/components/layout"
import { CreateCommunityModal } from "@/components/modal/createCommunityModal"
import { useCommunities } from "@/hooks/use-communities"
import { mergeCn } from "@/utils/cn"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function CommunitiesPage() {
  const [showCreateCommunityModal, setShowCreateCommunityModal] =
    useState<boolean>(false)
  const navigate = useNavigate()

  const { communities, createCommunity, isLoading } = useCommunities()

  return (
    <Layout page="Communities">
      <div
        className={mergeCn("flex flex-col items-center justify-center w-full", {
          "md:items-start": communities.length > 0,
        })}
      >
        <div
          className={mergeCn("mb-6 flex items-center justify-center w-full", {
            "md:justify-start": communities.length > 0,
          })}
        >
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
            onClick={() => setShowCreateCommunityModal(true)}
          >
            <span className="text-lg leading-none">+</span>
            Nova comunidade
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center w-full py-24">
            <CircleIcon className="h-12 w-12 text-pink-600" /> 
          </div>
        )}

        {communities?.length > 0 ? (
          <div className="flex flex-col md:flex-row items-center justify-center md:gap-6 md:flex-wrap md:justify-start">
            {communities.map((community) => (
              <CommunityCard
                key={community.id}
                name={community.name}
                totalMembers={community.members.length}
                onClickInTheCommunity={() =>
                  navigate(`/communities/${community.id}`)
                }
                avatar={community.avatarUrl}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center m-2">
            <p className="text-lg font-semibold text-[#6E5A6B]">
              Não existe nenhuma comunidade disponível!
            </p>
            <p className="mt-2 text-sm text-[#8F7A8C]">
              Crie agora sua comunidade para compartilhar sobre seus doramas com
              seus amigos ✨
            </p>
          </div>
        )}
        {showCreateCommunityModal && (
          <CreateCommunityModal
            onClose={() => {
              setShowCreateCommunityModal(false)
            }}
            onCreate={createCommunity}
          />
        )}
      </div>
    </Layout>
  )
}

interface CommunityCardProps {
  name: string
  totalMembers: number
  onClickInTheCommunity: () => void
  avatar?: string
}
export function CommunityCard({
  avatar,
  name,
  totalMembers,
  onClickInTheCommunity,
}: CommunityCardProps) {
  return (
    <div
      className="flex flex-col justify-center items-center mb-8 bg-[#FDFFFE] rounded-xl shadow-lg overflow-visible p-6 gap-6 cursor-pointer w-80"
      onClick={onClickInTheCommunity}
    >
      <Avatar
        imageUrl={avatar}
        title={name}
        className="rounded-xl w-28 h-28"
      />

      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>

      <span>
        <strong className="text-gray-800">{totalMembers}</strong> membros
      </span>
    </div>
  )
}
