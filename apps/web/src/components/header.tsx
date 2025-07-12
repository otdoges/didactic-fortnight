"use client";
import Link from "next/link";
import { Zap, Code, Bot } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Code Generator
              </h1>
              <p className="text-xs text-muted-foreground">
                Powered by 5 AI models working together
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>WebContainers</span>
            <span className="mx-1">•</span>
            <Code className="w-4 h-4" />
            <span>Live Preview</span>
          </div>
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
