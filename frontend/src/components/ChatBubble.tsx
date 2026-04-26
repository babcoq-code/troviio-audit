"use client";

import { motion } from "framer-motion";

interface Props {
  role: "user" | "ai";
  text: string;
}

export default function ChatBubble({ role, text }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          role === "user"
            ? "bg-blueberry text-white rounded-br-md"
            : "bg-surface-light text-gray-200 rounded-bl-md"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}
