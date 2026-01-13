import { useCallback, useEffect, useState, type ReactElement } from "react"
import { Avatar } from "../avatar"
import { ReactionTargetType, type Comment, type Reaction, type ReactionType } from "@/types"
import z from "zod"
import { CustomInput } from "../input"
import { useForm } from "react-hook-form"
import { IconButton } from "../button/iconButton"
import { SendIcon } from "../icons/send"
import { CommentIcon } from "../icons/comment"
import { LikeIcon } from "../icons/like"
import { HeartIcon } from "../icons/heart"
import { LaughtIcon } from "../icons/laught"
import { AngryIcon } from "../icons/angry"
import { useNavigate } from "react-router-dom" 
import { TrashIcon } from "../icons/trash"
import { ConfirmationModal } from "../modal/confirmationModal"
import { getRelativeTime } from "@/utils/date"

interface PostProps {
  userId: string
  postId: string
  authorProfilePicture?: string
  authorName: string
  authorId: string
  postedAt: string
  content: string
  fetchPostComments: (postId: string) => Promise<Comment[] | undefined>
  fetchReactions: (postId: string) => Promise<Reaction[] | undefined> 
  onAddComment: (
    postId: string,
    communityId: string,
    content: string
  ) => Promise<Comment | undefined | null>
  communityId: string
  onCreateReaction: (
   {postId, targetType, type}:{
    postId: string
    targetType: ReactionTargetType
    type: ReactionType
    }
  ) => Promise<Reaction | undefined | null>
  handleDeletePost: (postId: string) => Promise<void>
  handleDeleteComment: (commentId: string, postId: string) => Promise<void>
}

const createComment = z.object({
  content: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
})

type FormData = z.infer<typeof createComment>

