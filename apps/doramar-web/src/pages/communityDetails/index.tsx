import { Avatar } from "@/components/avatar"
import { CustomButton } from "@/components/button"
import { CommunityIcon } from "@/components/icons/community"
import { Layout } from "@/components/layout"
import { Members } from "@/components/membersComponents"
import { AddMemberModal } from "@/components/modal/addMemberModal"
import { MemberModal } from "@/components/modal/membersModal"
import { PostComponent } from "@/components/post"
import { SessionTitle } from "@/components/sessonTitle"
import { TextButton } from "@/components/textButton"
import { toast } from "@/components/toast"
import { useCommunities } from "@/hooks/use-communities"
import { useUser } from "@/hooks/use-user"
import {  CommunityRole, CommunityVisibility, type Post, type ReactionTargetType, type ReactionType } from "@/types"
 
import { useCallback, useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import z, { string } from "zod"

const createPostSchema = z.object({
  content: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
})

type FormData = z.infer<typeof createPostSchema>

export function CommunityDetails() {
  const {
    communities,
    createPost,
    getCommunityPosts,
    getPostsComments,
    createComment,
    createReaction,
    getReactionsByPostId,
    addMemberOnTheCommunity,
  } = useCommunities()
  const { communityId } = useParams()
  const { user, findUserByEmail } = useUser()
  const userId = user?.id

  const [posts, setPosts] = useState<Post[]>([])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!communityId) return
        const posts = await getCommunityPosts(communityId)
        setPosts(posts ?? [])
      } catch (error) {
        console.error("Failed to fetch communities:", error)
      }
    }
    fetchPosts()
  }, [communityId])
  

  const { reset, control, handleSubmit } = useForm<FormData>({})

  const community = communities?.find((c) => c.id === communityId)
  const onCreatePost = async ({ content }: FormData) => {
     if (!communityId) return

    const newPost = await createPost({ communityId, content })

    if (!newPost) return 
    
    setPosts(prev => [...prev, newPost])
    reset()
  }

  const fetchPostComments = async (postId: string) => {
    try {
      return await getPostsComments(postId) 
      
    } catch (error) {
      console.error("Failed to fetch communities:", error)
    }
  }
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = () => {
    const text = textAreaRef.current
    if (text) {
      text.style.height = "auto"
      text.style.height = `${text.scrollHeight}px`
    }
  }

  const onCreateReaction = async ({
    postId,
    targetType,
    type,
  }: {
    postId: string
    targetType: ReactionTargetType
    type: ReactionType
    }) => {
    if (!communityId) return 
    
   return await createReaction({
      postId,
      communityId,
      targetType,
      type 
    })
  }

  const fetchPostReactions = async (postId: string) => {
    try {
      return await getReactionsByPostId(postId) 
      
    } catch (error) {
      console.error("Failed to fetch communities:", error)
    }
  }
  
  const userIsCommunityMember = community?.members.some(m => m.userId === user?.id)
  const  userCanAddCommunityMember = community?.owner.id === user?.id || community?.members.some(m => m.userId === user?.id && m.role === CommunityRole.MODERATOR)
  
  const communityVisibility = community?.visibility
  const commuityIsPrivateOrSecret = communityVisibility === CommunityVisibility.PRIVATE || communityVisibility === CommunityVisibility.SECRET

  const onSearchMember = useCallback(
   async (email: string) => {
      return await findUserByEmail(email) 
    },
    [],
  )
  
  const onAddMember = useCallback(async (userId: string) => {
    if (!communityId) return 

    await addMemberOnTheCommunity(communityId, userId)
    setShowAddMemberModal(false) 
  }, [])
 
  return (
    <Layout page="Communities">
      <div className="w-full p-4 grid grid-cols-3 gap-6 items-start">
        <div className="col-span-2 flex flex-col gap-6">
          <div className="max-w-dvw min-w-88 w-auto bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100 p-4">
            <div className="flex justify-between p-2">
              <div>
                <p className="text-xl mb-2">{community?.name}</p>
                <div className="flex flex-row gap-2 mb-2">
                  <CommunityIcon />
                  <p>{community?.members.length} membros</p>
                </div>
              </div>

              {userCanAddCommunityMember && commuityIsPrivateOrSecret && (
                <CustomButton
                  name={"add membro"}
                  loading={false}
                  className={
                    "w-24 rounded-xl border border-pink-600 px-4 py-2 text-sm font-medium text-white h-12"
                  }
                  onClick={() => setShowAddMemberModal(true)}
                />
              )}
            </div>

            <div className="flex flex-row justify-evenly md:justify-start">
              <CustomButton
                onClick={() => setModalIsOpen(true)}
                loading={false}
                name="ver participantes"
                className=" w-40 rounded-xl border bg-white border-pink-600 px-4 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-50 md:hidden"
              />

              {!userIsCommunityMember && communityVisibility === CommunityVisibility.PUBLIC && (
                <CustomButton
                  name={"+ entrar"}
                  loading={false}
                  className={
                    "w-24 rounded-xl border border-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-50"
                  }
                  onClick={() =>
                    communityId
                      ? addMemberOnTheCommunity(communityId, user?.id ?? "")
                      : toast("Erro ao entrar na comunidade!")
                  }
                />
              )}
            </div>
          </div>

          {userIsCommunityMember && (
            <form
              className="flex flex-row gap-4 items-start w-auto md:w-auto bg-white p-4 rounded-2xl shadow-sm min-w-88"
              onSubmit={handleSubmit(onCreatePost)}
            >
              <Avatar
                imageUrl={user?.profilePicture}
                title={user?.name ?? ""}
                className="rounded-full bg-violet-300 w-16 h-16 flex-shrink-0"
              />
              <div className="flex-1 flex flex-col items-end gap-2 w-full">
                <Controller
                  render={({ field }) => (
                    <textarea
                      {...field}
                      ref={(e) => {
                        field.ref(e)
                        textAreaRef.current = e
                      }}
                      onInput={() => {
                        handleInput()
                        field.onChange
                      }}
                      rows={1}
                      name="content"
                      className="w-full resize-none overflow-hidden border border-pink-500 rounded-lg p-3 focus:ring-2 outline-none text-base min-h-[45px]"
                    />
                  )}
                  name="content"
                  control={control}
                />

                <CustomButton
                  name="postar"
                  loading={false}
                  className="w-24 h-10"
                />
              </div>
            </form>
          )}
          {userIsCommunityMember || communityVisibility === CommunityVisibility.PUBLIC && (
            <div className="flex flex-col justify-center gap-4 w-full">
              {posts?.map((post) => (
                <PostComponent
                  key={post.id}
                  userId={userId ?? ""}
                  postId={post.id}
                  content={post.content}
                  authorProfilePicture={post.author?.profilePicture}
                  authorName={post.author?.name}
                  authorId={post.author?.id}
                  postedAt={post.createdAt}
                  fetchPostComments={fetchPostComments}
                  onAddComment={createComment}
                  communityId={communityId ?? ""}
                  onCreateReaction={onCreateReaction}
                  fetchReactions={fetchPostReactions}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="hidden col-span-1 md:flex md:flex-col gap-4 sticky top-6 ">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <SessionTitle
              title="Membros"
              icon={<CommunityIcon className="text-pink-600" />}
            />
            <div className="grid grid-cols-4 gap-2">
              {community?.members?.slice(0, 8).map((member) => (
                <Members
                  key={member.id}
                  id={member.user.id}
                  name={member.user.name}
                  profilePicture={member.user.profilePicture}
                />
              ))}
            </div>

            {community?.members && community.members.length > 8 && (
              <TextButton
                name={`Ver todos (${community.members.length})`}
                className="no-underline"
                onClick={() => setModalIsOpen(true)}
              />
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <SessionTitle title="Descrição" />
            <p className="mt-2 text-sm text-gray-600">
              {community?.description || "Sem descrição disponível."}
            </p>
          </div>
        </aside>
      </div>
      <MemberModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        members={community?.members ?? []}
      />
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAddMember={onAddMember}
        onSearchMember={onSearchMember}
      />
    </Layout>
  )
}
