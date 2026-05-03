import { useEffect, useMemo, useRef, useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { useAuth } from "../context/AuthContext";
import {
  getThread,
  getListingById,
  getUserById,
  sendMessage,
  subscribe,
} from "../lib/store";

// A focused 1:1 chat drawer for a given listing+buyer+seller combo.
export const ChatDrawer = ({ listing, buyerId, sellerId, triggerLabel = "Chat with seller" }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [tick, setTick] = useState(0);
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Load thread when chat opens
  useEffect(() => {
    if (!open) return;

    const loadThread = async () => {
      setLoading(true);
      try {
        const messages = await getThread(listing.id, buyerId, sellerId);
        setThread(messages);
      } catch (error) {
        console.error('Failed to load chat thread:', error);
        setThread([]);
      } finally {
        setLoading(false);
      }
    };

    loadThread();
  }, [listing.id, buyerId, sellerId, open]);

  // Real-time: subscribe + poll every 1s while open.
  useEffect(() => {
    if (!open) return;
    const unsub = subscribe(() => {
      // Refresh thread when store changes
      getThread(listing.id, buyerId, sellerId).then(setThread).catch(console.error);
      setTick((t) => t + 1);
    });
    const interval = setInterval(() => {
      getThread(listing.id, buyerId, sellerId).then(setThread).catch(console.error);
      setTick((t) => t + 1);
    }, 1000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [open, listing.id, buyerId, sellerId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread.length, open]);

  const seller = getUserById(sellerId);
  const buyer = getUserById(buyerId);
  const other = user?.id === sellerId ? buyer : seller;

  const submit = async (e) => {
    e?.preventDefault();
    if (!text.trim() || !user) return;

    try {
      await sendMessage({
        listingId: listing.id,
        buyerId,
        sellerId,
        senderId: user.id,
        text: text.trim(),
      });
      setText("");
      // Refresh thread immediately
      const messages = await getThread(listing.id, buyerId, sellerId);
      setThread(messages);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Still clear text even if send failed
      setText("");
    }
  };

  const disabled = !user || user.id === sellerId ? false : false; // everyone logged in can chat

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          data-testid="chat-drawer-trigger"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          disabled={!user}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent
        data-testid="chat-drawer-content"
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="p-4 border-b border-gray-200 text-left">
          <SheetTitle data-testid="chat-partner-name" className="font-heading text-lg">
            {other?.name || "User"}
          </SheetTitle>
          <SheetDescription className="text-xs">
            About: <span className="text-gray-700">{listing.title}</span>
          </SheetDescription>
        </SheetHeader>

        <div
          ref={scrollRef}
          data-testid="chat-thread"
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        >
          {thread.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-sm text-gray-500">
              Say hi! Ask about condition, negotiate, or arrange a hostel pickup.
            </div>
          ) : (
            thread.map((m) => {
              const mine = m.senderId === user?.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      mine
                        ? "max-w-[75%] px-3 py-2 text-sm rounded-l-lg rounded-tr-lg bg-orange-500 text-white"
                        : "max-w-[75%] px-3 py-2 text-sm rounded-r-lg rounded-tl-lg bg-white border border-gray-200 text-gray-900"
                    }
                  >
                    <div className="whitespace-pre-wrap break-words">{m.text}</div>
                    <div
                      className={`text-[10px] mt-1 ${mine ? "text-orange-100" : "text-gray-400"}`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form
          onSubmit={submit}
          className="p-3 border-t border-gray-200 bg-white flex items-center gap-2"
        >
          <Input
            data-testid="chat-message-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="focus-visible:ring-orange-500"
            disabled={disabled}
          />
          <Button
            data-testid="chat-send-btn"
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={!text.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

