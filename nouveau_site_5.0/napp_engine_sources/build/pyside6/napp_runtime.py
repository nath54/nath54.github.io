"""
NaCode PySide6 Runtime.
Provides reactivity and global services for generated Python applications.
"""

# pylint: disable=no-name-in-module, invalid-name

# Import Modules
import json
import os
import asyncio
from typing import Any, Callable, cast

from PySide6.QtWidgets import QWidget, QGridLayout, QLabel, QVBoxLayout
from PySide6.QtCore import QUrl, QObject, Qt
from PySide6.QtGui import QDesktopServices


class NaObject(dict[str, Any]):
    """
    A dictionary subclass that allows dot notation for property access.
    Used for parity with JavaScript objects in Stage 6.1.
    """

    def __getattr__(self, name: str) -> Any:
        try:
            val = self[name]
            if isinstance(val, dict) and not isinstance(val, NaObject):
                return NaObject(val)
            return val
        except KeyError:
            raise AttributeError(
                f"'NaObject' object has no attribute '{name}'"
            ) from None

    def __setattr__(self, name: str, value: Any) -> None:
        self[name] = value


class ReactiveBuffer:
    """
    Storable state that notifies subscribers on change.
    """

    def __init__(
        self, data: dict[str, Any] | None = None, config: dict[str, Any] | None = None
    ) -> None:
        self.config = config or {}
        self._data: dict[str, Any] = data or {}
        self._subscribers: dict[
            str, list[Callable[[Any], None]]
        ] = {}  # path -> list of callbacks
        self._history: list[tuple[str, Any, Any]] = []  # path, old, new
        self._redo_stack: list[tuple[str, Any, Any]] = []
        self._in_undo_redo: bool = False

        # Flatten 'state' into the root for legacy compatibility (Stage 6.1)
        if "state" in self._data:
            self._data.update(self._data["state"])

        # Handle Persistence (Stage 6)
        if self.config.get("storage", {}).get("mode") == "local":
            self._load_local()

    def _wrap(self, val: Any) -> Any:
        """
        Recursively wraps dictionaries in NaObject for dot-access parity.
        """
        if isinstance(val, dict) and not isinstance(val, NaObject):
            return NaObject(val)
        if isinstance(val, list):
            return [self._wrap(item) for item in val]
        return val

    def subscribe(self, path: str, callback: Callable[[Any], None]) -> None:
        """
        Subscribes to changes for a specific property path.
        """
        if path not in self._subscribers:
            self._subscribers[path] = []
        self._subscribers[path].append(callback)

        # Initial call
        val = self.get(path)
        if val is not None:
            callback(val)

    def get(self, path: str) -> Any | None:
        """
        Retrieves a value from the buffer using a dotted path.
        """
        # Basic dotted path traversal
        parts = path.split(".")
        curr = self._data
        for p in parts:
            if isinstance(curr, dict) and p in curr:
                curr = curr[p]
            else:
                return None
        return self._wrap(curr)

    def set(self, path: str, value: Any) -> None:
        """
        Updates a value in the buffer and notifies subscribers.
        Supports dotted paths (Stage 6).
        """
        if not self._in_undo_redo:
            old = self.get(path)
            if old != value:
                self._history.append((path, old, value))
                self._redo_stack.clear()

        # Update data
        parts = path.split(".")
        curr = self._data
        for p in parts[:-1]:
            if p not in curr or not isinstance(curr[p], dict):
                curr[p] = {}
            curr = curr[p]

        curr[parts[-1]] = value

        # Persistent (Stage 6)
        if self.config.get("storage", {}).get("mode") == "local":
            self._save_local()

        # Notify subscribers for this path and all parent paths
        full_path = ""
        for p in parts:
            full_path = f"{full_path}.{p}" if full_path else p
            if full_path in self._subscribers:
                for cb in self._subscribers[full_path]:
                    cb(self.get(full_path))

    def _save_local(self) -> None:
        """Saves current state to local JSON file."""
        path = self.config.get("storage", {}).get("path", "app_state.json")
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(self._data, f)
        except Exception as e:  # pylint: disable=broad-except
            print(f"[ReactiveBuffer] Failed to save state: {e}")

    def _load_local(self) -> None:
        """Loads state from local JSON file."""
        path = self.config.get("storage", {}).get("path", "app_state.json")
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    self._data.update(json.load(f))
            except Exception as e:  # pylint: disable=broad-except
                print(f"[ReactiveBuffer] Failed to load state: {e}")

    def undo(self) -> None:
        """Performs undo."""
        if not self._history:
            return
        path, old, new = self._history.pop()
        self._redo_stack.append((path, old, new))
        self._in_undo_redo = True
        self.set(path, old)
        self._in_undo_redo = False

    def redo(self) -> None:
        """Performs redo."""
        if not self._redo_stack:
            return
        path, old, new = self._redo_stack.pop()
        self._history.append((path, old, new))
        self._in_undo_redo = True
        self.set(path, new)
        self._in_undo_redo = False


