import { useState, use, useMemo, Suspense } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import markdown from 'highlight.js/lib/languages/markdown';
import type { MiniWorkspaceProps, MiniWorkspaceFile } from '@ui/components';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('markdown', markdown);

const ICON_TO_LANG: Record<string, string> = {
  ts: 'typescript',
  md: 'markdown',
};

const contentCache = new Map<string, Promise<string>>();

function fetchContent(url: string): Promise<string> {
  if (!contentCache.has(url)) {
    contentCache.set(
      url,
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .catch(() => '')
    );
  }
  return contentCache.get(url)!;
}

function IconBadge({ icon }: { icon: string }) {
  return (
    <span className="inline-flex items-center justify-center px-1 rounded text-[9px] font-mono font-bold bg-accent/10 text-[var(--color-accent-on-surface)]">
      {icon}
    </span>
  );
}

function FileButton({ file, activeFileId, setActiveFileId, indent = false }: {
  file: MiniWorkspaceFile;
  activeFileId: string;
  setActiveFileId: (id: string) => void;
  indent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => setActiveFileId(file.id)}
      className={`w-full flex items-center gap-1.5 py-1 text-left text-[11px] font-mono truncate transition-colors cursor-pointer ${indent ? 'px-5' : 'px-3'} ${
        file.id === activeFileId
          ? 'bg-accent/10 border-l-2 border-accent text-text-primary'
          : 'text-text-secondary hover:bg-accent/5 hover:text-text-primary border-l-2 border-transparent'
      }`}
    >
      <IconBadge icon={file.icon} />
      <span className="truncate">{file.label}</span>
    </button>
  );
}

function FileViewer({ file }: { file: MiniWorkspaceFile }) {
  const text = use(fetchContent(file.src));
  const lang = ICON_TO_LANG[file.icon] ?? 'plaintext';
  const lines = text.trimEnd().split('\n');

  return (
    <div className="flex-1 overflow-auto py-3">
      {lines.map((line, idx) => {
        const lineNum = idx + 1;
        const isHighlighted = file.highlight?.includes(lineNum) ?? false;
        let highlighted: string;
        try {
          highlighted = hljs.highlight(line, { language: lang, ignoreIllegals: true }).value;
        } catch {
          highlighted = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        return (
          <div
            key={lineNum}
            className={`flex min-w-0 ${isHighlighted ? 'bg-red-500/10 border-l-2 border-red-500' : 'border-l-2 border-transparent'}`}
          >
            <div className={`w-8 shrink-0 text-right pr-3 text-[10px] font-mono select-none ${isHighlighted ? 'text-red-400/50' : 'text-text-secondary/30'}`}>
              {lineNum}
            </div>
            <div
              className="flex-1 px-3 text-xs font-mono whitespace-pre"
              dangerouslySetInnerHTML={{ __html: highlighted || ' ' }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function MiniWorkspace({ defaultFile, height = 400, tree }: MiniWorkspaceProps) {
  const [activeFileId, setActiveFileId] = useState(defaultFile);

  const allFiles = useMemo(
    () =>
      tree.flatMap(folder =>
        folder.children.flatMap(child =>
          'id' in child ? [child] : child.children
        )
      ),
    [tree]
  );
  const activeFile = useMemo(
    () => allFiles.find(f => f.id === activeFileId) ?? allFiles[0] ?? null,
    [allFiles, activeFileId]
  );

  if (!activeFile) return null;

  return (
    <div
      className="rounded-xl border border-border overflow-hidden my-6 bg-background flex flex-col"
      style={{ height }}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-border shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <IconBadge icon={activeFile.icon} />
          <span className="text-text-secondary text-xs font-mono truncate">{activeFile.path}</span>
          <span className="text-text-primary text-xs font-mono font-medium truncate">{activeFile.label}</span>
        </div>
        {activeFile.highlight && activeFile.highlight.length > 0 && (
          <span className="shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/30">
            ✗ violation
          </span>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-36 shrink-0 bg-background border-r border-border overflow-y-auto py-2">
          {tree.map((folder) => (
            <div key={folder.label}>
              <div className="px-3 py-1 text-[9px] font-mono text-text-secondary/50 uppercase tracking-widest truncate">
                {folder.label}
              </div>
              {folder.children.map((child) =>
                'id' in child ? (
                  <FileButton
                    key={child.id}
                    file={child}
                    activeFileId={activeFileId}
                    setActiveFileId={setActiveFileId}
                  />
                ) : (
                  <div key={child.label}>
                    <div className="px-3 py-1 text-[10px] font-mono text-text-secondary/40 truncate">
                      {child.label}/
                    </div>
                    {child.children.map((file) => (
                      <FileButton
                        key={file.id}
                        file={file}
                        activeFileId={activeFileId}
                        setActiveFileId={setActiveFileId}
                        indent
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center text-text-secondary/40 text-xs font-mono">
            loading…
          </div>
        }>
          <FileViewer file={activeFile} />
        </Suspense>
      </div>
    </div>
  );
}
