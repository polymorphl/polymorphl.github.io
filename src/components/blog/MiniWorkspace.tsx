import { useState } from 'react';
import type { MiniWorkspaceProps, MiniWorkspaceLine } from '@ui/components';

const TOKEN_CLASSES: Record<string, string> = {
  't-head': 'text-text-primary font-semibold',
  't-muted': 'text-text-secondary/30',
  't-comment': 'text-[#5a6a9a]',
  't-err': 'text-red-400',
  't-keyword': 'text-violet-400',
  't-string': 'text-green-300',
  't-ok': 'text-green-400',
  't-warn': 'text-yellow-400',
  't-prop': 'text-sky-300',
  't-type': 'text-blue-300',
  't-op': 'text-text-secondary',
};

function IconBadge({ icon }: { icon: string }) {
  return (
    <span className="inline-flex items-center justify-center px-1 rounded text-[9px] font-mono font-bold bg-accent/10 text-[var(--color-accent-on-surface)]">
      {icon}
    </span>
  );
}

function CodeLine({ line, lineNum, isHighlighted }: { line: MiniWorkspaceLine; lineNum: number; isHighlighted: boolean }) {
  return (
    <div className={`flex min-w-0 ${isHighlighted ? 'bg-red-500/10 border-l-2 border-red-500' : 'border-l-2 border-transparent'}`}>
      <div className={`w-8 shrink-0 text-right pr-3 text-[10px] font-mono select-none ${isHighlighted ? 'text-red-400/50' : 'text-text-secondary/30'}`}>
        {lineNum}
      </div>
      <div className="flex-1 px-3 text-xs font-mono whitespace-nowrap">
        {line.map(([type, text], i) => (
          <span key={i} className={TOKEN_CLASSES[type] ?? 'text-text-primary'}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MiniWorkspace({ defaultFile, height = 400, tree }: MiniWorkspaceProps) {
  const [activeFileId, setActiveFileId] = useState(defaultFile);

  const allFiles = tree.flatMap(folder => folder.children);
  const activeFile = allFiles.find(f => f.id === activeFileId) ?? allFiles[0];

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
              {folder.children.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setActiveFileId(file.id)}
                  className={`w-full flex items-center gap-1.5 px-3 py-1 text-left text-[11px] font-mono truncate transition-colors cursor-pointer ${
                    file.id === activeFileId
                      ? 'bg-accent/10 border-l-2 border-accent text-text-primary'
                      : 'text-text-secondary hover:bg-accent/5 hover:text-text-primary border-l-2 border-transparent'
                  }`}
                >
                  <IconBadge icon={file.icon} />
                  <span className="truncate">{file.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto py-3">
          {activeFile.content.map((line, idx) => (
            <CodeLine
              key={idx}
              line={line}
              lineNum={idx + 1}
              isHighlighted={activeFile.highlight?.includes(idx + 1) ?? false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
