"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PenSquare,
  Calendar,
  BarChart3,
  CheckCircle,
  Banknote,
  Hash,
  ArrowLeft,
  ImagePlus,
  Send,
  Loader2,
  Plus,
  X,
  MapPin,
  Clock,
} from "lucide-react";
import { useTribeStore } from "@/store/use-tribe-store";
import { useAuth } from "@/hooks/use-auth";
import * as tapestry from "@/lib/tapestry";
import type { Cast, Poll, ExploreItem } from "@/types";

const createOptions = [
  {
    id: "cast",
    label: "Cast",
    description: "Share a photo or update",
    icon: PenSquare,
    color: "#6366F1",
  },
  {
    id: "event",
    label: "Event",
    description: "Create a local event",
    icon: Calendar,
    color: "#14B8A6",
  },
  {
    id: "poll",
    label: "Poll",
    description: "Ask the community",
    icon: BarChart3,
    color: "#FB7185",
  },
  {
    id: "task",
    label: "Task",
    description: "Request community help",
    icon: CheckCircle,
    color: "#FB923C",
  },
  {
    id: "crowdfund",
    label: "Crowdfund",
    description: "Raise funds for a cause",
    icon: Banknote,
    color: "#A78BFA",
  },
  {
    id: "channel",
    label: "Channel",
    description: "Start a new community",
    icon: Hash,
    color: "#38BDF8",
  },
];

type Mode = "menu" | "cast" | "event" | "poll" | "task" | "crowdfund" | "channel";

