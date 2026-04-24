import { useState, use, useMemo, useRef, useEffect, Suspense } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import markdown from 'highlight.js/lib/languages/markdown';
import type { MiniWorkspaceProps, MiniWorkspaceFile, MiniWorkspaceConfig, MiniWorkspaceFolder } from '@ui/components';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('markdown', markdown);

const ICON_TO_LANG: Record<string, string> = {
  ts: 'typescript',
  md: 'markdown',
};

const contentCache = new Map<string, Promise<string>>();
const configCache = new Map<string, Promise<MiniWorkspaceConfig>>();

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

function fetchConfig(url: string): Promise<MiniWorkspaceConfig> {
  if (!configCache.has(url)) {
    configCache.set(
      url,
      fetch(url).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<MiniWorkspaceConfig>;
      })
    );
  }
  return configCache.get(url)!;
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

function MobileTabStrip({ tree, activeFileId, setActiveFileId }: {
  tree: MiniWorkspaceFolder[];
  activeFileId: string;
  setActiveFileId: (id: string) => void;
}) {
  const [activeFolderIndex, setActiveFolderIndex] = useState(() => {
    const idx = tree.findIndex(folder =>
      folder.children.some(child =>
        'id' in child
          ? child.id === activeFileId
          : child.children.some(f => f.id === activeFileId)
      )
    );
    return idx >= 0 ? idx : 0;
  });

  const folderFiles = useMemo(
    () =>
      (tree[activeFolderIndex]?.children ?? []).flatMap(child =>
        'id' in child ? [child] : child.children
      ),
    [tree, activeFolderIndex]
  );

  const folderTabsRef = useRef<HTMLDivElement>(null);
  const fileTabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    folderTabsRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeFolderIndex]);

  useEffect(() => {
    fileTabsRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeFileId, activeFolderIndex]);

  const handleFolderClick = (idx: number) => {
    setActiveFolderIndex(idx);
    const files = (tree[idx]?.children ?? []).flatMap(child =>
      'id' in child ? [child] : child.children
    );
    if (files[0]) setActiveFileId(files[0].id);
  };

  const singleFolder = tree.length === 1;

  return (
    <div className="block md:hidden border-b border-border shrink-0">
      {!singleFolder && (
        <div ref={folderTabsRef} className="flex overflow-x-auto border-b border-border/50">
          {tree.map((folder, idx) => (
            <button
              key={folder.label}
              type="button"
              data-active={idx === activeFolderIndex}
              onClick={() => handleFolderClick(idx)}
              className={`shrink-0 px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest whitespace-nowrap transition-colors ${
                idx === activeFolderIndex
                  ? 'text-[var(--color-accent-on-surface)] border-b-2 border-accent bg-accent/5'
                  : 'text-text-secondary/50 hover:text-text-secondary border-b-2 border-transparent'
              }`}
            >
              {folder.label}
            </button>
          ))}
        </div>
      )}
      <div ref={fileTabsRef} className="flex overflow-x-auto">
        {folderFiles.map(file => (
          <button
            key={file.id}
            type="button"
            data-active={file.id === activeFileId}
            onClick={() => setActiveFileId(file.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono whitespace-nowrap transition-colors ${
              file.id === activeFileId
                ? 'text-text-primary border-b-2 border-accent bg-accent/5'
                : 'text-text-secondary hover:text-text-primary border-b-2 border-transparent'
            }`}
          >
            <IconBadge icon={file.icon} />
            <span className="truncate max-w-[120px]">{file.label}</span>
          </button>
        ))}
      </div>
    </div>
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

function MiniWorkspaceInner({ defaultFile, height = 400, tree }: { defaultFile: string; height?: number; tree: MiniWorkspaceFolder[] }) {
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

      <MobileTabStrip
        tree={tree}
        activeFileId={activeFileId}
        setActiveFileId={setActiveFileId}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex w-36 shrink-0 flex-col bg-background border-r border-border overflow-y-auto py-2">
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

function ConfigLoader({ src, height }: { src: string; height?: number }) {
  const config = use(fetchConfig(src));
  return <MiniWorkspaceInner defaultFile={config.defaultFile} height={height} tree={config.tree} />;
}

export default function MiniWorkspace(props: MiniWorkspaceProps) {
  if ('src' in props && props.src) {
    return (
      <Suspense fallback={
        <div className="rounded-xl border border-border my-6 bg-background flex items-center justify-center text-text-secondary/40 text-xs font-mono" style={{ height: props.height ?? 400 }}>
          loading…
        </div>
      }>
        <ConfigLoader src={props.src} height={props.height} />
      </Suspense>
    );
  }
  const { defaultFile, height, tree } = props as { defaultFile: string; height?: number; tree: MiniWorkspaceFolder[] };
  return <MiniWorkspaceInner defaultFile={defaultFile} height={height} tree={tree} />;
}