class ResponsiveGridWidget(QWidget):
    """
    A widget that arranges its children in a grid.
    In landscape mode, it uses 2 columns.
    In portrait mode, it uses 1 column.
    """

    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.grid_layout = QGridLayout(self)
        self.widgets: list[QWidget] = []
        self.grid_layout.setContentsMargins(0, 0, 0, 0)
        self.grid_layout.setSpacing(10)

    def addWidget(self, widget: QWidget) -> None:
        """Adds a widget to the responsive grid."""
        self.widgets.append(widget)
        self._rearrange()

    def resizeEvent(self, event: Any) -> None:
        """Handles resize events to update layout."""
        super().resizeEvent(event)
        self._rearrange()

    def _rearrange(self) -> None:
        """Rearranges widgets based on current aspect ratio."""
        # Clear existing layout
        while self.grid_layout.count():
            item = self.grid_layout.takeAt(0)
            if item:
                w = item.widget()
                if w:
                    w.setParent(self)

        if not self.widgets:
            return

        # Determine columns: 2 for landscape, 1 for portrait
        cols = 2 if self.width() > self.height() else 1

        for i, widget in enumerate(self.widgets):
            row = i // cols
            col = i % cols
            self.grid_layout.addWidget(widget, row, col)


class RandomManifestWidget(QWidget):
    """
    A widget that fetches random items from a JSON manifest.
    """
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.layout = QVBoxLayout(self)
        self.layout.setContentsMargins(0, 0, 0, 0)
        self.display = QLabel()
        self.display.setWordWrap(True)
        self.display.setTextFormat(Qt.RichText)
        self.layout.addWidget(self.display)
        self.source = ""
        self.template = ""
        self.container_class = ""

    def init_widget(self, source: str, container_class: str, template: str) -> None:
        self.source = source
        self.template = template
        self.container_class = container_class
        self.refresh()

    def refresh(self) -> None:
        if not self.source or not os.path.exists(self.source):
            return
        
        try:
            with open(self.source, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if isinstance(data, list) and data:
                import random
                item = random.choice(data)
                
                # Simple substitution
                html = self.template
                for key, val in item.items():
                    html = html.replace(f"{{{key}}}", str(val))
                
                self.display.setText(html)
        except Exception as e:
            print(f"[RandomManifestWidget] Error: {e}")


# pylint: disable=too-many-public-methods
class Globals(QObject):
    """
    The 'gs' object global services.
    """

    def __init__(self) -> None:
        super().__init__()
        self.io = IOService()
        self.shell = ShellService()
        self.history: HistoryService | None = None
        self.canvases: dict[str, Any] = {}
        self.terminals: dict[str, Any] = {}
        self.widgets: dict[str, Any] = {} # For refresh_widget
        self.terminal_output: Any = None
        self.terminal_input: Any = None
        self._input_future: Any = None
        self.buffer: ReactiveBuffer | None = None

    def init(self, buffer: ReactiveBuffer) -> None:
        """Initializes the global services with a buffer."""
        self.buffer = buffer
        self.history = HistoryService(buffer)

    def refresh_widget(self, widget_id: str) -> None:
        """Triggers a refresh on a specific widget."""
        if widget_id in self.widgets:
            widget = self.widgets[widget_id]
            if hasattr(widget, "refresh"):
                widget.refresh()

    def set_terminal_widgets(self, output_widget: Any, input_widget: Any) -> None:
        """Alias for setup_terminal for compiler compatibility."""
        self.setup_terminal(output_widget, input_widget)

    def setup_terminal(self, output_widget: Any, input_widget: Any) -> None:
        """Sets up the terminal hooks."""
        self.terminal_output = output_widget
        self.terminal_input = input_widget
        if input_widget:
            input_widget.returnPressed.connect(self._on_terminal_return)

    def _on_terminal_return(self) -> None:
        """Handles terminal input submission."""
        if self.terminal_input and self._input_future:
            text = self.terminal_input.text()
            self.terminal_input.clear()
            # Echo input in blue (WebJS parity style)
            if self.terminal_output:
                self.terminal_output.appendHtml(
                    f'<span style="color: #8be9fd;">{text}</span>'
                )
            self._input_future.set_result(text)

    # --- Variable Manipulation ---

    def var_decl(self, name: str, value: Any, var_type: Any = None) -> None:
        """Declares a global variable."""
        if self.buffer:
            self.buffer.set(name, value)

    def var_set(self, name: str, value: Any) -> None:
        """Sets a global variable."""
        if self.buffer:
            self.buffer.set(name, value)

    def var_get(self, name: str, default_value: Any = None) -> Any:
        """Gets a global variable."""
        if self.buffer:
            val = self.buffer.get(name)
            return val if val is not None else default_value
        return default_value

    def var_del(self, name: str) -> None:
        """Deletes a global variable."""
        if self.buffer:
            # For now, setting to None as ReactiveBuffer doesn't have delete
            self.buffer.set(name, None)

    # --- List Manipulation ---

    def list_decl(self, name: str, value: list[Any], value_type: Any = None) -> None:
        """Declares a global list."""
        self.var_decl(name, list(value))

    def list_set(self, name: str, value: list[Any]) -> None:
        """Sets a global list."""
        self.var_set(name, list(value))

    def list_get(self, name: str, default_value: list[Any] | None = None) -> list[Any]:
        """Gets a global list."""
        return cast(list[Any], self.var_get(name, default_value or []))

    def list_len(self, name: str) -> int:
        """Returns the length of a global list."""
        lst = self.list_get(name)
        return len(lst) if isinstance(lst, list) else 0

    def list_append(self, name: str, value: Any) -> None:
        """Appends a value to a global list."""
        lst = list(self.list_get(name))
        lst.append(value)
        self.list_set(name, lst)

    def list_pop(self, name: str, idx: int = -1) -> Any:
        """Pops a value from a global list."""
        lst = list(self.list_get(name))
        if 0 <= idx < len(lst) or idx == -1:
            val = lst.pop(idx)
            self.list_set(name, lst)
            return val
        return None

    def list_get_item(self, name: str, idx: int) -> Any:
        """Gets an item from a global list."""
        lst = self.list_get(name)
        if 0 <= idx < len(lst):
            return lst[idx]
        return None

    def list_insert(self, name: str, idx: int, value: Any) -> None:
        """Inserts a value into a global list."""
        lst = list(self.list_get(name))
        lst.insert(idx, value)
        self.list_set(name, lst)

    def list_remove_by_idx(self, name: str, idx: int) -> None:
        """Removes an item from a global list by index."""
        lst = list(self.list_get(name))
        if 0 <= idx < len(lst):
            lst.pop(idx)
            self.list_set(name, lst)

    def list_clear(self, name: str) -> None:
        """Clears a global list."""
        self.list_set(name, [])

    # --- Dict Manipulation ---

    def dict_decl(
        self,
        name: str,
        value: dict[str, Any],
        key_type: Any = None,
        value_type: Any = None,
    ) -> None:
        """Declares a global dictionary."""
        self.var_decl(name, dict(value))

    def dict_set(self, name: str, value: dict[str, Any]) -> None:
        """Sets a global dictionary."""
        self.var_set(name, dict(value))

    def dict_get(
        self, name: str, default_value: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """Gets a global dictionary."""
        return cast(dict[str, Any], self.var_get(name, default_value or {}))

    def dict_set_item(self, name: str, key: str, value: Any) -> None:
        """Sets an item in a global dictionary."""
        dct = dict(self.dict_get(name))
        dct[key] = value
        self.dict_set(name, dct)

    def dict_get_item(self, name: str, key: str, default_value: Any = None) -> Any:
        """Gets an item from a global dictionary."""
        dct = self.dict_get(name)
        return dct.get(key, default_value)

    def dict_remove_item(self, name: str, key: str) -> None:
        """Removes an item from a global dictionary."""
        dct = dict(self.dict_get(name))
        if key in dct:
            del dct[key]
            self.dict_set(name, dct)

    def dict_contains(self, name: str, key: str) -> bool:
        """Checks if a global dictionary contains a key."""
        return key in self.dict_get(name)

    def dict_len(self, name: str) -> int:
        """Returns the length of a global dictionary."""
        return len(self.dict_get(name))

    def dict_clear(self, name: str) -> None:
        """Clears a global dictionary."""
        self.dict_set(name, {})

    def canvas(self, canvas_id: str) -> Any:
        """Retrieves a canvas instance by ID."""
        return self.canvases.get(canvas_id)

    def log(self, *args: Any) -> None:
        """
        Logs a message to the console.
        """
        print("[NaCode Log]", *args)

    def print(self, *args: Any, text: str | None = None, terminal_id: str | None = None) -> None:
        """
        Prints a message to a terminal or system console.
        """
        # Combine positional args and 'text' keyword arg
        msg_parts = list(map(str, args))
        if text is not None:
            msg_parts.append(str(text))
        final_text = " ".join(msg_parts)

        # Route to specific terminal if requested
        target_terminal = None
        if terminal_id and terminal_id in self.terminals:
            target_terminal = self.terminals[terminal_id]
        elif self.terminal_output:
            target_terminal = self.terminal_output

        if target_terminal:
            # QPlainTextEdit uses appendPlainText
            if hasattr(target_terminal, "appendPlainText"):
                target_terminal.appendPlainText(final_text)
            else:
                print(final_text)
        else:
            print(final_text)

    async def input(self, prompt: str = "") -> str:
        """
        Reads input from the terminal or system console.
        """
        if prompt:
            self.print(prompt)

        if not self.terminal_input:
            # Fallback to standard input if no terminal widget is set
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(None, input)

        self._input_future = asyncio.get_event_loop().create_future()
        return await self._input_future  # type: ignore

    async def input_int(self, prompt: str = "") -> int:
        """Reads an integer from input."""
        res = await self.input(prompt)
        try:
            return int(res)
        except ValueError:
            return 0

    async def input_float(self, prompt: str = "") -> float:
        """Reads a float from input."""
        res = await self.input(prompt)
        try:
            return float(res)
        except ValueError:
            return 0.0

    def navigate(self, page_name: str) -> None:
        """
        Requests navigation to a specific page.
        """
        # This will be overridden by the main app to handle window switching
        print(f"[NaCode GS] Navigation to {page_name} requested")


class IOService:
    """IO Services."""

    def read_text(self, path: str) -> str:
        """Reads text from a file."""
        if not os.path.exists(path):
            return ""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def write_text(self, path: str, content: str) -> bool:
        """Writes text to a file."""
        try:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            return True
        except Exception:  # pylint: disable=broad-except
            return False


class ShellService:
    """Shell Services."""

    def open(self, url: str) -> None:
        """Opens a URL in the default browser."""
        QDesktopServices.openUrl(QUrl(url))


class HistoryService:
    """History Services."""

    def __init__(self, buffer: ReactiveBuffer) -> None:
        self.buffer = buffer

    def undo(self) -> None:
        """Performs undo."""
        self.buffer.undo()

    def redo(self) -> None:
        """Performs redo."""
        self.buffer.redo()


gs = Globals()