export default function CreatePage() {
  const router = useRouter();
  const { addCast, addPoll, addEvent, addTask, addCrowdfund, addTribe, currentUser, currentCity } = useTribeStore();
  const { isAuthenticated, profile } = useAuth();
  const [mode, setMode] = useState<Mode>("menu");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cast state
  const [caption, setCaption] = useState("");

  // Poll state
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  // Event state
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");

  // Task state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskLocation, setTaskLocation] = useState("");
  const [taskReward, setTaskReward] = useState("");

  // Crowdfund state
  const [cfTitle, setCfTitle] = useState("");
  const [cfDesc, setCfDesc] = useState("");
  const [cfGoal, setCfGoal] = useState("");
  const [cfLocation, setCfLocation] = useState("");

  // Channel state
  const [channelName, setChannelName] = useState("");
  const [channelDesc, setChannelDesc] = useState("");

  const handleCreateCast = async () => {
    if (!caption.trim() || !currentUser) return;
    setIsSubmitting(true);

    const newCast: Cast = {
      id: `cast-${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        cityId: currentUser.cityId,
        isVerified: true,
      },
      caption: caption.trim(),
      imageUrl: "https://picsum.photos/seed/" + Date.now() + "/600/600",
      cityId: currentCity?.id || currentUser.cityId,
      likes: 0,
      comments: [],
      isLiked: false,
      isSaved: false,
      tipCount: 0,
      totalTips: 0,
      timestamp: "Just now",
    };

    addCast(newCast);

    if (isAuthenticated && profile?.id) {
      try {
        await tapestry.createContent(profile.id, [
          { key: "type", value: "cast" },
          { key: "caption", value: caption.trim() },
          { key: "imageUrl", value: newCast.imageUrl },
          ...(currentCity ? [{ key: "cityId", value: currentCity.id }] : []),
        ]);
      } catch {
        // Non-fatal
      }
    }

    setIsSubmitting(false);
    router.push("/home");
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || !currentUser) return;
    const validOptions = pollOptions.filter((o) => o.trim());
    if (validOptions.length < 2) return;
    setIsSubmitting(true);

    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        cityId: currentUser.cityId,
        isVerified: true,
      },
      question: pollQuestion.trim(),
      options: validOptions.map((o, i) => ({ id: `opt-${Date.now()}-${i}`, text: o.trim() })),
      duration: 72,
      timestamp: "Just now",
      votes: {},
    };

    addPoll(newPoll);
    setIsSubmitting(false);
    router.push("/home");
  };

  const handleCreateEvent = () => {
    if (!eventTitle.trim() || !currentUser) return;
    setIsSubmitting(true);

    const newEvent: ExploreItem = {
      id: `event-${Date.now()}`,
      type: "event",
      title: eventTitle.trim(),
      description: eventDesc.trim() || "A community event",
      icon: "calendar",
      color: "#14B8A6",
      participants: 1,
      location: eventLocation.trim() || currentCity?.name || "TBD",
      timeAgo: eventDate || "Upcoming",
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/400`,
      isTrending: false,
      cityId: currentCity?.id || currentUser.cityId,
    };

    addEvent(newEvent);
    setIsSubmitting(false);
    router.push("/explore");
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim() || !currentUser) return;
    setIsSubmitting(true);

    addTask({
      id: `task-${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        cityId: currentUser.cityId,
        isVerified: true,
      },
      title: taskTitle.trim(),
      description: taskDesc.trim() || "Community task",
      icon: "check-circle",
      location: taskLocation.trim() || currentCity?.name || "Local",
      helpers: 0,
      timeAgo: "Just now",
      reward: taskReward.trim() || undefined,
      isUrgent: false,
    });

    setIsSubmitting(false);
    router.push("/home");
  };

  const handleCreateCrowdfund = () => {
    if (!cfTitle.trim() || !currentUser) return;
    setIsSubmitting(true);

    addCrowdfund({
      id: `cf-${Date.now()}`,
      user: {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        cityId: currentUser.cityId,
        isVerified: true,
      },
      title: cfTitle.trim(),
      description: cfDesc.trim() || "Community crowdfund",
      icon: "banknote",
      location: cfLocation.trim() || currentCity?.name || "Local",
      goal: parseFloat(cfGoal) || 1000,
      raised: 0,
      contributors: 0,
      timeAgo: "Just now",
    });

    setIsSubmitting(false);
    router.push("/home");
  };

  const handleCreateChannel = () => {
    if (!channelName.trim()) return;
    setIsSubmitting(true);

    addTribe({
      id: `tribe-${Date.now()}`,
      cityId: currentCity?.id || "bangalore",
      name: channelName.trim(),
      description: channelDesc.trim() || "A new community channel",
      category: "general",
      icon: "hash",
      color: "#6366F1",
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/400`,
      members: 1,
      isPrivate: false,
      moderators: [currentUser?.id || "u1"],
      rules: ["Be respectful", "No spam"],
      subchannels: [
        { id: `sc-${Date.now()}`, name: "General", description: "General discussion", icon: "message-circle", color: "#6366F1", members: 1 },
      ],
      isJoined: true,
    });

    setIsSubmitting(false);
    router.push("/tribes");
  };

  const FormHeader = ({ title, onSubmit, canSubmit }: { title: string; onSubmit: () => void; canSubmit: boolean }) => (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
      <button onClick={() => setMode("menu")} className="text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-bold">{title}</h1>
      <button
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting}
        className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Post
      </button>
    </div>
  );

  const InputField = ({ label, value, onChange, placeholder, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; multiline?: boolean }) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border bg-muted/30 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border bg-muted/30 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      )}
    </div>
  );

  // Cast form
  if (mode === "cast") {
    return (
      <div>
        <FormHeader title="New Cast" onSubmit={handleCreateCast} canSubmit={!!caption.trim()} />
        <div className="p-4 space-y-4">
          <textarea
            placeholder="What's happening in your neighborhood?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            autoFocus
            className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button className="flex items-center gap-2 rounded-xl border border-dashed p-8 w-full text-muted-foreground hover:bg-muted/30 transition-colors">
            <ImagePlus className="h-6 w-6" />
            <span className="text-sm">Add photo</span>
          </button>
        </div>
      </div>
    );
  }

  // Poll form
  if (mode === "poll") {
    const validCount = pollOptions.filter((o) => o.trim()).length;
    return (
      <div>
        <FormHeader title="New Poll" onSubmit={handleCreatePoll} canSubmit={!!pollQuestion.trim() && validCount >= 2} />
        <div className="p-4 space-y-4">
          <textarea
            placeholder="Ask the community a question..."
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            rows={2}
            autoFocus
            className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Options</p>
            {pollOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium text-muted-foreground">
                  {String.fromCharCode(65 + i)}
                </div>
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                  className="flex-1 rounded-xl border bg-muted/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                {pollOptions.length > 2 && (
                  <button onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 4 && (
              <button
                onClick={() => setPollOptions([...pollOptions, ""])}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-600"
              >
                <Plus className="h-3.5 w-3.5" />
                Add option
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Event form
  if (mode === "event") {
    return (
      <div>
        <FormHeader title="New Event" onSubmit={handleCreateEvent} canSubmit={!!eventTitle.trim()} />
        <div className="p-4 space-y-4">
          <InputField label="Event Name" value={eventTitle} onChange={setEventTitle} placeholder="Give your event a name" />
          <InputField label="Description" value={eventDesc} onChange={setEventDesc} placeholder="What's this event about?" multiline />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3 w-3" /> Location
              </label>
              <input
                type="text"
                placeholder={currentCity?.name || "Where?"}
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full rounded-xl border bg-muted/30 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="h-3 w-3" /> Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-xl border bg-muted/30 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Task form
  if (mode === "task") {
    return (
      <div>
        <FormHeader title="New Task" onSubmit={handleCreateTask} canSubmit={!!taskTitle.trim()} />
        <div className="p-4 space-y-4">
          <InputField label="What do you need help with?" value={taskTitle} onChange={setTaskTitle} placeholder="e.g., Help moving furniture" />
          <InputField label="Details" value={taskDesc} onChange={setTaskDesc} placeholder="Describe the task..." multiline />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Location" value={taskLocation} onChange={setTaskLocation} placeholder={currentCity?.name || "Where?"} />
            <InputField label="Reward (optional)" value={taskReward} onChange={setTaskReward} placeholder="e.g., 0.5 SOL" />
          </div>
        </div>
      </div>
    );
  }

  // Crowdfund form
  if (mode === "crowdfund") {
    return (
      <div>
        <FormHeader title="New Crowdfund" onSubmit={handleCreateCrowdfund} canSubmit={!!cfTitle.trim()} />
        <div className="p-4 space-y-4">
          <InputField label="Campaign Title" value={cfTitle} onChange={setCfTitle} placeholder="e.g., Community Garden Fund" />
          <InputField label="Description" value={cfDesc} onChange={setCfDesc} placeholder="Why are you raising funds?" multiline />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Goal (SOL)" value={cfGoal} onChange={setCfGoal} placeholder="e.g., 100" />
            <InputField label="Location" value={cfLocation} onChange={setCfLocation} placeholder={currentCity?.name || "Where?"} />
          </div>
        </div>
      </div>
    );
  }

  // Channel form
  if (mode === "channel") {
    return (
      <div>
        <FormHeader title="New Channel" onSubmit={handleCreateChannel} canSubmit={!!channelName.trim()} />
        <div className="p-4 space-y-4">
          <InputField label="Channel Name" value={channelName} onChange={setChannelName} placeholder="e.g., Neighborhood Watch" />
          <InputField label="Description" value={channelDesc} onChange={setChannelDesc} placeholder="What's this channel about?" multiline />
        </div>
      </div>
    );
  }

  // Menu
  return (
    <div>
      <div className="sticky top-0 z-40 border-b bg-background/80 px-4 py-3 backdrop-blur-lg">
        <h1 className="text-lg font-bold">Create</h1>
        <p className="text-sm text-muted-foreground">What do you want to share?</p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {createOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id as Mode)}
              className="flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-shadow hover:shadow-tribe-small"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${opt.color}15`,
                  color: opt.color,
                }}
              >
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
