"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { updateUser } from "@/lib/db";
import { auth } from "@/lib/firebase";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Check, Settings, User as UserIcon, Lock, AlertCircle } from "lucide-react";

// ─── Avatar Data ────────────────────────────────────────────────────────────

const AVATAR_LIST = [
    { id: "adv-1", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4" },
    { id: "adv-2", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=ffdfbf" },
    { id: "adv-3", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Zara&backgroundColor=c0aede" },
    { id: "adv-4", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Orion&backgroundColor=d1d4f9" },
    { id: "adv-5", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Cleo&backgroundColor=ffd5dc" },
    { id: "adv-6", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Axel&backgroundColor=b6e3f4" },
    { id: "pix-1", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Alpha&backgroundColor=b6e3f4" },
    { id: "pix-2", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Nova&backgroundColor=ffdfbf" },
    { id: "pix-3", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Kira&backgroundColor=c0aede" },
    { id: "pix-4", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Titan&backgroundColor=d1d4f9" },
    { id: "pix-5", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Echo&backgroundColor=ffd5dc" },
    { id: "pix-6", url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Milo&backgroundColor=b6e3f4" },
    { id: "fun-1", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Bear&backgroundColor=b6e3f4" },
    { id: "fun-2", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fox&backgroundColor=ffdfbf" },
    { id: "fun-3", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Panda&backgroundColor=c0aede" },
    { id: "fun-4", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lion&backgroundColor=d1d4f9" },
    { id: "fun-5", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Wolf&backgroundColor=ffd5dc" },
    { id: "fun-6", url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Owl&backgroundColor=b6e3f4" },
    { id: "shp-1", url: "https://api.dicebear.com/7.x/shapes/svg?seed=Geo1&backgroundColor=b6e3f4,ffdfbf" },
    { id: "shp-2", url: "https://api.dicebear.com/7.x/shapes/svg?seed=Geo2&backgroundColor=c0aede,d1d4f9" },
    { id: "shp-3", url: "https://api.dicebear.com/7.x/shapes/svg?seed=Geo3&backgroundColor=ffd5dc,ffdfbf" },
    { id: "shp-4", url: "https://api.dicebear.com/7.x/shapes/svg?seed=Geo4&backgroundColor=b6e3f4,c0aede" },
    { id: "shp-5", url: "https://api.dicebear.com/7.x/shapes/svg?seed=Geo5&backgroundColor=d1d4f9,ffd5dc" },
    { id: "shp-6", url: "https://api.dicebear.com/7.x/shapes/svg?seed=Geo6&backgroundColor=ffdfbf,b6e3f4" },
    { id: "bot-1", url: "https://api.dicebear.com/7.x/bottts/svg?seed=R2D2&backgroundColor=b6e3f4" },
    { id: "bot-2", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Wall-E&backgroundColor=ffdfbf" },
    { id: "bot-3", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Optimus&backgroundColor=c0aede" },
    { id: "bot-4", url: "https://api.dicebear.com/7.x/bottts/svg?seed=HAL&backgroundColor=d1d4f9" },
    { id: "bot-5", url: "https://api.dicebear.com/7.x/bottts/svg?seed=T800&backgroundColor=ffd5dc" },
    { id: "bot-6", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Data&backgroundColor=b6e3f4" },
    { id: "ani-1", url: "https://img.icons8.com/color/150/corgi.png" },
    { id: "ani-2", url: "https://img.icons8.com/color/150/panda.png" },
    { id: "ani-3", url: "https://img.icons8.com/color/150/cow.png" },
    { id: "ani-4", url: "https://img.icons8.com/color/150/duck.png" },
    { id: "ani-5", url: "https://img.icons8.com/color/150/elephant.png" },
    { id: "ani-6", url: "https://img.icons8.com/color/150/bear.png" },
    { id: "sup-1", url: "https://img.icons8.com/color/150/spiderman-head.png" },
    { id: "sup-2", url: "https://img.icons8.com/color/150/iron-man.png" },
    { id: "sup-3", url: "https://img.icons8.com/color/150/captain-america.png" },
    { id: "sup-4", url: "https://img.icons8.com/color/150/thor.png" },
    { id: "sup-5", url: "https://img.icons8.com/color/150/deadpool.png" },
    { id: "sup-6", url: "https://img.icons8.com/color/150/wolverine.png" },
];

const AVATAR_CATEGORIES = [
    { label: "All", filter: null },
    { label: "Cartoon", filter: "adv-" },
    { label: "Pixel", filter: "pix-" },
    { label: "Emoji", filter: "fun-" },
    { label: "Geometric", filter: "shp-" },
    { label: "Robot", filter: "bot-" },
    { label: "Animal", filter: "ani-" },
    { label: "Superhero", filter: "sup-" },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const { user, refreshUser } = useAuth();

    // ── Avatar state ──
    const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(user?.avatar || "");
    const [isSavingAvatar, setIsSavingAvatar] = useState(false);
    const [avatarSuccess, setAvatarSuccess] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // ── Account state ──
    const [fullName, setFullName] = useState(user?.name || "");
    const [userId, setUserId] = useState(user?.userId || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSavingAccount, setIsSavingAccount] = useState(false);
    const [accountSuccess, setAccountSuccess] = useState(false);
    const [accountError, setAccountError] = useState("");

    // ── Helpers ──
    const displayedAvatars = activeCategory
        ? AVATAR_LIST.filter((a) => a.id.startsWith(activeCategory))
        : AVATAR_LIST;

    const avatarHasChanges = selectedAvatarUrl !== user?.avatar;
    const accountHasChanges =
        fullName !== user?.name ||
        userId !== user?.userId ||
        newPassword.length > 0;

    // ── Save Avatar ──
    const handleSaveAvatar = async () => {
        if (!user || !selectedAvatarUrl) return;
        setIsSavingAvatar(true);
        try {
            await updateUser(user.id, { avatar: selectedAvatarUrl });
            await refreshUser();
            setAvatarSuccess(true);
            setTimeout(() => setAvatarSuccess(false), 3000);
        } catch {
            console.error("Failed to save avatar");
        } finally {
            setIsSavingAvatar(false);
        }
    };

    // ── Save Account Info ──
    const handleSaveAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setAccountError("");

        // Validate passwords if changing
        if (newPassword) {
            if (!currentPassword) {
                setAccountError("Enter your current password to set a new one.");
                return;
            }
            if (newPassword.length < 6) {
                setAccountError("New password must be at least 6 characters.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setAccountError("New password and confirmation do not match.");
                return;
            }
        }

        setIsSavingAccount(true);
        try {
            const firebaseUser = auth.currentUser;
            if (!firebaseUser || !user) throw new Error("Not authenticated");

            // Update Firestore fields
            const firestoreUpdates: Record<string, string> = {};
            if (fullName !== user.name) firestoreUpdates.name = fullName;
            if (userId !== user.userId) firestoreUpdates.userId = userId;

            if (Object.keys(firestoreUpdates).length > 0) {
                await updateUser(user.id, firestoreUpdates);
            }

            // Update Firebase Auth password if requested
            if (newPassword && currentPassword) {
                const email = user.userId.includes("@")
                    ? user.userId
                    : `${user.userId}@auraa.control`;
                const credential = EmailAuthProvider.credential(email, currentPassword);
                await reauthenticateWithCredential(firebaseUser, credential);
                await updatePassword(firebaseUser, newPassword);
                // Also store the plain password in Firestore (as the app uses it for reference)
                await updateUser(user.id, { password: newPassword });
            }

            await refreshUser();
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setAccountSuccess(true);
            setTimeout(() => setAccountSuccess(false), 4000);
        } catch (err: any) {
            const msg = err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential"
                ? "Current password is incorrect."
                : err?.code === "auth/requires-recent-login"
                    ? "Session expired. Please sign out and sign back in."
                    : "Failed to update account. Please try again.";
            setAccountError(msg);
        } finally {
            setIsSavingAccount(false);
        }
    };

    // ── Input class helper ──
    const inputClass =
        "w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500";

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">

            {/* ── Page Header ── */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile and preferences</p>
                </div>
            </div>

            {/* ── Profile Info Card ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        {user?.avatar?.startsWith("http") ? (
                            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-500">
                                <span className="text-white font-bold text-2xl">{user?.name?.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">@{user?.userId}</p>
                    </div>
                </div>
            </div>

            {/* ── Account Information Section ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account Information</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your personal account details.</p>
                    </div>
                </div>

                <form onSubmit={handleSaveAccount} className="space-y-4">
                    {/* Name + UserId row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your full name"
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">User ID</label>
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Your user ID"
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    {/* Password section */}
                    <div className="pt-2">
                        <div className="flex items-center gap-2 mb-3">
                            <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Change Password</p>
                            <span className="text-xs text-gray-400 dark:text-gray-500">(optional — only fill in if changing)</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className={inputClass}
                                    autoComplete="current-password"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New password"
                                    className={inputClass}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className={inputClass}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error message */}
                    {accountError && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {accountError}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                        {accountSuccess && (
                            <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                <Check className="w-4 h-4" /> Your account details have been updated.
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={!accountHasChanges || isSavingAccount}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSavingAccount ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Avatar Picker Section ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Avatar</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose a unique avatar to represent your profile.</p>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                    {AVATAR_CATEGORIES.map((cat) => (
                        <button
                            key={cat.label}
                            type="button"
                            onClick={() => setActiveCategory(cat.filter)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat.filter
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-400"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Preview */}
                {selectedAvatarUrl && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <img src={selectedAvatarUrl} alt="Selected avatar" className="w-10 h-10 rounded-full border-2 border-blue-500" />
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                            {avatarHasChanges ? "New avatar selected — save to apply" : "Current avatar"}
                        </p>
                    </div>
                )}

                {/* Avatar Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                    {displayedAvatars.map((avatar) => {
                        const isSelected = selectedAvatarUrl === avatar.url;
                        return (
                            <button
                                key={avatar.id}
                                type="button"
                                title="Select Avatar"
                                onClick={() => setSelectedAvatarUrl(avatar.url)}
                                className={`relative flex flex-col items-center p-2 rounded-2xl border-2 transition-all duration-150 ${isSelected
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-200 dark:shadow-blue-900/30 scale-105"
                                        : "border-transparent hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <img src={avatar.url} alt={avatar.id} className="w-14 h-14 rounded-full object-cover bg-gray-100 dark:bg-gray-800" loading="lazy" />
                                {isSelected && (
                                    <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Save Avatar */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                    {avatarSuccess && (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                            <Check className="w-4 h-4" /> Avatar saved!
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={handleSaveAvatar}
                        disabled={!avatarHasChanges || isSavingAvatar}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSavingAvatar ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                        ) : (
                            "Save Avatar"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
