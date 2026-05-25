import { createContext, useContext } from 'react';

type CaptureFunction = (event: string, properties?: Record<string, unknown>) => void;

export const PostHogCaptureContext = createContext<CaptureFunction | null>(null);

export const usePostHogCapture = (): CaptureFunction | null =>
  useContext(PostHogCaptureContext);
