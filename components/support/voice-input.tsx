"use client";

import { Mic, Square, Volume2 } from "lucide-react";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/services/http";

export function SupportVoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [waveform, setWaveform] = useState<number[]>(Array(24).fill(20));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/voice", {
        method: "POST",
        body: JSON.stringify({
          userId: "11111111-1111-1111-1111-111111111112",
          command: "Check my balance",
          transcript: "Check my balance",
          response: "Your total balance is $17,740.65.",
          status: "processed"
        })
      })
  });

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setWaveform(Array(24).fill(20));
      mutation.mutate();
    } else {
      setIsRecording(true);
      intervalRef.current = setInterval(() => {
        setWaveform(Array.from({ length: 24 }, () => Math.random() * 60 + 20));
      }, 100);
    }
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-[#0a0a0a]/60 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isRecording ? 'bg-rose-500/20 text-rose-500 animate-pulse' : 'bg-primary/10 text-primary'}`}>
            <Volume2 className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wider">Voice Command</p>
            <p className="text-[10px] text-slate-500 font-mono">STUBBED AUDIO INPUT • AI HANDLER</p>
          </div>
        </div>
        {isRecording && (
          <span className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded-full animate-pulse">
            <div className="size-1.5 rounded-full bg-rose-500" />
            LIVE
          </span>
        )}
      </div>

      <div className="h-16 flex items-center justify-center gap-1 mb-6 px-4">
        {waveform.map((height, i) => (
          <div 
            key={i} 
            className={`w-1 rounded-full transition-all duration-150 ${isRecording ? 'bg-primary shadow-[0_0_8px_rgba(255,153,0,0.5)]' : 'bg-white/10'}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleRecording}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${
            isRecording 
            ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
            : 'bg-primary text-black hover:shadow-[0_0_20px_rgba(255,153,0,0.3)]'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="size-5 fill-current" />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic className="size-5" />
              <span>Start Voice Request</span>
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-[11px] text-slate-500 text-center font-medium leading-relaxed">
        Say &ldquo;Transfer $500 to Savings&rdquo; or &ldquo;Check my balance&rdquo;. 
        <br />
        <span className="text-primary/50">Mock logic parses intent via LLM stub.</span>
      </p>
    </div>
  );
}