export function PostComponent({
  userId,
  content,
  postId,
  authorProfilePicture,
  authorName,
  postedAt,
  fetchPostComments,
  onAddComment,
  communityId,
  fetchReactions,
  onCreateReaction,
  authorId,
  handleDeletePost,
  handleDeleteComment,
}: PostProps) {
  const [showReactions, setShowReactions] = useState(false)
  const [currentReaction, setCurrentReaction] = useState({
    type: "LIKE",
    emoji: <LikeIcon />,
    color: "black",
  })
  const [showComments, setShowComments] = useState(false)
  const [allComments, setAllComments] = useState<Comment[]>([])
  const [allReactions, setAllReactions] = useState<Reaction[]>([])
  const [showDeletePostModal, setShowDeletePostModal] = useState(false)
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false)

  const { reset, control, handleSubmit, setError } = useForm<FormData>({})

  const navigate = useNavigate()

  const reactions = [
    { type: "LIKE", emoji: <LikeIcon />, label: "Curtir", color: "blue-500" },
    { type: "LOVE", emoji: <HeartIcon />, label: "Amei", color: "red-500" },
    {
      type: "LAUGH",
      emoji: <LaughtIcon />,
      label: "Gargalhei",
      color: "yellow-500",
    },
    { type: "ANGRY", emoji: <AngryIcon />, label: "Grrr", color: "red-500" },
  ]

  useEffect(() => {
    fetchPostComments(postId).then((comments) => setAllComments(comments ?? []))

    fetchReactions(postId).then((newReactions) => {
      setAllReactions(newReactions ?? [])
      const userPostReaction = newReactions?.find((r) => r.userId === userId)

      if (userPostReaction) {
        const reactionDetails = reactions.find(
          (r) => r.type === userPostReaction?.type,
        )

        if (reactionDetails) setCurrentReaction(reactionDetails)
      }
    })
  }, [postId])

  const handleAddComment = useCallback(
    async ({ content }: FormData) => {
      await onAddComment(postId, communityId, content).then(
        (newComment) =>
          newComment && setAllComments((prev) => [...prev, newComment]),
      )
    },
    [postId],
  )

  const handleReacts = async (react: {
    type: string
    emoji: ReactElement
    label: string
    color: string
  }) => {
    setCurrentReaction({
      type: react.type,
      emoji: react.emoji,
      color: react.color,
    })

    onCreateReaction({
      postId,
      type: react.type as ReactionType,
      targetType: ReactionTargetType.POST,
    }).then((newReaction) =>
      newReaction
        ? setAllReactions((prev) => [...prev, newReaction])
        : setCurrentReaction({
            type: "LIKE",
            emoji: <LikeIcon />,
            color: "black",
          }),
    )

    setShowReactions(false)
  }

  return (
    <div className="max-w-dvw min-w-88 w-auto bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-pink-100 relative">
      <div className="p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-pink-100 border-2 border-white shadow-sm overflow-hidden">
          <Avatar
            title={postId}
            imageUrl={authorProfilePicture}
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <h3
            className="font-bold text-gray-800 hover:underline"
            onClick={() => navigate(`/profile/${authorId}`)}
          >
            {authorName}
          </h3>
          <span className="text-xs text-gray-400">{getRelativeTime(postedAt)}</span>
        </div>
        {userId === authorId && (
          <div>
            <IconButton
              icon={<TrashIcon className="text-pink-600" />}
              onClick={() => setShowDeletePostModal(!showDeletePostModal)}
            />
            <ConfirmationModal
              isOpen={showDeletePostModal}
              onClose={() => setShowDeletePostModal(false)}
              onClick={handleDeletePost}
              id={postId}
              question={"Tem certeza que deseja deletar este post?"}
            />
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <p className="text-gray-700 leading-relaxed">{content}</p>
      </div>

      <div className="px-6 py-2 border-t border-gray-50 flex items-center gap-8 relative">
        <div
          className="relative group"
          onClick={() => setShowReactions(!showReactions)}
        >
          <button
            className={`flex items-center gap-2 text-${currentReaction.color} hover:text-[#D63384] transition-colors font-semibold py-3`}
          >
            <span className="text-xl">{currentReaction.emoji}</span>
            <span className="text-sm">{currentReaction.type}</span>
          </button>

          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white shadow-xl rounded-full p-2 flex gap-2 border border-pink-50 animate-bounce-subtle">
              {reactions.map((r) => (
                <button
                  key={r.type}
                  onClick={() => handleReacts(r)}
                  className={`hover:scale-150 transition-transform px-2 py-1 text-2xl text-${r.color}`}
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <div
          className="flex flex-row gap-2 cursor-pointer"
          onClick={() => setShowComments(!showComments)}
        >
          <IconButton
            className="flex items-center gap-2 text-gray-500 hover:text-[#D63384] font-semibold transition-colors"
            icon={<CommentIcon />}
          />
          <span className="text-sm">{`${allComments.length} Comentários`}</span>
        </div>
      </div>

      {showComments && (
        <div className="bg-[#FFF5F7] p-6 space-y-4">
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {allComments?.map((c) => (
              <div key={c.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-pink-200 shrink-0 border border-white" />
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-pink-50 max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-[10px] font-bold text-[#D63384] uppercase tracking-wider"
                      onClick={() => navigate(`/profile/${authorId}`)}
                    >
                      {c.author?.name}
                    </p>
                    {c.author?.id === userId && (
                      <div>
                        <IconButton
                          icon={<TrashIcon className="text-pink-600 h-3 w-3" />}
                          onClick={() =>
                            setShowDeleteCommentModal(!showDeleteCommentModal)
                          }
                        />
                        <ConfirmationModal
                          isOpen={showDeleteCommentModal}
                          onClose={() => setShowDeleteCommentModal(false)}
                          onClick={async () => {
                            await handleDeleteComment(c.id, postId).then(() => {
                                setAllComments((prev) =>
                                  prev.filter((comment) => comment.id !== c.id),
                                )
                            })
                          
                          }}
                          id={c.id}
                          question={
                            "Tem certeza que deseja deletar este comentário?"
                          }
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            className="flex gap-3 items-center mt-4 bg-white rounded-full p-1 shadow-sm border border-pink-100"
            onSubmit={handleSubmit(handleAddComment)}
          >
            <CustomInput
              type="text"
              control={control}
              name="content"
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm text-gray-700"
            />
            <IconButton
              icon={<SendIcon />}
              className="bg-[#D63384] text-white p-2 rounded-full hover:bg-[#b52a6f] transition-all transform active:scale-95"
            />
          </form>
        </div>
      )}
    </div>
  )
}
