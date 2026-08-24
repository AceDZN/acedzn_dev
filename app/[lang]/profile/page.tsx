"use client";
/* eslint-disable @next/next/no-img-element -- Profile images use dynamic Clerk, Convex, and local blob URLs. */

import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";

interface ProfileRecord {
  _id: string;
  name?: string;
  description?: string;
  imageId?: string;
  pictureUrl?: string;
}

interface ClerkProfile {
  id: string;
  fullName: string | null;
  imageUrl: string;
}

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const userResult = useQuery(api.users.current);

  if (!isLoaded || (clerkUser && userResult === undefined)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!clerkUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  const user = (userResult ?? null) as ProfileRecord | null;

  return (
    <ProfileForm
      key={user?._id ?? clerkUser.id}
      user={user}
      clerkUser={clerkUser}
    />
  );
}

function ProfileForm({
  user,
  clerkUser,
}: {
  user: ProfileRecord | null;
  clerkUser: ClerkProfile;
}) {
  const update = useMutation(api.users.update);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const [name, setName] = useState(user?.name || clerkUser.fullName || "");
  const [description, setDescription] = useState(user?.description || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageId = user?.imageId;

      if (selectedImage) {
        // 1. Get upload URL
        const postUrl = await generateUploadUrl();

        // 2. Upload file
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });

        if (!result.ok) throw new Error("Upload failed");

        const { storageId } = await result.json();
        imageId = storageId;
      }

      // 3. Update user
      await update({
        name,
        description,
        imageId,
      });

      setSelectedImage(null);
      setPreviewUrl(null);

      // Optional: nice toast here
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl overflow-hidden ring-1 ring-gray-900/5">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90"></div>

          <div className="relative px-8 pb-8">
            {/* Profile Image - Negative Margin to overlap header */}
            <div className="relative -mt-16 mb-6 flex justify-center sm:justify-start">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-white">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : user?.imageId ? (
                    <StorageImage
                      storageId={user.imageId}
                      fallbackUrl={user.pictureUrl}
                    />
                  ) : (
                    <img
                      src={user?.pictureUrl || clerkUser.imageUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                {/* Overlay Edit Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Camera className="w-8 h-8 text-white/90" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Profile Settings
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your public profile and preferences.
                </p>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 transition-all duration-200"
                    placeholder="Your name"
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bio
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 transition-all duration-200 resize-none"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || clerkUser.fullName || "");
                    setDescription(user?.description || "");
                    setPreviewUrl(null);
                    setSelectedImage(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-600/20"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function StorageImage({
  storageId,
  fallbackUrl,
}: {
  storageId: string;
  fallbackUrl?: string;
}) {
  const url = useQuery(api.users.getImageUrl, { storageId });

  // While loading convex URL or if fails
  if (!url) {
    if (fallbackUrl)
      return (
        <img
          src={fallbackUrl}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      );
    return <div className="h-full w-full bg-gray-200 animate-pulse" />;
  }

  return <img src={url} alt="Profile" className="h-full w-full object-cover" />;
}
