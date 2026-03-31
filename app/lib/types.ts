// Core Types for Overthink Simulator

export type OverthinkLevel = 1 | 2 | 3 | 4 | 5;

export type PerspectiveMode =
  | "psychologist"
  | "doom_thinker"
  | "gen_z"
  | "gen_alpha"
  | "anime_protagonist"
  | "thai_mom";

export type EndingType = "worst" | "best" | "delusional";

export interface ThoughtStep {
  index: number;
  text: string;
}

export interface ThoughtChainResult {
  situation: string;
  level: OverthinkLevel;
  perspective: PerspectiveMode;
  steps: string[];
  sanity_score: number;
  ending_type: "normal" | EndingType;
}

export interface TriggerTemplate {
  id: string;
  label: string;
  situation: string;
}

// API Request/Response interfaces

export interface GenerateRequest {
  situation: string;
  level: OverthinkLevel;
  perspective: PerspectiveMode;
}

export interface GenerateResponse {
  steps: string[];
  sanity_score: number;
  ending_type: "normal";
}

export interface AlternateEndingRequest {
  situation: string;
  steps: string[];
  level: OverthinkLevel;
  perspective: PerspectiveMode;
  ending_type: EndingType;
}

export interface AlternateEndingResponse {
  new_final_step: string;
  sanity_score: number;
  ending_type: EndingType;
}

// Level descriptors for LLM prompt construction

export const LEVEL_DESCRIPTORS: Record<OverthinkLevel, { tone: string; conclusion: string }> = {
  1: { tone: "calm and rational", conclusion: "logical" },
  2: { tone: "slightly worried", conclusion: "logical with mild concern" },
  3: { tone: "anxious and spiraling", conclusion: "emotional" },
  4: { tone: "extreme anxiety", conclusion: "deeply emotional" },
  5: { tone: "completely unhinged and absurd", conclusion: "absurd/meme" },
};

// Perspective descriptors for LLM prompt construction

export const PERSPECTIVE_DESCRIPTORS: Record<PerspectiveMode, string> = {
  psychologist: "a clinical psychologist analyzing the situation",
  doom_thinker: "a pessimist who always expects the worst",
  gen_z: "a Gen Z person using internet slang and memes",
  gen_alpha: "a Gen Alpha kid with iPad brain",
  anime_protagonist: "an anime protagonist with dramatic inner monologue",
  thai_mom: "a Thai mom who worries about everything",
};
