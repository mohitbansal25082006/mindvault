"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { Send, Bot, User, FileText, ExternalLink, Loader2, Brain, Save, History, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date | string
  sources?: Array<{ id: string; title: string }>
}

interface ChatHistoryItem {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
  preview: string
}

export function ChatInterface() {
  const { data: session } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI knowledge assistant. I can help you find information from your documents, answer questions about your notes, and provide insights. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [chatTitle, setChatTitle] = useState("")
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Check if we're loading an existing chat
    const urlParams = new URLSearchParams(window.location.search)
    const chatId = urlParams.get("chatId")
    
    if (chatId) {
      loadChat(chatId)
    }
  }, [])

  const loadChat = async (chatId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/chat/${chatId}`)
      
      if (response.ok) {
        const chatMessages = await response.json()
        // Convert timestamp strings to Date objects
        const formattedMessages = chatMessages.map((msg: ChatMessage) => ({
          ...msg,
          timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
        }))
        setMessages(formattedMessages)
        setCurrentChatId(chatId)
        
        // Set the chat title if available
        const historyResponse = await fetch("/api/chat/history")
        if (historyResponse.ok) {
          const history = await historyResponse.json()
          const chat = history.find((c: ChatHistoryItem) => c.id === chatId)
          if (chat) {
            setChatTitle(chat.title)
          }
        }
      } else {
        toast.error("Failed to load chat")
      }
    } catch (error) {
      toast.error("Failed to load chat")
    } finally {
      setIsLoading(false)
    }
  }

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const response = await fetch("/api/chat/history")
      
      if (response.ok) {
        const history = await response.json()
        setChatHistory(history)
      } else {
        toast.error("Failed to load chat history")
      }
    } catch (error) {
      toast.error("Failed to load chat history")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const saveChat = async () => {
    if (!chatTitle.trim()) {
      toast.error("Please enter a title for your chat")
      return
    }

    try {
      const response = await fetch("/api/chat/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: chatTitle }),
      })

      if (response.ok) {
        const chat = await response.json()
        setCurrentChatId(chat.id)
        setIsSaveDialogOpen(false)
        toast.success("Chat saved successfully!")
        
        // Save all current messages to this chat
        for (const message of messages) {
          if (message.id !== "1") { // Skip the initial welcome message
            await fetch("/api/chat", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: message.content,
                chatId: chat.id,
              }),
            })
          }
        }
      } else {
        toast.error("Failed to save chat")
      }
    } catch (error) {
      toast.error("Failed to save chat")
    }
  }

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
        toast.success("Chat deleted successfully")
        
        // If we're currently viewing the deleted chat, reset the chat interface
        if (currentChatId === chatId) {
          setCurrentChatId(null)
          setChatTitle("")
          setMessages([
            {
              id: "1",
              role: "assistant",
              content:
                "Hello! I'm your AI knowledge assistant. I can help you find information from your documents, answer questions about your notes, and provide insights. What would you like to know?",
              timestamp: new Date(),
            },
          ])
        }
      } else {
        toast.error("Failed to delete chat")
      }
    } catch (error) {
      toast.error("Failed to delete chat")
    }
  }

  const openChat = (chatId: string) => {
    router.push(`/chat?chatId=${chatId}`)
    setIsHistoryDialogOpen(false)
    loadChat(chatId)
  }

  const startNewChat = () => {
    setCurrentChatId(null)
    setChatTitle("")
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI knowledge assistant. I can help you find information from your documents, answer questions about your notes, and provide insights. What would you like to know?",
        timestamp: new Date(),
      },
    ])
    setIsHistoryDialogOpen(false)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          chatId: currentChatId 
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Ensure sources are unique by id before storing
      const uniqueSources = data.sources
        ? data.sources.filter(
            (source: { id: string }, index: number, self: { id: string }[]) =>
              index === self.findIndex((s: { id: string }) => s.id === source.id)
          )
        : []

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
        sources: uniqueSources,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (_error) {
      toast.error("Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(e as unknown as React.FormEvent)
    }
  }

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    })
  }

  // Generate a unique key for each source that combines id and index
  const getSourceKey = (source: { id: string; title: string }, index: number) => {
    return `${source.id}-${index}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 h-full flex flex-col">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>AI Knowledge Assistant</CardTitle>
                <p className="text-muted-foreground">
                  Ask questions about your documents and get intelligent answers
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save Chat
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Chat</DialogTitle>
                    <DialogDescription>
                      Give your conversation a title to save it to your chat history.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={chatTitle}
                        onChange={(e) => setChatTitle(e.target.value)}
                        className="col-span-3"
                        placeholder="Enter chat title"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={saveChat}>
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
                <DialogTrigger asChild onClick={loadChatHistory}>
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-1" />
                    Chat History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Chat History</DialogTitle>
                    <DialogDescription>
                      Your saved conversations
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-96 overflow-y-auto">
                    {isLoadingHistory ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : chatHistory.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No saved chats yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chatHistory.map((chat) => (
                          <div
                            key={chat.id}
                            className="p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                            onClick={() => openChat(chat.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{chat.title}</h4>
                                <p className="text-sm text-muted-foreground truncate">{chat.preview}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDate(chat.updatedAt)} • {chat.messageCount} messages
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-2 flex-shrink-0"
                                onClick={(e) => deleteChat(chat.id, e)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={startNewChat}>
                      New Chat
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Conversation
            {currentChatId && (
              <Badge variant="secondary" className="text-xs">
                {chatTitle || "Untitled Chat"}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    {message.role === "user" ? (
                      <>
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs text-muted-foreground">Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.sources.map((source, index) => (
                            <Link
                              key={getSourceKey(source, index)}
                              href={`/documents/${source.id}/edit`}
                            >
                              <Badge
                                variant="secondary"
                                className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                {source.title}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t pt-4 mt-4">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                placeholder="Ask about your documents..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge
                variant="outline"
                className="text-xs cursor-pointer"
                onClick={() =>
                  setInput("What are the main topics in my documents?")
                }
              >
                💡 Try: &quot;What are the main topics in my documents?&quot;
              </Badge>
              <Badge
                variant="outline"
                className="text-xs cursor-pointer"
                onClick={() => setInput("Summarize my latest notes")}
              >
                💡 Try: &quot;Summarize my latest notes&quot;
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}