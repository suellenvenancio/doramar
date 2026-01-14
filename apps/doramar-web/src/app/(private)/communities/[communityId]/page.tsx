"use client"
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
 
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useRouter, useParams } from "next/navigation"
import z from "zod"  
import { IconButton } from "@/components/button/iconButton" 
import { TrashIcon } from "@/components/icons/trash"
import { ConfirmationModal } from "@/components/modal/confirmationModal"
import Image from "next/image"

const createPostSchema = z.object({
  content: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
})

type FormData = z.infer<typeof createPostSchema>

export default function CommunityDetails() {
  const params = useParams()
  const communityId = params.communityId as string
  const {
    communities,
    createPost,
    getCommunityPosts,
    getPostsComments,
    createComment,
    createReaction,
    getReactionsByPostId,
    addMemberOnTheCommunity,
    uploadCommunityProfilePicture,
    uploadCommunityCoverPicture,
    deleteCommunity,
    deletePost,
    deleteComment,
  } = useCommunities()
  const { user, findUserByEmail } = useUser()
  const userId = user?.id

  const fileAvatarRef = useRef<HTMLInputElement>(null)
  const fileCoverRef = useRef<HTMLInputElement>(null) 

  const [posts, setPosts] = useState<Post[]>([])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [showCommunityModal, setShowCommunityModal] = useState(false)
  
  const community = communities?.find((c) => c.id === communityId)

  const { reset, control, handleSubmit } = useForm<FormData>({})
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!communityId) return
        const fetchedPosts = await getCommunityPosts(communityId)
        if (fetchedPosts) {
            const sortedPosts = [...fetchedPosts].sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          })
          setPosts(sortedPosts)
        }
      } catch (error) {
        console.error("Failed to fetch communities:", error)
      }
    }
    fetchPosts()
  }, [communityId]) 

  const onCreatePost = async ({ content }: FormData) => {
    if (!communityId) {
      toast("Erro ao criar o post!")
      return
    }

    const newPost = await createPost({ communityId, content })

    if (!newPost) return 
    
    setPosts((prev) => [newPost, ...prev])
    reset({content: ""})
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

  const userIsOwnerOrModerator = community?.owner.id === user?.id || community?.members.some(m => m.userId === user?.id && (m.role === CommunityRole.ADMIN || m.role === CommunityRole.MODERATOR))
  
  const communityVisibility = community?.visibility

  const commuityIsPrivateOrSecret = communityVisibility === CommunityVisibility.PRIVATE || communityVisibility === CommunityVisibility.SECRET
 
  const onSearchMember = useCallback(
  async (email: string) => {
      return await findUserByEmail(email) 
    },
    [],
  )
  
  const onAddMember = useCallback(async (userId: string) => {
    if (!communityId) return toast("Erro ao adicionar membro!")

    await addMemberOnTheCommunity(communityId, userId)
    setShowAddMemberModal(false) 
  }, []) 

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
 
    const formData = new FormData()
    formData.append("file", file)
 
    try {
      if(!communityId) return toast("Erro ao fazer upload da imagem!")
      setIsUploadingAvatar(true)

      await uploadCommunityProfilePicture({formData, communityId:communityId})
    } catch (error) {
      console.error(error)
      toast("Erro ao fazer upload da imagem")
    } finally {
      setIsUploadingAvatar(false)

      if (fileAvatarRef.current) fileAvatarRef.current.value = ""
    }
  }
  
    const handleCoverFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append("file", file)
      try {
      if (!communityId) return toast("Erro ao fazer upload da imagem!")

        setIsUploadingCover(true)

        await uploadCommunityCoverPicture({
          formData,
          communityId: communityId,
        })
      } catch (error) {
        console.error(error)
        toast("Erro ao fazer upload da imagem")
      } finally {
        setIsUploadingCover(false)

        if (fileCoverRef.current) fileCoverRef.current.value = ""
      }
    }
  
  const handleDeleteCommunity = useCallback(async (communityId: string) => {
    await deleteCommunity(communityId).then(() => {
      router.push("/communities")
    })
  }, [])
  
  const handleDeletePost = useCallback(async (postId: string) => {
    if (!communityId) {
      toast("Erro ao deletar o post!")
      return
    }
    
    await deletePost(postId, communityId)
    setPosts(prev => prev.filter(post => post.id !== postId))
    }, [ communityId])
  
  const handleDeleteComment = useCallback(async (commentId: string, postId: string) => {
    if (!communityId) {
      toast("Erro ao deletar o comentário!")
      return
    }
    
    await deleteComment({ commentId, communityId, postId })
    }, [ communityId])
  return (
    <Layout page="Communities" className="min-w-100">
      <div className="w-full p-4 grid grid-cols-3 gap-6 items-start">
        <div className="col-span-3 md:col-span-2 flex flex-col gap-6">
          <div className="relative mt-4 w-full">
            <div
              onClick={() =>
                userIsOwnerOrModerator && fileCoverRef.current?.click()
              }
              className="relative h-48 w-full cursor-pointer group"
            >
              {community?.coverUrl ? (
                <Image
                  src={community.coverUrl}
                  alt="cover"
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-pink-600 rounded-xl flex items-center justify-center" />
              )}
              {isUploadingCover && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl text-white">
                  Carregando...
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileCoverRef}
              className="hidden"
              accept="image/*"
              onChange={handleCoverFileChange}
            />

            <div className="relative mt-[-40px] bg-white rounded-xl shadow-md border border-gray-100 p-6 w-full">
              <div className="flex flex-row items-center gap-2">
                <div className="relative -mt-20">
                  <div
                    className={`cursor-pointer hover:opacity-90 transition${isUploadingAvatar ? "animate-pulse" : ""}`}
                    onClick={
                      userIsOwnerOrModerator
                        ? () => fileAvatarRef.current?.click()
                        : undefined
                    }
                    title="Clique para alterar a foto"
                  >
                    <Avatar
                      title={community?.name ?? ""}
                      imageUrl={community?.avatarUrl}
                      className="top h-40 w-36 shadow-lg rounded-xl"
                    />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                        <span className="text-white text-xs font-bold">
                          ...
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileAvatarRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="mt-4">
                    <p className="text-xl md:text-2xl mb-2 font-bold">
                      {community?.name}
                    </p>
                    <div className="flex flex-row gap-1">
                      <CommunityIcon />
                      <p className="text-sm md:text-base">
                        {community?.members.length} membro(s)
                      </p>
                    </div>
                  </div>
                </div>
                {userIsOwnerOrModerator && (
                  <div className="absolute top-4 right-4 z-20">
                    <IconButton
                      icon={<TrashIcon className="text-pink-600" />}
                      onClick={() => setShowCommunityModal(!showCommunityModal)}
                    />
                    <ConfirmationModal
                      isOpen={showCommunityModal}
                      onClose={() => setShowCommunityModal(false)}
                      onClick={handleDeleteCommunity}
                      id={communityId ?? ""}
                      question={
                        "Tem certeza que deseja deletar esta comunidade?"
                      }
                    />
                  </div>
                )}

                <div className="flex flex-col items-end gap-2 ml-auto p-2">
                  {userIsOwnerOrModerator && commuityIsPrivateOrSecret && (
                    <CustomButton
                      name={"add membro"}
                      loading={false}
                      className="w-30 md:w-40 rounded-xl border border-pink-600 px-4 py-2 text-sm font-medium text-white h-11 bg-pink-600"
                      onClick={() => setShowAddMemberModal(true)}
                    />
                  )}

                  {!userIsCommunityMember &&
                    communityVisibility === CommunityVisibility.PUBLIC && (
                      <CustomButton
                        name={"entrar"}
                        loading={false}
                        className="w-20 md:w-40 rounded-xl border border-pink-600 px-4 py-2 text-sm font-medium text-white bg-pink-600 transition h-11"
                        onClick={() =>
                          communityId
                            ? addMemberOnTheCommunity(
                                communityId,
                                user?.id ?? "",
                              )
                            : toast("Erro ao entrar na comunidade!")
                        }
                      />
                    )}

                  <CustomButton
                    onClick={() => setModalIsOpen(true)}
                    loading={false}
                    name="membros"
                    className="w-20 md:w-40 rounded-xl border bg-white border-pink-600  text-sm font-medium text-pink-600 transition h-11 md:hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {userIsCommunityMember && (
            <form
              className="flex flex-row gap-4 items-start bg-white p-4 rounded-2xl shadow-sm w-full"
              onSubmit={handleSubmit(onCreatePost)}
            >
              <Avatar
                imageUrl={user?.profilePicture}
                title={user?.name ?? ""}
                className="rounded-full bg-violet-300 w-16 h-16 flex-shrink-0"
              />
              <div className="flex-1 flex flex-col items-end gap-2 w-full ">
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
                  className="w-24 h-10 rounded-xl"
                />
              </div>
            </form>
          )}
          {userIsCommunityMember && (
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
                  handleDeletePost={handleDeletePost}
                  handleDeleteComment={handleDeleteComment}
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
