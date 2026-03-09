Plan: File Support via @ in Chat

Context

Allow users to reference files/folders by typing @ in the TUI input. A navigation popup opens, the user selects a file, and @relative/path is inserted into the input. When sending, @ references are resolved: file contents are appended to the prompt sent to the API. The chat history displays the original text with @mentions.

---
Files to Create

src/tui/app/file_picker.rs

pub struct DirEntry { pub name: String, pub is_dir: bool, pub rel_path: PathBuf }

pub struct FilePickerState {
    pub current_dir: PathBuf,
    pub all_entries: Vec<DirEntry>,   // unfiltered
    pub filter: String,               // chars typed after `@`
    pub list_state: ListState,
    pub selected_index: usize,
    pub workspace_root: PathBuf,
    pub at_token_start: usize,        // byte offset of `@` in app.input
}
- open(dir, workspace_root, at_token_start) -> Self
- filtered_entries() -> Vec<&DirEntry> — prefix case-insensitive match
- descend(name) / ascend() (blocked at workspace_root) / reload()
- load_entries(): alphabetical dirs first, then files; skip hidden names and IGNORED_DIRS via core::tools::ignore::is_ignored_name

src/tui/handlers/file_picker.rs

pub enum FilePickerAction { Insert { rel_path: PathBuf }, Cancel, Keep }

pub fn handle_file_picker_key(code: KeyCode, mods: KeyModifiers, picker: &mut FilePickerState) -> FilePickerAction

| Key       | Condition      | Action                         |
|-----------|----------------|--------------------------------|
| Esc       | —              | Cancel                         |
| Up/Down   | —              | navigate list, Keep            |
| Enter     | dir            | descend(), reset filter, Keep  |
| Enter     | file           | Insert { rel_path }            |
| Backspace | non-empty filter | pop last char, Keep          |
| Backspace | empty filter   | ascend(), Keep                 |
| Char(c)   | no ALT/CTRL    | append filter, Keep            |

src/tui/draw/file_picker_popup.rs

pub(crate) fn draw_file_picker_popup(f: &mut Frame, area: Rect, picker: &mut FilePickerState)
- popup_area(area, 60, 60) (same helper as popups.rs)
- Internal Layout: breadcrumb (1L) | filter input (3L) | scrollable list (Min 3) | hint (1L)
- Dirs displayed with trailing / in DarkGray; selection in ACCENT background
- Empty state: "No matches" in italic DarkGray

src/core/llm/at_refs.rs

/// Scans `input` for `@word` tokens preceded by space/string start,
/// resolves paths in `workspace_root`, reads files (≤64 KiB),
/// lists directories (≤200 entries). Returns augmented prompt.
pub fn resolve_at_refs(input: &str, workspace_root: &Path) -> String
- Extraction without regex: scan byte-by-byte, token = @ + non-whitespace chars
- Security: canonical.starts_with(workspace_root) mandatory (prevents @../../etc/passwd)
- Deduplication: HashSet<PathBuf> of already annexed paths
- Output format:
<original input>

---
- Binary file → [binary file: N bytes]; file too large → truncated with notice

---
Files to Modify

src/core/tools/ignore.rs
- Make `is_ignored_name(name: &str) -> bool` public (`pub fn`) so it can be used by `file_picker.rs`

src/core/llm/mod.rs
- Add `pub mod at_refs;` to expose the new module

src/tui/app/mod.rs
- Add `pub mod file_picker;` and `pub use file_picker::FilePickerState;`
- Add field to `App`: `pub file_picker: Option<FilePickerState>`
- Initialize in `App::new()`: `file_picker: None`

src/tui/handlers/mod.rs
- Add `mod file_picker;`
- In `handle_key()`: intercept all keys when `app.file_picker.is_some()`, dispatch to `file_picker::handle_file_picker()`
- In `would_esc_start_meta_sequence()`: add `&& app.file_picker.is_none()` guard
- In `handle_mouse()`: add `&& app.file_picker.is_none()` guard before mouse event routing
- In copy shortcut and Esc handler: add `&& app.file_picker.is_none()` guards

src/tui/handlers/input.rs
- In the `Char(c)` arm: if `c == '@'` and preceded by whitespace (or at start of input), insert `@` into `app.input`, open `FilePickerState::open(root.clone(), root, pos)`, and return early

src/tui/handlers/chat_spawn.rs
- In `spawn_chat()`: before calling `llm::chat`, resolve `@ refs`:
  `let resolved_prompt = crate::core::llm::at_refs::resolve_at_refs(&prompt, &workspace.root);`
  then use `&resolved_prompt` as the prompt

src/tui/draw/mod.rs
- Add `mod file_picker_popup;`
- In `draw()`: after all other popups, render `file_picker_popup::draw_file_picker_popup(f, area, picker)` when `app.file_picker` is `Some`

src/tui/draw/input/mod.rs
- In `input_has_focus()`: add `&& app.file_picker.is_none()` so the input border dims when the file picker is open

---
Implementation Order

1. core/tools/ignore.rs — extract is_ignored_name
2. core/llm/at_refs.rs — new, connect in core/llm/mod.rs
3. tui/app/file_picker.rs — new, connect in tui/app/mod.rs
4. tui/handlers/file_picker.rs — new, connect in tui/handlers/mod.rs
5. tui/draw/file_picker_popup.rs — new, connect in tui/draw/mod.rs
6. tui/handlers/input.rs — trigger @
7. tui/handlers/mod.rs — dispatch + guards
8. tui/handlers/chat_spawn.rs — resolve_at_refs
9. tui/draw/input/mod.rs — input_has_focus

---
Verification

cargo build                                        # must compile without errors
cargo test                                         # unit tests at_refs + file_picker
cargo clippy --all-targets -- -D warnings
cargo fmt --check

Tests to write in at_refs.rs:
- input without @ → unchanged
- @src/main.rs valid → content annexed
- non-existent path → silently ignored
- ../../etc/passwd → ignored (security)
- duplicate @path → annexed only once
- @src/tui/ (directory) → listing annexed
- email@example.com mid-word → not triggered

Tests in file_picker.rs:
- open() on a tmpdir → all_entries populated
- filtered_entries("src") → only names starting with src
- ascend() at workspace root → no-op
- descend() into a subdirectory → current_dir updated
